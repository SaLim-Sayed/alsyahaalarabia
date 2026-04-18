import {
  cookieHeaderFromResponse,
  parseWpaHoneypot,
  parseWpNonce,
  parseWpSubmit,
} from "./wpLoginForm";
import { WP_LOST_PASSWORD_URL } from "./api";

export type PasswordResetErrorCode = "network" | "parse" | "server";

export type PasswordResetResult =
  | { ok: true }
  | { ok: false; error: PasswordResetErrorCode };

function interpretLostPasswordResponse(html: string, urlHints: string): boolean {
  if (/id=["']login_error["']/i.test(html)) return false;
  if (/checkemail/i.test(urlHints)) return true;
  if (/id=["']login-message["']/i.test(html)) return true;
  return false;
}

export async function requestWordPressPasswordReset(
  userLogin: string,
): Promise<PasswordResetResult> {
  try {
    const getRes = await fetch(WP_LOST_PASSWORD_URL, {
      headers: { Accept: "text/html,*/*" },
    });
    if (!getRes.ok) return { ok: false, error: "server" };

    const cookie = cookieHeaderFromResponse(getRes);
    const pageHtml = await getRes.text();
    const wpSubmit = parseWpSubmit(pageHtml);
    if (!wpSubmit) return { ok: false, error: "parse" };

    const nonce = parseWpNonce(pageHtml);
    const wpa = parseWpaHoneypot(pageHtml);

    const body = new URLSearchParams();
    body.set("user_login", userLogin.trim());
    body.set("redirect_to", "");
    body.set("action", "lostpassword");
    body.set("wpa_initiator", "");
    body.set("wp-submit", wpSubmit);
    if (nonce) body.set("_wpnonce", nonce);
    if (wpa) body.set(wpa.name, wpa.value);

    const postHeaders: Record<string, string> = {
      Accept: "text/html,*/*",
      "Content-Type": "application/x-www-form-urlencoded",
      Referer: WP_LOST_PASSWORD_URL,
    };
    if (cookie) postHeaders.Cookie = cookie;

    const postRes = await fetch(WP_LOST_PASSWORD_URL, {
      method: "POST",
      headers: postHeaders,
      body: body.toString(),
    });

    const location = postRes.headers.get("Location") ?? "";
    const postHtml = await postRes.text();
    const urlHints = `${location} ${postRes.url}`;

    if (!postRes.ok) return { ok: false, error: "server" };

    const success = interpretLostPasswordResponse(postHtml, urlHints);
    return success ? { ok: true } : { ok: false, error: "server" };
  } catch {
    return { ok: false, error: "network" };
  }
}
