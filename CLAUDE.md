@AGENTS.md

# จุดประสงค์ของโปรเจกต์นี้

โปรเจกต์นี้คือสนามฝึกเรียนรู้การเขียน **Next.js (App Router) เป็น frontend ที่ call API จริง**
จาก backend ข้างๆ (`../start-lernning-backend-nestJS-CRUD`) ซึ่งเป็นสนามฝึกเขียน REST API ด้วย NestJS

เป้าหมายหลัก **ไม่ใช่การทำ UI ให้สวยที่สุด** แต่คือการฝึกมือให้คุ้นกับ pattern ของการ
fetch ข้อมูล, render, ส่งฟอร์มกลับไป backend, และจัดการ error/loading/empty state
จนเขียนเองได้โดยไม่ต้องเปิดดูตัวอย่าง — ฝึกซ้ำมากพอจนเป็นความเคยชิน เหมือนฝั่ง backend

# ความสัมพันธ์กับ backend (อ่านก่อนเขียน fetcher ตัวแรก)

- backend รันที่ `http://localhost:3000/api` (ดู `main.ts` ฝั่ง backend — global prefix `api`, CORS เปิดไว้แล้ว)
- ต้องเปิด backend ไว้คู่กันตลอดเวลาที่ฝึก (`npm run start:dev` ที่โฟลเดอร์ backend) เพราะ frontend นี้ไม่มี mock data
- **ทุก response จาก backend ถูกห่อด้วย envelope เดียวกันหมด** (มาจาก global `TransformInterceptor`):
  ```ts
  {
    success: boolean;
    statusCode: number;
    message: string;
    count?: number;      // มีตอน data เป็น array
    meta?: unknown;       // มีตอน endpoint เป็น paginated (เช่น bank-accounts/offset)
    data: T;              // ของจริงอยู่ตรงนี้
    timestamp: string;
    path: string;
  }
  ```
  ดังนั้น fetcher ฝั่ง frontend ต้อง unwrap `.data` เสมอ ห้าม assume ว่า response คือ entity ตรงๆ
- ตอน error (4xx/5xx) backend ส่ง shape นี้กลับมาจาก `HttpExceptionFilter` (ดู `data: null`, `message` อาจเป็น string หรือ string[] ตอน validation fail หลายข้อ):
  ```ts
  { success: false, statusCode: number, message: string | string[], data: null, timestamp, path }
  ```
- รายชื่อ endpoint จริงที่มีให้เรียกตอนนี้ (อ้างจาก controller ฝั่ง backend):
  - `GET /api/product` (`?name=&page=&limit=`), `GET /api/product/:id`, `GET /api/product/search?minPrice=&maxPrice=`,
    `GET /api/product/stats`, `GET /api/product/sort?order=asc|desc`, `GET /api/product/filter?minPrice=&minStock=`,
    `GET /api/product/by-category`, `POST /api/product` (`{name, price, stock}`), `PATCH /api/product/:id` (`{name?, price?}`),
    `DELETE /api/product/:id`
  - `GET /api/category`, `GET /api/category/:id`, `GET /api/category/search?keyword=`, `POST /api/category` (`{name}`)
  - `POST /api/customer` (`{name, email}`), `PUT /api/customer/:email` (`{name}`) — upsert
  - `POST /api/order` (`{customerId, items: [{productId, quantity}]}`), `GET /api/order/:id`, `GET /api/order/status?status=`
  - `GET /api/bank-accounts/offset?page=&limit=`, `/cursor?cursorId=&limit=`, `/filter?bankName=&limit=`, `/stats`,
    `/top?n=`, `/top/orm?n=`, `/composite?accountType=&isActive=&limit=`, `/index-compare?bankName=&rate=&limit=`, `/benchmark`
- ถ้า endpoint ไหนดูไม่ตรงกับที่เขียนไว้ตรงนี้ (backend อาจถูกแก้ไประหว่างฝึก) ให้เปิดไฟล์ controller จริงที่
  `../start-lernning-backend-nestJS-CRUD/src/presentation/<resource>/<resource>.controller.ts` เพื่อเช็คของจริงก่อนเขียน

# วิธีที่ Claude ควรช่วย (สำคัญ — อ่านก่อนเริ่มแต่ละ checklist item)

เมื่อผู้ใช้พิมพ์ขอให้ทำ checklist ข้อใดข้อหนึ่ง (เช่น "ทำ GET ข้อที่ 3"):

1. **เขียนตัวอย่าง pattern ให้ดูก่อน** — โชว์โค้ดตัวอย่าง (snippet ในแชท ไม่ต้องลงไฟล์จริง)
   พร้อมอธิบายว่าทำไมต้องเขียนแบบนี้ จุดไหนคือหัวใจของ pattern นั้น (เช่น ทำไมต้อง fetch ฝั่ง server
   component ไม่ใช่ client, ทำไมต้อง unwrap `.data`)
