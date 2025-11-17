# AI Schedule Assistant Setup Guide

The AI Schedule Assistant uses OpenAI's GPT-4 to help you modify and optimize your schedule based on your needs and goals.

## Features

- **Natural Language Schedule Modifications**: Ask the AI to add, modify, or remove time blocks
- **Intelligent Suggestions**: Get personalized recommendations based on your goals
- **Context-Aware**: The AI understands your current schedule and template type
- **One-Click Apply**: Review and apply schedule changes with a single click
- **Conversation History**: Chat history is saved locally for reference

## Setup Instructions

### 1. Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy your API key (it starts with `sk-`)

### 2. Add API Key to Supabase

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Edge Functions** in the left sidebar
4. Click on **Manage secrets**
5. Add a new secret:
   - Name: `OPENAI_API_KEY`
   - Value: Your OpenAI API key (starts with `sk-`)
6. Click **Save**

#### Option B: Using Supabase CLI

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Link your project
supabase link --project-ref your-project-ref

# Set the secret
supabase secrets set OPENAI_API_KEY=sk-your-key-here
```

### 3. Verify Setup

1. Open your application
2. Click the AI Assistant button (purple/blue gradient circle in bottom-right)
3. Try asking: "Can you help me add a morning workout session?"
4. If the API key is configured correctly, you'll get a response

## Usage Examples

### Adding Time Blocks
- "Add a 30-minute meditation session at 6:00 AM"
- "Schedule a 2-hour study block for AI automation learning"
- "Add boxing training from 4:00 PM to 5:30 PM"

### Modifying Schedule
- "Move my business work earlier in the day"
- "Add more breaks between intensive work sessions"
- "Optimize my schedule for a class day"

### Getting Advice
- "How can I be more productive in the morning?"
- "Suggest a better evening routine"
- "What activities should I add for personal development?"

### Template-Specific Requests
- "Adjust this schedule for an intensive training day"
- "Optimize for maximum business productivity"
- "Add more recovery time on development days"

## How It Works

1. **You ask a question**: The AI receives your request along with context about your current schedule and template
2. **AI analyzes**: GPT-4 understands your goals (business, fitness, academics, spiritual growth)
3. **Generates suggestions**: The AI creates specific time blocks with instructions and checklists
4. **You review**: See the proposed changes before applying them
5. **One-click apply**: Click "Apply Changes" to add the new time blocks to your schedule

## Cost Information

- OpenAI charges per token used
- GPT-4o-mini is extremely cost-effective (~$0.15 per million input tokens)
- Typical chat message costs less than $0.01
- Set usage limits in your OpenAI account to control costs

## Troubleshooting

### "OpenAI API key not configured" Error
- Ensure you've added the API key to Supabase Edge Functions secrets
- Check that the secret name is exactly `OPENAI_API_KEY`
- Wait 1-2 minutes after adding the secret for it to propagate

### API Key Invalid
- Verify your API key starts with `sk-`
- Make sure you copied the entire key
- Check that your OpenAI account has billing set up

### Rate Limit Errors
- OpenAI has usage limits based on your account tier
- Wait a moment and try again
- Consider upgrading your OpenAI account tier

### Schedule Not Updating
- Make sure you click "Apply Changes" after the AI suggests modifications
- Refresh the page to see the latest schedule
- Check browser console for any errors

## Privacy & Security

- Your API key is stored securely in Supabase Edge Functions
- Conversations are stored locally in your browser
- No chat data is sent to third-party services except OpenAI
- Clear chat history anytime by clearing browser localStorage

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your OpenAI API key is valid and has available credits
3. Ensure the Edge Function is deployed correctly
4. Try refreshing the page

---

**Ready to get started?** Click the AI Assistant button in the bottom-right corner and start optimizing your schedule!
