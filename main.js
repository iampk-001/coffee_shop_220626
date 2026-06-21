try {

const SUPABASE_URL = 'https://qssjxxjwtzbukfyibeho.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzc2p4eGp3dHpidWtmeWliZWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwMDUyMDgsImV4cCI6MjA5NzU4MTIwOH0.HaZry-0aZxSazKN3XH_cuVJiz5PRYfV0DlWX4p7J1Zw';

let supabase = null;
try {
    if (window.supabase) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
            auth: {
                persistSession: false // ป้องกัน Supabase พังเวลาเข้าถึง localStorage ไม่ได้
            }
        });
    } else {
        console.error("Supabase CDN not loaded!");
        setTimeout(() => alert("ระบบไม่สามารถโหลดฐานข้อมูลได้ โปรดตรวจสอบอินเทอร์เน็ตหรือปิด AdBlock"), 1000);
    }
} catch (e) {
    console.error("Error init supabase:", e);
}

const translations = {
    en: {
        settings: "Settings", language: "Language", theme: "Theme",
        hero_title: "Reserve your table in advance for a chill experience.",
        booking_title: "Book Your Table",
        date_label: "Date *", time_label: "Time Slot *", guests_label: "Number of Guests *",
        name_label: "Name *", phone_label: "Phone *", note_label: "Special Requests",
        select_time: "Select Time",
        confirm_btn: "Confirm Booking",
        success_title: "Reservation Confirmed!",
        booking_id: "Booking ID:",
        screenshot_warning: "Please screenshot this page to show to our staff upon arrival.",
        back_home: "Back to Home"
    },
    th: {
        settings: "ตั้งค่า", language: "ภาษา", theme: "ธีมสี",
        hero_title: "จองโต๊ะล่วงหน้า รับประกันที่นั่งสุดชิล",
        booking_title: "จองโต๊ะของคุณ",
        date_label: "วันที่ *", time_label: "รอบเวลา *", guests_label: "จำนวนคน *",
        name_label: "ชื่อ - นามสกุล *", phone_label: "เบอร์โทรศัพท์ *", note_label: "หมายเหตุ / คำขอพิเศษ",
        select_time: "เลือกรอบเวลา",
        confirm_btn: "ยืนยันการจองโต๊ะ",
        success_title: "จองโต๊ะสำเร็จ!",
        booking_id: "รหัสการจอง:",
        screenshot_warning: "กรุณาแคปหน้าจอนี้เพื่อแสดงต่อพนักงานเมื่อมาถึงร้าน",
        back_home: "กลับสู่หน้าหลัก"
    }
};

// Safely use localStorage
function safeGetItem(key, defaultVal) {
    try {
        return localStorage.getItem(key) || defaultVal;
    } catch(e) {
        return defaultVal;
    }
}

function safeSetItem(key, val) {
    try {
        localStorage.setItem(key, val);
    } catch(e) {
        console.warn("localStorage not available");
    }
}

let currentLang = safeGetItem('lang', 'th'); // Default to Thai for this layout

const burgerBtn = document.getElementById('burgerBtn');
const settingsDrawer = document.getElementById('settingsDrawer');
const drawerOverlay = document.getElementById('drawerOverlay');

const btnEn = document.getElementById('btn-en');
const btnTh = document.getElementById('btn-th');
const btnDark = document.getElementById('btn-dark');
const btnLight = document.getElementById('btn-light');

const reservationForm = document.getElementById('reservationForm');
const successModal = document.getElementById('successModal');
const closeSuccessModal = document.getElementById('closeSuccessModal');

// Date min setup
const dateInput = document.getElementById('reservationDate');
const today = new Date().toISOString().split('T')[0];
dateInput.min = today;
dateInput.value = today;

function updateLanguage(lang) {
    currentLang = lang;
    safeSetItem('lang', lang);
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    btnEn.classList.toggle('active', lang === 'en');
    btnTh.classList.toggle('active', lang === 'th');
}

function updateTheme(isLight) {
    if (isLight) {
        document.body.classList.add('light-mode');
        safeSetItem('theme', 'light');
    } else {
        document.body.classList.remove('light-mode');
        safeSetItem('theme', 'dark');
    }
    btnLight.classList.toggle('active', isLight);
    btnDark.classList.toggle('active', !isLight);
}

// Init
const savedTheme = safeGetItem('theme', 'dark');
if (savedTheme === 'light') {
    updateTheme(true);
} else {
    updateTheme(false);
}
updateLanguage(currentLang);

// Drawer logic
burgerBtn.addEventListener('click', () => {
    settingsDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
});

drawerOverlay.addEventListener('click', () => {
    settingsDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
});

btnEn.addEventListener('click', () => updateLanguage('en'));
btnTh.addEventListener('click', () => updateLanguage('th'));
btnDark.addEventListener('click', () => updateTheme(false));
btnLight.addEventListener('click', () => updateTheme(true));

