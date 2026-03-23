export default function ProductDetailSkeleton() {
  return (
    <div className="bg-white rounded-xl p-8 mt-2 animate-pulse">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Left: image placeholder */}
        <div className="h-96 bg-gray-100 rounded-xl" />

        {/* Right: info placeholders */}
        <div className="space-y-4">
          <div className="h-4 bg-gray-100 rounded w-1/4" />
          <div className="h-6 bg-gray-100 rounded w-3/4" />
          <div className="h-4 bg-gray-100 rounded w-1/3" />
          <div className="h-8 bg-gray-100 rounded w-1/3" />
          <div className="h-px bg-gray-100 rounded" />
          <div className="h-3 bg-gray-100 rounded" />
          <div className="h-3 bg-gray-100 rounded" />
          <div className="h-3 bg-gray-100 rounded w-4/5" />
          <div className="h-3 bg-gray-100 rounded w-1/3" />
          <div className="flex gap-3 pt-2">
            <div className="h-11 bg-gray-100 rounded-sm w-36" />
            <div className="h-11 bg-gray-100 rounded-sm w-36" />
          </div>
        </div>
      </div>
    </div>
  );
}
