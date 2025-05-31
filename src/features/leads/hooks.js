import { useQuery } from '@tanstack/react-query';
import { fetchLeads } from './services';
import { editLead } from './services';

export function useLeads() {
  return useQuery({
    queryKey: ['leads'],         // Cache key
    queryFn: fetchLeads,         // Function to run
  });
}

export function useEditLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editLead,
    onSuccess: () => {
      // Refetch the leads after successful edit
      queryClient.invalidateQueries(['leads']);
    },
  });
}