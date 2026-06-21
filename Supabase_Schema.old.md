# Supabase Database Schema Design: Brown Coffee
อ้างอิงจาก SRS และฟีเจอร์การจองโต๊ะพร้อมสั่งอาหารล่วงหน้า (Table Booking & Pre-ordering) นี่คือการออกแบบโครงสร้างตาราง (Table Schema) สำหรับ Supabase ครับ

## 1. ตาราง: `products` (ข้อมูลเมนูสินค้า)
เก็บข้อมูลเมนูเครื่องดื่มและเบเกอรี่ เพื่อให้หน้าเว็บดึงไปแสดงผลแบบไดนามิก

| Column Name | Data Type | ข้อมูลเพิ่มเติม (Constraints) |
| :--- | :--- | :--- |
| `id` | `int8` | Primary Key, Is Identity (Auto Increment) |
| `title_en` | `text` | ชื่อเมนูภาษาอังกฤษ |
| `title_th` | `text` | ชื่อเมนูภาษาไทย |
| `category` | `text` | หมวดหมู่ (เช่น 'coffee', 'tea', 'bakery') |
| `price` | `numeric` | ราคาของสินค้า |
| `image_url` | `text` | ลิงก์รูปภาพ (เก็บเป็น URL) |
| `is_active`| `boolean`| สถานะการขาย (Default: `true`) |
| `created_at`| `timestamptz` | Default: `now()` |

**ข้อมูลตัวอย่าง 5 แถว (`products`)**
| id | title_en | title_th | category | price | image_url | is_active |
|:---|:---|:---|:---|:---|:---|:---|
| 1 | Signature Espresso | ซิกเนเจอร์ เอสเพรสโซ่ | coffee | 4.50 | https://... | true |
| 2 | Iced Caramel Macchiato | คาราเมลมัคคิอาโต้เย็น | coffee | 5.50 | https://... | true |
| 3 | Matcha Green Tea Latte | มัทฉะกรีนทีลาเต้ | tea | 5.00 | https://... | true |
| 4 | Classic Croissant | ครัวซองต์เนยสด | bakery | 3.50 | https://... | true |
| 5 | Chocolate Muffin | ช็อกโกแลตมัฟฟิน | bakery | 4.00 | https://... | true |

---

## 2. ตาราง: `bookings` (ข้อมูลการจองโต๊ะและออเดอร์)
เก็บข้อมูลลูกค้าที่ทำการจองโต๊ะ รวมถึงยอดรวมและสถานะ

| Column Name | Data Type | ข้อมูลเพิ่มเติม (Constraints) |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, Default: `uuid_generate_v4()` |
| `customer_name` | `text` | ชื่อลูกค้า |
| `customer_phone`| `text` | เบอร์โทรศัพท์ลูกค้า |
| `booking_date` | `date` | วันที่จองโต๊ะ |
| `booking_time` | `time` | เวลาที่จอง |
| `guest_count` | `int4` | จำนวนคน (1, 2, 3, 4) |
| `total_price` | `numeric` | ยอดรวมราคาสินค้าที่สั่งล่วงหน้า (Pre-order) |
| `status` | `text` | สถานะ (เช่น 'pending', 'confirmed', 'completed') Default: 'pending' |
| `created_at` | `timestamptz` | Default: `now()` |

**ข้อมูลตัวอย่าง 5 แถว (`bookings`)**
| id | customer_name | customer_phone | booking_date | booking_time | guest_count | total_price | status |
|:---|:---|:---|:---|:---|:---|:---|:---|
| uuid-1... | John Doe | 081-111-1111 | 2026-06-25 | 10:30:00 | 2 | 10.00 | pending |
| uuid-2... | สมหญิง ใจดี | 082-222-2222 | 2026-06-25 | 12:00:00 | 4 | 22.50 | confirmed |
| uuid-3... | Peter Parker | 083-333-3333 | 2026-06-26 | 09:00:00 | 1 | 4.50 | completed |
| uuid-4... | สมชาย รักชาติ | 084-444-4444 | 2026-06-27 | 14:00:00 | 2 | 8.50 | pending |
| uuid-5... | Bruce Wayne | 085-555-5555 | 2026-06-28 | 15:30:00 | 3 | 12.00 | pending |

---

## 3. ตาราง: `booking_items` (รายการอาหารในออเดอร์)
เป็นตารางเชื่อม (Junction Table) ระหว่าง `bookings` และ `products` เพื่อบอกว่าในการจองครั้งนั้น สั่งเมนูอะไรบ้าง จำนวนเท่าไหร่

