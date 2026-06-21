// src/components/SuccessModal.tsx
"use client";

export function SuccessModal({
  show,
  title,
  message,
  onClose,
}: {
  show: boolean;
  title: string;
  message?: string;
  onClose: () => void;
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-xl">
        {/* ปุ่มปิดมุมขวาบน */}
        <button
          onClick={onClose}
          aria-label="close"
          className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Icon วงกลมเขียว */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {message && <p className="mt-2 text-sm text-gray-500">{message}</p>}

        {/* ปุ่ม Back แบบ pill */}
        <button
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-200 cursor-pointer"
        >
          Back
        </button>
      </div>
    </div>
  );
}
