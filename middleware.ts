import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// HTTP Basic Auth para todo el panel `/admin/*` y los endpoints de seed.
// Credenciales en `.env`: USER_ADMIN, PASSWORD_ADMIN.
//
// Decisiones:
// - Edge runtime: usamos `atob` (web standard) y comparación manual
//   constant-time (ni timingSafeEqual de node:crypto está disponible aquí).
// - Si las env vars no están configuradas, devolvemos 503 explícito en lugar
//   de aceptar cualquier credencial. Falla cerrado, no abierto.
// - El realm "Biocultor Admin" hace que el navegador muestre un prompt nativo.
//   Persiste mientras el navegador no se cierre o el usuario no haga logout
//   desde su gestor de credenciales.

function constantTimeEqual(a: string, b: string): boolean {
  // Forzamos misma longitud expandiendo el más corto para no exponer
  // diferencias de longitud por timing. El resultado solo es true si
  // las longitudes coincidían Y todos los bytes son iguales.
  const len = Math.max(a.length, b.length);
  let mismatch = a.length === b.length ? 0 : 1;
  for (let i = 0; i < len; i++) {
    const ca = i < a.length ? a.charCodeAt(i) : 0;
    const cb = i < b.length ? b.charCodeAt(i) : 0;
    mismatch |= ca ^ cb;
  }
  return mismatch === 0;
}

function unauthorized(message = 'Auth required') {
  return new NextResponse(message, {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Biocultor Admin", charset="UTF-8"',
      'Cache-Control': 'no-store',
    },
  });
}

export function middleware(req: NextRequest) {
  // Lectura en runtime (no a nivel de módulo) para evitar que Next inline
  // los valores en build time como `undefined` cuando el build no los tiene.
  const ADMIN_USER = process.env.USER_ADMIN ?? '';
  const ADMIN_PASS = process.env.PASSWORD_ADMIN ?? '';

  if (!ADMIN_USER || !ADMIN_PASS) {
    return new NextResponse(
      'Admin no configurado: faltan USER_ADMIN o PASSWORD_ADMIN en .env',
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const header = req.headers.get('authorization');
  if (!header || !header.startsWith('Basic ')) {
    return unauthorized();
  }

  let decoded: string;
  try {
    decoded = atob(header.slice(6).trim());
  } catch {
    return unauthorized('Basic auth malformado');
  }

  const sep = decoded.indexOf(':');
  if (sep === -1) return unauthorized();

  const user = decoded.slice(0, sep);
  const pass = decoded.slice(sep + 1);

  // Importante: ejecutar AMBAS comparaciones aunque la primera falle, para
  // no filtrar por timing si el error fue en usuario o en contraseña.
  const userOk = constantTimeEqual(user, ADMIN_USER);
  const passOk = constantTimeEqual(pass, ADMIN_PASS);
  if (!(userOk && passOk)) return unauthorized();

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/api/seed',
    '/api/seed/:path*',
    '/api/seed-seo',
    '/api/seed-seo/:path*',
  ],
};
