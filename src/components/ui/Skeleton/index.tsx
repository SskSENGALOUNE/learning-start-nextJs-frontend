// ชุด skeleton กลาง ใช้ร่วมกันทุกหน้า แทน popup loading / "Loading..." เดิม
// หลักการ: บล็อกสีเทาวิบวับด้วย animate-pulse ตามโครงของ content จริง เพื่อลด layout shift ตอนข้อมูลมา

// บล็อกพื้นฐาน — กำหนดขนาด/รูปทรงผ่าน className (เช่น "h-4 w-32", "h-6 w-20 rounded-full")
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-gray-200 ${className}`} />;
}

// สำหรับหน้า list ทั่วไป (<ul>/การ์ดเรียงแนวตั้ง) — แท่งยาว n แถว
export function SkeletonList({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-5 w-full max-w-md" />
      ))}
    </div>
  );
}

// สำหรับหน้า detail — หัวข้อใหญ่ + บรรทัดข้อมูลสั้น ๆ
export function SkeletonDetail() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-7 w-48" />
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-5 w-24" />
    </div>
  );
}

// สำหรับตาราง product (4 คอลัมน์: Name / Price / Stock / Action)
// render เป็น <tr> ล้วน เพื่อเสียบเข้า <tbody> ของตารางจริงได้พอดี
export function ProductRowsSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className="px-6 py-4">
            <div className="h-4 w-32 rounded bg-gray-200" />
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-16 rounded bg-gray-200" />
          </td>
          <td className="px-6 py-4">
            <div className="h-6 w-20 rounded-full bg-gray-200" />
          </td>
          <td className="px-6 py-4">
            <div className="ml-auto h-4 w-24 rounded bg-gray-200" />
          </td>
        </tr>
      ))}
    </>
  );
}
