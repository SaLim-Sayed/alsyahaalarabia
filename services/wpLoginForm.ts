/** Helpers for parsing WordPress `wp-login.php` HTML forms (lost password, register). */

export function parseWpSubmit(html: string): string | null {
  const ordered =
    html.match(/name=["']wp-submit["'][^>]*value=["']([^"']*)["']/i) ??
    html.match(/value=["']([^"']*)["'][^>]*name=["']wp-submit["']/i);
  return ordered?.[1] ?? null;
}

export function parseWpNonce(html: string): string | undefined {
  const m =
    html.match(/name=["']_wpnonce["'][^>]*value=["']([^"']*)["']/i) ??
    html.match(/value=["']([^"']*)["'][^>]*name=["']_wpnonce["']/i);
  return m?.[1];
}

export function parseWpaHoneypot(html: string): { name: string; value: string } | undefined {
  const block = html.match(
    /wpa_field_info\s*=\s*\{[^}]*"wpa_field_name"\s*:\s*"([^"]+)"[^}]*"wpa_field_value"\s*:\s*([^,}\s]+)/,
  );
  if (!block) return undefined;
  const rawVal = block[2].trim().replace(/^["']|["']$/g, "");
  return { name: block[1], value: rawVal };
}

/** Forward `Set-Cookie` for the next POST (needed on many Android WebViews / fetch stacks). */
/** Inner HTML of `registerform` (WordPress core registration). */
export function extractRegisterFormInnerHtml(html: string): string | null {
  const m = html.match(
    /<form[^>]*id=["']registerform["'][^>]*>([\s\S]*?)<\/form>/i,
  );
  return m?.[1] ?? null;
}

export function parseHiddenInputs(formInnerHtml: string): Record<string, string> {
  const out: Record<string, string> = {};
  const re = /<input[^>]+>/gi;
  let m;
  while ((m = re.exec(formInnerHtml))) {
    const tag = m[0];
    const type = (tag.match(/type=["']([^"']*)["']/i)?.[1] ?? "").toLowerCase();
    if (type !== "hidden") continue;
    const name = tag.match(/name=["']([^"']+)["']/i)?.[1];
    if (!name) continue;
    const vm = tag.match(/value=["']([^"']*)["']/i);
    out[name] = vm?.[1] ?? "";
  }
  return out;
}

export function cookieHeaderFromResponse(res: Response): string | undefined {
  const headers = res.headers as Headers & { getSetCookie?: () => string[] };
  if (typeof headers.getSetCookie === "function") {
    const list = headers.getSetCookie();
    if (!list?.length) return undefined;
    const pairs = list
      .map((sc) => sc.split(";")[0]?.trim())
      .filter((p): p is string => Boolean(p && p.includes("=")));
    return pairs.length ? pairs.join("; ") : undefined;
  }
  return undefined;
}
