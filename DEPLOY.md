# Despliegue — Biocultor en VPS Hostinger (KVM 2 · Ubuntu 24.04 · Traefik)

Guía paso a paso para el primer deploy y los subsiguientes.

---

## 0. Pre-requisitos

- [ ] VPS con Docker + Traefik funcionando (ya lo tienes)
- [ ] DNS: `biocultor.com` y `www.biocultor.com` → A record apuntando a la IP del VPS
- [ ] Acceso SSH al VPS como root o usuario con permisos de Docker
- [ ] Repo GitHub: `https://github.com/NoCodeWorker/biocultor`

---

## 1. Preparar repo local (Windows) y primer push

```bash
cd "d:/BIOCULTOR/BIOCULTOR SHOP/biocultor"

# Verificar que .env NO está trackeado (debe fallar → bien)
git ls-files --error-unmatch .env

# Añadir remote y hacer commit inicial
git remote add origin https://github.com/NoCodeWorker/biocultor.git
git add -A
git commit -m "chore: initial commit + docker deploy setup"
git branch -M main
git push -u origin main
```

---

## 2. Auditar y limpiar el VPS

SSH al VPS y:

```bash
# Ver qué hay corriendo (identificar 'inkdie')
docker ps -a
docker network ls          # ← anota el nombre de la red Traefik
docker volume ls

# Ver la config de Traefik (típicamente en /opt/traefik o similar)
find /opt /root /home -maxdepth 3 -name "docker-compose*.yml" 2>/dev/null
find /opt /root /home -maxdepth 3 -name "traefik.yml" 2>/dev/null

# Eliminar inkdie (ajustar comandos según cómo esté desplegado)
# Si es docker compose:
cd /path/a/inkdie && docker compose down -v
# Si es contenedor suelto:
docker stop <container-id> && docker rm <container-id>
docker image rm <imagen-inkdie>
```

**⚠️ Antes de borrar:** si `inkdie` tiene DB/volúmenes con datos, haz backup:
```bash
docker run --rm -v <volumen>:/data -v $(pwd):/backup alpine tar czf /backup/inkdie-backup.tar.gz /data
```

---

## 3. Clonar y configurar en el VPS

```bash
# Directorio estándar para apps
sudo mkdir -p /opt/biocultor && sudo chown $USER:$USER /opt/biocultor
cd /opt/biocultor

# Clonar
git clone https://github.com/NoCodeWorker/biocultor.git .

# Crear .env con secretos reales (NO subir a git)
cp .env.example .env
nano .env   # rellenar todos los valores
```

Variables que DEBES cambiar en `.env`:
- `POSTGRES_PASSWORD` → una contraseña fuerte (generar con `openssl rand -base64 32`)
- `DATABASE_URL` → `postgresql://biocultor:LA_PASS_DE_ARRIBA@db:5432/biocultor?schema=public`
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` → claves **test** primero
- `RESEND_API_KEY`, `PACKLINK_API_KEY`, `OPENAI_API_KEY` → claves reales
- `NEXT_PUBLIC_APP_URL` → `https://biocultor.com`

---

## 4. Ajustar `docker-compose.yml` a la red Traefik real

Si la red NO se llama `traefik`, editar en `docker-compose.yml`:

```yaml
networks:
  traefik:
    external: true
    name: proxy         # ← aquí el nombre real que viste en `docker network ls`
```

Y también el label:
```
- "traefik.docker.network=proxy"
```

Si tu certresolver tampoco se llama `letsencrypt`, ajustar:
```
- "traefik.http.routers.biocultor.tls.certresolver=<nombre-real>"
```

---

## 5. Build + arranque

```bash
cd /opt/biocultor
docker compose build
docker compose up -d
docker compose logs -f web    # seguir arranque, Ctrl+C para salir
```

En el primer arranque, el contenedor `web` ejecuta `prisma migrate deploy` automáticamente (ver `command:` en compose) y crea las tablas en Postgres.

---

## 6. Seed de datos (producto + variantes)

