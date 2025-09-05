# Calendar Availability Setup Guide

Your appointment system respects your existing Google Calendar events when determining availability. Here's how to manage your availability slots:

## How It Works

The system automatically:
- ✅ Checks your Google Calendar for existing events
- ✅ Blocks time slots that conflict with existing appointments
- ✅ Only shows available 30-minute slots during business hours
- ✅ Updates in real-time when events are added/removed

## Current Business Hours

The system is configured for these default business hours:
- **Monday - Friday**: 9:00 AM - 5:00 PM
- **Time Slots**: 30-minute intervals
- **Lunch Break**: 12:00 PM - 1:00 PM (no appointments)

Available time slots:
- `09:00, 09:30, 10:00, 10:30, 11:00, 11:30`
- `13:00, 13:30, 14:00, 14:30, 15:00, 15:30, 16:00, 16:30, 17:00`

## Setting Your Availability

### Method 1: Block Time in Google Calendar

1. Open [Google Calendar](https://calendar.google.com)
2. Create events to block unavailable times:
   - **"Blocked"** - for unavailable periods
   - **"Lunch"** - for lunch breaks
   - **"Meeting"** - for existing appointments
   - **"Out of Office"** - for vacation days

### Method 2: Create Recurring Blocks

For regular unavailability (like weekly meetings):

1. Create a new event in Google Calendar
2. Set the title (e.g., "Team Meeting")
3. Set the time and date
4. Click **"More options"**
5. Under **"Repeat"**, choose your pattern:
   - Weekly on specific days
   - Monthly on certain dates
   - Custom patterns

### Method 3: Set Working Hours

1. Go to [Google Calendar Settings](https://calendar.google.com/calendar/u/0/r/settings)
2. Click **"Working hours & location"**
3. Set your working days and hours
4. This provides visual indication but doesn't block booking

## Managing Availability

### Blocking an Entire Day
Create an all-day event titled "Out of Office" or "Unavailable"

### Blocking Specific Hours
Create timed events for the hours you want to block

### Emergency Blocking
- Create a calendar event immediately
- The appointment system will reflect changes within minutes
- Existing bookings won't be affected

## Advanced Configuration

### Changing Business Hours

To modify business hours, update the time slots in:
- `src/app/api/appointments/route.ts` (line 148-151)
- `src/app/schedule/page.tsx` (line 36-39)
- `src/lib/google-calendar.ts` (availability checking logic)

### Adding Weekend Availability

Currently weekends are not available. To enable:
1. Modify the week generation in `schedule/page.tsx`
2. Change `length: 5` to `length: 7` for full week
3. Update business hours logic accordingly

### Custom Time Intervals

Default is 30-minute slots. To change:
1. Update time slot arrays in the code
2. Modify availability checking logic
3. Update meeting duration settings

## Best Practices

1. **Keep Calendar Updated**: Always add events to your calendar immediately
2. **Use Clear Titles**: Help distinguish between different types of blocks
3. **Set Buffer Time**: Consider adding 5-10 minute buffers between appointments
4. **Plan Ahead**: Block out future unavailable periods early
5. **Mobile Access**: Use Google Calendar mobile app for on-the-go updates

## Troubleshooting

### Appointments Appearing at Wrong Times
- Check your Google Calendar timezone settings
- Ensure domain-wide delegation is properly configured

### Time Slots Not Updating
- Calendar changes may take 1-2 minutes to reflect
- Refresh the appointment booking page
- Check that events are on the correct calendar (craig@cvcwebsolutions.com)

### Double Bookings
- Ensure all team members use the same calendar
- Consider creating shared calendars for team availability
- Use calendar invitations to confirm availability

## Integration Status

✅ **Google Calendar**: Fully integrated with domain-wide delegation  
⚠️ **Zoom Integration**: Requires API credentials (see ZOOM_API_SETUP.md)  
✅ **Email Notifications**: Confirmation emails with management links  
✅ **Appointment Management**: Clients can reschedule/cancel via secure links

The system is designed to be flexible and respect your actual calendar availability while providing clients with a professional booking experience.