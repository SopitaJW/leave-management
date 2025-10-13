const express = require('express');
const cors = require('cors');
const db = require('./database.js');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// --- API Endpoints (ปรับปรุงใหม่ตาม Schema) ---

// GET: ดึงข้อมูลสรุปการลาของพนักงานคนนั้นๆ
app.get('/api/summary/:employeeId', (req, res) => {
    const { employeeId } = req.params;
    const sql = `
        SELECT
            lt.LeaveTypeName AS name,
            lt.LeaveTypeID AS id,
            le.TotalDays AS quota,
            le.UsedDays AS used,
            le.RemainingDays AS remaining
        FROM LeaveEntitlement le
        JOIN LeaveType lt ON le.LeaveTypeID = lt.LeaveTypeID
        WHERE le.EmployeeID = ? AND le.Year = strftime('%Y', 'now')
    `;
    db.all(sql, [employeeId], (err, rows) => {
        if (err) return res.status(500).json({ "error": err.message });
        res.json({ "data": rows });
    });
});

// GET: ดึงประวัติการลาของพนักงาน (เวอร์ชันใหม่ที่รองรับการกรอง)
app.get('/api/history/:employeeId', (req, res) => {
    const { employeeId } = req.params;
    // ดึงค่า filter จาก query string ?search=...&status=...&type=...
    const { search = '', status = 'All', type = 'All' } = req.query;

    // สร้าง SQL query พื้นฐาน
    let sql = `
        SELECT
            lr.LeaveRequestID AS id,
            lt.LeaveTypeName AS leaveType,
            lr.StartDate,
            lr.EndDate,
            (JULIANDAY(lr.EndDate) - JULIANDAY(lr.StartDate)) + 1 AS days,
            lr.Status,
            lr.Reason,
            lr.RequestDate,
            lr.ApproverComment
        FROM LeaveRequest lr
        JOIN LeaveType lt ON lr.LeaveTypeID = lt.LeaveTypeID
        WHERE lr.EmployeeID = ?
    `;

    const params = [employeeId];

    // เพิ่มเงื่อนไขการค้นหา (Search)
    if (search) {
        sql += ' AND (lr.Reason LIKE ? OR lt.LeaveTypeName LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }

    // เพิ่มเงื่อนไขการกรองสถานะ (Status)
    if (status && status !== 'All') {
        // แปลงค่าจาก Frontend (Approved) เป็นค่าใน DB (อนุมัติแล้ว)
        const statusMap = {
            'Approved': 'อนุมัติแล้ว',
            'Pending': 'รออนุมัติ',
            'Rejected': 'ไม่อนุมัติ'
        };
        sql += ' AND lr.Status = ?';
        params.push(statusMap[status]);
    }
    
    // เพิ่มเงื่อนไขการกรองประเภทการลา (Type)
    if (type && type !== 'All') {
        sql += ' AND lt.LeaveTypeName = ?';
        params.push(type);
    }

    sql += ' ORDER BY lr.RequestDate DESC';

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ "error": err.message });
        res.json({ "data": rows });
    });
});

