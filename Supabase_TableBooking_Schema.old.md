# Supabase Database Schema Design: Table Reservation System
อ้างอิงจากเอกสารอัปเดต SRS ใหม่ (เน้นระบบรับจองโต๊ะร้านกาแฟแบบเพียวๆ โดยไม่มีการสั่งอาหารล่วงหน้า) นี่คือการออกแบบโครงสร้างตาราง (Table Schema) สำหรับ Supabase ครับ

ในกรณีนี้เราสามารถยุบรวมข้อมูลให้อยู่ใน **ตารางเดียว** ได้เพื่อความเรียบง่ายและทำงานได้เร็ว (MVP)

---

## ตาราง: `reservations` (ข้อมูลการจองโต๊ะ)
เก็บข้อมูลลูกค้าที่ทำการจองคิว รวมถึงรอบเวลาและสถานะคิวปัจจุบัน

| Column Name | Data Type | ความต้องการ (Constraints) | คำอธิบาย |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, Default: `uuid_generate_v4()` | รหัสอ้างอิงการจอง (ใช้แสดงผลให้ลูกค้าแคปหน้าจอ) |
| `customer_name` | `text` | Not Null | ชื่อลูกค้า |
| `customer_phone`| `text` | Not Null | เบอร์โทรศัพท์ลูกค้า |
| `reservation_date`| `date` | Not Null | วันที่จองโต๊ะ (เช่น '2026-06-25') |
| `time_slot` | `text` | Not Null | รอบเวลา (เช่น '09:00-11:00', '11:00-13:00') |
| `guest_count` | `int4` | Not Null | จำนวนคน |
| `note` | `text` | Nullable | ความต้องการพิเศษ (เช่น ขอเก้าอี้เด็ก) |
| `status` | `text` | Default: `'booked'` | สถานะ: `booked` (รอ), `arrived` (มาแล้ว), `no-show` (มาสาย/ไม่มา), `cancelled` (ยกเลิก) |
| `created_at` | `timestamptz` | Default: `now()` | เวลาที่ทำการกดจอง |

**ข้อมูลตัวอย่าง 5 แถว (`reservations`)**

| id (ตัดย่อมา) | customer_name | customer_phone | reservation_date | time_slot | guest_count | note | status |
|:---|:---|:---|:---|:---|:---|:---|:---|
| `uuid-1` | สมชาย รักดี | 081-111-1111 | 2026-06-25 | 09:00-11:00 | 2 | - | `arrived` |
| `uuid-2` | สมหญิง ใจดี | 082-222-2222 | 2026-06-25 | 11:00-13:00 | 4 | ขอเก้าอี้เด็ก | `booked` |
| `uuid-3` | Peter Parker | 083-333-3333 | 2026-06-25 | 11:00-13:00 | 1 | ขอโต๊ะมุมเงียบ | `no-show` |
| `uuid-4` | Tony Stark | 084-444-4444 | 2026-06-26 | 13:00-15:00 | 2 | - | `booked` |
| `uuid-5` | Bruce Wayne | 085-555-5555 | 2026-06-27 | 15:00-17:00 | 3 | - | `cancelled` |

---

## 💡 คำแนะนำ: หน้าเว็บควรอ่าน/เขียนข้อมูลอย่างไร (Supabase Integration)

### 1. การเช็คคิวว่างเพื่อแสดงหน้าเว็บ (Availability Check - SELECT)
**เมื่อลูกค้าเปิดหน้าเว็บและเลือก "วันที่":**
- สมมติว่าร้านรับคิวได้สูงสุดรอบละ 10 โต๊ะ
- ระบบต้องใช้ Supabase ดึงจำนวนการจองในแต่ละ `time_slot` ของวันนั้นๆ ออกมา:
```javascript
// ดึงข้อมูลการจองเฉพาะวันที่เลือก และสถานะยังถูกจองอยู่
const { data, error } = await supabase
  .from('reservations')
  .select('time_slot')
  .eq('reservation_date', '2026-06-25')
  .eq('status', 'booked');

// ฝั่ง Frontend (JavaScript) นำข้อมูลมานับจำนวนโต๊ะในแต่ละรอบ
// ถ้ารอบไหนจำนวน >= 10 โต๊ะ ให้เปลี่ยนปุ่มรอบเวลานั้นเป็น "เต็ม (Full)" และกดไม่ได้
```

### 2. การสร้างคิวใหม่ (Booking Creation - INSERT)
**เมื่อลูกค้ากรอกข้อมูลเสร็จและกด "ยืนยันการจอง":**
```javascript
const { data, error } = await supabase
  .from('reservations')
  .insert([{
      customer_name: "John Doe",
      customer_phone: "089-999-9999",
      reservation_date: "2026-06-25",
      time_slot: "09:00-11:00",
      guest_count: 2,
      note: "ฉลองวันเกิด"
  }])
  .select(); 

// เมื่อ Insert สำเร็จ ให้นำ data[0].id (ซึ่งเป็น UUID ตัวยาว) 
// ไปแสดงบนหน้าจอ "ยืนยันการจอง" เพื่อให้ลูกค้าแคปหน้าจอไว้เป็นรหัสยืนยันตัวตน
```

### 3. การจัดการระบบหลังบ้านสำหรับพนักงาน (Staff Dashboard - SELECT & UPDATE)
**การแสดงคิวประจำวัน (Daily Dashboard):**
- พนักงานเลือกวันที่ ระบบจะดึงข้อมูลทั้งหมดมาเรียงตามรอบเวลา (Time Slot):
```javascript
const { data, error } = await supabase
  .from('reservations')
  .select('*')
  .eq('reservation_date', '2026-06-25')
  .order('time_slot', { ascending: true });
```

**การเปลี่ยนสถานะ (Check-in / No-show):**
- เมื่อลูกค้ามาถึง พนักงานหาคิวและกดปุ่ม **"Check-in"**:
```javascript
await supabase
  .from('reservations')
  .update({ status: 'arrived' })
  .eq('id', 'uuid-ของลูกค้ารายนั้น');
```
- ถ้ารอจนผ่านไป 15 นาทีแล้วลูกค้าไม่มา พนักงานกดปุ่ม **"No-show"**:
```javascript
await supabase
  .from('reservations')
  .update({ status: 'no-show' })
  .eq('id', 'uuid-ของลูกค้ารายนั้น');
```
