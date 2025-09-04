# 🔐 Admin Users Setup Guide

This guide will help you create admin users directly in your PostgreSQL database.

## 🚀 **Option 1: Run the Node.js Script (Recommended)**

### Step 1: Install Dependencies
```bash
cd backend
npm install pg bcrypt dotenv
```

### Step 2: Set Environment Variables
Create a `.env` file in your backend directory:
```env
DATABASE_URL=postgresql://postgres:0123@localhost:5434/akazuba_florist
NODE_ENV=production
```

### Step 3: Run the Setup Script
```bash
node setup-admin-users.js
```

This will:
- ✅ Create the users table if it doesn't exist
- ✅ Create both admin users with proper password hashing
- ✅ Show you the created users and login credentials

## 🗄️ **Option 2: Manual SQL Setup**

### Step 1: Generate Password Hash
```bash
node generate-password-hash.js
```

This will output the proper bcrypt hash for the password `akazuba2024`.

### Step 2: Run SQL Commands
Connect to your PostgreSQL database and run:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  role VARCHAR(50) DEFAULT 'CUSTOMER',
  isActive BOOLEAN DEFAULT true,
  emailVerified BOOLEAN DEFAULT false,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert admin users (replace HASH_HERE with the actual hash from step 1)
INSERT INTO users (email, passwordHash, firstName, lastName, phone, role, isActive, emailVerified)
VALUES 
  ('admin@akazubaflorist.com', 'HASH_HERE', 'Admin', 'User', '+250700000000', 'ADMIN', true, true),
  ('info.akazubaflorist@gmail.com', 'HASH_HERE', 'Info', 'Admin', '0784586110', 'ADMIN', true, true);
```

## 🔑 **Admin Login Credentials**

After setup, you can login with:

### **Primary Admin:**
- **Email**: `admin@akazubaflorist.com`
- **Password**: `akazuba2024`

### **Info Admin:**
- **Email**: `info.akazubaflorist@gmail.com`
- **Password**: `akazuba2024`

## 🧪 **Verify Setup**

Check if admin users were created:
```sql
SELECT id, email, firstName, lastName, role, isActive, createdAt 
FROM users 
WHERE role = 'ADMIN' 
ORDER BY createdAt;
```

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **Connection Error**: Check your `DATABASE_URL` in `.env`
2. **Table Already Exists**: The script handles this automatically
3. **Permission Denied**: Ensure your database user has CREATE and INSERT privileges
4. **Password Hash Issues**: Use the `generate-password-hash.js` script for proper hashing

### **Database Connection Test:**
```bash
psql "postgresql://postgres:0123@localhost:5434/akazuba_florist" -c "SELECT version();"
```

## 📋 **What Gets Created**

- **Users Table**: Complete user management structure
- **Admin Users**: Two admin accounts with full privileges
- **Proper Security**: Bcrypt-hashed passwords
- **Phone Numbers**: Updated contact information

## 🎯 **Next Steps**

After creating admin users:
1. Test login at `/admin/login`
2. Change default passwords for security
3. Configure additional admin settings
4. Test admin functionality

---

**Need Help?** Check the error messages from the scripts or SQL commands for specific issues.
