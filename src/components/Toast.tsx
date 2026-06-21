// src/components/Toast.tsx
"use client";

export function Toast({ message }: { message: string | null }) {
    if (!message) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-red-600 px-4 py-3 text-sm text-white shadow-lg">
            {message}
        </div>
    );
}
