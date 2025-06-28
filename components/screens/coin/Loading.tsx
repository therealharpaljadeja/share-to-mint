export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow sm:rounded-lg animate-pulse">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
                        <div className="space-y-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i}>
                                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                    <div className="mt-2 h-12 bg-gray-100 rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
