import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const DEFAULT_BOOKING_LINK = 'https://calendar.google.com/calendar/appointments/schedules/';

export function useBookingLink() {
  const { data: bookingLink } = useQuery({
    queryKey: ['admin-settings', 'booking_link'],
    queryFn: async () => {
      const { data } = await supabase
        .from('admin_settings' as any)
        .select('setting_value')
        .eq('setting_key', 'booking_link')
        .single();
      return (data as any)?.setting_value || DEFAULT_BOOKING_LINK;
    },
    staleTime: 5 * 60 * 1000,
  });

  return bookingLink || DEFAULT_BOOKING_LINK;
}
