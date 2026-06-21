# User Flow & Wireframe Design: Brown Coffee

## 1. รายการหน้าจอที่ต้องมี (Screens List)
*   **หน้าหลัก (Landing Page)**: หน้าแรกสำหรับดึงดูดลูกค้า แสดงจุดเด่น เมนูแนะนำ และมีส่วนตะกร้าสินค้า
*   **หน้าชำระเงิน (Checkout Page)**: สำหรับให้ลูกค้ากรอกข้อมูลจัดส่งและยืนยันการสั่งซื้อ
*   **หน้าขอบคุณ (Thank You / Success Page)**: แสดงข้อความยืนยันและสรุปคำสั่งซื้อหลังจากกดซื้อสำเร็จ
*   **หน้าล็อกอินแอดมิน (Admin Login)**: สำหรับเจ้าของร้านล็อกอินเข้าสู่ระบบหลังบ้าน
*   **หน้าแอดมิน (Admin Dashboard)**: สำหรับดูรายการออเดอร์ทั้งหมด และปรับเปลี่ยนสถานะ (รอจัดส่ง / เสร็จสิ้น)

---

## 2. User Flow การใช้งาน

**🛒 ฝั่งลูกค้า (Customer Flow):**
`[เข้าหน้า Landing Page]` ➔ `[ดูเมนูและกด "Add to Cart"]` ➔ `[เปิดดูตะกร้า (Cart Sidebar)]` ➔ `[กดปุ่ม "Checkout"]` ➔ `[เข้าหน้า Checkout: กรอกชื่อ/เบอร์/ที่อยู่ และเลือก COD/รับที่ร้าน]` ➔ `[กด "Confirm Order"]` ➔ `[เข้าสู่หน้า Thank You (แสดงสรุปออเดอร์)]`

**📋 ฝั่งเจ้าของร้าน (Admin Flow):**
`[เข้าหน้า Admin Login]` ➔ `[กรอกรหัสผ่าน]` ➔ `[เข้าหน้า Admin Dashboard]` ➔ `[ดูรายการออเดอร์ที่เข้ามาใหม่]` ➔ `[กดอัปเดตสถานะ (เช่น อัปเดตเป็น Completed)]`

---

## 3. Wireframe แบบข้อความ

### 🏠 [หน้าหลัก - Landing Page]
```text
--------------------------------------------------
[ Navbar ] 
(Left) โลโก้ Brown Coffee   (Right) ไอคอนตะกร้าสินค้า (Cart) พร้อมตัวเลขจำนวนชิ้น
--------------------------------------------------
[ Hero Section ]
(Background) ภาพร้านกาแฟโทนน้ำตาลอบอุ่น / กาแฟพรีเมียม
(Text) "เริ่มต้นวันดีๆ ด้วยกาแฟแก้วโปรดของคุณ"
(Button) [ดูเมนูและสั่งเลย]
--------------------------------------------------
[ Menu Section ]
(Title) เมนูแนะนำของเรา
[ Card 1 ] ภาพกาแฟ | อเมริกาโน่เย็น | 65 ฿ | [Add to Cart]
[ Card 2 ] ภาพกาแฟ | ลาเต้ร้อน | 70 ฿ | [Add to Cart]
[ Card 3 ] ภาพเบเกอรี่ | ครัวซองต์เนยสด | 55 ฿ | [Add to Cart]
--------------------------------------------------
[ Footer ]
(Text) ที่อยู่ร้าน, เวลาเปิด-ปิด, เบอร์โทร
--------------------------------------------------

[ Cart Sidebar (ซ่อนอยู่ สไลด์มาจากขวาเมื่อกดไอคอนตะกร้า) ]
-----------------------------------------
| (Title) ตะกร้าสินค้าของคุณ     [ปิด X] |
|                                       |
| - อเมริกาโน่เย็น x 1         65 ฿      |
| - ลาเต้ร้อน x 2             140 ฿     |
|                                       |
| ราคารวม (Total):            205 ฿      |
|                                       |
| [ ไปยังหน้าชำระเงิน (Checkout) ]         |
-----------------------------------------
```

