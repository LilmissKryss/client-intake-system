# Email Setup for Client Intake Form

This document explains how to set up email functionality for the client intake form.

## Overview

When a client submits the intake form, two emails are sent:

1. A confirmation email to the client
2. A notification email to you with all the form details

## Configuration Steps

### 1. Create a `.env.local` file

Copy the `.env.local.example` file to `.env.local`:

```bash
cp .env.local.example .env.local
```

### 2. Configure Email Settings

Edit the `.env.local` file and update the following variables:

```
EMAIL_HOST=smtp.example.com       # Your SMTP server (e.g., smtp.gmail.com)
EMAIL_PORT=587                    # SMTP port (typically 587 for TLS or 465 for SSL)
EMAIL_SECURE=false                # Use 'true' for port 465, 'false' for port 587
EMAIL_USER=your-email@example.com # Your email address
EMAIL_PASS=your-password          # Your email password or app password
DEVELOPER_EMAIL=your-email@example.com # Email where you want to receive notifications
```

### 3. Email Provider Recommendations

#### Gmail

If using Gmail, you'll need to:

1. Enable 2-factor authentication
2. Create an "App Password" specifically for this application
3. Use that App Password in the `.env.local` file

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
```

#### Other Providers

Most email providers offer SMTP services. Check your email provider's documentation for the correct SMTP settings.

### 4. Database Setup

The application uses PostgreSQL with Prisma. Update the `DATABASE_URL` in your `.env.local` file:

```
DATABASE_URL="postgresql://username:password@localhost:5432/client_intake?schema=public"
```

### 5. Initialize the Database

Run the following commands to set up the database:

```bash
npx prisma migrate dev --name init
```

## Testing Email Functionality

To test if your email configuration is working:

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Fill out and submit the client intake form

3. Check both the client email address and your developer email address for the confirmation and notification emails

## Troubleshooting

If emails are not being sent:

1. Check the server logs for error messages
2. Verify your SMTP credentials are correct
3. Make sure your email provider allows SMTP access
4. If using Gmail, ensure you're using an App Password, not your regular password
5. Some email providers may block automated emails - check your email provider's security settings

## Customizing Email Templates

The email templates are defined in `src/lib/email.ts`. You can modify:

- `sendConfirmationEmail`: The email sent to clients
- `sendNotificationEmail`: The email sent to you
