const bcrypt = require('bcryptjs');

// New password - no $ signs to avoid shell issues
const NEW_PASSWORD = 'xK9#mP2$vL7@nQ4!wR';

bcrypt.hash(NEW_PASSWORD, 10).then(hash => {
    console.log('\n✅ Password & Hash generated successfully!');
    console.log('==========================================');
    console.log('Password :', NEW_PASSWORD);
    console.log('Hash     :', hash);
    console.log('==========================================');
    console.log('\n📋 Run this SQL on the live DB:');
    console.log(`UPDATE users SET password = '${hash}' WHERE email = 'admin@ammanational.org' AND role = 'ADMIN';`);
});
