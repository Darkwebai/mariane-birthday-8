const DRIVE_FOLDER_ID = '1TVN1ZS5ckfEW3TIIh3VX6l56a9vJeoBq';

function doGet() {
  const files = DriveApp.getFolderById(DRIVE_FOLDER_ID).getFiles();
  const fileUrls = [];
  while (files.hasNext()) {
    fileUrls.push(files.next().getDownloadUrl());
  }
  return ContentService.createTextOutput(JSON.stringify(fileUrls)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(request) {
  const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  const upload = JSON.parse(request.postData.contents);
  if (!upload.data) return ContentService.createTextOutput(JSON.stringify({ error: 'Missing photo' })).setMimeType(ContentService.MimeType.JSON);
  const blob = Utilities.newBlob(Utilities.base64Decode(upload.data), upload.mimeType || 'image/jpeg', upload.name || 'garden-photo.jpg');
  const file = folder.createFile(blob);
  return ContentService.createTextOutput(JSON.stringify({ id: file.getId(), name: file.getName() })).setMimeType(ContentService.MimeType.JSON);
}
