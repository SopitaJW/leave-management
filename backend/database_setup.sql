-- ไม่ต้องใช้ CREATE/USE DATABASE ใน SQLite

CREATE TABLE IF NOT EXISTS Department (
	DepartmentID INTEGER PRIMARY KEY AUTOINCREMENT,
	DepartmentName TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Employees (
	EmployeeID INTEGER PRIMARY KEY,
	FirstName TEXT NOT NULL,
	LastName TEXT NOT NULL,
	Email TEXT UNIQUE,
	Phone TEXT,
	Position TEXT,
	HireDate TEXT,
	DepartmentID INTEGER,
	ManagerID INTEGER,
	FOREIGN KEY(DepartmentID) REFERENCES Department(DepartmentID),
	FOREIGN KEY(ManagerID) REFERENCES Employees(EmployeeID)
);

CREATE TABLE IF NOT EXISTS UserAccount (
	UserID INTEGER PRIMARY KEY AUTOINCREMENT,
	UserName TEXT NOT NULL,
	Password TEXT NOT NULL,
	-- แปลง ENUM เป็น TEXT และใช้ CHECK constraint
	Role TEXT CHECK(Role IN ('Employee', 'HR', 'Manager')) DEFAULT 'Employee',
	EmployeeID INTEGER,
	FOREIGN KEY(EmployeeID) REFERENCES Employees(EmployeeID)
);

CREATE TABLE IF NOT EXISTS LeaveType (
    LeaveTypeID INTEGER PRIMARY KEY AUTOINCREMENT,
    LeaveTypeName TEXT NOT NULL,
    MaxDays INTEGER,
    Description TEXT
);

CREATE TABLE IF NOT EXISTS LeaveEntitlement (
	EntitlementID INTEGER PRIMARY KEY AUTOINCREMENT,
	EmployeeID INTEGER,
	Year INTEGER, -- แปลง YEAR เป็น INTEGER
	LeaveTypeID INTEGER,
	TotalDays INTEGER,
	UsedDays INTEGER DEFAULT 0,
	-- แปลง синтаксис ของ generated column
	RemainingDays INTEGER GENERATED ALWAYS AS (TotalDays - UsedDays),
	FOREIGN KEY(EmployeeID) REFERENCES Employees(EmployeeID),
	FOREIGN KEY(LeaveTypeID) REFERENCES LeaveType(LeaveTypeID)
);

CREATE TABLE IF NOT EXISTS LeaveRequest (
	LeaveRequestID INTEGER PRIMARY KEY AUTOINCREMENT,
	StartDate TEXT NOT NULL,
	EndDate TEXT NOT NULL,
	Reason TEXT,
	-- แปลง ENUM เป็น TEXT และใช้ CHECK constraint
	Status TEXT CHECK(Status IN ('รออนุมัติ','อนุมัติแล้ว','ไม่อนุมัติ','ยกเลิกคำขอ')) DEFAULT 'รออนุมัติ',
	RequestDate TEXT,
	ApprovalDate TEXT,
	ApproverComment TEXT,
	EmployeeID INTEGER,
	LeaveTypeID INTEGER,
	ApproverID INTEGER,
	FOREIGN KEY(EmployeeID) REFERENCES Employees(EmployeeID),
	FOREIGN KEY(LeaveTypeID) REFERENCES LeaveType(LeaveTypeID),
	FOREIGN KEY(ApproverID) REFERENCES Employees(EmployeeID)
);

-- ข้อมูลตัวอย่าง (Data Seeding)
INSERT INTO Department (DepartmentName) VALUES ('HR Department'), ('IT Department'), ('Administration Department');

INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, Position, HireDate, DepartmentID, ManagerID) VALUES
(1004, 'Suwapich', 'Arsa', 'suwapich_a@company.com', '0623418995', 'Office Assistant', '2020-05-05', 3, NULL),
(1001, 'Sopita', 'Jengsiwong', 'sopita_j@company.com', '0612345678', 'Developer', '2023-12-18', 2, 1004),
(1002, 'Meenlada', 'Kaewpinij', 'meenlada_k@company.com', '0859124637', 'Database Administrator', '2021-08-10', 2, 1004),
(1003, 'Sasitorn', 'Kitcharoen', 'sasitorn_k@company.com', '0945781203', 'HR Officer', '2023-05-20', 1, 1004);

-- ลบการเข้ารหัส SHA2 ออกก่อน เราจะจัดการในแอปพลิเคชัน
INSERT INTO UserAccount (UserName, Password, Role, EmployeeID) VALUES
('Johnson', '20367', 'Manager', 1001),
('Kanto', '30467', 'Employee', 1002),
('Param', '55123', 'Employee', 1003),
('Yuri', '66789', 'Employee', 1004);

INSERT INTO LeaveType (LeaveTypeName, MaxDays, Description) VALUES
('ลาป่วย', 20, 'ใช้เมื่อต้องการลาหยุดเนื่องจากป่วย หรือมีใบรับรองแพทย์'),
('ลากิจ', 10, 'ใช้เมื่อพนักงานต้องการลาหยุดเพื่อไปทำธุระส่วนตัว'),
('ลาพักร้อน', 15, 'วันลาหยุดพักผ่อนประจำปี (ได้รับค่าจ้าง)'),
('ลาคลอด', 90, 'ใช้สำหรับพนักงานหญิงที่ลาคลอด');

INSERT INTO LeaveEntitlement (EmployeeID, Year, LeaveTypeID, TotalDays, UsedDays) VALUES
(1001, 2025, 4, 90, 19),
(1002, 2025, 1, 20, 0),  
(1002, 2025, 2, 10, 4),  
(1002, 2025, 3, 15, 0),  
(1002, 2025, 4, 90, 0),  
(1003, 2025, 4, 60, 28),
(1004, 2025, 1, 20, 0);

INSERT INTO LeaveRequest (StartDate, EndDate, Reason, Status, RequestDate, ApprovalDate, ApproverComment, EmployeeID, LeaveTypeID, ApproverID) VALUES
('2025-09-10','2025-09-12','ป่วย (มีไข้)', 'อนุมัติแล้ว', '2025-09-09', '2025-09-10', 'อนุมัติเรียบร้อย', 1001, 1, 1004),
('2025-10-01','2025-10-02','ลากิจ', 'รออนุมัติ', '2025-09-30', NULL, 'กำลังรอการอนุมัติ', 1002, 2, 1004),
('2025-08-15','2025-08-20','ลาพักร้อน', 'อนุมัติแล้ว', '2025-08-10', '2025-08-12', 'อนุมัติเรียบร้อย', 1003, 3, 1004),
('2025-09-05','2025-09-06','ไปธุระกับครอบครัว','ไม่อนุมัติ', '2025-09-04', '2025-09-05', 'ลาหลายครั้งเกินไป', 1004, 4, 1004);