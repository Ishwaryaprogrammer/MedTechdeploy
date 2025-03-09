const { google } = require('googleapis');
const { authorize } = require('./google-auth');

// Create a Google Meet link
function createMeetLink(auth, callback) {
    const calendar = google.calendar({ version: 'v3', auth });
    const event = {
        summary: 'Google Meet Meeting',
        description: 'A chance to meet and discuss.',
        start: {
            dateTime: '2024-12-13T10:00:00+05:30',  // Adjust to your time zone
            timeZone: 'Asia/Kolkata',
        },
        end: {
            dateTime: '2024-12-13T11:00:00+05:30',  // Adjust to your time zone
            timeZone: 'Asia/Kolkata',
        },
        conferenceData: {
            createRequest: {
                requestId: 'sample123',
                conferenceSolutionKey: {
                    type: 'hangoutsMeet',
                },
            },
        },
    };

    calendar.events.insert(
        {
            calendarId: 'primary',
            resource: event,
            conferenceDataVersion: 1,
        },
        (err, event) => {
            if (err) {
                console.log('Error creating event: ' + err);
                return;
            }
            const meetLink = event.data.conferenceData.entryPoints[0].uri;
            callback(meetLink);
        }
    );
}

module.exports = { createMeetLink };
