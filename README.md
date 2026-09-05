# Mariane's Butterfly Garden Party

A responsive digital invitation with RSVP collection, printable program, host game cards, image downloads, and protected admin editing.

## Links

- Attendee invitation: `invite.html`
- RSVP page and guest book: `rsvp.html`
- Admin editor: `admin.html`
- Admin passcode: `mariane8`

The static prototype stores event details and RSVPs in the current browser. For shared records across devices, connect the form to a hosted database such as Supabase or Firebase.

## Google Drive photo uploads

The target folder is [Mariane's Google Drive folder](https://drive.google.com/drive/folders/1TVN1ZS5ckfEW3TIIh3VX6l56a9vJeoBq?usp=drive_link). To turn on automatic uploads, create a Google Apps Script project, paste in `google-apps-script.gs`, deploy it as a web app with access set to anyone, then paste its `/exec` URL into `driveUploadEndpoint` in `rsvp.js`. The browser photo picker and upload status are already wired to that endpoint.

## GitHub Pages

This project is ready for GitHub Pages. Upload the files to `Darkwebai/Mariane-Birthday`, enable Pages for the `main` branch, then share the repository's Pages URL ending in `/invite.html` with attendees.
