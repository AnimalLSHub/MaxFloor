// Flooring Work Management System - Core JavaScript (app.js)

// Helper functions for Modal control
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
}

// Main App Controller
document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Initial State & Seed Data
    // ==========================================
    
    const DEFAULT_SEED_DATA = {
        projects: [
            {
                id: "proj-1",
                name: "Condo Grand Ville (อาคาร A)",
                startDate: "2026-04-15",
                endDate: "2026-10-31",
                startMonth: 4,
                endMonth: 10,
                dueDate: "2026-10-31",
                totalRooms: 48,
                todayWorkers: "สมพงษ์ แก้วมี, ช่างมานะ, ช่างวิชัย",
                rooms: []
            },
            {
                id: "proj-2",
                name: "Premium Office Tower (ชั้น 5-8)",
                startDate: "2026-06-01",
                endDate: "2026-12-15",
                startMonth: 6,
                endMonth: 12,
                dueDate: "2026-12-15",
                totalRooms: 30,
                todayWorkers: "ช่างสมพงษ์, ช่างสุทัศน์",
                rooms: []
            }
        ],
        logs: [
            {
                id: "log-1",
                date: "2026-06-04",
                time: "09:15",
                worker: "สมพงษ์ แก้วมี",
                projectId: "proj-1",
                projectName: "Condo Grand Ville (อาคาร A)",
                note: "เข้าปูกระเบื้องยางและเก็บขอบยางห้อง 101, 102 เสร็จสิ้นทั้งหมดเรียบร้อยดี"
            },
            {
                id: "log-2",
                date: "2026-06-04",
                time: "11:30",
                worker: "ชาตรี ดีเลิศ",
                projectId: "proj-1",
                projectName: "Condo Grand Ville (อาคาร A)",
                note: "เตรียมพื้นผิว ปัดกวาดฝุ่นห้อง 105 เพื่อเตรียมส่งมอบตรวจงานปูพื้นในวันถัดไป"
            },
            {
                id: "log-3",
                date: "2026-06-04",
                time: "14:20",
                worker: "วิชัย ไกลทอง",
                projectId: "proj-1",
                projectName: "Condo Grand Ville (อาคาร A)",
                note: "ช่างวิชัยเข้าตรวจสอบห้อง 106 พบปัญหาความชื้นคอนกรีตสูง 9.5% ได้แจ้งกรรมการตรวจเพื่อซ่อมบำรุงท่อน้ำดี"
            },
            {
                id: "log-4",
                date: "2026-06-04",
                time: "14:30",
                worker: "มานะ อดทน",
                projectId: "proj-1",
                projectName: "Condo Grand Ville (อาคาร A)",
                note: "ช่างมานะปูเตรียมบอร์ดรองพื้นห้อง 104 และทากาวโพลียูรีเทน"
            },
            {
                id: "log-5",
                date: "2026-06-03",
                time: "10:00",
                worker: "ช่างสมพงษ์",
                projectId: "proj-2",
                projectName: "Premium Office Tower (ชั้น 5-8)",
                note: "เริ่มเข้าหน้างาน ตรวจสอบพื้นที่ชั้น 5 เพื่อเตรียมขนย้ายเครื่องมือและวัสดุแผ่นปูพื้น"
            },
            {
                id: "log-6",
                date: "2026-06-04",
                time: "08:30",
                worker: "ช่างสุทัศน์",
                projectId: "proj-2",
                projectName: "Premium Office Tower (ชั้น 5-8)",
                note: "ทากาวขาวอิมัลชันและปูแผ่นไวนิลลายไม้ห้องพัก 501 โซน A เสร็จสิ้นเรียบร้อยดี"
            },
            {
                id: "log-7",
                date: "2026-06-04",
                time: "13:00",
                worker: "ช่างสมพงษ์",
                projectId: "proj-2",
                projectName: "Premium Office Tower (ชั้น 5-8)",
                note: "ติดตั้งคิ้วและตัวจบขอบลามิเนตระหว่างห้อง 501 และโถงทางเดิน เสร็จสิ้น"
            }
        ],
        issues: [
            {
                id: "issue-1",
                projectId: "proj-1",
                projectName: "Condo Grand Ville (อาคาร A)",
                roomNo: "106",
                desc: "ความชื้นสะสมปูนรองพื้นสูง 9.5% ไม่สามารถลงกาวปูไวนิลลายไม้คลิกล็อกได้เนื่องจากอาจเกิดการโก่งตัวภายหลัง",
                reportedBy: "วิชัย ไกลทอง",
                date: "2026-06-04",
                status: "pending",
                solution: "",
                resolveDate: ""
            },
            {
                id: "issue-2",
                projectId: "proj-1",
                projectName: "Condo Grand Ville (อาคาร A)",
                roomNo: "102",
                desc: "ผิวคอนกรีตเดิมไม่เรียบเสมอกัน เกิดแอ่งน้ำขังขนาดใหญ่ในจุดกึ่งกลางห้องพักผ่อน",
                reportedBy: "สมพงษ์ แก้วมี",
                date: "2026-06-02",
                status: "resolved",
                solution: "สกัดแต่งเศษปูน ปรับระดับรองพื้นรอบแอ่งลึกด้วยปูนปรับระดับแห้งเร็ว (Self-Leveling Underlayment)",
                resolveDate: "2026-06-03"
            }
        ],
        workers: [
            "สมพงษ์ แก้วมี",
            "ช่างมานะ",
            "ช่างวิชัย",
            "ชาตรี ดีเลิศ",
            "วิชัย ไกลทอง",
            "มานะ อดทน",
            "ช่างสมพงษ์",
            "ช่างสุทัศน์"
        ]
    };

    // Global Database Object
    let db = {
        projects: [],
        logs: [],
        issues: [],
        workers: []
    };

    // Current app state pointers
    let activeTab = "tab-plan";
    let selectedProjectId = "";
    let roomFilter = "all";
    let activeLogProjectId = ""; // pointer for daily log modal
    let isBulkMode = false;
    let selectedRoomsForDelete = [];
    
    // Daily Operations new states
    let selectedDailyProjId = "";
    let selectedDailyDate = "";
    let activeDailyWorkers = []; // active workers log entries form queue

    // Robust local YYYY-MM-DD date string generator (bugfix timezone offset)
    function getLocalDateStr() {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const THAI_MONTHS = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];

    // Populates Day, Month, and Thai B.E. Year dropdowns
    function initDateDropdowns(dayId, monthId, yearId) {
        const daySelect = document.getElementById(dayId);
        const monthSelect = document.getElementById(monthId);
        const yearSelect = document.getElementById(yearId);

        if (!daySelect || !monthSelect || !yearSelect) return;

        // 1. Populate Months
        monthSelect.innerHTML = "";
        THAI_MONTHS.forEach((mName, index) => {
            const opt = document.createElement('option');
            opt.value = index + 1;
            opt.textContent = mName;
            monthSelect.appendChild(opt);
        });

        // 2. Populate Years (B.E. 2565 to 2580, which corresponds to C.E. 2022 to 2037)
        yearSelect.innerHTML = "";
        for (let y = 2565; y <= 2580; y++) {
            const opt = document.createElement('option');
            opt.value = y;
            opt.textContent = y;
            yearSelect.appendChild(opt);
        }

        // 3. Attach change event listeners to month & year to dynamically adjust day count
        monthSelect.addEventListener('change', () => adjustDays(dayId, monthId, yearId));
        yearSelect.addEventListener('change', () => adjustDays(dayId, monthId, yearId));

        // 4. Initial days adjustment
        adjustDays(dayId, monthId, yearId);
    }

    // Dynamic Day Adjuster based on Month and Year
    function adjustDays(dayId, monthId, yearId) {
        const daySelect = document.getElementById(dayId);
        const monthSelect = document.getElementById(monthId);
        const yearSelect = document.getElementById(yearId);

        if (!daySelect || !monthSelect || !yearSelect) return;

        const month = parseInt(monthSelect.value) || 1;
        const yearBE = parseInt(yearSelect.value) || (new Date().getFullYear() + 543);
        const yearCE = yearBE - 543;

        // Get total days in month
        const totalDays = new Date(yearCE, month, 0).getDate();
        const prevSelected = parseInt(daySelect.value) || 1;

        daySelect.innerHTML = "";
        for (let d = 1; d <= totalDays; d++) {
            const opt = document.createElement('option');
            opt.value = d;
            opt.textContent = d;
            daySelect.appendChild(opt);
        }

        // Keep previously selected day, but cap it at the maximum days in this month
        daySelect.value = Math.min(prevSelected, totalDays);
    }

    // Helper to get YYYY-MM-DD string from dropdown selectors
    function getDateStringFromDropdowns(dayId, monthId, yearId) {
        const day = document.getElementById(dayId).value;
        const month = document.getElementById(monthId).value;
        const yearBE = document.getElementById(yearId).value;
        const yearCE = parseInt(yearBE) - 543;
        return `${yearCE}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    // Helper to set dropdown selectors from YYYY-MM-DD string
    function setDropdownsFromDateString(dateStr, dayId, monthId, yearId) {
        if (!dateStr) return;
        const parts = dateStr.split('-');
        if (parts.length !== 3) return;

        const yearCE = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const day = parseInt(parts[2]);
        const yearBE = yearCE + 543;

        const daySelect = document.getElementById(dayId);
        const monthSelect = document.getElementById(monthId);
        const yearSelect = document.getElementById(yearId);

        if (monthSelect) monthSelect.value = month;
        if (yearSelect) yearSelect.value = yearBE;

        // Adjust day options since month/year has changed
        adjustDays(dayId, monthId, yearId);

        if (daySelect) daySelect.value = day;
    }


    // Dynamic Room Numbers Generator
    function generateRoomList(totalRooms) {
        const rooms = [];
        const roomsPerFloor = 8;
        const totalFloors = Math.ceil(totalRooms / roomsPerFloor);
        
        let count = 0;
        for (let floor = 1; floor <= totalFloors; floor++) {
            for (let r = 1; r <= roomsPerFloor; r++) {
                if (count >= totalRooms) break;
                const roomNo = `${floor}${String(r).padStart(2, '0')}`;
                rooms.push({
                    roomNo: roomNo,
                    status: 'pending',
                    worker: '',
                    note: '',
                    lastUpdated: ''
                });
                count++;
            }
        }
        return rooms;
    }

    // Initialize/Load DB
    function loadDB() {
        const stored = localStorage.getItem('floortech_db');
        if (stored) {
            try {
                db = JSON.parse(stored);
            } catch (e) {
                console.error("Error parsing localstorage database, fallback to seed.", e);
                seedDefaultDB();
            }
        } else {
            seedDefaultDB();
        }
        
        // Safety checks to ensure fields exist
        if (!db.projects) db.projects = [];
        if (!db.logs) db.logs = [];
        if (!db.issues) db.issues = [];
        if (!db.workers || db.workers.length === 0) {
            db.workers = [
                "สมพงษ์ แก้วมี",
                "ช่างมานะ",
                "ช่างวิชัย",
                "ชาตรี ดีเลิศ",
                "วิชัย ไกลทอง",
                "มานะ อดทน"
            ];
        }

        db.projects.forEach(proj => {
            if (!proj.rooms || proj.rooms.length === 0) {
                proj.rooms = generateRoomList(proj.totalRooms);
            }
            if (!proj.startDate) {
                proj.startDate = `2026-${String(proj.startMonth).padStart(2, '0')}-01`;
            }
            if (!proj.endDate) {
                proj.endDate = `2026-${String(proj.endMonth).padStart(2, '0')}-28`;
            }
            if (proj.todayWorkers === undefined) {
                proj.todayWorkers = "";
            }
        });
        
        // Seed specific completed rooms for Project 1 (Rooms 101, 102, 103 completed)
        const proj1 = db.projects.find(p => p.id === "proj-1");
        if (proj1 && proj1.rooms.length > 0) {
            const r101 = proj1.rooms.find(r => r.roomNo === "101");
            if (r101 && r101.status === 'pending') {
                r101.status = 'completed';
                r101.worker = 'สมพงษ์ แก้วมี';
                r101.lastUpdated = '2026-06-04';
            }
            const r102 = proj1.rooms.find(r => r.roomNo === "102");
            if (r102 && r102.status === 'pending') {
                r102.status = 'completed';
                r102.worker = 'สมพงษ์ แก้วมี';
                r102.lastUpdated = '2026-06-04';
            }
            const r103 = proj1.rooms.find(r => r.roomNo === "103");
            if (r103 && r103.status === 'pending') {
                r103.status = 'completed';
                r103.worker = 'สมพงษ์ แก้วมี';
                r103.lastUpdated = '2026-06-04';
            }
            const r104 = proj1.rooms.find(r => r.roomNo === "104");
            if (r104 && r104.status === 'pending') {
                r104.status = 'inspect';
                r104.worker = 'มานะ อดทน';
                r104.lastUpdated = '2026-06-04';
            }
            const r105 = proj1.rooms.find(r => r.roomNo === "105");
            if (r105 && r105.status === 'pending') {
                r105.status = 'progress';
                r105.worker = 'ชาตรี ดีเลิศ';
                r105.lastUpdated = '2026-06-04';
            }
            const r106 = proj1.rooms.find(r => r.roomNo === "106");
            if (r106 && r106.status === 'pending') {
                r106.status = 'issue';
                r106.worker = 'วิชัย ไกลทอง';
                r106.note = 'ความชื้นสะสมรองพื้นสูง 9.5%';
                r106.lastUpdated = '2026-06-04';
            }
        }
        
        const proj2 = db.projects.find(p => p.id === "proj-2");
        if (proj2 && proj2.rooms.length > 0) {
            const r101_2 = proj2.rooms.find(r => r.roomNo === "101");
            if (r101_2 && r101_2.status === 'pending') {
                r101_2.status = 'completed';
                r101_2.worker = 'สมพงษ์ แก้วมี';
                r101_2.lastUpdated = '2026-06-03';
            }
        }

        saveDB(false);
        
        if (db.projects.length > 0) {
            if (!selectedProjectId) selectedProjectId = db.projects[0].id;
            selectedDailyProjId = db.projects[0].id;
        }
        selectedDailyDate = getLocalDateStr();
    }

    function seedDefaultDB() {
        db = JSON.parse(JSON.stringify(DEFAULT_SEED_DATA));
        db.projects.forEach(proj => {
            proj.rooms = generateRoomList(proj.totalRooms);
        });
        saveDB();
    }

    function saveDB(render = true) {
        if (!db.projects) db.projects = [];
        if (!db.logs) db.logs = [];
        if (!db.issues) db.issues = [];
        if (!db.workers || !Array.isArray(db.workers) || db.workers.length === 0) {
            db.workers = [
                "สมพงษ์ แก้วมี",
                "ช่างมานะ",
                "ช่างวิชัย",
                "ชาตรี ดีเลิศ",
                "วิชัย ไกลทอง",
                "มานะ อดทน"
            ];
        }
        localStorage.setItem('floortech_db', JSON.stringify(db));
        if (render) {
            updateDashboardMetrics();
            renderActiveTab();
        }
    }

    // Set today's date in Date fields on forms
    function setTodayDates() {
        const todayStr = getLocalDateStr();
        
        // Populate Add Project selectors with today's date
        setDropdownsFromDateString(todayStr, 'project-start-day', 'project-start-month', 'project-start-year');
        setDropdownsFromDateString(todayStr, 'project-end-day', 'project-end-month', 'project-end-year');
        
        const addLogDate = document.getElementById('add-daily-log-date');
        if (addLogDate) addLogDate.value = todayStr;
    }

    // ==========================================
    // 2. Tab Navigation
    // ==========================================
    
    const navItems = document.querySelectorAll('.nav-item');
    const headerTitle = document.getElementById('current-page-title');
    const headerBtn = document.getElementById('header-action-btn');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            
            activeTab = item.getAttribute('data-tab');
            document.getElementById(activeTab).classList.add('active');
            
            // Exit bulk delete mode on tab switch
            isBulkMode = false;
            selectedRoomsForDelete = [];
            
            updatePageHeader();
            renderActiveTab();
        });
    });

    function updatePageHeader() {
        if (activeTab === "tab-plan") {
            headerTitle.textContent = "แผนงานโปรเจ็กต์และภาพรวม";
            headerBtn.style.display = "flex";
            headerBtn.querySelector('span').textContent = "เพิ่มโปรเจ็กต์ใหม่";
            headerBtn.onclick = () => openModal('modal-add-project');
        } else if (activeTab === "tab-rooms") {
            headerTitle.textContent = "รายละเอียดและผังห้อง";
            headerBtn.style.display = "flex";
            headerBtn.querySelector('span').textContent = "อัพเดทห้องพัก";
            
            headerBtn.onclick = () => {
                const currentProj = db.projects.find(p => p.id === selectedProjectId);
                if (currentProj && currentProj.rooms.length > 0) {
                    openRoomManager(currentProj.id, currentProj.rooms[0].roomNo);
                } else {
                    alert("ไม่พบข้อมูลห้องพัก กรุณาเลือกโปรเจ็กต์ที่มีห้องพักหรือทำการเพิ่มห้องพัก");
                }
            };
        } else if (activeTab === "tab-daily") {
            headerTitle.textContent = "บันทึกผู้เข้าปฏิบัติงานรายวัน";
            headerBtn.style.display = "none";
        } else if (activeTab === "tab-issues") {
            headerTitle.textContent = "การจัดการปัญหาที่เกิดขึ้น";
            headerBtn.style.display = "none";
        } else if (activeTab === "tab-data") {
            headerTitle.textContent = "จัดการข้อมูลระบบและตั้งค่า";
            headerBtn.style.display = "none";
        }
    }

    // ==========================================
    // 3. Tab Rendering Methods
    // ==========================================

    function renderActiveTab() {
        if (activeTab === "tab-plan") {
            renderPlanTab();
        } else if (activeTab === "tab-rooms") {
            renderRoomsTab();
        } else if (activeTab === "tab-daily") {
            renderDailyTab();
        } else if (activeTab === "tab-issues") {
            renderIssuesTab();
        } else if (activeTab === "tab-data") {
            renderDataTab();
        }
    }

    // Dashboard Statistics Updates
    function updateDashboardMetrics() {
        const totalProjects = db.projects.length;
        
        let totalRooms = 0;
        let completedRooms = 0;
        db.projects.forEach(p => {
            totalRooms += p.rooms.length;
            completedRooms += p.rooms.filter(r => r.status === 'completed').length;
        });

        const pendingIssues = db.issues.filter(i => i.status === 'pending').length;

        document.getElementById('stat-total-projects').textContent = totalProjects;
        document.getElementById('stat-total-rooms').textContent = totalRooms;
        document.getElementById('stat-completed-rooms').textContent = completedRooms;
        document.getElementById('stat-pending-issues').textContent = pendingIssues;
    }

    function initTimelineYearDropdown() {
        const yearSelect = document.getElementById('select-timeline-year');
        if (!yearSelect) return;

        // Get years from existing projects
        const projectYears = new Set();
        db.projects.forEach(proj => {
            if (proj.startDate) {
                const year = new Date(proj.startDate).getFullYear();
                if (!isNaN(year)) projectYears.add(year);
            }
            if (proj.endDate) {
                const year = new Date(proj.endDate).getFullYear();
                if (!isNaN(year)) projectYears.add(year);
            }
        });

        // Set default range B.E. 2567 to 2575 (2024 to 2032 C.E.)
        const defaultStartCE = 2024;
        const defaultEndCE = 2032;
        for (let y = defaultStartCE; y <= defaultEndCE; y++) {
            projectYears.add(y);
        }

        // Convert to sorted array
        const sortedYears = Array.from(projectYears).sort((a, b) => a - b);

        const prevValue = yearSelect.value;
        yearSelect.innerHTML = "";
        sortedYears.forEach(y => {
            const opt = document.createElement('option');
            opt.value = y;
            opt.textContent = y + 543; // Display as B.E.
            yearSelect.appendChild(opt);
        });

        // Default to current year (2026)
        const currentYear = new Date().getFullYear();
        if (prevValue && sortedYears.includes(parseInt(prevValue))) {
            yearSelect.value = prevValue;
        } else if (sortedYears.includes(currentYear)) {
            yearSelect.value = currentYear;
        } else {
            yearSelect.value = sortedYears[0];
        }
    }

    // RENDER TAB 1: Plan and Timelines
    function renderPlanTab() {
        const container = document.getElementById('timeline-project-rows');
        const tbody = document.getElementById('project-list-tbody');
        
        container.innerHTML = "";
        tbody.innerHTML = "";

        // Populate and sync the year filter dropdown
        initTimelineYearDropdown();

        if (db.projects.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 20px;">ไม่มีโปรเจ็กต์ในระบบในขณะนี้ กด "เพิ่มโปรเจ็กต์ใหม่" ด้านบนเพื่อเริ่มสร้าง</div>`;
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">ไม่มีข้อมูลโครงการ</td></tr>`;
            return;
        }

        // Fetch active view option (monthly or quarterly) and selected year
        const timelineView = document.getElementById('select-timeline-view') ? document.getElementById('select-timeline-view').value : 'monthly';
        const yearSelect = document.getElementById('select-timeline-year');
        const selectedYear = yearSelect && yearSelect.value ? parseInt(yearSelect.value) : new Date().getFullYear();

        const columnsList = [];
        if (timelineView === 'quarterly') {
            for (let q = 1; q <= 4; q++) {
                columnsList.push({ year: selectedYear, quarter: q });
            }
        } else {
            for (let m = 0; m <= 11; m++) {
                columnsList.push({ year: selectedYear, month: m });
            }
        }

        const numCols = columnsList.length;

        // Update Timeline Header Grid Columns
        const monthsHeader = document.getElementById('timeline-months-header');
        if (monthsHeader) {
            monthsHeader.style.gridTemplateColumns = `repeat(${numCols}, 1fr)`;
            monthsHeader.innerHTML = "";
            const THAI_SHORT_MONTHS = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
            columnsList.forEach(col => {
                const div = document.createElement('div');
                const yearBEShort = String((col.year + 543) % 100).padStart(2, '0');
                if (timelineView === 'quarterly') {
                    div.textContent = `Q${col.quarter}/${yearBEShort}`;
                } else {
                    div.textContent = `${THAI_SHORT_MONTHS[col.month]} ${yearBEShort}`;
                }
                monthsHeader.appendChild(div);
            });
        }

        db.projects.forEach(proj => {
            const completed = proj.rooms.filter(r => r.status === 'completed').length;
            const total = proj.rooms.length;
            const nonSkipped = proj.rooms.filter(r => r.status !== 'skipped').length;
            const progressPct = nonSkipped > 0 ? Math.round((completed / nonSkipped) * 100) : 0;

            const THAI_SHORT_MONTHS = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
            
            // Format start and end date labels
            const pStart = new Date(proj.startDate);
            const pEnd = new Date(proj.endDate);
            
            const startMonthStr = !isNaN(pStart.getTime()) ? `${THAI_SHORT_MONTHS[pStart.getMonth()]} ${String((pStart.getFullYear() + 543) % 100).padStart(2, '0')}` : "-";
            const endMonthStr = !isNaN(pEnd.getTime()) ? `${THAI_SHORT_MONTHS[pEnd.getMonth()]} ${String((pEnd.getFullYear() + 543) % 100).padStart(2, '0')}` : "-";

            // Check overlap with selectedYear
            const yearStart = new Date(selectedYear, 0, 1);
            const yearEnd = new Date(selectedYear, 11, 31);
            const hasOverlap = (!isNaN(pStart.getTime()) && !isNaN(pEnd.getTime())) && (pStart <= yearEnd && pEnd >= yearStart);

            let startIndex = 0;
            let endIndex = columnsList.length - 1;

            if (hasOverlap) {
                if (timelineView === 'quarterly') {
                    if (pStart.getFullYear() < selectedYear) {
                        startIndex = 0;
                    } else {
                        startIndex = Math.floor(pStart.getMonth() / 3);
                    }
                    if (pEnd.getFullYear() > selectedYear) {
                        endIndex = 3;
                    } else {
                        endIndex = Math.floor(pEnd.getMonth() / 3);
                    }
                } else {
                    if (pStart.getFullYear() < selectedYear) {
                        startIndex = 0;
                    } else {
                        startIndex = pStart.getMonth();
                    }
                    if (pEnd.getFullYear() > selectedYear) {
                        endIndex = 11;
                    } else {
                        endIndex = pEnd.getMonth();
                    }
                }
                
                if (endIndex < startIndex) endIndex = startIndex;
            }

            const colStart = startIndex + 1;
            const colEnd = endIndex + 2;

            // Gantt Row
            const rowDiv = document.createElement('div');
            rowDiv.className = 'timeline-row';
            
            if (!hasOverlap) {
                const yearBE = selectedYear + 543;
                rowDiv.innerHTML = `
                    <div class="project-meta-info">
                        <span class="project-meta-name" data-id="${proj.id}">${proj.name}</span>
                        <span class="project-meta-duration">${startMonthStr} - ${endMonthStr} | เสร็จสิ้น ${progressPct}%</span>
                    </div>
                    <div class="timeline-bar-wrapper" style="grid-template-columns: 1fr; background: #e2e8f0; border-style: dashed; display: flex; justify-content: center; align-items: center; height: 36px; padding: 0 12px;">
                        <span style="font-size: 11px; color: var(--text-muted); text-align: center; font-weight: 600;">
                            โครงการอยู่นอกช่วงเวลาปี พ.ศ. ${yearBE}
                        </span>
                    </div>
                `;
            } else {
                rowDiv.innerHTML = `
                    <div class="project-meta-info">
                        <span class="project-meta-name" data-id="${proj.id}">${proj.name}</span>
                        <span class="project-meta-duration">${startMonthStr} - ${endMonthStr} | เสร็จสิ้น ${progressPct}%</span>
                    </div>
                    <div class="timeline-bar-wrapper" style="grid-template-columns: repeat(${numCols}, 1fr);">
                        <div class="timeline-bar" style="grid-column: ${colStart} / ${colEnd};" data-id="${proj.id}">
                            <div class="timeline-bar-progress" style="width: ${progressPct}%"></div>
                            <div class="timeline-bar-text">${progressPct}% (${completed}/${total} ห้อง)</div>
                        </div>
                    </div>
                `;
            }
            
            const clickHandler = () => {
                selectedProjectId = proj.id;
                navItems.forEach(n => {
                    if (n.getAttribute('data-tab') === "tab-rooms") {
                        n.click();
                    }
                });
            };
            rowDiv.querySelector('.project-meta-name').addEventListener('click', clickHandler);
            if (hasOverlap) {
                rowDiv.querySelector('.timeline-bar').addEventListener('click', clickHandler);
            }

            container.appendChild(rowDiv);

            // Table Rows
            const tr = document.createElement('tr');
            
            // Format start and end date displays (Day/Month/Year TH)
            const parseDateTH = (dateStr) => {
                if (!dateStr) return "-";
                const p = dateStr.split('-');
                if (p.length !== 3) return dateStr;
                return `${p[2]}/${p[1]}/${parseInt(p[0]) + 543}`;
            };
            
            const displayStart = parseDateTH(proj.startDate);
            const displayEnd = parseDateTH(proj.endDate);

            tr.innerHTML = `
                <td data-label="ชื่อโปรเจ็กต์"><strong style="color: var(--accent); cursor:pointer;" class="proj-link">${proj.name}</strong></td>
                <td data-label="ห้องทั้งหมด">${total} ห้อง</td>
                <td data-label="ช่วงเวลาดำเนินการ">${displayStart} ถึง ${displayEnd}</td>
                <td data-label="วันที่กำหนดเสร็จ">${displayEnd}</td>
                <td data-label="ความคืบหน้า">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <div style="flex-grow:1; background:#e2e8f0; height:8px; border-radius:4px; overflow:hidden; min-width:80px; border: 1px solid var(--border-color);">
                            <div style="width:${progressPct}%; background-color: #38bdf8; height:100%;"></div>
                        </div>
                        <span>${progressPct}%</span>
                    </div>
                </td>
                <td data-label="การจัดการ">
                    <div style="display:flex; gap:8px;">
                        <button class="btn btn-sm btn-edit-project-row" data-id="${proj.id}">แก้ไข</button>
                        <button class="btn btn-sm btn-danger btn-delete-project" data-id="${proj.id}">ลบ</button>
                    </div>
                </td>
            `;

            tr.querySelector('.proj-link').addEventListener('click', clickHandler);
            tr.querySelector('.btn-edit-project-row').addEventListener('click', (e) => {
                e.stopPropagation();
                openEditProjectModal(proj.id);
            });
            tr.querySelector('.btn-delete-project').addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm(`คุณต้องการลบโปรเจ็กต์ "${proj.name}" และข้อมูลที่เกี่ยวข้องทั้งหมดใช่หรือไม่?`)) {
                    deleteProject(proj.id);
                }
            });

            tbody.appendChild(tr);
        });
    }

    // RENDER TAB 2: Room Tracker Grid
    function renderRoomsTab() {
        const select = document.getElementById('room-project-select');
        const gridContainer = document.getElementById('rooms-grid-container');
        
        const currentSelVal = select.value || selectedProjectId;
        select.innerHTML = "";
        
        if (db.projects.length === 0) {
            select.innerHTML = `<option value="">-- ไม่พบโครงการ --</option>`;
            gridContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">โปรดเพิ่มโครงการในแท็บ "แผนงานโปรเจ็กต์" ก่อน</div>`;
            document.getElementById('side-panel-project-name').textContent = "ไม่มีโปรเจ็กต์";
            document.getElementById('side-progress-percent').textContent = "0%";
            document.getElementById('side-progress-ratio').textContent = "0 จาก 0 ห้อง";
            document.getElementById('side-completed-list').textContent = "-";
            document.getElementById('side-remaining-list').textContent = "-";
            document.getElementById('btn-edit-current-project').style.display = "none";
            document.getElementById('btn-add-room-trigger').style.display = "none";
            return;
        }

        document.getElementById('btn-edit-current-project').style.display = "inline-flex";
        document.getElementById('btn-add-room-trigger').style.display = "inline-flex";

        db.projects.forEach(proj => {
            const opt = document.createElement('option');
            opt.value = proj.id;
            opt.textContent = proj.name;
            if (proj.id === currentSelVal) opt.selected = true;
            select.appendChild(opt);
        });

        if (select.value) {
            selectedProjectId = select.value;
        }

        const activeProj = db.projects.find(p => p.id === selectedProjectId);
        if (!activeProj) return;

        document.getElementById('side-panel-project-name').textContent = activeProj.name;
        
        const total = activeProj.rooms.length;
        const completed = activeProj.rooms.filter(r => r.status === 'completed').length;
        
        const nonSkippedTotal = activeProj.rooms.filter(r => r.status !== 'skipped').length;
        const pct = nonSkippedTotal > 0 ? Math.round((completed / nonSkippedTotal) * 100) : 0;

        document.getElementById('side-progress-percent').textContent = `${pct}%`;
        document.getElementById('side-progress-ratio').textContent = `ปูเสร็จแล้ว ${completed} จาก ${nonSkippedTotal} ห้อง (ไม่รวมข้าม)`;

        // Update SVG donut
        const donutCircle = document.getElementById('side-progress-donut');
        if (donutCircle) {
            const offset = 377 - (377 * pct) / 100;
            donutCircle.style.strokeDashoffset = offset;
        }

        // Filter pills status count display
        const counts = {
            all: total,
            pending: activeProj.rooms.filter(r => r.status === 'pending').length,
            progress: activeProj.rooms.filter(r => r.status === 'progress').length,
            inspect: activeProj.rooms.filter(r => r.status === 'inspect').length,
            completed: completed,
            issue: activeProj.rooms.filter(r => r.status === 'issue').length,
            skipped: activeProj.rooms.filter(r => r.status === 'skipped').length
        };

        Object.keys(counts).forEach(key => {
            const elem = document.getElementById(`count-${key}`);
            if (elem) elem.textContent = counts[key];
        });

        // Lists of completed vs remaining
        const completedRoomsList = activeProj.rooms.filter(r => r.status === 'completed').map(r => r.roomNo);
        document.getElementById('side-completed-list').textContent = completedRoomsList.length > 0 ? completedRoomsList.join(', ') : "ยังไม่มีห้องที่ปูพื้นเสร็จสิ้น";

        const remainingRoomsList = activeProj.rooms.filter(r => r.status === 'pending' || r.status === 'progress' || r.status === 'inspect').map(r => r.roomNo);
        document.getElementById('side-remaining-list').textContent = remainingRoomsList.length > 0 ? remainingRoomsList.join(', ') : "ปูพื้นเสร็จสิ้นครบทุกห้องแล้ว!";

        // Render Grid
        gridContainer.innerHTML = "";
        document.getElementById('room-grid-title-count').textContent = total;

        const sortedRooms = [...activeProj.rooms].sort((a, b) => a.roomNo.localeCompare(b.roomNo, undefined, {numeric: true, sensitivity: 'base'}));

        // Sync Bulk Action Bar display
        const bulkBar = document.getElementById('bulk-actions-bar');
        if (bulkBar) {
            if (isBulkMode) {
                bulkBar.classList.add('active');
                updateBulkBarUI();
            } else {
                bulkBar.classList.remove('active');
            }
        }

        sortedRooms.forEach(room => {
            if (roomFilter !== 'all' && room.status !== roomFilter) {
                return;
            }

            const roomCard = document.createElement('div');
            const isSelectedForDelete = selectedRoomsForDelete.includes(room.roomNo);
            roomCard.className = `room-card status-${room.status}${isBulkMode ? ' bulk-selecting' : ''}${isBulkMode && isSelectedForDelete ? ' bulk-selected' : ''}`;
            roomCard.setAttribute('data-room-no', room.roomNo);
            
            let statusText = "รอดำเนินการ";
            if (room.status === 'progress') statusText = "กำลังปู";
            else if (room.status === 'inspect') statusText = "รอตรวจ";
            else if (room.status === 'completed') statusText = "เสร็จสิ้น";
            else if (room.status === 'issue') statusText = "มีปัญหา";
            else if (room.status === 'skipped') statusText = "ข้ามงาน";

            roomCard.innerHTML = `
                <span>${room.roomNo}</span>
                <span class="room-card-status">${statusText}</span>
            `;

            let tooltip = `เลขห้อง: ${room.roomNo}\nสถานะ: ${statusText}`;
            if (room.worker) tooltip += `\nผู้ทำงาน: ${room.worker}`;
            if (room.lastUpdated) tooltip += `\nอัปเดตเมื่อ: ${room.lastUpdated}`;
            if (room.note) tooltip += `\nบันทึก: ${room.note}`;
            roomCard.title = tooltip;

            roomCard.addEventListener('click', () => {
                if (isBulkMode) {
                    const idx = selectedRoomsForDelete.indexOf(room.roomNo);
                    if (idx > -1) {
                        selectedRoomsForDelete.splice(idx, 1);
                        roomCard.classList.remove('bulk-selected');
                    } else {
                        selectedRoomsForDelete.push(room.roomNo);
                        roomCard.classList.add('bulk-selected');
                    }
                    updateBulkBarUI();
                } else {
                    document.querySelectorAll('.room-card').forEach(c => c.classList.remove('selected'));
                    roomCard.classList.add('selected');
                    openRoomManager(activeProj.id, room.roomNo);
                }
            });

            gridContainer.appendChild(roomCard);
        });

        if (gridContainer.children.length === 0) {
            gridContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">ไม่พบห้องตามฟิลเตอร์สถานะที่เลือก</div>`;
        }
    }

    // Bind selector and filter pills in Room Tab
    document.getElementById('room-project-select').addEventListener('change', (e) => {
        selectedProjectId = e.target.value;
        renderRoomsTab();
    });

    const pills = document.querySelectorAll('.filter-pill');
    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            roomFilter = pill.getAttribute('data-filter');
            renderRoomsTab();
        });
    });

    // Helper to update bulk delete actions bar details
    function updateBulkBarUI() {
        const info = document.getElementById('bulk-actions-info');
        const btnDelete = document.getElementById('btn-bulk-delete-confirm');
        if (info) {
            info.textContent = `เลือกห้องพักเพื่อลบ... (เลือกแล้ว ${selectedRoomsForDelete.length} ห้อง)`;
        }
        if (btnDelete) {
            btnDelete.disabled = selectedRoomsForDelete.length === 0;
            btnDelete.textContent = `ลบห้องที่เลือก (${selectedRoomsForDelete.length})`;
        }
    }

    // Bind bulk delete controls in Room Tab
    const btnBulkModeTrigger = document.getElementById('btn-bulk-mode-trigger');
    if (btnBulkModeTrigger) {
        btnBulkModeTrigger.addEventListener('click', () => {
            isBulkMode = true;
            selectedRoomsForDelete = [];
            renderRoomsTab();
        });
    }

    const btnBulkCancel = document.getElementById('btn-bulk-cancel');
    if (btnBulkCancel) {
        btnBulkCancel.addEventListener('click', () => {
            isBulkMode = false;
            selectedRoomsForDelete = [];
            renderRoomsTab();
        });
    }

    const btnBulkSelectAll = document.getElementById('btn-bulk-select-all');
    if (btnBulkSelectAll) {
        btnBulkSelectAll.addEventListener('click', () => {
            const activeProj = db.projects.find(p => p.id === selectedProjectId);
            if (!activeProj) return;

            // Select all rooms currently displayed matching the active filters
            const visibleRooms = activeProj.rooms.filter(room => {
                return roomFilter === 'all' || room.status === roomFilter;
            });
            selectedRoomsForDelete = visibleRooms.map(r => r.roomNo);
            
            // Add bulk-selected styling to all visible cards
            document.querySelectorAll('.room-card').forEach(card => {
                card.classList.add('bulk-selected');
            });
            updateBulkBarUI();
        });
    }

    const btnBulkDeleteConfirm = document.getElementById('btn-bulk-delete-confirm');
    if (btnBulkDeleteConfirm) {
        btnBulkDeleteConfirm.addEventListener('click', () => {
            if (selectedRoomsForDelete.length === 0) {
                alert("กรุณาเลือกห้องพักอย่างน้อย 1 ห้องเพื่อดำเนินการลบ");
                return;
            }

            const activeProj = db.projects.find(p => p.id === selectedProjectId);
            if (!activeProj) return;

            if (confirm(`คุณแน่ใจว่าต้องการลบห้องพักที่เลือกทั้งหมดจำนวน ${selectedRoomsForDelete.length} ห้อง ออกจากโครงการ "${activeProj.name}" ใช่หรือไม่? การลบนี้จะมีผลถาวร`)) {
                // Delete selected rooms
                activeProj.rooms = activeProj.rooms.filter(r => !selectedRoomsForDelete.includes(r.roomNo));
                activeProj.totalRooms = activeProj.rooms.length;

                // Add log entry
                const todayStr = getLocalDateStr();
                const currentTimeStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });
                db.logs.push({
                    id: `log-${Date.now()}`,
                    date: todayStr,
                    time: currentTimeStr,
                    worker: "ระบบจัดการข้อมูล",
                    projectId: activeProj.id,
                    projectName: activeProj.name,
                    note: `ดำเนินการลบห้องพักแบบกลุ่ม (Bulk Delete) จำนวน ${selectedRoomsForDelete.length} ห้อง (${selectedRoomsForDelete.sort().join(', ')})`
                });

                // Clear states
                isBulkMode = false;
                selectedRoomsForDelete = [];

                saveDB();
                alert("ดำเนินการลบห้องพักเสร็จสิ้นเรียบร้อยแล้ว!");
            }
        });
    }

    // Bind log period filter selector in Daily Tab
    const logPeriodFilter = document.getElementById('filter-log-period');
    if (logPeriodFilter) {
        logPeriodFilter.addEventListener('change', () => {
            renderDailyTab();
        });
    }

    // Helper to get/initialize attendance state for a project on a specific date
    let dailyAttendanceState = {};
    let cardSelectedDates = {};

    function getProjectDateState(projId, dateStr) {
        const key = `${projId}_${dateStr}`;
        if (!dailyAttendanceState[key]) {
            // Find existing logs for this project and date
            const existingLogs = db.logs.filter(l => l && l.projectId === projId && l.date === dateStr);
            dailyAttendanceState[key] = existingLogs.map(l => ({
                workerName: l.worker,
                note: l.note
            }));
        }
        return dailyAttendanceState[key];
    }

    // RENDER TAB 3: Daily Attendance/Operations Log (Grouped 5-day sliding window layout)
    function renderDailyTab() {
        const projSelect = document.getElementById('daily-project-select');
        const dateSelect = document.getElementById('daily-date-select');
        const logsContainer = document.getElementById('daily-5days-logs');
        const workerSelect = document.getElementById('daily-worker-select');
        const activeWorkersList = document.getElementById('daily-active-workers-list');
        const poolList = document.getElementById('workers-pool-list');

        if (!projSelect || !dateSelect || !logsContainer || !workerSelect || !activeWorkersList || !poolList) return;

        // 1. Populate Project Dropdown
        const prevProjVal = projSelect.value || selectedDailyProjId;
        projSelect.innerHTML = "";
        db.projects.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.textContent = p.name;
            if (p.id === prevProjVal) opt.selected = true;
            projSelect.appendChild(opt);
        });
        if (projSelect.value) {
            selectedDailyProjId = projSelect.value;
        }

        // 2. Set Date Select
        if (!selectedDailyDate) {
            selectedDailyDate = getLocalDateStr();
        }
        dateSelect.value = selectedDailyDate;

        // 3. Populate Worker Select Dropdown (excluding active ones)
        workerSelect.innerHTML = `<option value="">-- เลือกพนักงาน --</option>`;
        db.workers.forEach(w => {
            if (!activeDailyWorkers.some(active => active.name === w)) {
                const opt = document.createElement('option');
                opt.value = w;
                opt.textContent = w;
                workerSelect.appendChild(opt);
            }
        });

        // 4. Render Active Workers Logger Queue
        activeWorkersList.innerHTML = "";
        if (activeDailyWorkers.length === 0) {
            activeWorkersList.innerHTML = `<div style="font-size:12px; color:var(--text-muted); padding:4px 0;">ไม่มีพนักงานเข้าปฏิบัติงานที่เลือก</div>`;
        } else {
            activeDailyWorkers.forEach(w => {
                const row = document.createElement('div');
                row.className = "worker-detail-row";
                row.innerHTML = `
                    <span class="worker-name-label" style="font-weight:600; font-size:13px; color:var(--text-primary);">👤 ${w.name}:</span>
                    <div style="display:flex; gap:8px; width:100%;">
                        <input type="text" class="form-control worker-task-input" style="flex-grow:1; padding: 6px 12px; font-size: 13px;" placeholder="ระบุการปฏิบัติงาน..." value="${w.note}">
                        <button type="button" class="btn btn-sm btn-danger btn-remove-active" style="padding:4px 8px; font-weight:bold; font-size:14px;">&times;</button>
                    </div>
                `;
                
                // Bind active row inputs
                row.querySelector('.worker-task-input').addEventListener('input', (e) => {
                    w.note = e.target.value;
                });
                row.querySelector('.btn-remove-active').addEventListener('click', () => {
                    activeDailyWorkers = activeDailyWorkers.filter(active => active.name !== w.name);
                    renderDailyTab();
                });
                activeWorkersList.appendChild(row);
            });
        }

        // 5. Render 5-Day sliding window Logs
        logsContainer.innerHTML = "";
        const targetDate = new Date(selectedDailyDate);
        if (isNaN(targetDate.getTime())) {
            logsContainer.innerHTML = `<div style="text-align:center; color:var(--text-muted); font-size:13px;">กรุณาเลือกวันที่ถูกต้อง</div>`;
            return;
        }

        // Generate 5 days list (selected day + 4 preceding days)
        const daysList = [];
        for (let i = 0; i < 5; i++) {
            const d = new Date(targetDate);
            d.setDate(d.getDate() - i);
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            daysList.push(`${y}-${m}-${day}`);
        }

        daysList.forEach(dateStr => {
            const dParts = dateStr.split('-');
            const displayDate = dParts.length === 3 ? `${dParts[2]}/${dParts[1]}/${parseInt(dParts[0]) + 543}` : dateStr;

            // Get logs for selected project and date
            const logsForDate = db.logs.filter(l => l && l.projectId === selectedDailyProjId && l.date === dateStr);
            logsForDate.sort((a, b) => (b.time || '00:00').localeCompare(a.time || '00:00'));

            const dateHeader = document.createElement('div');
            dateHeader.className = "log-date-header";
            dateHeader.innerHTML = `📅 วันที่ ${displayDate}`;
            logsContainer.appendChild(dateHeader);

            const itemsContainer = document.createElement('div');
            itemsContainer.className = "log-date-items";

            if (logsForDate.length === 0) {
                itemsContainer.innerHTML = `<div style="padding:6px 12px; color:var(--text-muted); font-size:12px; font-style:italic;">ไม่มีรายชื่อผู้เข้าปฏิบัติงานในวันนี้</div>`;
            } else {
                logsForDate.forEach(log => {
                    const item = document.createElement('div');
                    item.className = "activity-item";
                    item.style.borderLeft = "4px solid var(--accent)";
                    item.style.marginBottom = "8px";
                    item.innerHTML = `
                        <div class="activity-details" style="width: 100%;">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span style="font-weight:700; color:var(--text-primary); font-size:12px;">👤 ช่างผู้ทำ: ${log.worker || 'ไม่ระบุชื่อ'}</span>
                                <span class="activity-time" style="display:flex; align-items:center; gap:8px; font-size:11px;">
                                    ${log.time || ''} น.
                                    <button class="btn-delete-log" data-log-id="${log.id}" title="ลบประวัตินี้" style="background:none; border:none; color:var(--color-issue); cursor:pointer; font-size:16px; font-weight:bold;">&times;</button>
                                </span>
                            </div>
                            <div class="activity-issue-text" style="width:100%; display:block; background:#ffffff;">
                                ${(log.note || 'เข้าปฏิบัติงานประจำวัน').replace(/\n/g, '<br>')}
                            </div>
                        </div>
                    `;
                    item.querySelector('.btn-delete-log').addEventListener('click', () => {
                        if (confirm("ต้องการลบรายงานความคืบหน้าของโครงการนี้ใช่หรือไม่?")) {
                            deleteDailyLog(log.id);
                        }
                    });
                    itemsContainer.appendChild(item);
                });
            }
            logsContainer.appendChild(itemsContainer);
        });

        // 6. Render Global Workers List (CRUD Manager)
        poolList.innerHTML = "";
        db.workers.forEach(w => {
            const item = document.createElement('div');
            item.style.display = "flex";
            item.style.justifyContent = "space-between";
            item.style.alignItems = "center";
            item.style.background = "#f8fafc";
            item.style.border = "1px solid var(--border-color)";
            item.style.padding = "6px 12px";
            item.style.borderRadius = "8px";
            item.innerHTML = `
                <span style="font-size:13px; font-weight:600; color:var(--text-primary);">${w}</span>
                <div style="display:flex; gap:6px;">
                    <button class="btn btn-sm btn-edit-worker" style="padding:2px 6px; font-size:11px; border-color:var(--accent); color:var(--accent);" data-name="${w}">แก้ไข</button>
                    <button class="btn btn-sm btn-danger btn-delete-worker" style="padding:2px 6px; font-size:11px;" data-name="${w}">ลบ</button>
                </div>
            `;

            // Edit Worker event
            item.querySelector('.btn-edit-worker').addEventListener('click', () => {
                const oldName = w;
                const newName = prompt(`แก้ไขรายชื่อพนักงาน "${oldName}" เป็น:`, oldName);
                if (newName && newName.trim() && newName.trim() !== oldName) {
                    const cleanNewName = newName.trim();
                    if (db.workers.includes(cleanNewName)) {
                        alert(`เกิดข้อผิดพลาด: ชื่อ "${cleanNewName}" มีอยู่ในระบบแล้ว`);
                        return;
                    }
                    
                    // Rename in pool
                    const idx = db.workers.indexOf(oldName);
                    if (idx > -1) db.workers[idx] = cleanNewName;

                    // Propagate rename to db.logs
                    db.logs.forEach(l => {
                        if (l && l.worker === oldName) l.worker = cleanNewName;
                    });

                    // Propagate rename to db.issues
                    db.issues.forEach(i => {
                        if (i && i.reportedBy === oldName) i.reportedBy = cleanNewName;
                    });

                    // Propagate rename to project active rooms
                    db.projects.forEach(p => {
                        if (p.rooms) {
                            p.rooms.forEach(r => {
                                if (r && r.worker === oldName) r.worker = cleanNewName;
                            });
                        }
                        if (p.todayWorkers) {
                            const workersArr = p.todayWorkers.split(',').map(s => s.trim());
                            const wIdx = workersArr.indexOf(oldName);
                            if (wIdx > -1) {
                                workersArr[wIdx] = cleanNewName;
                                p.todayWorkers = workersArr.join(', ');
                            }
                        }
                    });

                    // Rename in activeDailyWorkers queue if present
                    activeDailyWorkers.forEach(active => {
                        if (active.name === oldName) active.name = cleanNewName;
                    });

                    saveDB();
                    alert("บันทึกการแก้ไขชื่อพนักงานเรียบร้อย!");
                }
            });

            // Delete Worker event
            item.querySelector('.btn-delete-worker').addEventListener('click', () => {
                const nameToDelete = w;
                if (confirm(`คุณแน่ใจว่าต้องการลบพนักงาน "${nameToDelete}" ออกจากฐานข้อมูลระบบ?`)) {
                    db.workers = db.workers.filter(x => x !== nameToDelete);
                    activeDailyWorkers = activeDailyWorkers.filter(active => active.name !== nameToDelete);
                    saveDB();
                    alert("ลบพนักงานเรียบร้อย!");
                }
            });

            poolList.appendChild(item);
        });
    }

    // RENDER TAB 4: Issues Tracker
    function renderIssuesTab() {
        const container = document.getElementById('issues-list-container');
        container.innerHTML = "";

        const totalIssues = db.issues.length;
        const activeIssues = db.issues.filter(i => i.status === 'pending').length;
        const resolvedIssues = db.issues.filter(i => i.status === 'resolved').length;

        document.getElementById('issue-total-count').textContent = totalIssues;
        document.getElementById('issue-active-count').textContent = activeIssues;
        document.getElementById('issue-resolved-count').textContent = resolvedIssues;

        if (totalIssues === 0) {
            container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">ไม่พบรายการแจ้งปัญหาใดๆ ในทุกโครงการ</div>`;
            return;
        }

        const sortedIssues = [...db.issues].sort((a,b) => {
            if (a.status === b.status) {
                return b.date.localeCompare(a.date);
            }
            return a.status === 'pending' ? -1 : 1;
        });

        sortedIssues.forEach(issue => {
            const card = document.createElement('div');
            card.className = `issue-card ${issue.status === 'pending' ? 'unresolved' : 'resolved'}`;

            const badgeText = issue.status === 'pending' ? 'พบปัญหาล่าช้า' : 'แก้ไขเสร็จสิ้น';
            const badgeClass = issue.status === 'pending' ? 'issue' : 'completed';

            const repParts = issue.date.split('-');
            const displayRepDate = repParts.length === 3 ? `${repParts[2]}/${repParts[1]}/${parseInt(repParts[0])+543}` : issue.date;
            
            let resDateStr = "";
            if (issue.resolveDate) {
                const resParts = issue.resolveDate.split('-');
                resDateStr = resParts.length === 3 ? `${resParts[2]}/${resParts[1]}/${parseInt(resParts[0])+543}` : issue.resolveDate;
            }

            card.innerHTML = `
                <div class="issue-card-header">
                    <div>
                        <div class="issue-card-title">${issue.projectName} — ห้อง ${issue.roomNo}</div>
                        <div class="issue-card-meta">แจ้งโดย: ${issue.reportedBy} | เมื่อ: ${displayRepDate}</div>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span class="status-badge ${badgeClass}">${badgeText}</span>
                        <button class="btn-delete-issue-card" data-id="${issue.id}" title="ลบรายการปัญหานี้" style="background:none; border:none; color:var(--text-secondary); cursor:pointer; font-size:18px; font-weight:bold;">&times;</button>
                    </div>
                </div>
                <div class="issue-card-body">
                    <strong>รายละเอียดปัญหา:</strong> ${issue.desc}
                    ${issue.status === 'resolved' ? `
                        <div class="issue-resolution">
                            <strong>แนวทางการแก้ไข (สำเร็จเมื่อ ${resDateStr}):</strong><br>
                            ${issue.solution}
                        </div>
                    ` : ''}
                </div>
                ${issue.status === 'pending' ? `
                    <div class="issue-card-footer">
                        <button class="btn btn-sm btn-primary btn-resolve-issue" data-id="${issue.id}">
                            ลงบันทึกการแก้ไขปัญหา
                        </button>
                    </div>
                ` : ''}
            `;

            const btnResolve = card.querySelector('.btn-resolve-issue');
            if (btnResolve) {
                btnResolve.addEventListener('click', () => {
                    openIssueResolver(issue.id);
                });
            }

            card.querySelector('.btn-delete-issue-card').addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm("ต้องการลบสถิติจดบันทึกปัญหานี้ออกจากระบบใช่หรือไม่?")) {
                    deleteIssue(issue.id);
                }
            });

            container.appendChild(card);
        });
    }

    // RENDER TAB 5: Data Management / Raw Database
    function renderDataTab() {
        const view = document.getElementById('database-raw-view');
        if (view) {
            view.textContent = JSON.stringify(db, null, 4);
        }
    }

    // Export DB utility
    document.getElementById('btn-export-data').addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
        const dlAnchorElem = document.createElement('a');
        
        const timestamp = new Date().toISOString().slice(0, 10);
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", `floortech_backup_${timestamp}.json`);
        dlAnchorElem.click();
    });

    // Import DB utility
    document.getElementById('input-import-file').addEventListener('change', (e) => {
        const fileReader = new FileReader();
        fileReader.onload = function (event) {
            try {
                const parsed = JSON.parse(event.target.result);
                if (parsed.projects && parsed.logs && parsed.issues) {
                    db = parsed;
                    saveDB();
                    alert("นำเข้าข้อมูลระบบเสร็จสิ้นเรียบร้อยแล้ว!");
                } else {
                    alert("โครงสร้างไฟล์สำรองข้อมูลไม่ถูกต้อง กรุณาอัปโหลดไฟล์ JSON ที่ถูกต้อง");
                }
            } catch (error) {
                alert("ไฟล์เสียหายหรือไม่สามารถอ่านค่า JSON ได้");
            }
        };
        if (e.target.files[0]) {
            fileReader.readAsText(e.target.files[0]);
        }
    });

    // Reset default seeds
    document.getElementById('btn-reset-demo').addEventListener('click', () => {
        if (confirm("คุณแน่ใจว่าต้องการรีเซ็ตข้อมูลทั้งหมดกลับไปเป็นค่าเริ่มต้นของการทดสอบระบบ (Demo Data)? ข้อมูลปัจจุบันทั้งหมดจะสูญหาย")) {
            seedDefaultDB();
            alert("รีเซ็ตระบบเป็นค่าเริ่มต้นสำเร็จ");
        }
    });

    // Clear all records
    document.getElementById('btn-clear-system').addEventListener('click', () => {
        if (confirm("ต้องการล้างข้อมูลระบบทั้งหมด (Clear All)? ทุกโปรเจ็กต์จะถูกลบ ข้อมูลปัจจุบันทั้งหมดจะสูญหายและระบบจะกลายเป็นศูนย์")) {
            db = {
                projects: [],
                logs: [],
                issues: []
            };
            saveDB();
            alert("ล้างข้อมูลในระบบสำเร็จ");
        }
    });

    // ==========================================
    // 4. Operations / Action Modals Forms Logic
    // ==========================================

    function deleteDailyLog(logId) {
        db.logs = db.logs.filter(l => l.id !== logId);
        saveDB();
    }

    function deleteIssue(issueId) {
        db.issues = db.issues.filter(i => i.id !== issueId);
        saveDB();
    }

    function deleteProject(projId) {
        db.projects = db.projects.filter(p => p.id !== projId);
        db.logs = db.logs.filter(l => l.projectId !== projId);
        db.issues = db.issues.filter(i => i.projectId !== projId);
        
        if (selectedProjectId === projId) {
            selectedProjectId = db.projects.length > 0 ? db.projects[0].id : "";
        }
        saveDB();
    }

    // Action: Add Project Submit
    document.getElementById('form-add-project').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('project-name').value;
        const totalRooms = parseInt(document.getElementById('project-total-rooms').value);
        const startDate = getDateStringFromDropdowns('project-start-day', 'project-start-month', 'project-start-year');
        const endDate = getDateStringFromDropdowns('project-end-day', 'project-end-month', 'project-end-year');

        if (startDate > endDate) {
            alert("ข้อผิดพลาด: วันเริ่มต้นต้องไม่ระบุทีหลังวันที่สิ้นสุดโครงการ");
            return;
        }

        // Calculate months
        const startMonth = new Date(startDate).getMonth() + 1;
        const endMonth = new Date(endDate).getMonth() + 1;

        const newId = `proj-${Date.now()}`;
        const newProj = {
            id: newId,
            name: name,
            startDate: startDate,
            endDate: endDate,
            startMonth: startMonth,
            endMonth: endMonth,
            dueDate: endDate,
            totalRooms: totalRooms,
            todayWorkers: "",
            rooms: generateRoomList(totalRooms)
        };

        db.projects.push(newProj);
        selectedProjectId = newId;

        e.target.reset();
        setTodayDates(); // Reset dropdowns to today
        closeModal('modal-add-project');
        saveDB();
    });

    // Action: Open Edit Project Modal
    function openEditProjectModal(projId) {
        const proj = db.projects.find(p => p.id === projId);
        if (!proj) return;

        document.getElementById('edit-project-id').value = proj.id;
        document.getElementById('edit-project-name').value = proj.name;
        document.getElementById('edit-project-total-rooms').value = proj.rooms ? proj.rooms.length : proj.totalRooms;
        
        // Populate edit date dropdowns from existing Western date string
        setDropdownsFromDateString(proj.startDate, 'edit-project-start-day', 'edit-project-start-month', 'edit-project-start-year');
        setDropdownsFromDateString(proj.endDate, 'edit-project-end-day', 'edit-project-end-month', 'edit-project-end-year');

        openModal('modal-edit-project');
    }

    document.getElementById('btn-edit-current-project').addEventListener('click', () => {
        if (selectedProjectId) {
            openEditProjectModal(selectedProjectId);
        }
    });

    // Action: Edit Project Submit
    document.getElementById('form-edit-project').addEventListener('submit', (e) => {
        e.preventDefault();

        const projId = document.getElementById('edit-project-id').value;
        const name = document.getElementById('edit-project-name').value;
        const newTotal = parseInt(document.getElementById('edit-project-total-rooms').value);
        const startDate = getDateStringFromDropdowns('edit-project-start-day', 'edit-project-start-month', 'edit-project-start-year');
        const endDate = getDateStringFromDropdowns('edit-project-end-day', 'edit-project-end-month', 'edit-project-end-year');

        if (startDate > endDate) {
            alert("ข้อผิดพลาด: วันเริ่มต้นต้องไม่ระบุทีหลังวันที่สิ้นสุดโครงการ");
            return;
        }

        if (newTotal < 1) {
            alert("ข้อผิดพลาด: จำนวนห้องต้องไม่ต่ำกว่า 1 ห้อง");
            return;
        }

        const proj = db.projects.find(p => p.id === projId);
        if (proj) {
            proj.name = name;
            proj.startDate = startDate;
            proj.endDate = endDate;
            proj.dueDate = endDate;
            
            // Extract start/end month indexes for Gantt
            proj.startMonth = new Date(startDate).getMonth() + 1;
            proj.endMonth = new Date(endDate).getMonth() + 1;
            
            // Adjust rooms count list
            const currentCount = proj.rooms.length;
            if (newTotal > currentCount) {
                // Generate potential room list
                const potentialRooms = generateRoomList(newTotal);
                potentialRooms.forEach(r => {
                    if (!proj.rooms.some(existing => existing.roomNo === r.roomNo)) {
                        proj.rooms.push(r);
                    }
                });
                // Dynamic fallback if naming is irregular
                while (proj.rooms.length < newTotal) {
                    const nextNo = proj.rooms.length + 101;
                    proj.rooms.push({ roomNo: String(nextNo), status: 'pending', worker: '', note: '', lastUpdated: getLocalDateStr() });
                }
            } else if (newTotal < currentCount) {
                // Warning note was in confirmation, now slice last rooms
                proj.rooms = proj.rooms.slice(0, newTotal);
            }
            proj.totalRooms = proj.rooms.length;
            
            db.logs.forEach(l => {
                if (l.projectId === projId) l.projectName = name;
            });
            db.issues.forEach(i => {
                if (i.projectId === projId) i.projectName = name;
            });

            closeModal('modal-edit-project');
            saveDB();
            alert("อัปเดตรายละเอียดโปรเจ็กต์เรียบร้อย!");
        }
    });

    // Action: Open Add Room Modal Trigger
    document.getElementById('btn-add-room-trigger').addEventListener('click', () => {
        if (selectedProjectId) {
            openModal('modal-add-room');
        }
    });

    // Action: Add Room Submit
    document.getElementById('form-add-room').addEventListener('submit', (e) => {
        e.preventDefault();

        const roomNo = document.getElementById('add-room-no').value.trim();
        const status = document.getElementById('add-room-status').value;

        const proj = db.projects.find(p => p.id === selectedProjectId);
        if (!proj) return;

        const duplicate = proj.rooms.some(r => r.roomNo === roomNo);
        if (duplicate) {
            alert(`เกิดข้อผิดพลาด: เลขห้อง ${roomNo} มีอยู่แล้วในโปรเจ็กต์นี้`);
            return;
        }

        proj.rooms.push({
            roomNo: roomNo,
            status: status,
            worker: '',
            note: 'สร้างห้องเพิ่มเติมโดยผู้ใช้งาน',
            lastUpdated: getLocalDateStr()
        });
        
        proj.totalRooms = proj.rooms.length;

        e.target.reset();
        closeModal('modal-add-room');
        saveDB();
        alert(`เพิ่มห้องพัก ${roomNo} เรียบร้อย!`);
    });

    // Action: Open Room Manager Modal
    function openRoomManager(projectId, roomNo) {
        const proj = db.projects.find(p => p.id === projectId);
        if (!proj) return;
        
        const room = proj.rooms.find(r => r.roomNo === roomNo);
        if (!room) return;

        document.getElementById('room-manage-project-id').value = projectId;
        document.getElementById('room-manage-room-no').value = roomNo;
        document.getElementById('room-manager-title').textContent = `${proj.name} — จัดการห้อง ${roomNo}`;
        document.getElementById('room-manage-status').value = room.status;
        document.getElementById('room-manage-worker').value = room.worker || "";
        document.getElementById('room-manage-note').value = room.note || "";
        
        const issuePanel = document.getElementById('room-manage-issue-panel');
        const issueDescInput = document.getElementById('room-manage-issue-desc');
        
        issueDescInput.value = "";
        if (room.status === 'issue') {
            issuePanel.style.display = 'block';
            const relatedIssue = db.issues.find(i => i.projectId === projectId && i.roomNo === roomNo && i.status === 'pending');
            if (relatedIssue) {
                issueDescInput.value = relatedIssue.desc;
            }
        } else {
            issuePanel.style.display = 'none';
        }

        const btnDeleteRoom = document.getElementById('btn-delete-room');
        const newBtnDeleteRoom = btnDeleteRoom.cloneNode(true);
        btnDeleteRoom.parentNode.replaceChild(newBtnDeleteRoom, btnDeleteRoom);

        newBtnDeleteRoom.addEventListener('click', () => {
            if (confirm(`คุณต้องการลบ "ห้องพัก ${roomNo}" ออกจากโครงการ "${proj.name}" ใช่หรือไม่?`)) {
                proj.rooms = proj.rooms.filter(r => r.roomNo !== roomNo);
                proj.totalRooms = proj.rooms.length;
                
                closeModal('modal-room-manager');
                saveDB();
                alert(`ลบห้องพัก ${roomNo} เรียบร้อยแล้ว`);
            }
        });

        openModal('modal-room-manager');
    }

    // Room Status Option listener within Room Manager Modal
    document.getElementById('room-manage-status').addEventListener('change', (e) => {
        const issuePanel = document.getElementById('room-manage-issue-panel');
        const issueDescInput = document.getElementById('room-manage-issue-desc');
        
        if (e.target.value === 'issue') {
            issuePanel.style.display = 'block';
            issueDescInput.setAttribute('required', 'true');
        } else {
            issuePanel.style.display = 'none';
            issueDescInput.removeAttribute('required');
        }
    });

    // Action: Update Room Details Submit
    document.getElementById('form-manage-room').addEventListener('submit', (e) => {
        e.preventDefault();

        const projectId = document.getElementById('room-manage-project-id').value;
        const roomNo = document.getElementById('room-manage-room-no').value;
        const status = document.getElementById('room-manage-status').value;
        const worker = document.getElementById('room-manage-worker').value;
        const note = document.getElementById('room-manage-note').value;
        
        const proj = db.projects.find(p => p.id === projectId);
        if (!proj) return;

        const room = proj.rooms.find(r => r.roomNo === roomNo);
        if (!room) return;

        const prevStatus = room.status;
        const todayStr = getLocalDateStr();
        const currentTimeStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });

        room.status = status;
        room.worker = worker;
        room.note = note;
        room.lastUpdated = todayStr;

        if (status === 'issue') {
            const desc = document.getElementById('room-manage-issue-desc').value;
            const existingIssue = db.issues.find(i => i.projectId === projectId && i.roomNo === roomNo && i.status === 'pending');
            if (existingIssue) {
                existingIssue.desc = desc;
                existingIssue.reportedBy = worker || "พนักงานควบคุมงาน";
            } else {
                db.issues.push({
                    id: `issue-${Date.now()}`,
                    projectId: projectId,
                    projectName: proj.name,
                    roomNo: roomNo,
                    desc: desc,
                    reportedBy: worker || "พนักงานควบคุมงาน",
                    date: todayStr,
                    status: "pending",
                    solution: "",
                    resolveDate: ""
                });
            }
        } else if (prevStatus === 'issue' && status !== 'issue') {
            const activeIssues = db.issues.filter(i => i.projectId === projectId && i.roomNo === roomNo && i.status === 'pending');
            activeIssues.forEach(i => {
                i.status = 'resolved';
                i.solution = `ปรับปรุงแก้ไขสถานะการปูพื้นเป็น: ${status} ผ่านโมดูลจัดการรายห้อง`;
                i.resolveDate = todayStr;
            });
        }

        db.logs.push({
            id: `log-${Date.now()}`,
            date: todayStr,
            time: currentTimeStr,
            worker: worker || "ระบบอัปเดตห้องพัก",
            projectId: projectId,
            projectName: proj.name,
            note: `อัปเดตสถานะห้อง ${roomNo} เป็น: ${status === 'completed' ? 'เสร็จสิ้น' : status === 'progress' ? 'กำลังปูพื้น' : status === 'inspect' ? 'รอตรวจสอบ' : status === 'issue' ? 'มีปัญหา' : 'ข้ามไม่ต้องปู'} (${note || 'ไม่มีบันทึกเพิ่มเติม'})`
        });

        closeModal('modal-room-manager');
        saveDB();
    });

    // Action: Add Daily Work Log Submit (Project-centric daily modal)
    document.getElementById('form-add-daily-log').addEventListener('submit', (e) => {
        e.preventDefault();

        const projectId = document.getElementById('add-daily-log-project-id').value;
        const worker = document.getElementById('add-daily-log-worker').value;
        const note = document.getElementById('add-daily-log-note').value;
        const date = document.getElementById('add-daily-log-date').value;
        const currentTimeStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });

        const proj = db.projects.find(p => p.id === projectId);
        if (!proj) {
            alert("เกิดข้อผิดพลาด: ไม่พบโปรเจ็กต์ที่ระบุ");
            return;
        }

        // Push new daily activity log
        db.logs.push({
            id: `log-${Date.now()}`,
            date: date,
            time: currentTimeStr,
            worker: worker,
            projectId: projectId,
            projectName: proj.name,
            note: note
        });

        // Auto-update project's current worker list if they changed it in the modal
        proj.todayWorkers = worker;

        e.target.reset();
        closeModal('modal-add-daily-log');
        
        saveDB();
        alert("บันทึกรายงานความคืบหน้าโครงการเสร็จสิ้น!");
    });

    // Action: Open Issue Resolver Modal
    function openIssueResolver(issueId) {
        const issue = db.issues.find(i => i.id === issueId);
        if (!issue) return;

        document.getElementById('issue-resolve-id').value = issueId;
        document.getElementById('issue-resolve-desc').textContent = `${issue.projectName} ห้อง ${issue.roomNo}: "${issue.desc}"`;
        document.getElementById('issue-resolve-solution').value = issue.solution || "";
        document.getElementById('issue-resolve-status').value = "resolved";

        openModal('modal-issue-manager');
    }

    // Action: Issue Resolve Submit
    document.getElementById('form-resolve-issue').addEventListener('submit', (e) => {
        e.preventDefault();

        const issueId = document.getElementById('issue-resolve-id').value;
        const solution = document.getElementById('issue-resolve-solution').value;
        const status = document.getElementById('issue-resolve-status').value;
        
        const issue = db.issues.find(i => i.id === issueId);
        if (!issue) return;

        const todayStr = getLocalDateStr();
        const currentTimeStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });

        issue.status = status;
        issue.solution = solution;
        issue.resolveDate = todayStr;

        if (status === 'resolved') {
            const proj = db.projects.find(p => p.id === issue.projectId);
            if (proj) {
                const room = proj.rooms.find(r => r.roomNo === issue.roomNo);
                if (room && room.status === 'issue') {
                    room.status = 'inspect';
                    room.note = `ได้รับการแก้ไข: ${solution}`;
                    room.lastUpdated = todayStr;
                }
            }

            db.logs.push({
                id: `log-${Date.now()}`,
                date: todayStr,
                time: currentTimeStr,
                worker: "ระบบแก้ไขปัญหา",
                projectId: issue.projectId,
                projectName: issue.projectName,
                note: `แก้ไขปัญหาห้อง ${issue.roomNo} สำเร็จ: ${solution}`
            });
        }

        closeModal('modal-issue-manager');
        saveDB();
        alert("บันทึกการแก้ไขปัญหาเรียบร้อย!");
    });


    // ==========================================
    // 5. Initial Boot & UI bindings
    // ==========================================
    
    // Initialize date dropdown selectors
    initDateDropdowns('project-start-day', 'project-start-month', 'project-start-year');
    initDateDropdowns('project-end-day', 'project-end-month', 'project-end-year');
    initDateDropdowns('edit-project-start-day', 'edit-project-start-month', 'edit-project-start-year');
    initDateDropdowns('edit-project-end-day', 'edit-project-end-month', 'edit-project-end-year');

    loadDB();

    // Bind timeline view select change and year select change
    const selectTimelineView = document.getElementById('select-timeline-view');
    if (selectTimelineView) {
        selectTimelineView.addEventListener('change', () => {
            renderPlanTab();
        });
    }
    const selectTimelineYear = document.getElementById('select-timeline-year');
    if (selectTimelineYear) {
        selectTimelineYear.addEventListener('change', () => {
            renderPlanTab();
        });
    }

    // Bind Daily Operations elements
    const dailyProjSelect = document.getElementById('daily-project-select');
    if (dailyProjSelect) {
        dailyProjSelect.addEventListener('change', (e) => {
            selectedDailyProjId = e.target.value;
            activeDailyWorkers = []; // clear current queue
            renderDailyTab();
        });
    }

    const dailyDateSelect = document.getElementById('daily-date-select');
    if (dailyDateSelect) {
        dailyDateSelect.addEventListener('change', (e) => {
            selectedDailyDate = e.target.value;
            renderDailyTab();
        });
    }

    const btnAddSelectedWorker = document.getElementById('btn-add-selected-worker');
    if (btnAddSelectedWorker) {
        btnAddSelectedWorker.addEventListener('click', () => {
            const wSelect = document.getElementById('daily-worker-select');
            if (!wSelect) return;
            const name = wSelect.value;
            if (name && !activeDailyWorkers.some(w => w.name === name)) {
                activeDailyWorkers.push({ name: name, note: "" });
                wSelect.value = "";
                renderDailyTab();
            }
        });
    }

    const btnSaveDailyAttendance = document.getElementById('btn-save-daily-attendance');
    if (btnSaveDailyAttendance) {
        btnSaveDailyAttendance.addEventListener('click', () => {
            if (activeDailyWorkers.length === 0) {
                alert("กรุณาเลือกพนักงานเข้าทำงานและระบุรายละเอียดก่อนบันทึก");
                return;
            }
            const proj = db.projects.find(p => p.id === selectedDailyProjId);
            if (!proj) return;

            const currentTimeStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });

            activeDailyWorkers.forEach(w => {
                db.logs.push({
                    id: `log-${Date.now()}-${Math.random()}`,
                    date: selectedDailyDate,
                    time: currentTimeStr,
                    worker: w.name,
                    projectId: selectedDailyProjId,
                    projectName: proj.name,
                    note: w.note || "เข้าปฏิบัติงานประจำวัน"
                });
            });

            // Sync project's todayWorkers list if date is today
            const todayStr = getLocalDateStr();
            if (selectedDailyDate === todayStr) {
                proj.todayWorkers = activeDailyWorkers.map(w => w.name).join(', ');
            }

            activeDailyWorkers = []; // Reset queue
            saveDB();
            alert("บันทึกรายงานผู้เข้าปฏิบัติงานรายวันเรียบร้อยแล้ว!");
        });
    }

    const btnAddWorkerPool = document.getElementById('btn-add-worker-pool');
    const inputNewWorkerName = document.getElementById('input-new-worker-name');

    const addWorkerPoolFunc = () => {
        if (!inputNewWorkerName) return;
        const name = inputNewWorkerName.value.trim();
        if (!name) return;
        if (db.workers.includes(name)) {
            alert("ชื่อพนักงานนี้มีอยู่แล้วในระบบ");
            return;
        }
        db.workers.push(name);
        inputNewWorkerName.value = "";
        saveDB();
        alert(`เพิ่ม "${name}" เข้าสู่ฐานข้อมูลระบบเรียบร้อย`);
    };

    if (btnAddWorkerPool && inputNewWorkerName) {
        btnAddWorkerPool.addEventListener('click', addWorkerPoolFunc);
        inputNewWorkerName.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addWorkerPoolFunc();
            }
        });
    }

    // ==========================================
    // 6. Data Exporters & Screenshot Utilities
    // ==========================================
    
    function downloadCSV(filename, csvContent) {
        const BOM = "\uFEFF";
        const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function exportPlanToExcel() {
        let csv = "ชื่อโครงการ,วันที่เริ่มต้น,วันที่สิ้นสุด,จำนวนห้องทั้งหมด,จำนวนห้องที่เสร็จ,เปอร์เซ็นต์ความคืบหน้า\n";
        db.projects.forEach(proj => {
            const total = proj.rooms.length;
            const completed = proj.rooms.filter(r => r.status === 'completed').length;
            const nonSkipped = proj.rooms.filter(r => r.status !== 'skipped').length;
            const progressPct = nonSkipped > 0 ? Math.round((completed / nonSkipped) * 100) : 0;
            const name = `"${proj.name.replace(/"/g, '""')}"`;
            csv += `${name},${proj.startDate},${proj.endDate},${total},${completed},${progressPct}%\n`;
        });
        downloadCSV("floor-tech-projects.csv", csv);
    }

    function exportRoomsToExcel() {
        const proj = db.projects.find(p => p.id === selectedProjectId);
        if (!proj) {
            alert("ไม่พบข้อมูลโครงการที่กำลังแสดงเพื่อส่งออก");
            return;
        }
        let csv = `รายชื่อห้องพักในโครงการ: ${proj.name}\n`;
        csv += "เลขห้อง,สถานะ,ช่างผู้รับผิดชอบ,วันที่อัปเดตล่าสุด,บันทึกเพิ่มเติม\n";
        
        const sortedRooms = [...proj.rooms].sort((a, b) => a.roomNo.localeCompare(b.roomNo, undefined, {numeric: true, sensitivity: 'base'}));
        sortedRooms.forEach(room => {
            let statusText = "ยังไม่ทำ";
            if (room.status === 'progress') statusText = "กำลังปู";
            else if (room.status === 'inspect') statusText = "รอตรวจ";
            else if (room.status === 'completed') statusText = "เสร็จสิ้น";
            else if (room.status === 'issue') statusText = "มีปัญหา";
            else if (room.status === 'skipped') statusText = "ข้ามงาน";
            
            const worker = `"${(room.worker || '').replace(/"/g, '""')}"`;
            const note = `"${(room.note || '').replace(/"/g, '""')}"`;
            csv += `${room.roomNo},${statusText},${worker},${room.lastUpdated || '-'},${note}\n`;
        });
        downloadCSV(`rooms_${proj.name.replace(/\s+/g, '_')}.csv`, csv);
    }

    function exportDailyLogsToExcel() {
        const proj = db.projects.find(p => p.id === selectedDailyProjId);
        const namePrefix = proj ? proj.name : "all_projects";
        let csv = "วันที่,เวลา,โครงการ,ช่างผู้ทำงาน,รายละเอียดการปฏิบัติงาน\n";
        
        const filteredLogs = db.logs.filter(l => !selectedDailyProjId || l.projectId === selectedDailyProjId);
        filteredLogs.sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
        
        filteredLogs.forEach(log => {
            const dateParts = log.date.split('-');
            const displayDate = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}/${parseInt(dateParts[0]) + 543}` : log.date;
            const pName = `"${(log.projectName || '').replace(/"/g, '""')}"`;
            const worker = `"${(log.worker || '').replace(/"/g, '""')}"`;
            const note = `"${(log.note || '').replace(/"/g, '""')}"`;
            csv += `${displayDate},${log.time || ''},${pName},${worker},${note}\n`;
        });
        downloadCSV(`daily_logs_${namePrefix.replace(/\s+/g, '_')}.csv`, csv);
    }

    function exportIssuesToExcel() {
        let csv = "โครงการ,เลขห้อง,วันที่แจ้ง,ผู้รายงาน,สถานะ,รายละเอียดปัญหา,แนวทางการแก้ไข,วันที่แก้ไขสำเร็จ\n";
        
        const sortedIssues = [...db.issues].sort((a,b) => {
            if (a.status === b.status) return b.date.localeCompare(a.date);
            return a.status === 'pending' ? -1 : 1;
        });
        
        sortedIssues.forEach(issue => {
            const repParts = issue.date.split('-');
            const displayRepDate = repParts.length === 3 ? `${repParts[2]}/${repParts[1]}/${parseInt(repParts[0])+543}` : issue.date;
            
            let resDateStr = "-";
            if (issue.resolveDate) {
                const resParts = issue.resolveDate.split('-');
                resDateStr = resParts.length === 3 ? `${resParts[2]}/${resParts[1]}/${parseInt(resParts[0])+543}` : issue.resolveDate;
            }
            
            const statusText = issue.status === 'pending' ? "กำลังแก้ไข" : "แก้ไขเสร็จสิ้น";
            const pName = `"${(issue.projectName || '').replace(/"/g, '""')}"`;
            const reporter = `"${(issue.reportedBy || '').replace(/"/g, '""')}"`;
            const desc = `"${(issue.desc || '').replace(/"/g, '""')}"`;
            const solution = `"${(issue.solution || '').replace(/"/g, '""')}"`;
            
            csv += `${pName},${issue.roomNo},${displayRepDate},${reporter},${statusText},${desc},${solution},${resDateStr}\n`;
        });
        downloadCSV("issues_report.csv", csv);
    }

    function exportDataSummaryToExcel() {
        let csv = "หัวข้อ,จำนวนรายการ\n";
        csv += `จำนวนโครงการทั้งหมด,${db.projects.length}\n`;
        csv += `จำนวนห้องทั้งหมดทุกโครงการ,${db.projects.reduce((acc, p) => acc + p.rooms.length, 0)}\n`;
        csv += `จำนวนบันทึกงานรายวันทั้งหมด,${db.logs.length}\n`;
        csv += `จำนวนปัญหาทั้งหมดที่พบ,${db.issues.length}\n`;
        csv += `จำนวนช่าง/พนักงานในระบบ,${db.workers.length}\n`;
        downloadCSV("floortech_database_summary.csv", csv);
    }

    function exportTabToJPG(tabId) {
        const tabElement = document.getElementById(tabId);
        if (!tabElement) return;
        
        const exportBar = tabElement.querySelector('.export-actions-group');
        if (exportBar) exportBar.style.visibility = 'hidden';
        
        // Save original style properties to restore later
        const originalAnimation = tabElement.style.animation;
        const originalOpacity = tabElement.style.opacity;
        const originalTransform = tabElement.style.transform;
        
        // Override animations/opacity to capture solid colors at 100% visibility
        tabElement.style.animation = 'none';
        tabElement.style.opacity = '1';
        tabElement.style.transform = 'none';
        
        const options = {
            useCORS: true,
            allowTaint: true,
            scale: 2,
            backgroundColor: '#f1f5f9'
        };
        
        html2canvas(tabElement, options).then(canvas => {
            if (exportBar) exportBar.style.visibility = 'visible';
            
            // Restore original style properties
            tabElement.style.animation = originalAnimation;
            tabElement.style.opacity = originalOpacity;
            tabElement.style.transform = originalTransform;
            
            const imgData = canvas.toDataURL('image/jpeg', 1.0); // Save at maximum quality
            const dlLink = document.createElement('a');
            dlLink.download = `${tabId}_screenshot.jpg`;
            dlLink.href = imgData;
            dlLink.style.display = 'none';
            document.body.appendChild(dlLink);
            dlLink.click();
            document.body.removeChild(dlLink);
        }).catch(err => {
            console.error("Capture failed: ", err);
            if (exportBar) exportBar.style.visibility = 'visible';
            
            // Restore original style properties in case of error
            tabElement.style.animation = originalAnimation;
            tabElement.style.opacity = originalOpacity;
            tabElement.style.transform = originalTransform;
            
            alert("ไม่สามารถบันทึกรูปภาพได้ในขณะนี้");
        });
    }

    // Setup Export Action Event Listeners
    document.querySelectorAll('.btn-export-excel').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            if (tab === 'tab-plan') exportPlanToExcel();
            else if (tab === 'tab-rooms') exportRoomsToExcel();
            else if (tab === 'tab-daily') exportDailyLogsToExcel();
            else if (tab === 'tab-issues') exportIssuesToExcel();
            else if (tab === 'tab-data') exportDataSummaryToExcel();
        });
    });

    document.querySelectorAll('.btn-export-pdf').forEach(btn => {
        btn.addEventListener('click', () => {
            window.print();
        });
    });

    document.querySelectorAll('.btn-export-jpg').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            exportTabToJPG(tab);
        });
    });

    updateDashboardMetrics();
    updatePageHeader();
    setTodayDates();
    renderActiveTab();
});
