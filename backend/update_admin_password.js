/**
 * One-time script to update the ADMIN user password in the DB.
 * Run: node update_admin_password.js
 * Delete this file after use!
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function updateAdminPassword() {
  const NEW_PASSWORD = 'AMMA@Adm!n#2026$Secure';

  // Hash the password with bcrypt (salt rounds = 10)
  const hashed = await bcrypt.hash(NEW_PASSWORD, 10);

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'amma_portal',
  });

  const [result] = await connection.execute(
    "UPDATE users SET password = ? WHERE email = 'admin@ammanational.org' AND role = 'ADMIN'",
    [hashed]
  );

  await connection.end();

  if (result.affectedRows > 0) {
    console.log('✅ Admin password updated successfully!');
    console.log('-------------------------------------------');
    console.log('Email   : admin@ammanational.org');
    console.log('Password: AMMA@Adm!n#2026$Secure');
    console.log('-------------------------------------------');
    console.log('⚠️  Please delete this file after use!');
  } else {
    console.log('❌ No admin user found with that email. Check the DB manually.');
  }
}

updateAdminPassword().catch(console.error);
