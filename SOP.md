# Standard Operating Procedure (SOP) - AMMA Membership Portal

## 1. Overview
The AMMA Membership Portal is a dynamic system designed to manage healthcare professional memberships, inquiries, and subscriptions.

## 2. User Management
### 2.1. Registration Process
- Users register by selecting a membership category.
- Email verification is required via a 6-digit OTP.
- Professional details (License, Institution, etc.) are collected based on the selected category.
- New members are automatically set to **APPROVED** status by default (can be changed to PENDING in `authService.js` if stricter verification is needed).

### 2.2. Admin Member Control
- Admins can view the full list of members in the **Admin Portal**.
- **View Details**: Click the Eye icon to see all professional and personal info.
- **Status Update**: Change status between **PENDING**, **APPROVED**, and **BLOCKED**.
- **Export Data**: Use the "Export Excel" button to download a full list of members and their professional details.

## 3. Subscription Plan Management
### 3.1. Managing Plans
- Navigate to the **Plans** tab in the Admin Portal.
- **Add Plan**: Click "New Plan" to create a dynamic membership category.
- **Edit Plan**: Click the Edit icon to update price, duration, or description.
- **Delete Plan**: Click the Trash icon to remove a plan (Note: Plans linked to users cannot be deleted without affecting their profiles).
- **Status**: Set a plan to **INACTIVE** to hide it from the registration page without deleting it.

### 3.2. Member Plan Updates
- Members can switch their category from the **Membership** tab in their dashboard.
- Changing a plan updates their profile and `plan_id` in the database.

## 4. Data Security & Backups
### 4.1. Database Backup
- Admins should regularly perform database backups.
- Click the **DB Backup** button in the Admin Portal (Members tab).
- This downloads a `.sql` file containing all table structures and data.
- **Restoration**: This file can be imported into a MySQL database using tools like phpMyAdmin or command line `mysql -u user -p db_name < backup.sql`.

### 4.2. Sender Email
- All system emails (OTP, notifications) are sent from `membership@ammanational.org`.
- This is configured in `backend/src/utils/sendEmail.js`.
- Ensure the SMTP credentials in `.env` are valid for this sender.

## 5. Maintenance
- Regularly review **Inquiries** and **Newsletter** subscribers in the Admin Portal.
- Keep the `node_modules` updated and monitor server logs for any anomalies.

---
© 2026 American Muslims Medical Association (AMMA)
