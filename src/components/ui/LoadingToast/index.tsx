"use client";

export function LoadingToast({ show }: { show: boolean }) {
    if (!show) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-3 text-sm text-white shadow-lg">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-400 border-t-white" />
            Loading...
        </div>
    );
}
