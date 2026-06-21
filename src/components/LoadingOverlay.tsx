"use client";

export function LoadingOverlay({ show }: { show: boolean }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="flex items-center gap-3 rounded-lg bg-white px-6 py-4 shadow-lg">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                <p className="text-sm font-medium text-gray-700">กำลังโหลด...</p>
            </div>
        </div>
    );
}
