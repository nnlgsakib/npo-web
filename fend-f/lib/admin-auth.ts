"use client"

// Admin key stored in a session cookie (expires on browser close)
// Path-scoped to '/admin-dash' and cleared when leaving admin area.

const ADMIN_KEY_COOKIE = "FLABD_admin_key"
const ADMIN_COOKIE_PATH = "/admin-dash"

function setCookie(name: string, value: string, options?: { path?: string; secure?: boolean; sameSite?: "Lax" | "Strict" | "None" }) {
  if (typeof document === "undefined") return
  const path = options?.path ?? "/"
  const sameSite = options?.sameSite ?? "Lax"
  const secure = options?.secure ? "; Secure" : ""
  // Session cookie (no expires/max-age) so it dies on browser close
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=${path}; SameSite=${sameSite}${secure}`
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const cookies = document.cookie ? document.cookie.split("; ") : []
  for (const c of cookies) {
    const [k, ...rest] = c.split("=")
    if (k === name) return decodeURIComponent(rest.join("="))
  }
  return null
}

function deleteCookie(name: string, path = "/") {
  if (typeof document === "undefined") return
  document.cookie = `${name}=; Path=${path}; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`
}

export function setAdminKey(key: string) {
  // Store as session cookie, scoped to admin routes
  setCookie(ADMIN_KEY_COOKIE, key, { path: ADMIN_COOKIE_PATH, sameSite: "Lax" })
}

export function getAdminKey(): string | null {
  // Try admin path cookie first
  const key = getCookie(ADMIN_KEY_COOKIE)
  return key
}

export function clearAdminKey() {
  // Clear cookie on both scoped path and root just in case
  deleteCookie(ADMIN_KEY_COOKIE, ADMIN_COOKIE_PATH)
  deleteCookie(ADMIN_KEY_COOKIE, "/")
}

export function isAdminAuthenticated(): boolean {
  return !!getAdminKey()
}
