# Supabase Database Schema: Brew & Brown (Table Reservation)
อ้างอิงจากโครงสร้างหน้าเว็บใหม่ (Brew & Brown) ที่ใช้ Dropdown ในการเลือกรอบเวลาและจำนวนผู้เข้าพัก นี่คือการออกแบบโครงสร้างตาราง (Table Schema) สำหรับใช้งานกับ Supabase ครับ

เนื่องจากระบบปัจจุบันเน้นไปที่การจองโต๊ะอย่างเดียว เราสามารถใช้เพียง **1 ตารางหลัก** ก็ครอบคลุมการทำงาน (MVP) แล้วครับ

---

## ตาราง: `reservations` (ข้อมูลการจองโต๊ะ)
เก็บข้อมูลลูกค้าที่ส่งฟอร์มเข้ามา เพื่อใช้จัดการคิวหน้าร้าน

| Column Name | Data Type | ความต้องการ (Constraints) | คำอธิบาย |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, Default: `uuid_generate_v4()` | รหัสอ้างอิงการจอง (เช่น นำไปสร้าง Booking ID: `#BB-...`) |
| `customer_name` | `text` | Not Null | ชื่อ-นามสกุลลูกค้า |
| `customer_phone`| `text` | Not Null | เบอร์โทรศัพท์ลูกค้า |
| `reservation_date`| `date` | Not Null | วันที่จอง (เช่น '2026-06-25') |
| `time_slot` | `text` | Not Null | รอบเวลาจาก Dropdown (เช่น '10:00 - 11:30') |
| `guest_count` | `text` | Not Null | จำนวนคน (เก็บเป็น Text เพราะมีตัวเลือก '6+') |
| `special_request` | `text` | Nullable | หมายเหตุ / คำขอพิเศษ (Special Requests) |
| `status` | `text` | Default: `'booked'` | สถานะ: `booked` (จอง/รอ), `arrived` (มาแล้ว), `no-show` (มาสายเกิน 15 นาที), `cancelled` (ยกเลิก) |
| `created_at` | `timestamptz` | Default: `now()` | เวลาที่ลูกค้ากดปุ่มยืนยันการจอง |

**ข้อมูลตัวอย่าง 5 แถว (`reservations`)**

| id (ย่อ) | customer_name | customer_phone | reservation_date | time_slot | guest_count | special_request | status |
|:---|:---|:---|:---|:---|:---|:---|:---|
| `uuid-1` | สมชาย รักดี | 081-111-1111 | 2026-06-25 | 10:00 - 11:30 | 2 | ขอโต๊ะริมหน้าต่าง | `booked` |
| `uuid-2` | สมหญิง ใจดี | 082-222-2222 | 2026-06-25 | 13:00 - 14:30 | 4 | ขอเก้าอี้เด็ก | `arrived` |
| `uuid-3` | Peter Parker | 083-333-3333 | 2026-06-26 | 14:30 - 16:00 | 1 | - | `no-show` |
| `uuid-4` | Tony Stark | 084-444-4444 | 2026-06-26 | 16:00 - 17:30 | 6+ | จองสำหรับประชุม | `booked` |
| `uuid-5` | Bruce Wayne | 085-555-5555 | 2026-06-27 | 11:30 - 13:00 | 3 | - | `cancelled` |

---

## 💡 คำแนะนำ: หน้าเว็บควรอ่าน/เขียนข้อมูลอย่างไร (Supabase Integration)

### 1. การสร้างคิวจองใหม่ (Write - INSERT)
**เมื่อลูกค้ากรอกฟอร์มเสร็จและกด "ยืนยันการจองโต๊ะ" (ในไฟล์ `main.js`):**
หน้าเว็บจะต้องดึง Value จาก Input และ Select ทั้งหมดเพื่อยิงคำสั่ง Insert ไปยัง Supabase
```javascript
// ดึงค่าจาก DOM Elements ในฟอร์ม
const name = document.getElementById('customerName').value;
const phone = document.getElementById('customerPhone').value;
const date = document.getElementById('reservationDate').value;
const time = document.getElementById('timeSlot').value;
const guests = document.getElementById('guestsCount').value;
const note = document.getElementById('customerNote').value;

// ยิงคำสั่ง Insert ลง Supabase
const { data, error } = await supabase
  .from('reservations')
  .insert([{
      customer_name: name,
      customer_phone: phone,
      reservation_date: date,
      time_slot: time, // '10:00 - 11:30'
      guest_count: guests, // '1', '2', ..., '6+'
      special_request: note
  }])
  .select(); 

// เมื่อบันทึกสำเร็จ สามารถนำ data[0].id (UUID) ไปประยุกต์แสดงเป็น Booking ID
// เช่น ตัดตัวอักษรเพื่อใช้สร้าง #BB-XXXX ให้ลูกค้าแคปหน้าจอ
```

### 2. การเช็คคิวเต็มก่อนเปิดให้จอง (Read - SELECT & COUNT)
**หากต้องการซ่อนรอบเวลาที่เต็มแล้วในตัวเลือก `<select>`:**
เมื่อลูกค้าเลือก "วันที่" เสร็จ หน้าเว็บควรยิง API ไปถาม Supabase ว่าในวันนั้น แต่ละรอบเวลาถูกจองไปกี่คิวแล้ว
```javascript
// ดึงเฉพาะคิวของวันที่ลูกค้าเลือก และสถานะยังไม่ถูกยกเลิก
const { data, error } = await supabase
  .from('reservations')
  .select('time_slot')
  .eq('reservation_date', '2026-06-25')
  .eq('status', 'booked');

// ฝั่ง Frontend นำจำนวนที่ได้มานับ เช่น ถ้ารอบ '10:00 - 11:30' มีคนจองไปแล้ว >= 10 คิว
// ให้ใช้ JavaScript วนลูป Option แล้วสั่ง disabled = true ให้ตัวเลือกนั้นกดไม่ได้
```

### 3. ระบบหลังบ้าน (Staff Dashboard - UPDATE)
เมื่อลูกค้าเดินเข้ามาที่ร้านและแจ้งชื่อหรือ Booking ID พนักงานสามารถค้นหาและกดเปลี่ยนสถานะได้:
```javascript
// เปลี่ยนสถานะเป็น "มาถึงแล้ว" (Arrived)
await supabase.from('reservations').update({ status: 'arrived' }).eq('id', 'รหัสคิวลูกค้า');

// กรณีลูกค้ามาสายเกิน 15 นาที ระบบอัตโนมัติหรือพนักงานสามารถกดเปลี่ยนสถานะเป็น "No-show"
await supabase.from('reservations').update({ status: 'no-show' }).eq('id', 'รหัสคิวลูกค้า');
```
