-- Enable UUID extension (Required for Supabase UUID generation)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create "reservations" table
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    reservation_date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    guest_count TEXT NOT NULL,
    special_request TEXT,
    status TEXT DEFAULT 'booked',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert sample data for reservations
INSERT INTO reservations (customer_name, customer_phone, reservation_date, time_slot, guest_count, special_request, status) VALUES
('สมชาย รักดี', '081-111-1111', '2026-06-25', '10:00 - 11:30', '2', 'ขอโต๊ะริมหน้าต่าง', 'booked'),
('สมหญิง ใจดี', '082-222-2222', '2026-06-25', '13:00 - 14:30', '4', 'ขอเก้าอี้เด็ก', 'arrived'),
('Peter Parker', '083-333-3333', '2026-06-26', '14:30 - 16:00', '1', NULL, 'no-show'),
('Tony Stark', '084-444-4444', '2026-06-26', '16:00 - 17:30', '6+', 'จองสำหรับประชุม', 'booked'),
('Bruce Wayne', '085-555-5555', '2026-06-27', '11:30 - 13:00', '3', NULL, 'cancelled');
