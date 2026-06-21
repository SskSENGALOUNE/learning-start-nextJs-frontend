"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { LoadingToast } from "@/components/ui/LoadingToast";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { LoadingModal } from "@/components/ui/LoadingModal";
import { SuccessModal } from "@/components/ui/SuccessModal";
import { DeleteModal } from "@/components/ui/DeleteModal";

export default function UiComponentPage() {
  const [showToast, setShowToast] = useState(false);
  const [showLoadingToast, setShowLoadingToast] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const triggerTemporary = (setShow: (v: boolean) => void) => {
    setShow(true);
    setTimeout(() => setShow(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">UI Components</h1>
          <p className="text-sm text-gray-500 mt-1">
            รวม component ที่ใช้ซ้ำได้ทั้งแอป (src/components/ui)
          </p>
        </div>

        {/* Button */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Button</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="primary" loading>
              Loading
            </Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
        </section>

        {/* Toast (error) */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Toast (Error)
          </h2>
          <Button
            variant="danger"
            onClick={() => triggerTemporary(setShowToast)}
          >
            Trigger Error Toast
          </Button>
          <Toast
            message={
              showToast ? "เกิดข้อผิดพลาด: ไม่สามารถบันทึกข้อมูลได้" : null
            }
          />
        </section>

        {/* LoadingToast */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            LoadingToast
          </h2>
          <Button
            variant="outline"
            onClick={() => triggerTemporary(setShowLoadingToast)}
          >
            Trigger Loading Toast (2s)
          </Button>
          <LoadingToast show={showLoadingToast} />
        </section>

        {/* LoadingOverlay */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            LoadingOverlay
          </h2>
          <Button
            variant="outline"
            onClick={() => triggerTemporary(setShowLoadingOverlay)}
          >
            Trigger Loading Overlay (2s)
          </Button>
          <LoadingOverlay show={showLoadingOverlay} />
        </section>

        {/* LoadingModal */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            LoadingModal
          </h2>
          <Button
            variant="outline"
            onClick={() => triggerTemporary(setShowLoadingModal)}
          >
            Trigger Loading Modal (2s)
          </Button>
          <LoadingModal show={showLoadingModal} message="กำลังโหลด..." />
        </section>

        {/* SuccessModal */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            SuccessModal
          </h2>
          <Button variant="primary" onClick={() => setShowSuccessModal(true)}>
            Trigger Success Modal
          </Button>
          <SuccessModal
            show={showSuccessModal}
            title="Created Successfully."
            message="You have created a new item."
            onClose={() => setShowSuccessModal(false)}
          />
        </section>

        {/* DeleteModal */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            DeleteModal
          </h2>
          <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
            Trigger Delete Modal
          </Button>
          <DeleteModal
            show={showDeleteModal}
            itemName="ตัวอย่างสินค้า"
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={() => setShowDeleteModal(false)}
          />
        </section>
      </div>
    </main>
  );
}
