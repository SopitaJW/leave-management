const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const dbFile = './leave_management.db';

// ลบไฟล์ database เก่าทิ้ง (เพื่อให้เริ่มต้นใหม่ทุกครั้งที่รัน dev server)
// ใน Production จริงๆ ไม่ควรทำแบบนี้
if (process.env.NODE_ENV !== 'production' && fs.existsSync(dbFile)) {
    fs.unlinkSync(dbFile);
}

const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // เปิดใช้งาน Foreign Key constraints
        db.run('PRAGMA foreign_keys = ON;', (err) => {
            if (err) console.error("Could not enable foreign keys", err);
        });
        
        // อ่านและรันไฟล์ SQL เพื่อสร้าง Table และใส่ข้อมูล
        const sqlScript = fs.readFileSync('./database_setup.sql', 'utf8');
        db.exec(sqlScript, (err) => {
            if (err) {
                console.error('Error executing SQL script', err.message);
            } else {
                console.log('Database initialized successfully with tables and seed data.');
            }
        });
    }
});

module.exports = db;