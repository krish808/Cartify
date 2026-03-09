export default function SkeletonCard() {
  return (
    <div className="p-5 border rounded-lg shadow-sm animate-pulse">
      {/* Image Skeleton */}
      <div className="h-48 bg-gray-200 rounded-md mb-4"></div>

      {/* Title Skeleton */}
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>

      {/* Price Skeleton */}
      <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>

      {/* Button Skeleton */}
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  );
}
