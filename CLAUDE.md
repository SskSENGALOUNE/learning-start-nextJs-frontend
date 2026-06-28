@AGENTS.md

# จุดประสงค์ของโปรเจกต์นี้

โปรเจกต์นี้คือสนามฝึกเรียนรู้การเขียน **Next.js (App Router) เป็น frontend ที่ call API จริง**
จาก backend ข้างๆ (`../start-lernning-backend-nestJS-CRUD`) ซึ่งเป็นสนามฝึกเขียน REST API ด้วย NestJS

เป้าหมายหลัก **ไม่ใช่การทำ UI ให้สวยที่สุด** แต่คือการฝึกมือให้คุ้นกับ pattern ของการ
fetch ข้อมูล, render, ส่งฟอร์มกลับไป backend, และจัดการ error/loading/empty state
จนเขียนเองได้โดยไม่ต้องเปิดดูตัวอย่าง — ฝึกซ้ำมากพอจนเป็นความเคยชิน เหมือนฝั่ง backend

# ความสัมพันธ์กับ backend (อ่านก่อนเขียน fetcher ตัวแรก)

- backend รันที่ `http://localhost:3000/api` (ดู `main.ts` ฝั่ง backend — global prefix `api`, CORS เปิดไว้แล้ว)
- frontend นี้รันที่ port **3001** (`next dev -p 3001` ใน `package.json`) เพื่อไม่ชนกับ backend ที่ port 3000
- **ต้องมีไฟล์ `.env` ที่ root ของ frontend** ตั้งค่า base URL ให้ `httpClient.ts` (ถ้าไม่มี → `fetch` ยิงไป `undefined/...` ได้ HTML กลับมา → error `Unexpected token '<' ... is not valid JSON`):
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:3000/api
  ```
  ต้องขึ้นต้นด้วย `NEXT_PUBLIC_` เพราะ `apiFetch` ทำงานฝั่ง client + ต้องมี `/api` ต่อท้าย (service เรียก path แบบ `/product` ไม่ใส่ prefix เอง) และต้อง restart dev server ทุกครั้งหลังแก้ `.env`
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
  (ใน layer `lib/configs/httpClient.ts` ของโปรเจกต์นี้ `apiFetch` คืน envelope ทั้งก้อนออกมาตรงๆ
  ไม่ unwrap ให้ — ปล่อยให้ `lib/services/*Service.ts` หรือ hook ที่เรียกใช้เป็นคนดึง `.data`/`.meta` เอาเอง
  ตาม pattern เดียวกับ `achievementsSerive.getAll()` ใน `web-admin-mastermind`)
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
  - `GET /api/customer` (เพิ่มเองระหว่างฝึก ของเดิม backend ไม่มี), `POST /api/customer` (`{name, email}`),
    `PUT /api/customer/:email` (`{name}`) — upsert
  - `POST /api/order` (`{customerId, items: [{productId, quantity}]}`), `GET /api/order/:id`, `GET /api/order/status?status=`
  - `GET /api/bank-accounts/offset?page=&limit=`, `/cursor?cursorId=&limit=`, `/filter?bankName=&limit=`, `/stats`,
    `/top?n=`, `/top/orm?n=`, `/composite?accountType=&isActive=&limit=`, `/index-compare?bankName=&rate=&limit=`, `/benchmark`
- ถ้า endpoint ไหนดูไม่ตรงกับที่เขียนไว้ตรงนี้ (backend อาจถูกแก้ไประหว่างฝึก) ให้เปิดไฟล์ controller จริงที่
  `../learning-start-nestJs-backend/src/presentation/<resource>/<resource>.controller.ts` เพื่อเช็คของจริงก่อนเขียน

# วิธีที่ Claude ควรช่วย (สำคัญที่สุด — อ่านก่อนเริ่มแต่ละ checklist item)

> **เป้าหมายของการฝึกคือ "เข้าใจการตัดสินใจ" ไม่ใช่ "จำโค้ด"**
> ผู้ใช้บอกเองว่าที่ผ่านมามักเขียนตามตัวอย่างโดยไม่เข้าใจ และ **ไม่อยากให้เน้นการท่องจำ**
> สิ่งที่ผู้ใช้ต้องได้จากทุกข้อคือ pattern การคิดแบบนี้:
>
> **"เจอสถานการณ์แบบนี้ → ต้องใช้วิธีนี้ → เพราะเหตุผลนี้"**
>
> ถ้าผู้ใช้เข้าใจ "เพราะอะไร" แล้ว เขาจะเขียนเองได้ในสถานการณ์ใหม่ที่ไม่เคยเห็นตัวอย่าง — นั่นคือความสำเร็จ
> ไม่ใช่การจำว่า "หน้า product เขียนแบบนี้" แต่จำไม่ได้ว่าทำไม

เมื่อผู้ใช้พิมพ์ขอให้ทำ checklist ข้อใดข้อหนึ่ง (เช่น "ทำ GET ข้อที่ 3"):

1. **เริ่มจาก "สถานการณ์" ก่อน "โค้ด"** — อธิบายก่อนว่าข้อนี้เจอโจทย์อะไร (เช่น "ต้อง pre-fill ฟอร์มจากข้อมูลเดิม
   ก่อนให้ผู้ใช้แก้") แล้วถามชวนคิดว่า *"สถานการณ์แบบนี้ ควรใช้วิธีไหน?"* ก่อนเฉลย — อย่าโยนโค้ดให้ลอกทันที
2. **ทุกครั้งที่โชว์วิธี ต้องบอก "เพราะอะไร" คู่กันเสมอ** ในรูปแบบ *เจอ X → ทำ Y → เพราะ Z* เช่น:
   - "เจอ response ที่ห่อด้วย envelope → hook ต้อง unwrap `.data` เอง → **เพราะ** httpClient ออกแบบให้คืนทั้งก้อน
     เผื่อ resource อื่นต้องใช้ `.meta`/`.message` ต่างกัน ถ้า unwrap ที่ httpClient จะ lock ทุก resource ให้เหมือนกันหมด"
   - "เจอ data ที่ขึ้นกับ user interaction (filter/page) → ใช้ `useState` + `useEffect` ไม่ใช่ fetch ตอน render →
     **เพราะ** ถ้า fetch ใน render ตรงๆ จะยิงซ้ำทุกครั้งที่ re-render"
   - ถ้าตอบ "เพราะอะไร" ไม่ได้ แปลว่ายังอธิบายไม่ครบ — ห้ามข้ามส่วนนี้
3. **เทียบกับทางเลือกที่ "ผิด" หรือ "แย่กว่า" ให้เห็น** — บอกด้วยว่าถ้าทำอีกแบบจะพังยังไง/ลำบากตรงไหน
   เพราะการเข้าใจว่า "ทำไมไม่ทำอีกแบบ" ช่วยให้จำเหตุผลได้ลึกกว่าการจำแค่ว่า "ทำแบบนี้"
4. **โชว์ snippet ในแชทเป็นโครง ไม่ใช่โค้ดเต็มให้ลอก** — ให้เห็นหัวใจของ pattern (3-5 บรรทัดที่สำคัญ)
   ส่วนที่เหลือปล่อยให้ผู้ใช้เติมเอง **ห้าม implement ลงไฟล์จริงให้** จนกว่าผู้ใช้จะเขียนเองแล้วขอให้ช่วย
5. **ตอน review ให้ถามกลับว่า "ทำไมถึงเขียนตรงนี้แบบนี้"** ถ้าผู้ใช้ตอบไม่ได้ = ยังลอกอยู่ ให้ย้อนไปอธิบายเหตุผล
   ไม่ใช่แค่ชี้ว่าบรรทัดไหนผิด แต่ชี้ว่า *เข้าใจอะไรพลาดไป* ถึงเขียนผิดตรงนั้น
6. เลือกว่าแต่ละ checklist item จะ "สร้างหน้า/route ใหม่" หรือ "เพิ่ม component ใน route เดิม" ตามความเหมาะสม
7. ก่อนเริ่มข้อที่ต้อง call API ตัวใหม่ ให้เตือนผู้ใช้เปิด backend ไว้ก่อน (`npm run start:dev`)

## ⚠️ จุดอ่อนที่ต้องเน้นย้ำเป็นพิเศษ: การรับส่ง parameter / argument

ผู้ใช้บอกเองว่า **ยังงงเรื่องการรับส่ง parameter / argument** — นี่คือพื้นฐานที่ทุก layer ในโปรเจกต์นี้ใช้
(ค่าตัวเดียวถูกส่งต่อหลายทอด: `page → hook → service → apiFetch → backend`) ถ้าตรงนี้ไม่แน่น จะเขียน feature ใหม่ไม่ได้เอง

**ทุกครั้งที่อธิบายโค้ดที่มีการส่งค่าระหว่างฟังก์ชัน/layer ให้ทำสิ่งนี้เสมอ (ห้ามข้าม):**

- **แยกคำให้ชัด**: *parameter* = ช่องรับตอนนิยามฟังก์ชัน (กล่องเปล่า) / *argument* = ค่าจริงตอนเรียกใช้ (ของที่ใส่กล่อง)
  เช่น `getById(id)` → `id` คือ parameter, `getById(5)` → `5` คือ argument
- **ย้ำว่า JS จับคู่ตาม "ตำแหน่ง"**: `getAll(2, 20)` → `2` เข้าช่องแรก (`page`), `20` เข้าช่องสอง (`limit`) — สลับลำดับ = ค่าผิดแบบเงียบๆ
- **วาดเส้นทางการไหลของค่า (data flow) ให้เห็นเป็นทอดๆ** เวลาค่าวิ่งข้าม layer เช่น
  `useParams().id ("5") → Number() → useProduct(5) → getById(5) → apiFetch('/product/5')`
  พร้อมชี้จุดที่ต้อง **แปลง type** (string จาก URL → number) และบอกว่า *เพราะ* parameter ปลายทางเป็น `number`
- **เปรียบเทียบ 2 วิธีส่งค่า**: ส่งทีละตัว (positional เช่น `getById(5)`) เหมาะตอน argument น้อย / ส่งเป็น object
  (payload เช่น `create({name, price, stock})`) เหมาะตอน argument เยอะ **เพราะ** จับคู่ด้วย "ชื่อ" ไม่ใช่ "ตำแหน่ง" จึงไม่สลับพลาด
- **เช็คความเข้าใจด้วยคำถามย้อนกลับ** (เช่น "`searchByPrice(500, 100)` จะเกิดอะไรขึ้น?") ก่อนไปต่อ — อย่าเพิ่งสรุปว่าเข้าใจแล้ว

# สถาปัตยกรรม: layer ของ frontend นี้

ตั้งแต่ resource `product` เป็นต้นไป โปรเจกต์นี้จัด layer ตาม pattern เดียวกับ `web-admin-mastermind`
(โปรเจกต์จริงข้างเคียงใน `lernning-full/`) — ไม่ใช้ Server Component fetch ตรงๆ ในหน้าอีกแล้ว
แต่แยกเป็น 4 ชั้นต่อ resource:

```
src/lib/configs/httpClient.ts   # apiFetch<T>() ตัวเดียว ใช้ร่วมกันทุก resource
                                 # คืน ApiEnvelope<T> เต็มก้อน { success, message, data, meta? }
                                 # ไม่ unwrap ให้ — throw error เองถ้า !res.ok || !json.success

src/lib/types/<resource>.ts     # type ของ entity (เช่น Product) เก็บแยกจาก service

src/lib/services/<resource>Service.ts
                                 # object เปล่าๆ (ไม่ใช่ class ก็ได้ ถ้าไม่มี state ภายใน) มีฟังก์ชันต่อ endpoint
                                 # เช่น getAll(page, limit, ...filters) เรียก apiFetch แล้ว return envelope ตรงๆ

src/hooks/use<Resource>.ts      # "use client" + useState (data, meta, loading, params)
                                 # + useCallback fetchXxx() + useEffect เรียกตอน mount/params เปลี่ยน
                                 # + updateParams() + refresh() — เป็นคนแยก .data/.meta ออกจาก envelope
```

หน้า (`page.tsx`) เป็น **Client Component** (`"use client"`) เรียก hook ตรงๆ แล้ว render —
ไม่ fetch เองในหน้า ไม่ unwrap envelope เองในหน้า ปล่อยให้ hook จัดการให้หมด

> หมายเหตุ ESLint: `react-hooks/set-state-in-effect` จะ flag การเรียก fetch function (ที่ setState ข้างใน)
> จาก `useEffect` ตรงๆ — เป็น fetch-on-mount pattern ที่ตั้งใจทำ ให้ใส่
> `// eslint-disable-next-line react-hooks/set-state-in-effect` พร้อม comment สั้นๆ อธิบายเหตุผลไว้ด้วย

# สูตรมาตรฐาน: ขั้นตอนทำ 1 ฟีเจอร์ที่ call API

ใช้เป็น checklist ย่อยทุกครั้งที่ทำ feature ใหม่ (ไม่ว่าจะ fetch หรือ submit ฟอร์ม):

- [ ] 1. เปิดดู controller/DTO จริงฝั่ง backend เพื่อยืนยัน shape ของ request/response
- [ ] 2. เพิ่ม type ของ entity ใน `src/lib/types/<resource>.ts`
- [ ] 3. เพิ่มฟังก์ชันใน `src/lib/services/<resource>Service.ts` เรียก `apiFetch` จาก `httpClient.ts` (ห้าม unwrap ที่นี่ ปล่อยให้ hook unwrap)
- [ ] 4. เขียน/แก้ custom hook ใน `src/hooks/use<Resource>.ts` — เพิ่ม state ใหม่ที่ต้องใช้ (เช่น filter param ใหม่) แล้ว unwrap `.data`/`.meta` จาก envelope
- [ ] 5. เขียน UI component ใน `src/components/` หรือใน `page.tsx` ตรงๆ ถ้ายังไม่ซับซ้อน รับค่าจาก hook มา render
- [ ] 6. จัดการ loading / error / empty state ให้ครบ (ใช้ field `loading`/`error` ที่ hook return มา)
- [ ] 7. ถ้าเป็นฟอร์ม ผูก state ด้วย `useState`/`useActionState` หรือ native `<form action>` ตามความเหมาะสม + validate ฝั่ง client ก่อนยิงจริง
- [ ] 8. ทดสอบจริงผ่าน browser กับ backend ที่รันอยู่ ทั้ง happy path และ edge case (404, validation error, ผลลัพธ์ว่าง)

---

# Checklist ฝึกซ้ำตามหมวด

> หลักการ: ทำซ้ำจน pattern ติดมือ — แต่ละข้อควรมี "สถานการณ์" ที่ต่างจากข้ออื่น

## GET — ดึงข้อมูลมาแสดง (14 ครั้ง)

- [x] 1. หน้า list แสดง product ทั้งหมด (`GET /api/product`) — Client Component + `useProducts()` hook (เสร็จแล้ว ดู `src/hooks/useProducts.ts`)
- [x] 2. หน้า detail ตาม id แบบ dynamic route `/product/[id]` (`GET /api/product/:id`)
- [x] 3. กล่อง search ค้นหา category ด้วย keyword (`GET /api/category/search?keyword=`) — Client Component + debounce
- [x] 4. ฟอร์ม filter product ด้วยช่วงราคา min/max (`GET /api/product/search?minPrice=&maxPrice=`) — ดู `useProducts.ts` (สลับ `searchByPrice` เมื่อมี min+max) + ฟอร์มใน `products/page.tsx`
- [x] 5. ปุ่ม/dropdown sort product ตามราคา asc/desc (`GET /api/product/sort?order=`) — `<select sortOrder>` ใน `products/page.tsx` + `sortByPrice` ใน `useProducts.ts`
- [ ] 6. ฟอร์ม filter รวมหลาย field พร้อมกัน (`GET /api/product/filter?minPrice=&minStock=`)
- [x] 7. Pagination แบบปุ่ม "หน้าก่อน/หน้าถัดไป" (`GET /api/product?page=&limit=`)
- [ ] 8. การ์ดสรุป stats สั้นๆ บนหน้า dashboard (`GET /api/product/stats`)
- [ ] 9. หน้า group สินค้าตาม category (`GET /api/product/by-category`)
- [ ] 10. หน้า order detail ที่แสดง customer + รายการ items ครบ (`GET /api/order/:id`)
- [ ] 11. dropdown filter order ตาม status (`GET /api/order/status?status=`)
- [x] 12. Loading state ด้วย `loading.tsx` หรือ skeleton ระหว่างรอ fetch — `<ProductRowsSkeleton>` ใน `products/page.tsx`
- [ ] 13. Error state แสดง message จริงจาก backend ตอน fetch ล้มเหลว (เช่น `:id` ที่ไม่มีจริง → 404)
- [x] 14. Empty state ตอนผลลัพธ์ไม่มีข้อมูล (เช่น filter ไม่เจอ, search ไม่เจอ) — ข้อความ "ไม่พบสินค้าในช่วงราคานี้" ใน `products/page.tsx`

## POST — ฟอร์มส่งข้อมูลสร้างใหม่ (8 ครั้ง)

- [x] 1. ฟอร์มสร้าง product ใหม่ (`POST /api/product` — `{name, price, stock}`) พร้อม client-side validation
- [x] 2. ฟอร์มสร้าง category ใหม่ (`POST /api/category` — `{name}`)
- [x] 3. ฟอร์มสร้าง customer ใหม่ (`POST /api/customer` — `{name, email}`)
- [ ] 4. ฟอร์มสร้าง order: เลือก customer + เพิ่ม/ลบ item ได้หลายแถวก่อน submit (`POST /api/order` — nested `items[]`)
- [ ] 5. แสดง validation error จาก backend ตรงๆ ใต้ field ที่ผิด (เช่น `price` เป็นค่าลบ)
- [ ] 6. แสดง error เฉพาะกรณีข้อมูลขัดแย้ง (เช่นชื่อ category ซ้ำ → backend ส่ง `ConflictException`)
- [x] 7. feedback ตอนสร้างสำเร็จ (toast/alert) + เคลียร์ฟอร์มหรือ redirect ไปหน้า detail
- [x] 8. disable ปุ่ม submit ระหว่างรอ response กัน double submit

## PATCH/PUT — ฟอร์มแก้ไขข้อมูล (5 ครั้ง)

- [x] 1. ฟอร์ม edit product พร้อม pre-fill ข้อมูลเดิมจาก `GET /api/product/:id` ก่อนแก้ (`PATCH /api/product/:id`) — `products/[id]/edit/page.tsx` (reuse `useProduct` pre-fill + `useEffect` sync ลง state) + `useUpdateProduct.ts` + ปุ่ม Edit ในหน้า list/detail
- [ ] 2. ฟอร์ม upsert customer ด้วย email เป็น key (`PUT /api/customer/:email`)
- [ ] 3. แสดง error ตอนแก้ไข record ที่ไม่มีอยู่จริง (404 `NotFoundException`)
- [ ] 4. หลังแก้ไขสำเร็จ ทำให้หน้า list เห็นข้อมูลใหม่โดยไม่ reload เต็มหน้า (`revalidatePath`/refetch/router.refresh)
- [ ] 5. ปุ่ม submit แสดง loading state ระหว่างรอ + disable กันกดซ้ำ

## DELETE — ลบข้อมูล (4 ครั้ง)

- [x] 1. ปุ่มลบ product พร้อม confirm dialog ก่อนยิง `DELETE /api/product/:id` — `<DeleteModal>` + `useDeleteProduct.ts`
- [ ] 2. ลบสำเร็จแล้วเอา item ออกจาก list ทันทีโดยไม่ reload ทั้งหน้า (optimistic remove)
- [ ] 3. แสดง error ตอนลบ record ที่ไม่มีอยู่แล้ว (404)
- [ ] 4. Rollback การ optimistic remove ถ้า backend ตอบ error กลับมา

## Advanced — Bank Account dashboard (เลือกทำได้, ฝึก UI ที่ care เรื่อง performance) (5 ครั้ง)

> ใช้ endpoint กลุ่ม `bank-accounts` ที่ backend คืน timing (ms) มาด้วยอยู่แล้ว — โฟกัสที่การแสดงผลเปรียบเทียบ

- [x] 1. หน้าเทียบ offset pagination vs cursor pagination — เรียกทั้งสอง endpoint แสดง ms ที่ backend คำนวณมาให้คู่กัน
- [x] 2. แสดงผล `benchmark` (`GET /bank-accounts/benchmark`) เป็นตาราง/กราฟเทียบเวลาของแต่ละวิธี
- [ ] 3. ฟอร์ม filter ด้วย `accountType` + `isActive` พร้อมกัน (`GET /bank-accounts/composite`)
- [ ] 4. หน้า leaderboard top-N บัญชี balance สูงสุด (`GET /bank-accounts/top?n=`)
- [ ] 5. การ์ดสรุป stats รวม (`GET /bank-accounts/stats`)

---

# หมายเหตุ

- ทุกครั้งที่ทำ checklist เสร็จ ให้ขีดเครื่องหมาย `[x]` ในไฟล์นี้ เพื่อ track ความคืบหน้า เหมือนฝั่ง backend
- ถ้า pattern ไหนเริ่มทำได้คล่องแล้ว ข้ามไปข้อถัดไปได้เลย ไม่จำเป็นต้องทำครบทุกข้อ
- โปรเจกต์นี้ตั้งต้นจาก `create-next-app` (Next.js 16, React 19, Tailwind v4) — ตั้งใจ **ไม่ใช้ axios**
  (เทียบกับ `web-admin-mastermind` ที่ใช้ axios + interceptor เพราะมี auth token ต้อง attach) เพราะ backend
  ฝึกนี้ไม่มี auth เลยพอใช้ native `fetch` ห่อใน `httpClient.ts` ตัวเดียวก็เพียงพอ — ไม่ต้องติดตั้ง library เพิ่ม
- โครงสร้างปัจจุบัน: `src/app` (route ตาม App Router, page เป็น Client Component), `src/components` (UI component
  ที่ใช้ร่วมกันหลาย resource), `src/hooks` (`use<Resource>.ts` ต่อ resource), `src/lib/configs` (`httpClient.ts`),
  `src/lib/types` (`<resource>.ts`), `src/lib/services` (`<resource>Service.ts`) — ดู resource `product` เป็นตัวอย่างอ้างอิง
  ตอนเพิ่ม resource ใหม่ (category, customer, order, bank-account)
- Next.js เวอร์ชันนี้ใหม่กว่าที่ Claude เคยเทรนมา ดู `AGENTS.md` ว่าให้เช็ค `node_modules/next/dist/docs/`
  ก่อนเขียนโค้ดที่ไม่มั่นใจเรื่อง API ที่เปลี่ยนไป