2. **อย่า implement ลงไฟล์จริงให้ทันที** — ปล่อยให้ผู้ใช้เขียนตามด้วยตัวเอง
3. หลังผู้ใช้เขียนเสร็จและขอให้ตรวจ ให้ **review** โค้ด ชี้จุดที่พลาด/ปรับปรุงได้ พร้อมอธิบายเหตุผล
4. เลือกว่าแต่ละ checklist item จะ "สร้างหน้า/route ใหม่" หรือ "เพิ่ม component ใน route เดิม"
   ให้พิจารณาตามความเหมาะสมของแต่ละข้อ
5. ก่อนเริ่มข้อที่ต้อง call API ตัวใหม่ ให้เตือนผู้ใช้เปิด backend ไว้ก่อน (`npm run start:dev`)

# สูตรมาตรฐาน: ขั้นตอนทำ 1 ฟีเจอร์ที่ call API

ใช้เป็น checklist ย่อยทุกครั้งที่ทำ feature ใหม่ (ไม่ว่าจะ fetch หรือ submit ฟอร์ม):

- [ ] 1. เปิดดู controller/DTO จริงฝั่ง backend เพื่อยืนยัน shape ของ request/response
- [ ] 2. กำหนด TypeScript type/interface ของ response (เผื่อ unwrap จาก envelope `{ data: T }`)
- [ ] 3. เขียนฟังก์ชัน fetcher ใน `src/lib/` (เช่น `src/lib/product.ts`) เรียกด้วย `fetch` พร้อม base URL, unwrap `.data`, throw error ถ้า `success: false`
- [ ] 4. เลือกว่าจะ fetch ฝั่ง Server Component (default, ไม่มี interactivity) หรือ Client Component + `useEffect`/hook (ต้องมี state/interactivity)
- [ ] 5. ถ้าเรียกซ้ำในหลายที่ ห่อ logic เป็น custom hook ใน `src/hooks/` (เช่น `useProducts`)
- [ ] 6. เขียน UI component ใน `src/components/` รับ data มา render
- [ ] 7. จัดการ loading / error / empty state ให้ครบ (`loading.tsx`, `error.tsx`, หรือ conditional render)
- [ ] 8. ถ้าเป็นฟอร์ม ผูก state ด้วย `useState`/`useActionState` หรือ native `<form action>` ตามความเหมาะสม + validate ฝั่ง client ก่อนยิงจริง
- [ ] 9. ทดสอบจริงผ่าน browser กับ backend ที่รันอยู่ ทั้ง happy path และ edge case (404, validation error, ผลลัพธ์ว่าง)

---

# Checklist ฝึกซ้ำตามหมวด

> หลักการ: ทำซ้ำจน pattern ติดมือ — แต่ละข้อควรมี "สถานการณ์" ที่ต่างจากข้ออื่น

## GET — ดึงข้อมูลมาแสดง (14 ครั้ง)

- [ ] 1. หน้า list แสดง product ทั้งหมด (`GET /api/product`) — Server Component fetch
- [ ] 2. หน้า detail ตาม id แบบ dynamic route `/product/[id]` (`GET /api/product/:id`)
- [ ] 3. กล่อง search ค้นหา category ด้วย keyword (`GET /api/category/search?keyword=`) — Client Component + debounce
- [ ] 4. ฟอร์ม filter product ด้วยช่วงราคา min/max (`GET /api/product/search?minPrice=&maxPrice=`)
- [ ] 5. ปุ่ม/dropdown sort product ตามราคา asc/desc (`GET /api/product/sort?order=`)
- [ ] 6. ฟอร์ม filter รวมหลาย field พร้อมกัน (`GET /api/product/filter?minPrice=&minStock=`)
- [ ] 7. Pagination แบบปุ่ม "หน้าก่อน/หน้าถัดไป" (`GET /api/product?page=&limit=`)
- [ ] 8. การ์ดสรุป stats สั้นๆ บนหน้า dashboard (`GET /api/product/stats`)
- [ ] 9. หน้า group สินค้าตาม category (`GET /api/product/by-category`)
- [ ] 10. หน้า order detail ที่แสดง customer + รายการ items ครบ (`GET /api/order/:id`)
- [ ] 11. dropdown filter order ตาม status (`GET /api/order/status?status=`)
- [ ] 12. Loading state ด้วย `loading.tsx` หรือ skeleton ระหว่างรอ fetch
- [ ] 13. Error state แสดง message จริงจาก backend ตอน fetch ล้มเหลว (เช่น `:id` ที่ไม่มีจริง → 404)
- [ ] 14. Empty state ตอนผลลัพธ์ไม่มีข้อมูล (เช่น filter ไม่เจอ, search ไม่เจอ)

## POST — ฟอร์มส่งข้อมูลสร้างใหม่ (8 ครั้ง)

