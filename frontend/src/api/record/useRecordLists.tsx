import { useQuery } from "@tanstack/react-query";
import { getRecordByUserId } from "@/db/record";

export const useRecordListsQuery = (userId: string) => {
  return useQuery({
    queryFn: () => getRecordByUserId(userId),
    queryKey: [userId, "records"],
  });
};
