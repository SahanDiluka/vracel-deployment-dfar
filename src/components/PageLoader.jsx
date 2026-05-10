// src/components/PageLoader.jsx
export default function PageLoader() {
  return (
    <div className="flex-1 animate-pulse px-6 py-14 max-w-5xl mx-auto w-full">
      {/* Banner skeleton */}
      <div className="h-40 bg-gray-200 rounded-2xl mb-10" />
      {/* Content lines */}
      <div className="space-y-4">
        <div className="h-5 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-100 rounded w-5/6" />
        <div className="h-4 bg-gray-100 rounded w-4/6" />
      </div>
      {/* Table / card skeleton */}
      <div className="mt-10 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-xl" />
        ))}
      </div>
    </div>
  );
}