El proyecto solo tiene `seed-seo.mts`. Para el producto base necesitas crear un seed o insertarlo a mano:

```bash
# Entrar al contenedor
docker compose exec web sh

# Opción A: con Prisma Studio (si está disponible)
# Opción B: con psql desde el contenedor db
docker compose exec db psql -U biocultor -d biocultor

# Ejecutar el seed SEO (opcional, si quieres poblar páginas SEO)
docker compose exec web node --experimental-strip-types scripts/seed-seo.mts
```

---

## 7. Verificación

```bash
# Contenedores arriba
docker compose ps

# Traefik debería haber emitido cert SSL; comprobar:
curl -I https://biocultor.com

# Logs en vivo
docker compose logs -f
```

Abrir en navegador: `https://biocultor.com` — debería cargar la home.

---

## 8. Webhook de Stripe (test)

En [dashboard.stripe.com/test/webhooks](https://dashboard.stripe.com/test/webhooks):
- Endpoint: `https://biocultor.com/api/webhook`
- Copia el `whsec_...` que te da y ponlo en `.env` como `STRIPE_WEBHOOK_SECRET`
- `docker compose up -d` (recarga env)

---

## 9. Deploys posteriores

```bash
cd /opt/biocultor
git pull

# 1. Asegurar que la DB está arriba (build la necesita para ISR).
docker compose up -d db

# 2. Rebuild con DATABASE_URL disponible en build-time.
docker compose build web

# 3. Recrear el contenedor web con la nueva imagen.
docker compose up -d --force-recreate web

# 4. Seguir arranque.
docker compose logs -f web
```

**Por qué `up -d db` antes del build**: la home usa ISR (`export const revalidate = 1800`), por lo que Next intenta pre-renderizarla en build-time consultando Prisma. El Dockerfile espera `DATABASE_URL` como `ARG` (ver `docker-compose.yml → build.args`) y el builder necesita resolver el hostname `db` — eso exige que la red `biocultor_internal` esté creada (sucede la primera vez que levantas `db`).

Si el build falla con `Environment variable not found: DATABASE_URL`:
- Verifica que `.env` contiene `DATABASE_URL=postgresql://…`.
- Verifica que `db` está arriba: `docker compose ps db`.
- La primera vez que haces deploy desde cero: sigue el orden del bloque anterior (primero `up -d db`, luego `build web`, luego `up web`).

---

## Troubleshooting

**Next build falla en `npm run build`** por Prisma queries en páginas server:
- Opción A (rápida, sin caching): añadir `export const dynamic = 'force-dynamic'` a la página — evita pre-render en build a cambio de SSR por request.
- Opción B (recomendada, con ISR): la página queda con `export const revalidate = N`. Requiere:
  1. `DATABASE_URL` en `.env` raíz del proyecto.
  2. `docker compose up -d db` antes de `docker compose build web` (para que la red `biocultor_internal` exista y el builder pueda conectar al `db`).
  3. `build.args.DATABASE_URL` y `build.network: biocultor_internal` configurados en `docker-compose.yml` (ya hecho).
  4. `ARG DATABASE_URL` + `ENV DATABASE_URL=$DATABASE_URL` en el stage `builder` del `Dockerfile` antes de `RUN npm run build` (ya hecho).

**Traefik no emite cert SSL:**
- DNS: `dig biocultor.com` debe resolver a la IP del VPS
- Puertos 80/443 abiertos en UFW/firewall Hostinger
- `docker logs traefik` para ver errores ACME

**Contenedor `web` reinicia en bucle:**
- `docker compose logs web` — suele ser `DATABASE_URL` mal formado o DB aún no ready
- El healthcheck del servicio `db` debería evitar esto, pero si persiste: `docker compose restart web`

**Rotar contraseña DB después del deploy:**
- Cambiar `POSTGRES_PASSWORD` en `.env` NO afecta a la DB ya creada. Hay que entrar con `ALTER USER biocultor WITH PASSWORD '...'` o recrear el volumen (perdiendo datos).
