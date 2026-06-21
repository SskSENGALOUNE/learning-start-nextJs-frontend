// src/components/ui/LoadingModal/index.tsx
"use client";

export function LoadingModal({
  show,
  message,
}: {
  show: boolean;
  message?: string;
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-xl">
        {/* Icon spinner วงกลม แทนที่ checkmark/warning ของอีก 2 ตัว */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
          <span className="h-7 w-7 animate-spin rounded-full border-[3px] border-blue-200 border-t-blue-600" />
        </div>

        <h2 className="text-lg font-bold text-gray-900">
          {message ?? "loading..."}
        </h2>
      </div>
    </div>
  );
}
