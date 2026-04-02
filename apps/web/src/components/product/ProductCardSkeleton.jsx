export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg p-4 animate-pulse">
      <div className="h-48 bg-gray-100 rounded-md mb-4" />
      <div className="h-3 bg-gray-100 rounded mb-2" />
      <div className="h-3 bg-gray-100 rounded w-2/3 mb-3" />
      <div className="h-4 bg-gray-100 rounded w-1/3 mb-3" />
      <div className="h-8 bg-gray-100 rounded" />
    </div>
  );
}
