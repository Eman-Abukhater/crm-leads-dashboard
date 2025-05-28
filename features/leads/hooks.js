import { useQuery } from '@tanstack/react-query';
import { fetchLeads } from './services';

export function useLeads() {
  return useQuery({
    queryKey: ['leads'],         // Cache key
    queryFn: fetchLeads,         // Function to run
  });
}
