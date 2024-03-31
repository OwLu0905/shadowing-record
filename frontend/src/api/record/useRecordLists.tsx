import { useQuery } from "@tanstack/react-query";
import { getRecordByUserId } from "@/db/record";

const useRecordListsQuery = (userId: string) => {
  return useQuery({
    queryFn: () => getRecordByUserId(userId),
    queryKey: ["records"],
  });
};

export default useRecordListsQuery;
