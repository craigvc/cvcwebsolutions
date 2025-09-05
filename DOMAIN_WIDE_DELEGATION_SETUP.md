# Domain-Wide Delegation Setup for Google Calendar

Since you have a Google Workspace account (cvcwebsolutions.com), you need Domain-Wide Delegation to allow the service account to access your personal calendar.

## Step 1: Enable Domain-Wide Delegation

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **"IAM & Admin" → "Service Accounts"**
3. Find your service account: `appointment-schedule@cvcwebsolutions.iam.gserviceaccount.com`
4. Click on it
5. Click **"Details"** tab
6. Scroll down to **"Domain-wide delegation"**
7. Click **"Enable Google Workspace Domain-wide Delegation"**
8. **Product name**: `CVC Appointment Scheduler`
9. Click **"Save"**
10. **Copy the Client ID** (you'll need it for step 2)

## Step 2: Configure in Google Admin Console

1. Go to [Google Admin Console](https://admin.google.com/)
2. Navigate to **"Security" → "API Controls" → "Domain-wide Delegation"**
3. Click **"Add new"**
4. **Client ID**: (paste the Client ID from step 1)
5. **OAuth Scopes**: `https://www.googleapis.com/auth/calendar,https://www.googleapis.com/auth/gmail.send`
6. Click **"Authorize"**

## Step 3: Update Environment Variables

Update your `.env.local` to use your email directly:

```bash
GOOGLE_CALENDAR_ID=craig@cvcwebsolutions.com
```

## Step 4: Update Code to Use Domain-Wide Delegation

The service account will then be able to impersonate your user account and create events in your calendar.

This is the proper enterprise solution for Google Workspace accounts.

## Alternative: Simple Solution

If Domain-Wide Delegation is too complex for now:

1. Add the service account's calendar to your Google Calendar
2. All appointments will appear in that shared calendar
3. You can view and manage them from your main calendar view

The appointment system is working perfectly - it's just a matter of calendar access permissions.