### 💳 [หน้าชำระเงิน - Checkout Page]
```text
--------------------------------------------------
[ Header ] โลโก้ Brown Coffee  (< กลับไปหน้าหลัก)
--------------------------------------------------
[ Order Summary ] (สรุปรายการสินค้าทางซ้ายหรือด้านบน)
- อเมริกาโน่เย็น x 1
- ลาเต้ร้อน x 2
รวมทั้งหมด: 205 ฿
--------------------------------------------------
[ Shipping Form ] (แบบฟอร์มให้กรอกข้อมูล)
(Title) ข้อมูลการจัดส่ง
[ Input: ชื่อ - นามสกุล ]
[ Input: เบอร์โทรศัพท์ติดต่อ ]
[ Textarea: ที่อยู่จัดส่ง (เว้นว่างได้ถ้ามารับเอง) ]

(Title) วิธีรับสินค้าและการชำระเงิน
(Radio) [ O ] เก็บเงินปลายทาง (COD)
(Radio) [   ] รับที่ร้าน (Pick up in store)

[ Button: ยืนยันคำสั่งซื้อ (Confirm Order) ]
--------------------------------------------------
```

### ⚙️ [หน้าแอดมิน - Admin Dashboard]
```text
--------------------------------------------------
[ Header ] Admin Dashboard | (Right) [Logout]
--------------------------------------------------
(Title) รายการคำสั่งซื้อล่าสุด (Latest Orders)

[ Table ]
| Order ID | ชื่อลูกค้า | เบอร์โทร   | รูปแบบรับ | ยอดรวม | สถานะ | จัดการ |
|----------|------------|------------|-----------|--------|-------|--------|
| #001     | สมชาย      | 081-xxx    | COD       | 205 ฿  | [ รอส่ง ] | [✓ เสร็จสิ้น] |
| #002     | สมหญิง     | 089-xxx    | รับที่ร้าน | 70 ฿   | [ รอส่ง ] | [✓ เสร็จสิ้น] |
--------------------------------------------------
```

---

## 4. Prompt สำหรับสั่ง AI สร้าง Frontend ของหน้าหลัก

หากต้องการนำไปสั่ง AI (เช่น Claude, ChatGPT หรือให้ผมเขียนให้ทีหลัง) สามารถก๊อปปี้ Prompt ด้านล่างนี้ไปใช้ได้เลยครับ:

```text
Role: You are an expert Frontend Developer and UI/UX Designer.
Task: Create a responsive Landing Page for a premium coffee shop named "Brown Coffee".
Tech Stack: HTML5, CSS3 (Vanilla), JavaScript (Vanilla). Do NOT use Tailwind or any external CSS frameworks.

Design Requirements:
- Aesthetic: Minimalist, premium, warm tone (Brown, soft cream, and dark espresso colors). Use subtle glassmorphism and soft shadows.
- Typography: Use a modern Google Font (e.g., 'Inter', 'Outfit', or 'Playfair Display' for headings).
- Layout: Must be fully responsive (Mobile-first approach).

Sections to include in `index.html`:
1. Navbar: Sticky, Logo on the left, Cart icon on the right with an item count badge.
2. Hero Section: High-quality full-width background image (use placeholder from Unsplash), large catchy headline ("Start your day with the perfect cup"), and a Call-to-Action button ("Order Now") that scrolls to the menu.
3. Menu Section: A grid of 3 product cards. Each card must have: A beautiful coffee image placeholder, Product Name, Price, and an "Add to Cart" button.
4. Cart Sidebar: A sliding sidebar from the right (hidden by default) that displays mock cart items, total price, and a "Checkout" button.
5. Footer: Simple footer with address and social links.

Interactivity (JS):
- Clicking "Add to Cart" should update the cart count badge and open the sidebar.
- Provide smooth hover effects on buttons and product cards (micro-animations).
- The cart sidebar must be able to open and close smoothly.

Please output the complete code including `index.html`, `style.css`, and `main.js`.
```
