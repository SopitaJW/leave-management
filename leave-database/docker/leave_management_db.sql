CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

create table Department (
	DepartmentID int auto_increment primary key,
	DepartmentName varchar(100) not null
);

create table Employees (
	EmployeeID int primary key,
	FirstName varchar(50) not null,
	LastName varchar(50) not null,
	Email varchar(100) unique,
	Phone varchar(20),
	Position varchar(50),
	HireDate date,
	DepartmentID int,
	ManagerID int,
	foreign key(DepartmentID) references Department(DepartmentID),
	foreign key(ManagerID) references Employees(EmployeeID)
);

create table UserAccount (
	UserID int auto_increment primary key,
	UserName varchar(50) not null,
	Password varchar(255) not null,
	Role enum('Employee', 'HR', 'Manager') default 'Employee', #ควบคุมสิทธิ์ จำกัดว่าใครทำอะไรได้
	EmployeeID int,
	foreign key(EmployeeID) references Employees(EmployeeID)
);

create table LeaveType (
LeaveTypeID int auto_increment primary key,
LeaveTypeName varchar(50) not null,
MaxDays int,
Description varchar(255)
);

create table LeaveEntitlement (
	EntitlementID int auto_increment primary key,
	EmployeeID int,
	Year year,
	LeaveTypeID int,
	TotalDays int,
	UsedDays int default 0,
	RemainingDays int generated always as (TotalDays - UsedDays) stored,
	foreign key(EmployeeID) references Employees(EmployeeID),
	foreign key(LeaveTypeID) references LeaveType(LeaveTypeID)
);

create table LeaveRequest (
	LeaveRequestID int auto_increment primary key,
	StartDate date not null,
	EndDate date not null,
	Reason text,
	Status enum('รออนุมัติ','อนุมัติแล้ว','ไม่อนุมัติ','ยกเลิกคำขอ') default 'รออนุมัติ', #เก็บสถานะของคำขอลาได้เฉพาะ รออนุมัติ, อนุมัติแล้ว, ไม่อนุมัติ,ยกเลิกคำขอ
	RequestDate date,
	ApprovalDate date,
	ApproverComment text,
	EmployeeID int,
	LeaveTypeID int,
	ApproverID int,
	foreign key(EmployeeID) references Employees(EmployeeID),
	foreign key(LeaveTypeID) references LeaveType(LeaveTypeID),
	foreign key(ApproverID) references Employees(EmployeeID)
) auto_increment = 2001;



insert into Department (DepartmentName)
values 
('HR Department'),
('IT Department'),
('Administration Department');

insert into Employees (EmployeeID, FirstName, LastName, Email, Phone, Position, HireDate, DepartmentID, ManagerID) values
(1004, 'Suwapich', 'Arsa', 'suwapich_a@company.com', '0623418995', 'Office Assistant', '2020-05-05', 3, NULL);

insert into Employees (EmployeeID, FirstName, LastName, Email, Phone, Position, HireDate, DepartmentID, ManagerID) values
(1001, 'Sopita', 'Jengsiwong', 'sopita_j@company.com', '0612345678', 'Developer', '2023-12-18', 2, 1004),
(1002, 'Meenlada', 'Kaewpinij', 'meenlada_k@company.com', '0859124637', 'Database Administrator', '2021-08-10', 2, 1004),
(1003, 'Sasitorn', 'Kitcharoen', 'sasitorn_k@company.com', '0945781203', 'HR Officer', '2023-05-20', 1, 1004);

insert into UserAccount (UserName, Password, Role, EmployeeID) values
('Johnson', SHA2('20367', 256), 'Manager', 1001),
('Kanto',   SHA2('30467', 256), 'Employee', 1002),
('Param',   SHA2('55123', 256), 'Employee', 1003),
('Yuri',    SHA2('66789', 256), 'Employee', 1004);

insert into LeaveType (LeaveTypeName, MaxDays, Description) values
('ลาป่วย', 20, 'ใช้เมื่อต้องการลาหยุดเนื่องจากป่วย หรือมีใบรับรองแพทย์'),
('ลากิจ', 10, 'ใช้เมื่อพนักงานต้องการลาหยุดเพื่อไปทำธุระส่วนตัว'),
('ลาพักร้อน', 15, 'วันลาหยุดพักผ่อนประจำปี (ได้รับค่าจ้าง)'),
('ลาคลอด', 60, 'ใช้สำหรับพนักงานหญิงที่ลาคลอด');

insert into LeaveEntitlement (EmployeeID, Year, LeaveTypeID, TotalDays, UsedDays) values
(1001, 2025, 4, 60, 19),
(1002, 2025, 2, 10,  4),
(1003, 2025, 4, 60, 28),
(1004, 2025, 1, 20,  0);

insert into LeaveRequest (StartDate, EndDate, Reason, Status, RequestDate, ApprovalDate, ApproverComment, EmployeeID, LeaveTypeID, ApproverID) values
('2025-09-10','2025-09-12','ป่วย (มีไข้)', 'อนุมัติแล้ว', '2025-09-09', '2025-09-10', 'อนุมัติเรียบร้อย', 1001, 1, 1004),
('2025-10-01','2025-10-02','ลากิจ', 'รออนุมัติ', '2025-09-30', NULL, 'กำลังรอการอนุมัติ', 1002, 2, 1004),
('2025-08-15','2025-08-20','ลาพักร้อน', 'อนุมัติแล้ว', '2025-08-10', '2025-08-12', 'อนุมัติเรียบร้อย', 1003, 3, 1004),
('2025-09-05','2025-09-06','ไปธุระกับครอบครัว','ไม่อนุมัติ', '2025-09-04', '2025-09-05', 'ลาหลายครั้งเกินไป', 1004, 4, 1004);