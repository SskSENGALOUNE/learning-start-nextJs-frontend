// src/components/DeleteModal.tsx
"use client";

export function DeleteModal({
  show,
  itemName,
  onConfirm,
  onCancel,
}: {
  show: boolean;
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-xl">
        {/* Icon สามเหลี่ยมเตือน */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-7 w-7 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v3.75m0 3.75h.008M10.29 3.86L1.82 18a1.5 1.5 0 001.3 2.25h17.76a1.5 1.5 0 001.3-2.25L13.71 3.86a1.5 1.5 0 00-2.42 0z"
            />
          </svg>
        </div>

        <h2 className="text-lg font-bold text-gray-900">Delete {itemName}?</h2>
        <p className="mt-2 text-sm text-gray-500">
          You&apos;re going to delete &quot;{itemName}&quot;.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-full bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-200 cursor-pointer"
          >
            No, keep it.
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 cursor-pointer"
          >
            Yes, Delete!
          </button>
        </div>
      </div>
    </div>
  );
}