// Form Submission
reservationForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;
    const date = document.getElementById('reservationDate').value;
    const time = document.getElementById('timeSlot').value;
    const guests = document.getElementById('guestsCount').value;
    const note = document.getElementById('customerNote').value;

    if(!time) {
        alert(currentLang === 'en' ? "Please select a time slot." : "กรุณาเลือกรอบเวลา");
        return;
    }

    // Disable button to prevent multiple submissions
    const submitBtn = document.getElementById('confirmBookingBtn');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = currentLang === 'en' ? "Booking..." : "กำลังจอง...";

    if (!supabase) {
        alert(currentLang === 'en' ? "Database connection error." : "ไม่สามารถเชื่อมต่อฐานข้อมูลได้");
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        return;
    }

    try {
        const { data, error } = await supabase
            .from('reservations')
            .insert([{
                customer_name: name,
                customer_phone: phone,
                reservation_date: date,
                time_slot: time,
                guest_count: guests,
                special_request: note || null,
                status: 'booked'
            }])
            .select();

        if (error) throw error;

        // Success - Generate Booking ID from UUID
        const bookingId = data[0].id.split('-')[0].toUpperCase();
        document.getElementById('displayBookingId').textContent = `#BB-${bookingId}`;
        
        document.getElementById('displayCustomerName').textContent = name;
        document.getElementById('displayCustomerPhone').textContent = phone;
        document.getElementById('displayDate').textContent = date;
        document.getElementById('displayTime').textContent = time;
        document.getElementById('displayGuests').textContent = guests;

        successModal.classList.add('active');
        
        // Refresh the queue table immediately!
        if (typeof fetchQueue === 'function') {
            fetchQueue();
        }
    } catch (error) {
        console.error("Booking Error:", error);
        alert(currentLang === 'en' ? "Failed to book table: " + error.message : "เกิดข้อผิดพลาดในการจองโต๊ะ: " + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    }
});

closeSuccessModal.addEventListener('click', () => {
    successModal.classList.remove('active');
    reservationForm.reset();
    dateInput.value = today;
});

// ==========================================
// Queue Display Logic
// ==========================================
const queueLoading = document.getElementById('queueLoading');
const queueEmpty = document.getElementById('queueEmpty');
const queueError = document.getElementById('queueError');
const queueErrorMsg = document.getElementById('queueErrorMsg');
const queueDataList = document.getElementById('queueDataList');
const refreshQueueBtn = document.getElementById('refreshQueueBtn');

function setQueueState(state) {
    queueLoading.classList.remove('active');
    queueEmpty.classList.remove('active');
    queueError.classList.remove('active');
    queueDataList.style.display = 'none';

    if (state === 'loading') queueLoading.classList.add('active');
    if (state === 'empty') queueEmpty.classList.add('active');
    if (state === 'error') queueError.classList.add('active');
    if (state === 'data') queueDataList.style.display = 'grid';
}

async function fetchQueue() {
    setQueueState('loading');
    
    if (!supabase) {
        queueErrorMsg.textContent = 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้';
        setQueueState('error');
        return;
    }

    try {
        // Fetch reservations, ordered by date and time
        const { data, error } = await supabase
            .from('reservations')
            .select('*')
            .order('reservation_date', { ascending: true })
            .order('time_slot', { ascending: true });

        if (error) throw error;

        if (!data || data.length === 0) {
            setQueueState('empty');
            return;
        }

        // Render Data
        queueDataList.innerHTML = '';
        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'queue-card';
            
            // Format status color and text
            let statusClass = item.status === 'booked' ? '' : 'arrived';
            let statusText = item.status === 'booked' ? 'จองแล้ว' : (item.status || 'รอดำเนินการ');

            // Format date nicely
            const dateObj = new Date(item.reservation_date);
            const dateStr = dateObj.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });

            card.innerHTML = `
                <div class="qc-header">
                    <span class="qc-name">👤 ${item.customer_name}</span>
                    <span class="qc-status ${statusClass}">${statusText}</span>
                </div>
                <div class="qc-detail">
                    <strong>📅 วันที่:</strong> <span>${dateStr}</span>
                </div>
                <div class="qc-detail">
                    <strong>⏰ เวลา:</strong> <span>${item.time_slot}</span>
                </div>
                <div class="qc-detail">
                    <strong>👥 จำนวน:</strong> <span>${item.guest_count} ท่าน</span>
                </div>
            `;
            queueDataList.appendChild(card);
        });

        setQueueState('data');
    } catch (err) {
        console.error("Queue fetch error:", err);
        queueErrorMsg.textContent = err.message;
        setQueueState('error');
    }
}

// Call on load and on refresh button click
if (refreshQueueBtn) {
    refreshQueueBtn.addEventListener('click', fetchQueue);
}

// Initial Fetch
document.addEventListener('DOMContentLoaded', fetchQueue);
// Also fetch immediately in case DOM is already loaded
if(document.readyState !== 'loading') {
    fetchQueue();
}

} catch (globalError) {
    alert("🔥 MAIN.JS CRASHED:\n" + globalError.message + "\n\n" + globalError.stack);
}