// POST: สร้างคำร้องการลาใหม่
app.post('/api/request', (req, res) => {
    const { startDate, endDate, reason, employeeId, leaveTypeId } = req.body;

    if (!startDate || !endDate || !reason || !employeeId || !leaveTypeId) {
        return res.status(400).json({ "error": "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const sql = `
        INSERT INTO LeaveRequest (StartDate, EndDate, Reason, RequestDate, EmployeeID, LeaveTypeID, ApproverID)
        VALUES (?, ?, ?, DATE('now'), ?, ?, ?)
    `;
  
    const approverId = 1001; 
    const params = [startDate, endDate, reason, employeeId, leaveTypeId, approverId];

    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ "error": err.message });
        res.status(201).json({ "id": this.lastID });
    });
});

// --- API Endpoints สำหรับ Manager ---

// 1. GET: ดึงข้อมูลคำขอลาทั้งหมดสำหรับหน้า Manager (พร้อม Filter)
app.get('/api/manager/requests', (req, res) => {
    // ดึงค่า filter จาก query string
    const { search = '', type = 'all', status = 'pending' } = req.query;

    let sql = `
        SELECT
            lr.LeaveRequestID AS id,
            emp.FirstName || ' ' || emp.LastName AS employeeName,
            emp.EmployeeID AS employeeId,
            dept.DepartmentName AS department,
            lt.LeaveTypeName AS leaveType,
            lr.StartDate,
            lr.EndDate,
            (JULIANDAY(lr.EndDate) - JULIANDAY(lr.StartDate)) + 1 AS days,
            lr.Reason,
            lr.Status,
            lr.RequestDate,
            lr.ApprovalDate AS approvedDate, -- ใช้ Alias ให้ตรงกับ Frontend
            lr.ApproverComment AS rejectReason -- ใช้ Alias ให้ตรงกับ Frontend
        FROM LeaveRequest lr
        JOIN Employees emp ON lr.EmployeeID = emp.EmployeeID
        JOIN Department dept ON emp.DepartmentID = dept.DepartmentID
        JOIN LeaveType lt ON lr.LeaveTypeID = lt.LeaveTypeID
        WHERE 1=1
    `;
    const params = [];

    // แปลง status ที่ Frontend ใช้ (pending) เป็นค่าใน DB (รออนุมัติ)
    const statusMap = {
        'pending': 'รออนุมัติ',
        'approved': 'อนุมัติแล้ว',
        'rejected': 'ไม่อนุมัติ'
    };
    if (status && statusMap[status]) {
        sql += ' AND lr.Status = ?';
        params.push(statusMap[status]);
    }

    if (type && type !== 'all') {
        sql += ' AND lt.LeaveTypeName = ?';
        params.push(type);
    }
    
    if (search) {
        sql += ' AND (emp.FirstName LIKE ? OR emp.LastName LIKE ? OR emp.EmployeeID LIKE ? OR dept.DepartmentName LIKE ?)';
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    sql += ' ORDER BY lr.RequestDate DESC';

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ "error": err.message });
        res.json({ data: rows });
    });
});

// 2. PUT: อัปเดตสถานะการลา (Approve/Reject) - (เวอร์ชันอัปเกรด)
app.put('/api/manager/requests/:id', (req, res) => {
    const { id } = req.params;
    const { status, comment } = req.body;

    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }

    // --- กรณี "ไม่อนุมัติ" ---
    // ทำงานแบบเดิม คืออัปเดตแค่ตาราง LeaveRequest
    if (status !== 'อนุมัติแล้ว') {
        const sql = `
            UPDATE LeaveRequest
            SET Status = ?, ApproverComment = ?, ApprovalDate = DATE('now')
            WHERE LeaveRequestID = ?
        `;
        db.run(sql, [status, comment, id], function(err) {
            if (err) return res.status(500).json({ "error": err.message });
            if (this.changes === 0) return res.status(404).json({ error: 'Request not found' });
            res.json({ message: 'Leave request updated successfully' });
        });
        return; // จบการทำงานสำหรับเคสนี้
    }
    
    // --- กรณี "อนุมัติแล้ว" ---
    // เราจะใช้ Transaction เพื่ออัปเดต 2 ตารางพร้อมกัน
    db.serialize(() => {
        // 1. เริ่ม Transaction
        db.run('BEGIN TRANSACTION');

        // 2. ดึงข้อมูลที่จำเป็นจาก LeaveRequest (EmployeeID, LeaveTypeID, จำนวนวัน)
        const getRequestInfoSql = `
            SELECT 
                EmployeeID, 
                LeaveTypeID, 
                (JULIANDAY(EndDate) - JULIANDAY(StartDate)) + 1 AS days
            FROM LeaveRequest 
            WHERE LeaveRequestID = ?
        `;

        db.get(getRequestInfoSql, [id], (err, requestInfo) => {
            if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ error: err.message });
            }
            if (!requestInfo) {
                db.run('ROLLBACK');
                return res.status(404).json({ error: 'Leave request not found' });
            }

            // 3. อัปเดตตาราง LeaveEntitlement โดยเพิ่ม UsedDays
            const updateEntitlementSql = `
                UPDATE LeaveEntitlement
                SET UsedDays = UsedDays + ?
                WHERE EmployeeID = ? AND LeaveTypeID = ? AND Year = ?
            `;
            const currentYear = new Date().getFullYear();
            
            db.run(updateEntitlementSql, [requestInfo.days, requestInfo.EmployeeID, requestInfo.LeaveTypeID, currentYear], function(err) {
                if (err) {
                    db.run('ROLLBACK');
                    return res.status(500).json({ error: err.message });
                }

                // 4. อัปเดตตาราง LeaveRequest (เปลี่ยนสถานะ)
                const updateRequestSql = `
                    UPDATE LeaveRequest
                    SET Status = ?, ApproverComment = ?, ApprovalDate = DATE('now')
                    WHERE LeaveRequestID = ?
                `;
                db.run(updateRequestSql, [status, comment, id], function(err) {
                    if (err) {
                        db.run('ROLLBACK');
                        return res.status(500).json({ error: err.message });
                    }

                    // 5. ถ้าทุกอย่างสำเร็จ ให้ COMMIT Transaction
                    db.run('COMMIT');
                    res.json({ message: 'Leave approved and entitlement updated successfully!' });
                });
            });
        });
    });
});

// --- API Endpoint สำหรับ Manager Dashboard ---
app.get('/api/manager/dashboard-stats/:managerId', async (req, res) => {
    const { managerId } = req.params;

    const dbQuery = (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    };

    try {
        // 1. ดึงข้อมูล Manager
        const managerInfoPromise = dbQuery(`
            SELECT FirstName, LastName, EmployeeID, Position, d.DepartmentName
            FROM Employees e
            JOIN Department d ON e.DepartmentID = d.DepartmentID
            WHERE e.EmployeeID = ?
        `, [managerId]);

        // 2. ดึงข้อมูลสรุปของทีม
        const teamStatsPromise = dbQuery(`
            SELECT
                (SELECT COUNT(*) FROM Employees WHERE ManagerID = ?) AS totalEmployees,
                (SELECT COUNT(DISTINCT lr.EmployeeID) FROM LeaveRequest lr JOIN Employees e ON lr.EmployeeID = e.EmployeeID WHERE e.ManagerID = ? AND lr.Status = 'อนุมัติแล้ว' AND DATE('now') BETWEEN lr.StartDate AND lr.EndDate) AS onLeaveToday,
                (SELECT COUNT(*) FROM LeaveRequest lr JOIN Employees e ON lr.EmployeeID = e.EmployeeID WHERE e.ManagerID = ? AND lr.Status = 'รออนุมัติ') AS pendingRequests
        `, [managerId, managerId, managerId]);

        // 3. ดึงคำขอลาล่าสุด 3 รายการ
        const recentRequestsPromise = dbQuery(`
            SELECT
                lr.LeaveRequestID AS id,
                emp.FirstName || ' ' || emp.LastName AS name,
                lt.LeaveTypeName AS type,
                (JULIANDAY(lr.EndDate) - JULIANDAY(lr.StartDate)) + 1 AS days,
                lr.Status AS status,
                lr.StartDate AS start,
                lr.EndDate AS end
            FROM LeaveRequest lr
            JOIN Employees emp ON lr.EmployeeID = emp.EmployeeID
            JOIN LeaveType lt ON lr.LeaveTypeID = lt.LeaveTypeID
            WHERE emp.ManagerID = ?
            ORDER BY lr.RequestDate DESC
            LIMIT 3
        `, [managerId]);

        const [managerInfoResult, teamStatsResult, recentRequests] = await Promise.all([
            managerInfoPromise,
            teamStatsPromise,
            recentRequestsPromise
        ]);

        res.json({
            data: {
                managerInfo: managerInfoResult[0],
                teamStats: teamStatsResult[0],
                recentRequests: recentRequests
            }
        });

    } catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

// --- API Endpoint สำหรับหน้าประวัติการลาของทีม ---
app.get('/api/manager/team-history/:managerId', (req, res) => {
    const { managerId } = req.params;
    const { search = '', status = 'All', type = 'All' } = req.query;

    let sql = `
        SELECT
            lr.LeaveRequestID AS id,
            emp.FirstName || ' ' || emp.LastName AS employeeName, -- เพิ่มชื่อพนักงาน
            lt.LeaveTypeName AS leaveType,
            lr.StartDate,
            lr.EndDate,
            (JULIANDAY(lr.EndDate) - JULIANDAY(lr.StartDate)) + 1 AS days,
            lr.Status,
            lr.Reason,
            lr.RequestDate,
            lr.ApproverComment
        FROM LeaveRequest lr
        JOIN Employees emp ON lr.EmployeeID = emp.EmployeeID
        JOIN LeaveType lt ON lr.LeaveTypeID = lt.LeaveTypeID
        WHERE emp.ManagerID = ? -- เงื่อนไขหลัก: ค้นหาจาก ManagerID
    `;
    const params = [managerId];

    // เพิ่มเงื่อนไขการค้นหา (Search)
    if (search) {
        sql += ' AND (emp.FirstName LIKE ? OR emp.LastName LIKE ? OR lr.Reason LIKE ? OR lt.LeaveTypeName LIKE ?)';
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // เพิ่มเงื่อนไขการกรองสถานะ (Status)
    if (status && status !== 'All') {
        const statusMap = {
            'Approved': 'อนุมัติแล้ว',
            'Pending': 'รออนุมัติ',
            'Rejected': 'ไม่อนุมัติ'
        };
        sql += ' AND lr.Status = ?';
        params.push(statusMap[status]);
    }
    
    // เพิ่มเงื่อนไขการกรองประเภทการลา (Type)
    if (type && type !== 'All') {
        sql += ' AND lt.LeaveTypeName = ?';
        params.push(type);
    }

    sql += ' ORDER BY lr.RequestDate DESC';

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ "error": err.message });
        res.json({ "data": rows });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});