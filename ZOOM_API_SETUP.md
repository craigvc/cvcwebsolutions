# Zoom API Setup Guide

To enable Zoom integration for the appointment system, you need to configure Zoom API credentials.

## Step 1: Create a Zoom App

1. Go to [Zoom Marketplace](https://marketplace.zoom.us/)
2. Sign in with your Zoom account
3. Click **"Develop"** → **"Build App"**
4. Choose **"Server-to-Server OAuth"** app type
5. Fill in your app information:
   - **App Name**: `CVC Appointment System`
   - **Company Name**: `CVC Web Solutions`
   - **Developer Email**: `craig@cvcwebsolutions.com`

## Step 2: Get API Credentials

After creating the app, you'll get:
- **Account ID**
- **Client ID** 
- **Client Secret**

## Step 3: Set Scopes

In your app settings, add these scopes:
- `meeting:write:admin` - Create meetings
- `meeting:read:admin` - Read meeting details
- `user:read:admin` - Read user information

## Step 4: Update Environment Variables

Add these to your `.env.local` file:

```bash
# Zoom API Configuration
ZOOM_ACCOUNT_ID=your_account_id_here
ZOOM_CLIENT_ID=your_client_id_here
ZOOM_CLIENT_SECRET=your_client_secret_here
```

## Step 5: Test the Integration

Once configured, the appointment system will:
- ✅ Create Zoom meetings for appointments
- ✅ Check real Zoom calendar availability
- ✅ Include meeting links in calendar events
- ✅ Include meeting links in confirmation emails

## Without Zoom Configuration

The system will still work without Zoom credentials:
- ❌ No Zoom meetings created
- ✅ Google Calendar events still created
- ✅ Appointments still bookable
- ✅ System uses Google Calendar availability only

## Testing

After adding credentials, restart your development server:

```bash
npm run dev
```

The system will automatically detect the configuration and start using the Zoom API for real meeting creation and availability checking.