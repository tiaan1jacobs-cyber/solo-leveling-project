import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatRequest {
  message: string;
  conversationHistory: ChatMessage[];
  currentSchedule?: any;
  currentTemplate?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { message, conversationHistory, currentSchedule, currentTemplate }: ChatRequest = await req.json();

    const openAIKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAIKey) {
      return new Response(
        JSON.stringify({
          error: "OpenAI API key not configured. Please add your OpenAI API key to use the AI assistant."
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const systemPrompt = `You are an AI schedule assistant for a personal development and discipline app. Your role is to help users:

1. Modify their daily schedule based on their needs
2. Suggest time blocks and activities
3. Provide discipline and productivity advice
4. Help them stay accountable to their 20 Sacred Rules
5. Adapt schedules based on the day type (Development, Class, Intensive)

Current Context:
- Template: ${currentTemplate || 'Not specified'}
- Current Schedule: ${currentSchedule ? JSON.stringify(currentSchedule) : 'Not loaded'}

When users ask to modify their schedule:
- Provide specific time blocks with start/end times
- Include activity titles, instructions, and checklists
- Consider their goals: AI automation business, fitness, academics, spiritual growth
- Respect the wake-up time (5:30 AM) and sleep time (10:00 PM)
- Format responses with clear time blocks in JSON when appropriate

When providing schedule modifications, use this format:
{
  "type": "schedule_modification",
  "blocks": [
    {
      "startTime": "HH:MM",
      "endTime": "HH:MM",
      "title": "Activity Title",
      "instructions": ["Step 1", "Step 2"],
      "checklist": ["Task 1", "Task 2"]
    }
  ],
  "explanation": "Why these changes help you"
}

Be motivational, direct, and focused on discipline and excellence.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      { role: "user", content: message }
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    let scheduleModification = null;
    try {
      const jsonMatch = assistantMessage.match(/\{[\s\S]*"type":\s*"schedule_modification"[\s\S]*\}/);
      if (jsonMatch) {
        scheduleModification = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.log("No schedule modification in response");
    }

    return new Response(
      JSON.stringify({
        message: assistantMessage,
        scheduleModification: scheduleModification,
        conversationHistory: [...conversationHistory,
          { role: "user", content: message },
          { role: "assistant", content: assistantMessage }
        ]
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});