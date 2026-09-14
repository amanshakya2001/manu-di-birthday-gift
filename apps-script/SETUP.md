# Connecting the Google Sheet (~3 minutes)

This logs who opened the site, on what device, and which gifts she picked —
straight into a spreadsheet you own. No API keys end up in the website code.

## 1. Make the sheet

1. Go to <https://sheets.new> — a blank spreadsheet opens.
2. Name it something like **Manu Birthday Tracker**.

## 2. Add the script

1. In that sheet: **Extensions → Apps Script**.
2. Delete whatever is in the editor.
3. Paste the entire contents of [`Code.gs`](Code.gs).
4. Click the 💾 save icon.

## 3. Deploy it as a web app

1. Click **Deploy → New deployment**.
2. Click the ⚙️ gear next to "Select type" → choose **Web app**.
3. Set:
   - **Description:** anything, e.g. `birthday tracker`
   - **Execute as:** **Me**
   - **Who has access:** **Anyone** ← this matters. Not "Anyone with Google account".
4. Click **Deploy**.
5. Google will ask you to authorise it. Click **Authorize access**, pick your
   account, then on the "Google hasn't verified this app" screen click
   **Advanced → Go to (your project name) (unsafe)** → **Allow**.

   That warning is just because it's your own unpublished script. It only has
   access to this one spreadsheet.
6. Copy the **Web app URL**. It looks like:
   ```
   https://script.google.com/macros/s/AKfycb...long.../exec
   ```

## 4. Paste it into the site

Open [`src/config.js`](../src/config.js) and put the URL in `tracking.endpoint`:

```js
export const tracking = {
  endpoint: 'https://script.google.com/macros/s/AKfycb.../exec',
}
```

Then rebuild so the live link picks it up:

```bash
npm run build
```

## 5. Check it works

Paste the Web app URL straight into a browser tab. You should see:

```json
{"ok":true,"msg":"Birthday tracker is live 🎂"}
```

Then open the site itself. Within a few seconds a **Visits** tab should appear in
your spreadsheet with a new row.

---

## What ends up in the sheet

Three tabs, created automatically:

| Tab | What lands there |
| --- | --- |
| **Visits** | One row each time the site is opened — device type, OS, browser, screen size, language, timezone, where they came from |
| **Gift Picks** | One row when she presses "Send my list" — exactly which gifts, and how many |
| **Journey** | How far through she got: which stages she reached, whether she finished the letter |

The `Session` column is a random per-visit id. Rows sharing one means it was the
same visit — so you can tell one person exploring from three different people.

## Opening it in Excel

**File → Download → Microsoft Excel (.xlsx)** in Google Sheets. Or in Excel:
**Data → Get Data → From Web** and point it at the sheet's published CSV URL if
you want it to refresh by itself.

## Turning it off

Clear `tracking.endpoint` back to `''` in `src/config.js` and rebuild. Every
tracking call becomes a no-op — nothing is sent, and nothing else changes.

## Troubleshooting

**Nothing appears in the sheet.** Almost always "Who has access" was left as
"Anyone with Google account". Redeploy with **Anyone**.

**You edited `Code.gs` and nothing changed.** Apps Script serves the last
*deployed* version. Use **Deploy → Manage deployments → ✏️ edit → Version: New
version → Deploy**. The URL stays the same.

**Rows appear twice in development.** React's StrictMode mounts components twice
in `npm run dev`. The production build (`npm run build`) doesn't do this, and
visits are de-duplicated per page load anyway.
