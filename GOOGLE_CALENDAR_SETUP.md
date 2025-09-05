# Google Calendar Integration Setup Guide

This guide will help you set up Google Calendar integration for automatic appointment scheduling.

## Prerequisites

1. A Google account
2. An existing Google Cloud Project (you mentioned you have one)
3. Google Cloud CLI (gcloud) installed

## Step 1: Install Google Cloud CLI

### Windows Installation:
1. Download the installer from: https://cloud.google.com/sdk/docs/install-sdk#windows
2. Run the installer and follow the prompts
3. Restart your command prompt/terminal
4. Verify installation: `gcloud --version`

### Initialize gcloud:
```bash
gcloud init
```

## Step 2: Enable Google Calendar API

1. Go to the Google Cloud Console: https://console.cloud.google.com/
2. Select your existing project
3. Navigate to "APIs & Services" > "Library"
4. Search for "Google Calendar API"
5. Click on it and press "Enable"

Alternatively, use gcloud CLI:
```bash
gcloud services enable calendar-json.googleapis.com
```

## Step 3: Create a Service Account

### Using Google Cloud Console:
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Enter a name (e.g., "appointment-scheduler")
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

### Using gcloud CLI:
```bash
gcloud iam service-accounts create appointment-scheduler \
    --description="Service account for appointment scheduling" \
    --display-name="Appointment Scheduler"
```

## Step 4: Create and Download Service Account Key

### Using Google Cloud Console:
1. In "Credentials", find your service account
2. Click on it to open details
3. Go to the "Keys" tab
4. Click "Add Key" > "Create new key"
5. Select "JSON" format
6. Download the file and keep it secure

### Using gcloud CLI:
```bash
gcloud iam service-accounts keys create ~/appointment-scheduler-key.json \
    --iam-account=appointment-scheduler@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

## Step 5: Extract Environment Variables

From the downloaded JSON key file, extract these values for your `.env` file:

```bash
# From the JSON file, copy these values:
GOOGLE_CLIENT_EMAIL=appointment-scheduler@your-project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

**Important**: The private key must include the literal `\n` characters and be wrapped in quotes.

## Step 6: Share Calendar with Service Account

1. Open Google Calendar (calendar.google.com)
2. Go to "Settings" > "Settings"
3. Click on your calendar on the left
4. Scroll to "Share with specific people"
5. Click "Add people"
6. Enter your service account email (from GOOGLE_CLIENT_EMAIL)
7. Set permission to "Make changes to events"
8. Click "Send"

## Step 7: Get Calendar ID (Optional)

By default, the app uses your primary calendar (`primary`). To use a specific calendar:

1. In Google Calendar settings
2. Select your calendar
3. Scroll to "Calendar ID" (it looks like an email)
4. Copy this ID to your `.env` file as `GOOGLE_CALENDAR_ID`

## Step 8: Configure Environment Variables

Create a `.env.local` file in your project root (copy from `.env.example`):

```bash
# Google Calendar API Configuration
GOOGLE_CLIENT_EMAIL=appointment-scheduler@your-project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=primary

# Or use a specific calendar:
# GOOGLE_CALENDAR_ID=your-calendar-id@gmail.com
```

## Step 9: Test the Integration

1. Restart your development server
2. Try booking an appointment through the `/schedule` page
3. Check your Google Calendar for the new event
4. The event should include:
   - Client details
   - Zoom meeting link (if configured)
   - Email invitations to attendees
   - Automatic reminders

## Troubleshooting

### Common Issues:

1. **"Calendar not found" error**:
   - Make sure you shared the calendar with the service account
   - Verify the calendar ID is correct

2. **"Access denied" error**:
   - Check that the Google Calendar API is enabled
   - Verify service account permissions

3. **"Invalid credentials" error**:
   - Ensure the private key format is correct (with `\n` characters)
   - Make sure the client email matches exactly

4. **Events not appearing**:
   - Check that the calendar is shared with proper permissions
   - Verify the time zone settings

### Useful gcloud Commands:

```bash
# List your projects
gcloud projects list

# Set default project
gcloud config set project YOUR_PROJECT_ID

# List enabled APIs
gcloud services list --enabled

# List service accounts
gcloud iam service-accounts list
```

## Security Notes

- Keep your service account key file secure
- Never commit the key file to version control
- Use environment variables for sensitive data
- Consider rotating service account keys periodically
- Limit service account permissions to only what's needed

## Next Steps

Once configured, the appointment system will:

1. **Check Availability**: Query both Zoom and Google Calendar
2. **Create Events**: Automatically add appointments to your calendar
3. **Send Invitations**: Email invites to clients
4. **Set Reminders**: Configure automatic email/popup reminders
5. **Include Meeting Links**: Add Zoom URLs to calendar events

The integration works seamlessly with the existing appointment booking system!