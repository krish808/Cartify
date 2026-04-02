export default function CartSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-sm p-5 flex gap-4">
          <div className="w-24 h-24 bg-gray-100 rounded shrink-0" />
          <div className="flex-1 space-y-3 py-1">
            <div className="h-3 bg-gray-100 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/4" />
            <div className="h-8 bg-gray-100 rounded w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}
