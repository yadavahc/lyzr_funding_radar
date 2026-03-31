// StatCard component for dashboard

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  loading?: boolean;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  loading,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {loading ? "..." : value}
          </p>
          {subtitle && (
            <p className="text-gray-400 text-xs mt-1">{subtitle}</p>
          )}
        </div>
        {icon && <span className="text-4xl">{icon}</span>}
      </div>
    </div>
  );
}
