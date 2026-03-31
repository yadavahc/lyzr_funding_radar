// LoadingStatus component for showing extraction progress

interface LoadingStatusProps {
  isLoading: boolean;
  status?: string;
  progress?: number;
}

export default function LoadingStatus({
  isLoading,
  status = "Processing...",
  progress,
}: LoadingStatusProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm">
        <div className="flex items-center justify-center mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
        <p className="text-center text-lg font-semibold text-gray-900 mb-2">
          {status}
        </p>
        {progress !== undefined && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}
