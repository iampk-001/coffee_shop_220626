# User Flow & Wireframe Design: Coffee Shop Table Reservation System

อ้างอิงจาก SRS ล่าสุดที่เน้นระบบจองโต๊ะ (Table Reservation) และจัดการคิว นี่คือการออกแบบโครงสร้างหน้าจอและ User Flow ครับ

## 1. รายการหน้าจอที่ต้องมี (Screens List)

**📱 ฝั่งลูกค้า (Customer Interface):**
*   **หน้าหลัก (Booking Page):** หน้าสำหรับให้ลูกค้าเลือกวันที่, รอบเวลา (Time Slot), จำนวนคน และกรอกข้อมูลส่วนตัว
*   **หน้ายืนยันการจอง (Success / Confirmation Page):** หน้าจอสรุปข้อมูลการจองและแสดง **"รหัสการจอง"** (Booking ID) เพื่อให้ลูกค้าแคปหน้าจอเก็บไว้เป็นหลักฐาน

**💻 ฝั่งพนักงาน (Staff Interface):**
*   **หน้าล็อกอินพนักงาน (Staff Login):** หน้าสำหรับพนักงานเข้าสู่ระบบเพื่อความปลอดภัย
*   **หน้าจัดการคิว (Daily Queue Dashboard):** หน้าจอแสดงรายการลูกค้าที่จองคิวเข้ามาในแต่ละวัน โดยพนักงานสามารถกดเปลี่ยนสถานะได้ (มาถึงแล้ว / ไม่มาตามนัด / ยกเลิก)

---

## 2. User Flow การใช้งานแบบลูกศรต่อกัน

**👩‍💼 ฝั่งลูกค้า (Customer Flow):**
`[เข้าหน้า Booking Page]` ➔ `[เลือกวันที่ต้องการ (ล่วงหน้า 1-7 วัน)]` ➔ `[เลือกรอบเวลา (Time Slot) ที่ยังว่างอยู่]` ➔ `[ระบุจำนวนคน และกรอก ชื่อ/เบอร์โทร/หมายเหตุ]` ➔ `[กด "ยืนยันการจอง"]` ➔ `[แสดงหน้า Confirmation พร้อมรหัสการจอง (Booking ID)]` ➔ `[ลูกค้าแคปหน้าจอเก็บไว้]`

**👨‍🍳 ฝั่งพนักงาน (Staff Flow):**
`[เข้าหน้า Staff Login]` ➔ `[เข้าสู่หน้า Daily Queue Dashboard]` ➔ `[เลือกดูรายการคิวของ "วันนี้"]` ➔ `[เมื่อลูกค้ามาถึงร้าน แจ้งรหัสการจอง]` ➔ `[พนักงานหาคิวในระบบ และกดปุ่ม "Check-in" เพื่อรับลูกค้าเข้าโต๊ะ]` 
*(หรือกรณีลูกค้ามาสายเกิน 15 นาที ➔ พนักงานกดปุ่ม "No-show" เพื่อตัดคิว)*

---

## 3. Wireframe แบบข้อความ

### 🏠 [หน้าหลักฝั่งลูกค้า - Booking Page]
```text
--------------------------------------------------
[ Header ] โลโก้ร้านกาแฟ | "จองโต๊ะล่วงหน้า"
--------------------------------------------------
(Title) 1. เลือกวันที่
[ Date Picker: วันนี้ | พรุ่งนี้ | มะรืนนี้ ... ]

(Title) 2. เลือกรอบเวลา (Time Slot)
[ 09:00 - 11:00 ] [ 11:00 - 13:00 ]
[ 13:00 - 15:00 ] [ 15:00 - 17:00 (เต็ม) ]
[ 17:00 - 19:00 ]

(Title) 3. รายละเอียดของคุณ
[ Button: จำนวนคน (Guests) [-] 2 [+] ]
[ Input: ชื่อ - นามสกุล (Name) * ]
[ Input: เบอร์โทรศัพท์ (Phone) * ]
[ Textarea: ความต้องการพิเศษ เช่น เอาเก้าอี้เด็ก (Optional) ]

[ Button: ยืนยันการจอง (Confirm Booking) ]
--------------------------------------------------
```

