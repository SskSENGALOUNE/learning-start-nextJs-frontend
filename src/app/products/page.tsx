"use client";

import { Button } from "@/components/ui/Button";
import { DeleteModal } from "@/components/ui/DeleteModal";
import { LoadingModal } from "@/components/ui/LoadingModal";
import { useDeleteProduct } from "@/hooks/useDeleteProduct";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/lib/types/product";
import Link from "next/link";
import { useState } from "react";

export default function ProductsPage() {
  const { data, meta, loading, params, updateParams, refresh } = useProducts();
  const { remove, deleting } = useDeleteProduct();
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  const onFilter = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ minPrice: min, maxPrice: max });  // เปลี่ยน params → useEffect ใน hook ยิงเอง
  };

  const onClear = () => {
    setMin(""); setMax("");
    updateParams({ minPrice: "", maxPrice: "" });     // กลับไปโหมด list ปกติ
  };



  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <LoadingModal show={deleting} message="กำลังลบสินค้า..." />
        <LoadingModal show={loading} message="กำลังโหลดข้อมูล..." />
        <DeleteModal
          show={!!deleteTarget}
          itemName={deleteTarget?.name ?? ""}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={async () => {
            if (!deleteTarget) return;
            const ok = await remove(deleteTarget.id);
            if (ok) refresh();
          }}
        />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-sm text-gray-500 mt-1">
              จัดการและดูรายการสินค้าทั้งหมดในระบบ
            </p>
          </div>

          {/* Create Product Button */}
          <Link
            href="/products/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow transition-all duration-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Product
          </Link>
          <form onSubmit={onFilter} className="flex gap-2 mb-4">
            <input value={min} onChange={(e) => setMin(e.target.value)} type="number" placeholder="ราคาต่ำสุด" />
            <input value={max} onChange={(e) => setMax(e.target.value)} type="number" placeholder="ราคาสูงสุด" />
            <button type="submit">ค้นหา</button>
            <button type="button" onClick={onClear}>ล้าง</button>
          </form>

          {/* empty state: filter แล้วไม่เจอ */}
          {!loading && data.length === 0 && <p>ไม่พบสินค้าในช่วงราคานี้</p>}


          {/* empty state: filter แล้วไม่เจอ */}
          {!loading && data.length === 0 && <p>ไม่พบสินค้าในช่วงราคานี้</p>}

        </div>

        {/* Table Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-950">{p.name}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      ฿{p.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {p.stock > 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          {p.stock} units
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                          Out of stock
                        </span>
                      )}
                    </td>
                    {/* แทนทั้งหมดตั้งแต่บรรทัด 94 ถึง 132 ด้วยอันนี้อันเดียว */}
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/products/${p.id}`}
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        View Details
                        <svg
                          className="w-4 h-4 ml-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="ml-4 text-red-600 hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Section */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50 border-t border-gray-100 text-sm">
            <Button
              variant="outline"
              className="px-3 py-1.5 text-xs"
              disabled={params.page <= 1}
              onClick={() => updateParams({ page: params.page - 1 })}
              icon={
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              }
            >
              Back
            </Button>

            <Button
              variant="outline"
              className="px-3 py-1.5 text-xs"
              disabled={!meta || params.page >= meta.totalPages}
              onClick={() => updateParams({ page: params.page + 1 })}
              icon={
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              }
              iconPosition="right"
            >
              Next
            </Button>

            <span className="text-gray-600 font-medium">
              Page {meta?.page || 1} / {meta?.totalPages || 1}
            </span>

            <Button
              variant="outline"
              className="px-3 py-1.5 text-xs"
              disabled={!meta || params.page >= meta.totalPages}
              onClick={() => updateParams({ page: params.page + 1 })}
              icon={
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              }
              iconPosition="right"
            >
              Next
            </Button>
          </div>
        </div>
        <DeleteModal
          show={!!deleteTarget}
          itemName={deleteTarget?.name ?? ""}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={async () => {
            if (!deleteTarget) return;
            const ok = await remove(deleteTarget.id);
            setDeleteTarget(null);
            if (ok) refresh();
          }}
        />
        <LoadingModal show={deleting} message="loading..." />
      </div>
    </main>
  );
}
