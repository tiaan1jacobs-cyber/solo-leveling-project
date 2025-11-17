// Supabase Edge Function Example: Calculate Daily Stats
// Deploy with: supabase functions deploy calculate-daily-stats

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { date } = await req.json();
    const targetDate = date || new Date().toISOString().split('T')[0];

    // Get user's schedule blocks for the day
    const { data: blocks, error: blocksError } = await supabase
      .from('daily_schedule_blocks')
      .select('*')
      .eq('user_id', user.id)
      .eq('schedule_date', targetDate);

    if (blocksError) throw blocksError;

    // Get user's progress for the day
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('completion_date', targetDate);

    if (progressError) throw progressError;

    // Calculate stats
    const totalBlocks = blocks?.length || 0;
    const completedBlocks = progress?.length || 0;
    const completionRate = totalBlocks > 0 ? (completedBlocks / totalBlocks) * 100 : 0;

    const totalXP = blocks?.reduce((sum, block) => sum + (block.xp_value || 0), 0) || 0;
    const earnedXP = blocks
      ?.filter((block) => progress?.some((p) => p.time_block_id === block.id))
      .reduce((sum, block) => sum + (block.xp_value || 0), 0) || 0;

    const stats = {
      date: targetDate,
      userId: user.id,
      totalBlocks,
      completedBlocks,
      completionRate: Math.round(completionRate * 10) / 10,
      totalXP,
      earnedXP,
      xpProgress: Math.round((earnedXP / totalXP) * 100),
    };

    // Store in daily_analytics table
    await supabase
      .from('daily_analytics')
      .upsert({
        user_id: user.id,
        date: targetDate,
        completion_rate: stats.completionRate,
        total_score: earnedXP,
        total_xp_earned: earnedXP,
        tasks_completed: completedBlocks,
        tasks_total: totalBlocks,
      });

    return new Response(JSON.stringify(stats), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