- [ ] 1. ฟอร์มสร้าง product ใหม่ (`POST /api/product` — `{name, price, stock}`) พร้อม client-side validation
- [ ] 2. ฟอร์มสร้าง category ใหม่ (`POST /api/category` — `{name}`)
- [ ] 3. ฟอร์มสร้าง customer ใหม่ (`POST /api/customer` — `{name, email}`)
- [ ] 4. ฟอร์มสร้าง order: เลือก customer + เพิ่ม/ลบ item ได้หลายแถวก่อน submit (`POST /api/order` — nested `items[]`)
- [ ] 5. แสดง validation error จาก backend ตรงๆ ใต้ field ที่ผิด (เช่น `price` เป็นค่าลบ)
- [ ] 6. แสดง error เฉพาะกรณีข้อมูลขัดแย้ง (เช่นชื่อ category ซ้ำ → backend ส่ง `ConflictException`)
- [ ] 7. feedback ตอนสร้างสำเร็จ (toast/alert) + เคลียร์ฟอร์มหรือ redirect ไปหน้า detail
- [ ] 8. disable ปุ่ม submit ระหว่างรอ response กัน double submit

## PATCH/PUT — ฟอร์มแก้ไขข้อมูล (5 ครั้ง)

- [ ] 1. ฟอร์ม edit product พร้อม pre-fill ข้อมูลเดิมจาก `GET /api/product/:id` ก่อนแก้ (`PATCH /api/product/:id`)
- [ ] 2. ฟอร์ม upsert customer ด้วย email เป็น key (`PUT /api/customer/:email`)
- [ ] 3. แสดง error ตอนแก้ไข record ที่ไม่มีอยู่จริง (404 `NotFoundException`)
- [ ] 4. หลังแก้ไขสำเร็จ ทำให้หน้า list เห็นข้อมูลใหม่โดยไม่ reload เต็มหน้า (`revalidatePath`/refetch/router.refresh)
- [ ] 5. ปุ่ม submit แสดง loading state ระหว่างรอ + disable กันกดซ้ำ

## DELETE — ลบข้อมูล (4 ครั้ง)

- [ ] 1. ปุ่มลบ product พร้อม confirm dialog ก่อนยิง `DELETE /api/product/:id`
- [ ] 2. ลบสำเร็จแล้วเอา item ออกจาก list ทันทีโดยไม่ reload ทั้งหน้า (optimistic remove)
- [ ] 3. แสดง error ตอนลบ record ที่ไม่มีอยู่แล้ว (404)
- [ ] 4. Rollback การ optimistic remove ถ้า backend ตอบ error กลับมา

## Advanced — Bank Account dashboard (เลือกทำได้, ฝึก UI ที่ care เรื่อง performance) (5 ครั้ง)

> ใช้ endpoint กลุ่ม `bank-accounts` ที่ backend คืน timing (ms) มาด้วยอยู่แล้ว — โฟกัสที่การแสดงผลเปรียบเทียบ

- [ ] 1. หน้าเทียบ offset pagination vs cursor pagination — เรียกทั้งสอง endpoint แสดง ms ที่ backend คำนวณมาให้คู่กัน
- [ ] 2. แสดงผล `benchmark` (`GET /bank-accounts/benchmark`) เป็นตาราง/กราฟเทียบเวลาของแต่ละวิธี
- [ ] 3. ฟอร์ม filter ด้วย `accountType` + `isActive` พร้อมกัน (`GET /bank-accounts/composite`)
- [ ] 4. หน้า leaderboard top-N บัญชี balance สูงสุด (`GET /bank-accounts/top?n=`)
- [ ] 5. การ์ดสรุป stats รวม (`GET /bank-accounts/stats`)

---

# หมายเหตุ

- ทุกครั้งที่ทำ checklist เสร็จ ให้ขีดเครื่องหมาย `[x]` ในไฟล์นี้ เพื่อ track ความคืบหน้า เหมือนฝั่ง backend
- ถ้า pattern ไหนเริ่มทำได้คล่องแล้ว ข้ามไปข้อถัดไปได้เลย ไม่จำเป็นต้องทำครบทุกข้อ
- โปรเจกต์นี้เพิ่งตั้งต้นจาก `create-next-app` (Next.js 16, React 19, Tailwind v4) — ยังไม่มี data-fetching
  library ติดตั้ง (ไม่มี axios/SWR/TanStack Query) ถ้าจะใช้ตัวไหนให้ติดตั้งเองตอนถึง checklist ที่เกี่ยวข้อง
  ไม่ต้องติดตั้งล่วงหน้า — เริ่มจาก native `fetch` ก่อนเสมอ
- โครงสร้างปัจจุบัน: `src/app` (route ตาม App Router), `src/components` (UI component), `src/hooks` (custom hook),
  `src/lib` (fetcher/utility) — ทุกโฟลเดอร์ยังว่างอยู่ ให้ค่อยเติมตามแต่ละ checklist item
- Next.js เวอร์ชันนี้ใหม่กว่าที่ Claude เคยเทรนมา ดู `AGENTS.md` ว่าให้เช็ค `node_modules/next/dist/docs/`
  ก่อนเขียนโค้ดที่ไม่มั่นใจเรื่อง API ที่เปลี่ยนไป
