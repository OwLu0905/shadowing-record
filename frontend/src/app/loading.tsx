import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="container flex items-center py-20">
      <Skeleton className="h-64 w-96 " />
    </div>
  );
}
