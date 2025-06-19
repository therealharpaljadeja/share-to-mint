"use client";

import { useSearchParams } from "next/navigation";

export default function ShareContent() {
  const searchParams = useSearchParams();
  
  const castHash = searchParams.get("castHash") || "";
  const castFid = Number(searchParams.get("castFid")) || 0;
  const viewerFid = Number(searchParams.get("viewerFid")) || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Cast Details</h1>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Cast Hash</h3>
                <p className="mt-2 text-sm text-gray-900 break-all font-mono bg-gray-50 p-3 rounded-md">
                  {castHash}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Cast Author FID</h3>
                <p className="mt-2 text-sm text-gray-900 font-mono bg-gray-50 p-3 rounded-md">
                  {castFid}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Viewer FID</h3>
                <p className="mt-2 text-sm text-gray-900 font-mono bg-gray-50 p-3 rounded-md">
                  {viewerFid}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 