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
                startMonth: 4, // April
                endMonth: 10,  // October
                dueDate: "2026-10-31",
                totalRooms: 48,
                rooms: [] // Will be populated dynamically on load
            },
            {
                id: "proj-2",
                name: "Premium Office Tower (ชั้น 5-8)",
                startMonth: 6, // June
                endMonth: 12, // December
                dueDate: "2026-12-15",
                totalRooms: 30,
                rooms: []
            }
        ],
        logs: [
            {
                id: "log-1",
                date: "2026-06-04",
                worker: "สมพงษ์ แก้วมี",
                projectId: "proj-1",
                projectName: "Condo Grand Ville (อาคาร A)",
                roomNo: "101",
                type: "lay",
                status: "completed",
                issue: "",
                time: "09:15"
            },
            {
                id: "log-2",
                date: "2026-06-04",
                worker: "สมพงษ์ แก้วมี",
                projectId: "proj-1",
                projectName: "Condo Grand Ville (อาคาร A)",
                roomNo: "102",
                type: "lay",
                status: "completed",
                issue: "",
                time: "10:45"
            },
            {
                id: "log-3",
                date: "2026-06-04",
                worker: "สมพงษ์ แก้วมี",
                projectId: "proj-1",
                projectName: "Condo Grand Ville (อาคาร A)",
                roomNo: "103",
                type: "lay",
                status: "completed",
                issue: "",
                time: "14:20"
            },
            {
                id: "log-4",
                date: "2026-06-04",
                worker: "มานะ อดทน",
                projectId: "proj-1",
                projectName: "Condo Grand Ville (อาคาร A)",
                roomNo: "104",
                type: "lay",
                status: "inspect",
                issue: "",
                time: "15:00"
            },
            {
                id: "log-5",
                date: "2026-06-04",
                worker: "ชาตรี ดีเลิศ",
                projectId: "proj-1",
                projectName: "Condo Grand Ville (อาคาร A)",
                roomNo: "105",
                type: "lay",
                status: "progress",
                issue: "",
                time: "11:30"
            },
            {
                id: "log-6",
                date: "2026-06-04",
                worker: "วิชัย ไกลทอง",
                projectId: "proj-1",
                projectName: "Condo Grand Ville (อาคาร A)",
                roomNo: "106",
                type: "lay",
                status: "delayed",
                issue: "ความชื้นปูนรองพื้นมีค่า 9.5% เกินเกณฑ์มาตรฐาน เนื่องจากตรวจพบท่อน้ำระบบชำรุดใต้พื้น ต้องรอช่างแก้ไข",
                time: "10:00"
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
        ]
    };

    // Global Database Object
    let db = {
        projects: [],
        logs: [],
        issues: []
    };

    // Current app state pointers
    let activeTab = "tab-plan";
    let selectedProjectId = "";
    let roomFilter = "all";

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
        
        // Safety checks to ensure rooms exist
        db.projects.forEach(proj => {
            if (!proj.rooms || proj.rooms.length === 0) {
                proj.rooms = generateRoomList(proj.totalRooms);
            }
        });
        
        // Seed specific completed rooms for Project 1 (Rooms 101, 102, 103 completed)
        // Project 1 details per requirement
        const proj1 = db.projects.find(p => p.id === "proj-1");
        if (proj1 && proj1.rooms.length > 0) {
            // Room 101
            if (proj1.rooms.find(r => r.roomNo === "101").status === 'pending') {
                proj1.rooms.find(r => r.roomNo === "101").status = 'completed';
                proj1.rooms.find(r => r.roomNo === "101").worker = 'สมพงษ์ แก้วมี';
                proj1.rooms.find(r => r.roomNo === "101").lastUpdated = '2026-06-04';
            }
            // Room 102
            if (proj1.rooms.find(r => r.roomNo === "102").status === 'pending') {
                proj1.rooms.find(r => r.roomNo === "102").status = 'completed';
                proj1.rooms.find(r => r.roomNo === "102").worker = 'สมพงษ์ แก้วมี';
                proj1.rooms.find(r => r.roomNo === "102").lastUpdated = '2026-06-04';
            }
            // Room 103
            if (proj1.rooms.find(r => r.roomNo === "103").status === 'pending') {
                proj1.rooms.find(r => r.roomNo === "103").status = 'completed';
                proj1.rooms.find(r => r.roomNo === "103").worker = 'สมพงษ์ แก้วมี';
                proj1.rooms.find(r => r.roomNo === "103").lastUpdated = '2026-06-04';
            }
            // Room 104
            if (proj1.rooms.find(r => r.roomNo === "104").status === 'pending') {
                proj1.rooms.find(r => r.roomNo === "104").status = 'inspect';
                proj1.rooms.find(r => r.roomNo === "104").worker = 'มานะ อดทน';
                proj1.rooms.find(r => r.roomNo === "104").lastUpdated = '2026-06-04';
            }
            // Room 105
            if (proj1.rooms.find(r => r.roomNo === "105").status === 'pending') {
                proj1.rooms.find(r => r.roomNo === "105").status = 'progress';
                proj1.rooms.find(r => r.roomNo === "105").worker = 'ชาตรี ดีเลิศ';
                proj1.rooms.find(r => r.roomNo === "105").lastUpdated = '2026-06-04';
            }
            // Room 106
            if (proj1.rooms.find(r => r.roomNo === "106").status === 'pending') {
                proj1.rooms.find(r => r.roomNo === "106").status = 'issue';
                proj1.rooms.find(r => r.roomNo === "106").worker = 'วิชัย ไกลทอง';
                proj1.rooms.find(r => r.roomNo === "106").note = 'ความชื้นสะสมรองพื้นสูง 9.5%';
                proj1.rooms.find(r => r.roomNo === "106").lastUpdated = '2026-06-04';
            }
        }
        
        // Project 2 seed updates
        const proj2 = db.projects.find(p => p.id === "proj-2");
        if (proj2 && proj2.rooms.length > 0) {
            if (proj2.rooms.find(r => r.roomNo === "101").status === 'pending') {
                proj2.rooms.find(r => r.roomNo === "101").status = 'completed';
                proj2.rooms.find(r => r.roomNo === "101").worker = 'สมพงษ์ แก้วมี';
                proj2.rooms.find(r => r.roomNo === "101").lastUpdated = '2026-06-03';
            }
        }

        saveDB(false); // Silent save just in case seeds run
        
        if (db.projects.length > 0 && !selectedProjectId) {
            selectedProjectId = db.projects[0].id;
        }
    }

    function seedDefaultDB() {
        db = JSON.parse(JSON.stringify(DEFAULT_SEED_DATA)); // Deep clone
        db.projects.forEach(proj => {
            proj.rooms = generateRoomList(proj.totalRooms);
        });
        saveDB();
    }

    function saveDB(render = true) {
        localStorage.setItem('floortech_db', JSON.stringify(db));
        if (render) {
            updateDashboardMetrics();
            renderActiveTab();
        }
    }

    // Set today's date in Date fields on forms
    function setTodayDates() {
        const todayStr = new Date().toISOString().split('T')[0];
        const logDateInput = document.getElementById('log-date');
        const projDueDateInput = document.getElementById('project-due-date');
        if (logDateInput) logDateInput.value = todayStr;
        if (projDueDateInput) projDueDateInput.value = todayStr;
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
            
            // Remove active from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active to current
            item.classList.add('active');
            
            // Hide all tab sections
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            
            // Show current tab section
            activeTab = item.getAttribute('data-tab');
            document.getElementById(activeTab).classList.add('active');
            
            // Update Page Header details
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
            headerTitle.textContent = "รายละเอียดและผังห้องพัก";
            headerBtn.style.display = "flex";
            headerBtn.querySelector('span').textContent = "อัพเดทห้องพัก";
            
            // Click to trigger room manager on selected project's first room or open general modal
            headerBtn.onclick = () => {
                const currentProj = db.projects.find(p => p.id === selectedProjectId);
                if (currentProj && currentProj.rooms.length > 0) {
                    // Populate and open with first room
                    openRoomManager(currentProj.id, currentProj.rooms[0].roomNo);
                }
            };
        } else if (activeTab === "tab-daily") {
            headerTitle.textContent = "การปฏิบัติงานรายวัน";
            headerBtn.style.display = "none";
        } else if (activeTab === "tab-issues") {
            headerTitle.textContent = "การจัดการปัญหาที่เกิดขึ้น";
            headerBtn.style.display = "none";
        } else if (activeTab === "tab-data") {
            headerTitle.textContent = "จัดการฐานข้อมูลและตั้งค่า";
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
            totalRooms += p.totalRooms;
            completedRooms += p.rooms.filter(r => r.status === 'completed').length;
        });

        const pendingIssues = db.issues.filter(i => i.status === 'pending').length;

        // Inject into HTML elements
        document.getElementById('stat-total-projects').textContent = totalProjects;
        document.getElementById('stat-total-rooms').textContent = totalRooms;
        document.getElementById('stat-completed-rooms').textContent = completedRooms;
        document.getElementById('stat-pending-issues').textContent = pendingIssues;
    }

    // RENDER TAB 1: Plan and Timelines
    function renderPlanTab() {
        const container = document.getElementById('timeline-project-rows');
        const tbody = document.getElementById('project-list-tbody');
        
        container.innerHTML = "";
        tbody.innerHTML = "";

        if (db.projects.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 20px;">ไม่มีโปรเจ็กต์ในระบบในขณะนี้ กด "เพิ่มโปรเจ็กต์ใหม่" ด้านบนเพื่อเริ่มสร้าง</div>`;
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">ไม่มีข้อมูลโครงการ</td></tr>`;
            return;
        }

        db.projects.forEach(proj => {
            // Calculation completion progress
            const completed = proj.rooms.filter(r => r.status === 'completed').length;
            const progressPct = proj.totalRooms > 0 ? Math.round((completed / proj.totalRooms) * 100) : 0;

            // Month lists mapping
            const thaiMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
            const startText = thaiMonths[proj.startMonth - 1];
            const endText = thaiMonths[proj.endMonth - 1];

            // 1. Draw Gantt Row
            const rowDiv = document.createElement('div');
            rowDiv.className = 'timeline-row';
            
            // Grid columns start/end. Since months are 1-12, grid columns are 1 to 13.
            // Let's compute grid styles for duration bar
            const colStart = proj.startMonth;
            const colEnd = proj.endMonth + 1; // span ends at start of next month column
            
            rowDiv.innerHTML = `
                <div class="project-meta-info">
                    <span class="project-meta-name" data-id="${proj.id}">${proj.name}</span>
                    <span class="project-meta-duration">${startText} - ${endText} | เสร็จสิ้น ${progressPct}%</span>
                </div>
                <div class="timeline-bar-wrapper">
                    <div class="timeline-bar" style="grid-column: ${colStart} / ${colEnd};" data-id="${proj.id}">
                        <div class="timeline-bar-progress" style="width: ${progressPct}%"></div>
                        <div class="timeline-bar-text">${progressPct}% (${completed}/${proj.totalRooms} ห้อง)</div>
                    </div>
                </div>
            `;
            
            // Add click listener to navigate to this project's room grid
            const clickHandler = () => {
                selectedProjectId = proj.id;
                // Switch active tab programmatically
                navItems.forEach(n => {
                    if (n.getAttribute('data-tab') === "tab-rooms") {
                        n.click();
                    }
                });
            };
            rowDiv.querySelector('.project-meta-name').addEventListener('click', clickHandler);
            rowDiv.querySelector('.timeline-bar').addEventListener('click', clickHandler);

            container.appendChild(rowDiv);

            // 2. Draw Table Rows
            const tr = document.createElement('tr');
            
            // Date formatting
            const dateParts = proj.dueDate.split('-');
            const displayDueDate = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}/${parseInt(dateParts[0])+543}` : proj.dueDate; // TH format

            tr.innerHTML = `
                <td><strong style="color: var(--accent); cursor:pointer;" class="proj-link">${proj.name}</strong></td>
                <td>${proj.totalRooms} ห้อง</td>
                <td>${startText} - ${endText}</td>
                <td>${displayDueDate}</td>
                <td>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <div style="flex-grow:1; background:rgba(255,255,255,0.05); height:8px; border-radius:4px; overflow:hidden; min-width:80px;">
                            <div style="width:${progressPct}%; background:linear-gradient(to right, #10b981, #06b6d4); height:100%;"></div>
                        </div>
                        <span>${progressPct}%</span>
                    </div>
                </td>
                <td>
                    <button class="btn btn-sm btn-danger btn-delete-project" data-id="${proj.id}">ลบ</button>
                </td>
            `;

            tr.querySelector('.proj-link').addEventListener('click', clickHandler);
            tr.querySelector('.btn-delete-project').addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm(`คุณต้องการลบโปรเจ็กต์ "${proj.name}" และข้อมูลที่เกี่ยวข้องทั้งหมดใช่หรือไม่? (การดำเนินการนี้ไม่สามารถย้อนกลับได้)`)) {
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
        
        // 1. Populate Dropdown Select
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
            return;
        }

        db.projects.forEach(proj => {
            const opt = document.createElement('option');
            opt.value = proj.id;
            opt.textContent = proj.name;
            if (proj.id === currentSelVal) opt.selected = true;
            select.appendChild(opt);
        });

        // Set state pointer
        if (select.value) {
            selectedProjectId = select.value;
        }

        // Fetch selected project object
        const activeProj = db.projects.find(p => p.id === selectedProjectId);
        if (!activeProj) return;

        // 2. Render Side Dashboard Stats
        document.getElementById('side-panel-project-name').textContent = activeProj.name;
        
        const total = activeProj.rooms.length;
        const completed = activeProj.rooms.filter(r => r.status === 'completed').length;
        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

        document.getElementById('side-progress-percent').textContent = `${pct}%`;
        document.getElementById('side-progress-ratio').textContent = `ปูพื้นเสร็จแล้ว ${completed} จาก ${total} ห้อง`;

        // Update circular SVG donut chart
        const donutCircle = document.getElementById('side-progress-donut');
        if (donutCircle) {
            // Circumference of r=60 circle is 2 * PI * 60 = ~377
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
            issue: activeProj.rooms.filter(r => r.status === 'issue').length
        };

        Object.keys(counts).forEach(key => {
            const elem = document.getElementById(`count-${key}`);
            if (elem) elem.textContent = counts[key];
        });

        // Lists of completed vs remaining
        const completedRoomsList = activeProj.rooms.filter(r => r.status === 'completed').map(r => r.roomNo);
        document.getElementById('side-completed-list').textContent = completedRoomsList.length > 0 ? completedRoomsList.join(', ') : "ยังไม่มีห้องที่ปูพื้นเสร็จสิ้น";

        const remainingRoomsList = activeProj.rooms.filter(r => r.status !== 'completed').map(r => r.roomNo);
        document.getElementById('side-remaining-list').textContent = remainingRoomsList.length > 0 ? remainingRoomsList.join(', ') : "ปูพื้นเสร็จสิ้นครบทุกห้องแล้ว!";

        // 3. Render Grid of Rooms
        gridContainer.innerHTML = "";
        document.getElementById('room-grid-title-count').textContent = total;

        activeProj.rooms.forEach(room => {
            // Filter logic
            if (roomFilter !== 'all' && room.status !== roomFilter) {
                return; // skip rendering
            }

            const roomCard = document.createElement('div');
            roomCard.className = `room-card status-${room.status}`;
            roomCard.setAttribute('data-room-no', room.roomNo);
            
            let statusText = "รอดำเนินการ";
            if (room.status === 'progress') statusText = "กำลังปู";
            else if (room.status === 'inspect') statusText = "รอตรวจ";
            else if (room.status === 'completed') statusText = "เสร็จสิ้น";
            else if (room.status === 'issue') statusText = "มีปัญหา";

            roomCard.innerHTML = `
                <span>${room.roomNo}</span>
                <span class="room-card-status">${statusText}</span>
            `;

            // Hover tooltip details
            let tooltip = `เลขห้อง: ${room.roomNo}\nสถานะ: ${statusText}`;
            if (room.worker) tooltip += `\nผู้ทำงาน: ${room.worker}`;
            if (room.lastUpdated) tooltip += `\nอัปเดตเมื่อ: ${room.lastUpdated}`;
            if (room.note) tooltip += `\nบันทึก: ${room.note}`;
            roomCard.title = tooltip;

            // Click room grid to edit details
            roomCard.addEventListener('click', () => {
                // Highlight visual select
                document.querySelectorAll('.room-card').forEach(c => c.classList.remove('selected'));
                roomCard.classList.add('selected');
                
                openRoomManager(activeProj.id, room.roomNo);
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

    // RENDER TAB 3: Daily Activity Log
    function renderDailyTab() {
        const formSelect = document.getElementById('log-project');
        const feedContainer = document.getElementById('daily-activity-feed');
        
        // 1. Populate log-form project selection
        formSelect.innerHTML = `<option value="" disabled selected>-- เลือกโครงการ --</option>`;
        db.projects.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.textContent = p.name;
            formSelect.appendChild(opt);
        });

        // 2. Clear & Render Logs
        feedContainer.innerHTML = "";
        
        const filterDateVal = document.getElementById('filter-log-date').value;
        let filteredLogs = db.logs;
        
        if (filterDateVal) {
            filteredLogs = db.logs.filter(l => l.date === filterDateVal);
        }

        // Sort descending by date and time
        filteredLogs.sort((a, b) => {
            const valA = `${a.date}T${a.time || '00:00'}`;
            const valB = `${b.date}T${b.time || '00:00'}`;
            return valB.localeCompare(valA);
        });

        if (filteredLogs.length === 0) {
            feedContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 40px 0;">ไม่มีรายงานการทำงานในวันที่ระบุ</div>`;
            return;
        }

        filteredLogs.forEach(log => {
            const li = document.createElement('div');
            li.className = `activity-item act-${log.status}`;

            let typeText = "งานปูพื้นทั่วไป";
            if (log.type === "inspect") typeText = "ตรวจรับงานปูพื้น";
            else if (log.type === "fix") typeText = "แก้ไขงานปูพื้น";

            let statusBadgeClass = "pending";
            let statusText = "อยู่ระหว่างดำเนินงาน";
            if (log.status === "completed") { statusBadgeClass = "completed"; statusText = "ผ่านการตรวจสอบ"; }
            else if (log.status === "inspect") { statusBadgeClass = "inspect"; statusText = "รอกรรมการตรวจ"; }
            else if (log.status === "delayed") { statusBadgeClass = "issue"; statusText = "ติดปัญหาล่าช้า"; }

            // Date format display
            const dParts = log.date.split('-');
            const displayDate = dParts.length === 3 ? `${dParts[2]}/${dParts[1]}/${parseInt(dParts[0])+543}` : log.date;

            li.innerHTML = `
                <div class="activity-details">
                    <span class="activity-title">${log.worker} • ห้อง ${log.roomNo}</span>
                    <span class="activity-subtitle">${log.projectName} | ${typeText}</span>
                    ${log.issue ? `<div class="activity-issue-text"><strong>เหตุขัดข้อง:</strong> ${log.issue}</div>` : ''}
                </div>
                <div class="activity-meta">
                    <span class="status-badge ${statusBadgeClass}">${statusText}</span>
                    <span class="activity-time">${displayDate} ${log.time || ''} น.</span>
                </div>
            `;
            feedContainer.appendChild(li);
        });
    }

    // Handle Log status input change to display/hide delayed details
    document.getElementById('log-status').addEventListener('change', (e) => {
        const delayGroup = document.getElementById('log-delay-reason-group');
        if (e.target.value === 'delayed') {
            delayGroup.style.display = 'flex';
            document.getElementById('log-delay-reason').setAttribute('required', 'true');
        } else {
            delayGroup.style.display = 'none';
            document.getElementById('log-delay-reason').removeAttribute('required');
        }
    });

    // Handle daily logs list date filter
    document.getElementById('filter-log-date').addEventListener('change', renderDailyTab);
    document.getElementById('btn-clear-date-filter').addEventListener('click', () => {
        document.getElementById('filter-log-date').value = "";
        renderDailyTab();
    });

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

        // Sort: pending first, then date descending
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

            // Thai Date format
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
                    <span class="status-badge ${badgeClass}">${badgeText}</span>
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

            // Action button bind
            const btnResolve = card.querySelector('.btn-resolve-issue');
            if (btnResolve) {
                btnResolve.addEventListener('click', () => {
                    openIssueResolver(issue.id);
                });
            }

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

    // Action A: Delete Project
    function deleteProject(projId) {
        db.projects = db.projects.filter(p => p.id !== projId);
        // Clean corresponding logs/issues too
        db.logs = db.logs.filter(l => l.projectId !== projId);
        db.issues = db.issues.filter(i => i.projectId !== projId);
        
        // Reset selections
        if (selectedProjectId === projId) {
            selectedProjectId = db.projects.length > 0 ? db.projects[0].id : "";
        }
        saveDB();
    }

    // Action B: Add Project Submit
    document.getElementById('form-add-project').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('project-name').value;
        const totalRooms = parseInt(document.getElementById('project-total-rooms').value);
        const startMonth = parseInt(document.getElementById('project-start-month').value);
        const endMonth = parseInt(document.getElementById('project-end-month').value);
        const dueDate = document.getElementById('project-due-date').value;

        if (startMonth > endMonth) {
            alert("คำเตือน: เดือนเริ่มต้นต้องไม่ระบุทีหลังเดือนสิ้นสุดโครงการ");
            return;
        }

        const newId = `proj-${Date.now()}`;
        const newProj = {
            id: newId,
            name: name,
            startMonth: startMonth,
            endMonth: endMonth,
            dueDate: dueDate,
            totalRooms: totalRooms,
            rooms: generateRoomList(totalRooms)
        };

        db.projects.push(newProj);
        selectedProjectId = newId;

        // Reset Form & Close
        e.target.reset();
        closeModal('modal-add-project');
        
        // Save & Redraw
        saveDB();
    });

    // Action C: Open Room Manager Modal
    function openRoomManager(projectId, roomNo) {
        const proj = db.projects.find(p => p.id === projectId);
        if (!proj) return;
        
        const room = proj.rooms.find(r => r.roomNo === roomNo);
        if (!room) return;

        // Set inputs fields values
        document.getElementById('room-manage-project-id').value = projectId;
        document.getElementById('room-manage-room-no').value = roomNo;
        document.getElementById('room-manager-title').textContent = `${proj.name} — จัดการห้อง ${roomNo}`;
        document.getElementById('room-manage-status').value = room.status;
        document.getElementById('room-manage-worker').value = room.worker || "";
        document.getElementById('room-manage-note').value = room.note || "";
        
        // Handle issue panel presentation
        const issuePanel = document.getElementById('room-manage-issue-panel');
        const issueDescInput = document.getElementById('room-manage-issue-desc');
        
        issueDescInput.value = "";
        if (room.status === 'issue') {
            issuePanel.style.display = 'block';
            // Pre-fill with existing issue if exists
            const relatedIssue = db.issues.find(i => i.projectId === projectId && i.roomNo === roomNo && i.status === 'pending');
            if (relatedIssue) {
                issueDescInput.value = relatedIssue.desc;
            }
        } else {
            issuePanel.style.display = 'none';
        }

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

    // Action D: Update Room Details Submit
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
        const todayStr = new Date().toISOString().split('T')[0];
        const currentTimeStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });

        // Apply changes
        room.status = status;
        room.worker = worker;
        room.note = note;
        room.lastUpdated = todayStr;

        // Handle issue lifecycle logic
        if (status === 'issue') {
            const desc = document.getElementById('room-manage-issue-desc').value;
            // Check if there is already an active issue reported for this room
            const existingIssue = db.issues.find(i => i.projectId === projectId && i.roomNo === roomNo && i.status === 'pending');
            if (existingIssue) {
                existingIssue.desc = desc; // update
                existingIssue.reportedBy = worker || "พนักงานควบคุมงาน";
            } else {
                // Add new issue
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
            // If they changed status from issue to something else, resolve active issues
            const activeIssues = db.issues.filter(i => i.projectId === projectId && i.roomNo === roomNo && i.status === 'pending');
            activeIssues.forEach(i => {
                i.status = 'resolved';
                i.solution = `ปรับปรุงแก้ไขสถานะการปูพื้นเป็น: ${status} ผ่านโมดูลจัดการรายห้อง`;
                i.resolveDate = todayStr;
            });
        }

        // Add corresponding daily activity record automatically
        let typeAction = 'lay';
        if (status === 'inspect') typeAction = 'inspect';
        else if (status === 'completed') typeAction = 'inspect';
        else if (status === 'issue') typeAction = 'fix';

        db.logs.push({
            id: `log-${Date.now()}`,
            date: todayStr,
            time: currentTimeStr,
            worker: worker || "ระบบอัพเดทอัตโนมัติ",
            projectId: projectId,
            projectName: proj.name,
            roomNo: roomNo,
            type: typeAction,
            status: status === 'issue' ? 'delayed' : status,
            issue: status === 'issue' ? document.getElementById('room-manage-issue-desc').value : note
        });

        // Close Modal & Save
        closeModal('modal-room-manager');
        saveDB();
    });

    // Action E: Add Daily Work Log Submit
    document.getElementById('daily-log-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const worker = document.getElementById('log-worker').value;
        const projectId = document.getElementById('log-project').value;
        const roomNo = document.getElementById('log-room').value.trim();
        const type = document.getElementById('log-type').value;
        const status = document.getElementById('log-status').value;
        const delayReason = document.getElementById('log-delay-reason').value;
        const date = document.getElementById('log-date').value;
        const currentTimeStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });

        const proj = db.projects.find(p => p.id === projectId);
        if (!proj) {
            alert("เกิดข้อผิดพลาด: ไม่พบโปรเจ็กต์ที่ระบุ");
            return;
        }

        // Validate if room exists in selected project
        let room = proj.rooms.find(r => r.roomNo === roomNo);
        
        // If room does not exist (e.g. they typed room 707 and project only has 48 rooms), we ask or just add it dynamically
        if (!room) {
            if (confirm(`ไม่พบเลขห้อง ${roomNo} ในข้อมูลดั้งเดิมของโครงการ ต้องการสร้างห้องปูพื้นใหม่นี้เป็นกรณีพิเศษใช่หรือไม่?`)) {
                room = {
                    roomNo: roomNo,
                    status: 'pending',
                    worker: '',
                    note: '',
                    lastUpdated: ''
                };
                proj.rooms.push(room);
                proj.totalRooms = proj.rooms.length; // Increment total rooms count
            } else {
                return; // cancel
            }
        }

        // 1. Log Activity Record
        db.logs.push({
            id: `log-${Date.now()}`,
            date: date,
            time: currentTimeStr,
            worker: worker,
            projectId: projectId,
            projectName: proj.name,
            roomNo: roomNo,
            type: type,
            status: status,
            issue: status === 'delayed' ? delayReason : ''
        });

        // 2. Synchronize status of the Room
        let syncedRoomStatus = 'progress';
        if (status === 'completed') syncedRoomStatus = 'completed';
        else if (status === 'inspect') syncedRoomStatus = 'inspect';
        else if (status === 'delayed') syncedRoomStatus = 'issue';

        room.status = syncedRoomStatus;
        room.worker = worker;
        room.lastUpdated = date;
        if (status === 'delayed') {
            room.note = `ล่าช้า: ${delayReason}`;
            
            // Add issue tracking entry
            db.issues.push({
                id: `issue-${Date.now()}`,
                projectId: projectId,
                projectName: proj.name,
                roomNo: roomNo,
                desc: `[รายงานรายวัน] ${delayReason}`,
                reportedBy: worker,
                date: date,
                status: 'pending',
                solution: '',
                resolveDate: ''
            });
        } else {
            room.note = `อัปเดตจากรายงานรายวัน (${type === 'lay' ? 'ปูพื้น' : type === 'inspect' ? 'ตรวจงาน' : 'ซ่อมแซม'})`;
        }

        // Clear Form, Save & Re-render
        e.target.reset();
        setTodayDates();
        document.getElementById('log-delay-reason-group').style.display = 'none';
        
        saveDB();
        alert("บันทึกการรายงานรายวันสำเร็จ!");
    });

    // Action F: Open Issue Resolver Modal
    function openIssueResolver(issueId) {
        const issue = db.issues.find(i => i.id === issueId);
        if (!issue) return;

        document.getElementById('issue-resolve-id').value = issueId;
        document.getElementById('issue-resolve-desc').textContent = `${issue.projectName} ห้อง ${issue.roomNo}: "${issue.desc}"`;
        document.getElementById('issue-resolve-solution').value = issue.solution || "";
        document.getElementById('issue-resolve-status').value = "resolved";

        openModal('modal-issue-manager');
    }

    // Action G: Issue Resolve Submit
    document.getElementById('form-resolve-issue').addEventListener('submit', (e) => {
        e.preventDefault();

        const issueId = document.getElementById('issue-resolve-id').value;
        const solution = document.getElementById('issue-resolve-solution').value;
        const status = document.getElementById('issue-resolve-status').value;
        
        const issue = db.issues.find(i => i.id === issueId);
        if (!issue) return;

        const todayStr = new Date().toISOString().split('T')[0];
        const currentTimeStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });

        issue.status = status;
        issue.solution = solution;
        issue.resolveDate = todayStr;

        // If status is marked resolved, synchronize the room status to 'inspect' (to be checked by inspector)
        // or keep status as completed if resolved
        if (status === 'resolved') {
            const proj = db.projects.find(p => p.id === issue.projectId);
            if (proj) {
                const room = proj.rooms.find(r => r.roomNo === issue.roomNo);
                if (room && room.status === 'issue') {
                    room.status = 'inspect'; // set to inspect so foreman inspects it
                    room.note = `ได้รับการแก้ไข: ${solution}`;
                    room.lastUpdated = todayStr;
                }
            }

            // Append daily work log log entry
            db.logs.push({
                id: `log-${Date.now()}`,
                date: todayStr,
                time: currentTimeStr,
                worker: "ระบบแก้ไขปัญหา",
                projectId: issue.projectId,
                projectName: issue.projectName,
                roomNo: issue.roomNo,
                type: "fix",
                status: "inspect",
                issue: `แก้ไขเสร็จสิ้น: ${solution}`
            });
        }

        closeModal('modal-issue-manager');
        saveDB();
        alert("บันทึกการแก้ไขปัญหาเรียบร้อย!");
    });


    // ==========================================
    // 5. Initial Boot & UI bindings
    // ==========================================
    
    // Boot operations
    loadDB();
    updateDashboardMetrics();
    updatePageHeader();
    setTodayDates();
    renderActiveTab();
});
