// StartupTable component

import { StartupData } from "@/types/index";

interface StartupTableProps {
  startups: StartupData[];
  loading?: boolean;
}

export default function StartupTable({
  startups,
  loading,
}: StartupTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-center text-gray-500">Loading startups...</p>
      </div>
    );
  }

  if (!startups || startups.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-center text-gray-500">No startups found. Run fetch to populate data.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Founders
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Funding
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Round
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Source
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {startups.map((startup, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {startup.companyName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {startup.founderNames?.join(", ") || "-"}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-green-600">
                  {startup.fundingTotal}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {startup.latestRound}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                    {startup.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <a
                    href={startup.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-xs truncate"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
