import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

interface UseRealtimeOptions {
  table: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
  onChange?: (payload: any) => void;
}

/**
 * Hook for subscribing to real-time database changes
 *
 * @example
 * useRealtime({
 *   table: 'daily_schedule_blocks',
 *   filter: `user_id=eq.${userId}`,
 *   onChange: (payload) => {
 *     console.log('Change received!', payload);
 *     refetchData();
 *   }
 * });
 */
export function useRealtime({
  table,
  event = '*',
  filter,
  onInsert,
  onUpdate,
  onDelete,
  onChange,
}: UseRealtimeOptions) {
  useEffect(() => {
    let channel: RealtimeChannel;

    const setupSubscription = () => {
      channel = supabase
        .channel(`${table}_changes`)
        .on(
          'postgres_changes',
          {
            event,
            schema: 'public',
            table,
            filter,
          },
          (payload) => {
            if (onChange) {
              onChange(payload);
            }

            switch (payload.eventType) {
              case 'INSERT':
                if (onInsert) onInsert(payload);
                break;
              case 'UPDATE':
                if (onUpdate) onUpdate(payload);
                break;
              case 'DELETE':
                if (onDelete) onDelete(payload);
                break;
            }
          }
        )
        .subscribe();
    };

    setupSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [table, event, filter, onInsert, onUpdate, onDelete, onChange]);
}
