import { Skeleton } from "./skeleton";

export function HeroSkeleton() {
  return (
    <div className="w-full py-20 md:py-32 bg-[#EEE7D8]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4 rounded-xl" />
          <Skeleton className="h-6 w-11/12 rounded-lg" />
          <Skeleton className="h-6 w-5/6 rounded-lg" />
          <div className="flex flex-wrap gap-4 pt-4">
            <Skeleton className="h-12 w-40 rounded-xl" />
            <Skeleton className="h-12 w-36 rounded-xl" />
          </div>
        </div>
        <div className="relative h-[300px] md:h-[450px] w-full rounded-2xl overflow-hidden bg-[#FBF9F4] border border-[#D8CCB8]">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}

export function CountryCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div key={idx} className="p-6 rounded-2xl border border-[#D8CCB8] bg-[#FBF9F4] space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
          </div>
          <Skeleton className="h-9 w-24 rounded-lg pt-2" />
        </div>
      ))}
    </div>
  );
}

export function ServicesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="p-8 rounded-2xl border border-[#D8CCB8] bg-[#FBF9F4] space-y-5">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <Skeleton className="h-6 w-1/2 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-11/12 rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />
          </div>
          <Skeleton className="h-5 w-24 rounded" />
        </div>
      ))}
    </div>
  );
}

export function CardGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div key={idx} className="p-6 rounded-2xl border border-[#D8CCB8] bg-[#FBF9F4] flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-5 w-24 rounded" />
        </div>
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="max-w-3xl mx-auto p-6 md:p-8 rounded-3xl border border-[#D8CCB8] bg-[#FBF9F4] space-y-8 shadow-sm">
      <div className="flex justify-center">
        <div className="flex bg-[#EEE7D8] border border-[#D8CCB8] p-1 rounded-xl gap-2 w-full md:w-auto">
          <Skeleton className="h-10 w-36 rounded-lg" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16 rounded" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}
