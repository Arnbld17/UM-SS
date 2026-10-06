const COOKIE_NAME = "um_ss_gate";

function allow() {
  return new Response(null, {
    status: 200,
    headers: {
      "x-middleware-next": "1",
    },
  });
}

function redirect(location) {
  return new Response(null, {
    status: 302,
    headers: {
      Location: location,
      "Cache-Control": "no-store",
    },
  });
}

function timingSafeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const encoder = new TextEncoder();
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);
  if (aBytes.length !== bBytes.length) return false;

  let result = 0;
  for (let i = 0; i < aBytes.length; i += 1) {
    result |= aBytes[i] ^ bBytes[i];
  }
  return result === 0;
}

function expectedToken(user, pass) {
  return btoa(`${user}:${pass}`);
}

function getCookie(request, name) {
  const raw = request.headers.get("cookie") || "";
  const parts = raw.split(";").map((part) => part.trim());
  for (const part of parts) {
    if (part.startsWith(`${name}=`)) {
      return decodeURIComponent(part.slice(name.length + 1));
    }
  }
  return "";
}

function isPublicPath(pathname) {
  if (
    pathname === "/login.html" ||
    pathname === "/api/login" ||
    pathname === "/favicon.ico" ||
    pathname === "/llms.txt" ||
    pathname === "/styles.css" ||
    pathname === "/main.js"
  ) {
    return true;
  }

  // Images/icons must load even before the login cookie is available.
  return (
    pathname.startsWith("/assets/") ||
    /\.(?:css|js|png|jpe?g|gif|svg|webp|ico|woff2?|ttf|txt)$/i.test(pathname)
  );
}

function safeNextPath(value) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }
  return value;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};

export default async function middleware(request) {
  const user = process.env.BASIC_AUTH_USER || "";
  const pass = process.env.BASIC_AUTH_PASS || "";
  const { pathname } = new URL(request.url);

  // Local/dev or unset env: site stays open.
  if (!user || !pass) {
    return allow();
  }

  const token = expectedToken(user, pass);

  if (pathname === "/api/login" && request.method === "POST") {
    let form;
    try {
      form = await request.formData();
    } catch {
      return redirect("/login.html?error=1");
    }

    const providedUser = String(form.get("username") || "");
    const providedPass = String(form.get("password") || "");
    const nextPath = safeNextPath(String(form.get("next") || "/"));

    if (!timingSafeEqual(providedUser, user) || !timingSafeEqual(providedPass, pass)) {
      return redirect(`/login.html?error=1&next=${encodeURIComponent(nextPath)}`);
    }

    const response = redirect(nextPath);
    response.headers.append(
      "Set-Cookie",
      `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`
    );
    return response;
  }

  if (isPublicPath(pathname)) {
    return allow();
  }

  const cookie = getCookie(request, COOKIE_NAME);
  if (timingSafeEqual(cookie, token)) {
    return allow();
  }

  const url = new URL(request.url);
  const next = safeNextPath(url.pathname + url.search);
  return redirect(`/login.html?next=${encodeURIComponent(next)}`);
}
