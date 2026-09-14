// Sends visit + choice data to a Google Sheet (via an Apps Script web app).
// If no endpoint is configured, every function here quietly does nothing,
// so the site works exactly the same without it.

import { tracking } from '../config.js'

const SESSION_KEY = 'mb_session'

/** A random id so all rows from one visit can be grouped together. */
function sessionId() {
  try {
    let id = sessionStorage.getItem(SESSION_KEY)
    if (!id) {
      id = Math.random().toString(36).slice(2, 9) + '-' + Date.now().toString(36)
      sessionStorage.setItem(SESSION_KEY, id)
    }
    return id
  } catch {
    return 'no-storage'
  }
}

function detectOS(ua) {
  if (/Windows NT/i.test(ua)) return 'Windows'
  if (/Android/i.test(ua)) return 'Android'
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS'
  if (/Mac OS X/i.test(ua)) return 'macOS'
  if (/Linux/i.test(ua)) return 'Linux'
  return 'Unknown'
}

function detectBrowser(ua) {
  // Order matters — most of these also contain "Safari" or "Chrome".
  if (/SamsungBrowser/i.test(ua)) return 'Samsung Internet'
  if (/Edg\//i.test(ua)) return 'Edge'
  if (/OPR\/|Opera/i.test(ua)) return 'Opera'
  if (/Firefox\//i.test(ua)) return 'Firefox'
  if (/Chrome\//i.test(ua)) return 'Chrome'
  if (/Safari\//i.test(ua)) return 'Safari'
  return 'Unknown'
}

function detectDeviceType(ua) {
  if (/iPad|Tablet/i.test(ua)) return 'Tablet'
  if (/Android(?!.*Mobile)/i.test(ua)) return 'Tablet'
  if (/Mobi|iPhone|Android/i.test(ua)) return 'Phone'
  return 'Desktop'
}

export function deviceInfo() {
  const ua = navigator.userAgent || ''
  let touch = false
  try { touch = navigator.maxTouchPoints > 0 || 'ontouchstart' in window } catch {}
  let timezone = ''
  try { timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '' } catch {}

  return {
    device: detectDeviceType(ua),
    os: detectOS(ua),
    browser: detectBrowser(ua),
    screen: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    dpr: window.devicePixelRatio || 1,
    touch: touch ? 'yes' : 'no',
    language: navigator.language || '',
    timezone,
    referrer: document.referrer || 'direct',
    ua,
  }
}

function post(payload) {
  if (!tracking.endpoint) return
  const body = JSON.stringify({
    ...payload,
    session: sessionId(),
    at: new Date().toISOString(),
  })

  try {
    // text/plain keeps this a "simple" request, so the browser skips the CORS
    // preflight that Apps Script's redirect chain can't answer. no-cors means we
    // can't read the reply — fine, this is fire-and-forget logging.
    fetch(tracking.endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body,
      keepalive: true,
    }).catch(() => {})
  } catch {
    /* never let logging break the page */
  }
}

let visitLogged = false

/** Called once when the site opens. */
export function logVisit() {
  if (visitLogged) return
  visitLogged = true
  post({ type: 'visit', ...deviceInfo() })
}

/** Called as she moves through the stages. */
export function logEvent(event, detail = '') {
  const d = deviceInfo()
  post({ type: 'event', event, detail, device: d.device, os: d.os, browser: d.browser })
}

/** Called when she hits "Send my list". */
export function logGifts(items) {
  const d = deviceInfo()
  post({
    type: 'gifts',
    count: items.length,
    items: items.join(' | '),
    device: d.device,
    os: d.os,
    browser: d.browser,
  })
}

export const trackingEnabled = () => Boolean(tracking.endpoint)