### ✅ [หน้ายืนยันการจอง - Booking Confirmation]
```text
--------------------------------------------------
[ Icon: เครื่องหมายถูกสีเขียว (Success) ]
(Title) จองโต๊ะสำเร็จ!
--------------------------------------------------
[ Booking Card ]
รหัสการจอง: #BK-8492  <-- (ตัวหนา ใหญ่ชัดเจน)
ชื่อลูกค้า: คุณสมชาย
เบอร์โทรศัพท์: 081-xxx-xxxx
วันที่: 25 มิถุนายน 2026
รอบเวลา: 09:00 - 11:00 น.
จำนวน: 2 ท่าน
หมายเหตุ: ขอโต๊ะริมหน้าต่าง
--------------------------------------------------
(Text) 📸 กรุณาแคปหน้าจอนี้เพื่อแสดงต่อพนักงานเมื่อมาถึงร้าน
(Text) ⚠️ หากมาสายเกิน 15 นาที คิวจะถูกยกเลิกอัตโนมัติ

[ Button: กลับสู่หน้าหลัก / จองอีกครั้ง ]
--------------------------------------------------
```

### ⚙️ [หน้าจัดการคิวพนักงาน - Daily Queue Dashboard]
```text
--------------------------------------------------
[ Header ] Staff Dashboard | [Logout]
--------------------------------------------------
[ Date Selector: วันนี้ (25 มิ.ย.) < > ]

(Title) รายการคิวจองทั้งหมด (12 คิว) | [ สถานะ: ทุกรอบเวลา v ]

[ Table List ]
| รหัสจอง | รอบเวลา | ชื่อลูกค้า | เบอร์โทร | คน | หมายเหตุ | สถานะ | จัดการคิว |
|---------|---------|------------|----------|----|----------|-------|-----------|
| #BK-111 | 09:00   | คุณเอ      | 081-xxx  | 2  | -        | [รอ]  | [Check-in] [No-show] |
| #BK-222 | 11:00   | คุณบี      | 082-xxx  | 4  | เก้าอี้เด็ก| [รอ]  | [Check-in] [No-show] |
| #BK-333 | 11:00   | คุณซี      | 083-xxx  | 1  | -        | [เข้า]| (เสร็จสิ้น) |
--------------------------------------------------
```

---

## 4. Prompt สำหรับสั่ง AI สร้าง Frontend

ก็อปปี้ Prompt ด้านล่างนี้ไปสั่ง AI ให้สร้าง UI สำหรับ **หน้าจองโต๊ะ (Booking Page)** ได้เลยครับ:

```text
Role: You are an expert Frontend Developer and UI/UX Designer.
Task: Create a modern, responsive Table Reservation Page for a premium coffee shop.
Tech Stack: HTML5, CSS3 (Vanilla), JavaScript (Vanilla). Do NOT use Tailwind or any external CSS libraries.

Design Requirements:
- Aesthetic: Clean, minimalist, cafe-style warm tone (coffee brown, beige, cream). Use subtle shadows and rounded corners.
- Typography: Use Google Fonts like 'Inter' for UI text and 'Playfair Display' for headings.
- Layout: Mobile-first approach, fully responsive.

Sections to include in `index.html`:
1. Header: Simple elegant shop logo/name.
2. Date Selection: A clean date picker input or a row of selectable date chips.
3. Time Slot Selection: A grid of selectable time slot buttons (e.g., "09:00-11:00", "11:00-13:00"). Make one button look visually "disabled/full" to demonstrate the UI state.
4. Booking Details Form: 
   - A counter for number of guests (- 1 +)
   - Input fields for Name and Phone Number (required)
   - Textarea for Special Requests (optional)
5. Submit Action: A large, prominent "Confirm Booking" button.
6. Success Modal (Hidden by default): A popup/modal overlay that appears after submission. It must contain a success checkmark, a dummy Booking ID (e.g., #BK-8492), the summarized booking details, and a warning text: "Please screenshot this page. Reservations are cancelled if 15 minutes late."

Interactivity (JS):
- Time slot buttons should be selectable (highlight with a brand color when clicked).
- Guest counter (- / +) should work.
- The "Confirm Booking" button should prevent default form submission and trigger the Success Modal to open.

Please provide semantic HTML, clean CSS, and JavaScript.
```
