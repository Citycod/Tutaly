import { Client } from 'pg';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env from root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function createAdmin() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('No DATABASE_URL found in .env');
    process.exit(1);
  }

  const client = new Client({
    connectionString: dbUrl,
  });

  try {
    await client.connect();
    
    const email = 'admin@tutaly.com';
    const password = 'AdminPassword123!';
    
    // Check if admin exists
    const checkRes = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (checkRes.rows.length > 0) {
      console.log(`Admin user with email ${email} already exists.`);
      // Update role to admin just in case
      await client.query('UPDATE users SET role = $1 WHERE email = $2', ['admin', email]);
      console.log('Ensured role is admin.');
      process.exit(0);
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    const id = crypto.randomUUID();
    
    // Insert user
    await client.query(`
      INSERT INTO users (
        id, email, password, role, "isEmailVerified", "dateOfBirth", "isActive", "isMfaEnabled"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8
      )
    `, [
      id,
      email,
      hashedPassword,
      'admin',
      true, // isEmailVerified
      '1990-01-01', // dateOfBirth
      true, // isActive
      false // isMfaEnabled
    ]);
    
    console.log('✅ Admin account created successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    
  } catch (err) {
    console.error('Error creating admin:', err);
  } finally {
    await client.end();
  }
}

createAdmin();
