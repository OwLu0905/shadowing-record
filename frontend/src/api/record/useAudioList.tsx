import { getAudiosById } from "@/db/record";
import { useQuery } from "@tanstack/react-query";

export const useAudioListQuery = (recordId: string) => {
  return useQuery({
    queryFn: () => getAudiosById(recordId),
    queryKey: [recordId, "history"],
  });
};