| Column Name | Data Type | ข้อมูลเพิ่มเติม (Constraints) |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, Default: `uuid_generate_v4()` |
| `booking_id` | `uuid` | Foreign Key อ้างอิง `bookings.id` (On Delete Cascade) |
| `product_id` | `int8` | Foreign Key อ้างอิง `products.id` |
| `quantity` | `int4` | จำนวนที่สั่ง |
| `unit_price` | `numeric` | ราคาต่อชิ้น ณ วันที่สั่ง (เพื่อป้องกันกรณีราคาเมนูเปลี่ยนทีหลัง) |

**ข้อมูลตัวอย่าง 5 แถว (`booking_items`)**
| id | booking_id | product_id | quantity | unit_price |
|:---|:---|:---|:---|:---|
| uuid-a... | uuid-1... (John) | 2 | 1 | 5.50 |
| uuid-b... | uuid-1... (John) | 1 | 1 | 4.50 |
| uuid-c... | uuid-2... (สมหญิง) | 3 | 3 | 5.00 |
| uuid-d... | uuid-2... (สมหญิง) | 4 | 2 | 3.50 |
| uuid-e... | uuid-3... (Peter) | 1 | 1 | 4.50 |

---

## 💡 คำแนะนำ: หน้าเว็บควรอ่าน/เขียนข้อมูลอย่างไร (Supabase Integration)

### 1. การอ่านข้อมูล (Read - SELECT)
**ดึงเมนูสินค้ามาแสดงที่หน้า Home:**
- เมื่อหน้าเว็บโหลด ควรใช้ Supabase JS Client เรียก `supabase.from('products').select('*').eq('is_active', true)` เพื่อดึงเมนูทั้งหมดมาแทนที่ `menuItems` ที่เป็นตัวแปรแบบ Hardcode ไว้ใน `main.js` ปัจจุบัน
- การกรองข้อมูลตามหมวดหมู่ (Category Chips) สามารถทำต่อที่ฝั่ง Frontend ได้เหมือนเดิมเพื่อความรวดเร็ว

### 2. การเขียนข้อมูล (Write - INSERT)
**เมื่อลูกค้ากดปุ่ม "Confirm Booking" บนหน้าเว็บ:**
การเขียนข้อมูลนี้ต้องระวังเรื่อง Relational Data เพราะต้องบันทึกข้อมูลลง 2 ตารางต่อเนื่องกัน:
1. **Insert ลง `bookings`:** สร้าง Record ใหม่ด้วยข้อมูลจากฟอร์ม (ชื่อ, เบอร์, วัน, เวลา) และยอดรวมตะกร้า (`total_price`)
   ```javascript
   const { data: booking, error } = await supabase.from('bookings').insert([{
       customer_name: nameInput.value,
       customer_phone: phoneInput.value,
       booking_date: dateInput.value,
       booking_time: timeInput.value,
       guest_count: parseInt(guestsInput.value),
       total_price: calculateTotal()
   }]).select(); // ต้องมี .select() เพื่อขอรับ ID ที่เพิ่งสร้างใหม่กลับมาใช้งานต่อ
   ```
2. **Insert ลง `booking_items`:** นำ `booking[0].id` ที่ได้จากขั้นตอนแรก มาวนลูปข้อมูลตะกร้า (Array `cart` ใน `main.js`) แล้วบันทึกสินค้าแต่ละชิ้นที่ลูกค้าสั่ง
   ```javascript
   // สมมติว่าจัดกลุ่มสินค้าซ้ำเป็น quantity ไว้แล้ว
   const itemsToInsert = cart.map(item => ({
       booking_id: booking[0].id,
       product_id: item.id,
       quantity: 1, 
       unit_price: item.price
   }));
   await supabase.from('booking_items').insert(itemsToInsert);
   ```

### 3. การจัดการระบบหลังบ้าน (Admin Dashboard)
- แอดมินสามารถใช้ฟังก์ชัน Join ของ Supabase เพื่อดึงข้อมูลการจองทั้งหมดพร้อมรายชื่ออาหารมาแสดงในตารางเดียว:
  `supabase.from('bookings').select('*, booking_items(*, products(title_en, title_th))')`
- เมื่อแอดมินกดยืนยันออเดอร์ ก็ส่งคำสั่ง Update: `supabase.from('bookings').update({ status: 'confirmed' }).eq('id', targetId)`
