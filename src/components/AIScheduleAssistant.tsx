import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Loader, Sparkles, Calendar, Check, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ScheduleModification {
  type: 'schedule_modification';
  blocks: Array<{
    startTime: string;
    endTime: string;
    title: string;
    instructions?: string[];
    checklist?: string[];
  }>;
  explanation: string;
}

interface AIScheduleAssistantProps {
  currentTemplate: string;
  currentSchedule: any[];
  onScheduleUpdate: () => void;
}

export function AIScheduleAssistant({ currentTemplate, currentSchedule, onScheduleUpdate }: AIScheduleAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKeySet, setApiKeySet] = useState(false);
  const [pendingModification, setPendingModification] = useState<ScheduleModification | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages);
      setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
    }

    const welcomeMessage: Message = {
      role: 'assistant',
      content: '👋 Hi! I\'m your AI schedule assistant. I can help you:\n\n• Modify your daily schedule\n• Add or remove time blocks\n• Suggest activities based on your goals\n• Provide discipline and productivity advice\n• Adapt your schedule for different day types\n\nJust tell me what you need!',
      timestamp: new Date()
    };

    if (messages.length === 0) {
      setMessages([welcomeMessage]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch(`${supabaseUrl}/functions/v1/chat-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          message: input,
          conversationHistory,
          currentSchedule,
          currentTemplate
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error?.includes('OpenAI API key')) {
          setApiKeySet(false);
          throw new Error('Please add your OpenAI API key to use the AI assistant. You can add it in your Supabase project settings under Edge Functions secrets.');
        }
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      setApiKeySet(true);

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (data.scheduleModification) {
        setPendingModification(data.scheduleModification);
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: `❌ Error: ${error.message}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const applyScheduleModification = async () => {
    if (!pendingModification) return;

    try {
      const template = await supabase
        .from('schedule_templates')
        .select('id')
        .eq('name', currentTemplate)
        .single();

      if (!template.data) {
        throw new Error('Template not found');
      }

      for (const block of pendingModification.blocks) {
        await supabase.from('time_blocks').insert({
          template_id: template.data.id,
          start_time: block.startTime,
          end_time: block.endTime,
          title: block.title,
          category: 'other',
          points: 5,
          instructions: block.instructions || [],
          checklist: block.checklist || [],
          resources: []
        });
      }

      const successMessage: Message = {
        role: 'assistant',
        content: '✅ Schedule updated successfully! Your new time blocks have been added.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, successMessage]);
      setPendingModification(null);
      onScheduleUpdate();
    } catch (error: any) {
      console.error('Failed to apply modification:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: `❌ Failed to update schedule: ${error.message}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 z-50 group"
      >
        <MessageCircle className="w-6 h-6" />
        <div className="absolute -top-1 -right-1 bg-green-500 w-3 h-3 rounded-full animate-pulse" />
        <div className="absolute top-full right-0 mt-2 bg-gray-900 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          AI Schedule Assistant
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border-2 border-gray-200">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Sparkles className="w-6 h-6" />
            <div className="absolute -top-1 -right-1 bg-green-500 w-2 h-2 rounded-full" />
          </div>
          <div>
            <h3 className="font-bold">AI Schedule Assistant</h3>
            <p className="text-xs opacity-90">Powered by GPT-4</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {!apiKeySet && (
        <div className="bg-yellow-50 border-b border-yellow-200 p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-yellow-800">
              <p className="font-semibold mb-1">OpenAI API Key Required</p>
              <p>Add your OpenAI API key to Supabase Edge Functions secrets as <code className="bg-yellow-100 px-1 rounded">OPENAI_API_KEY</code></p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-800'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-white opacity-70' : 'text-gray-400'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
              <Loader className="w-5 h-5 animate-spin text-blue-600" />
            </div>
          </div>
        )}

        {pendingModification && (
          <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h4 className="font-bold text-gray-900">Proposed Schedule Changes</h4>
            </div>
            <div className="space-y-2 mb-3">
              {pendingModification.blocks.map((block, i) => (
                <div key={i} className="bg-white p-3 rounded-lg border border-blue-200">
                  <div className="font-semibold text-gray-900">
                    {block.startTime} - {block.endTime}
                  </div>
                  <div className="text-sm text-gray-700">{block.title}</div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mb-3">{pendingModification.explanation}</p>
            <div className="flex gap-2">
              <button
                onClick={applyScheduleModification}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Check className="w-4 h-4" />
                Apply Changes
              </button>
              <button
                onClick={() => setPendingModification(null)}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-semibold transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask me to modify your schedule..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 text-white p-2 rounded-lg transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          AI can modify your schedule • Ask for suggestions
        </p>
      </div>
    </div>
  );
}
