/**
 * Google Apps Script backend for the birthday site.
 * Receives POSTs from src/lib/track.js and appends them to this spreadsheet.
 *
 * SETUP: see apps-script/SETUP.md — it takes about 3 minutes.
 */

// Leave blank to use the spreadsheet this script is attached to.
// Or paste a spreadsheet ID (the long string in its URL) to target another one.
const SHEET_ID = ''

// Column layout for each tab. The headers are written automatically.
const TABS = {
  visits: {
    name: 'Visits',
    headers: ['When', 'Session', 'Device', 'OS', 'Browser', 'Screen', 'Viewport',
              'DPR', 'Touch', 'Language', 'Timezone', 'Referrer', 'User Agent'],
    row: (d) => [d.when, d.session, d.device, d.os, d.browser, d.screen, d.viewport,
                 d.dpr, d.touch, d.language, d.timezone, d.referrer, d.ua],
  },
  gifts: {
    name: 'Gift Picks',
    headers: ['When', 'Session', 'How many', 'What she picked', 'Device', 'OS', 'Browser'],
    row: (d) => [d.when, d.session, d.count, d.items, d.device, d.os, d.browser],
  },
  event: {
    name: 'Journey',
    headers: ['When', 'Session', 'Event', 'Detail', 'Device', 'OS', 'Browser'],
    row: (d) => [d.when, d.session, d.event, d.detail, d.device, d.os, d.browser],
  },
}

function book() {
  return SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet()
}

/** Get a tab, creating it with a frozen header row if it doesn't exist yet. */
function tabFor(spec) {
  const ss = book()
  let sheet = ss.getSheetByName(spec.name)
  if (!sheet) {
    sheet = ss.insertSheet(spec.name)
    sheet.appendRow(spec.headers)
    sheet.getRange(1, 1, 1, spec.headers.length).setFontWeight('bold')
    sheet.setFrozenRows(1)
  }
  return sheet
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)

    // 'visit' | 'gifts' | 'event'  →  falls back to the Journey tab
    const key = data.type === 'visit' ? 'visits' : data.type === 'gifts' ? 'gifts' : 'event'
    const spec = TABS[key]

    // Timestamp in the sheet owner's timezone, so it reads naturally.
    const when = Utilities.formatDate(
      data.at ? new Date(data.at) : new Date(),
      Session.getScriptTimeZone(),
      'yyyy-MM-dd HH:mm:ss'
    )

    tabFor(spec).appendRow(spec.row({ ...data, when: when }))

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON)
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

/** Opening the web app URL in a browser hits this — handy for checking it deployed. */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, msg: 'Birthday tracker is live 🎂' }))
    .setMimeType(ContentService.MimeType.JSON)
}
