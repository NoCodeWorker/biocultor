# DEPLOY.md — Guía de Despliegue Biocultor

> **Arquitectura**: Next.js + PostgreSQL corriendo en Docker Compose, con Traefik como reverse proxy (SSL automático via Let's Encrypt).

---

## ⚡ Despliegue rápido (flujo estándar)

```bash
# 1. Conectar al VPS
ssh -i ~/.ssh/id_ed25519 root@187.124.220.48

# 2. Ir a la carpeta del proyecto
cd /opt/biocultor

# 3. Traer los últimos cambios
git pull origin main

# 4. Reconstruir y reiniciar el contenedor web
docker compose up -d --build web
```

El contenedor tardará ~60-90 segundos en compilar. La web quedará disponible en https://biocultor.com automáticamente.

---

## 🏗️ Arquitectura del Stack

```
Internet
    │
    ▼
Traefik (reverse proxy, SSL)
    │  Puerto 80/443 en el host
    ▼
biocultor-web  (Next.js, puerto 3000 interno)
    │  Red Docker: biocultor_internal
    ▼
biocultor-db   (PostgreSQL 16, puerto 5432 interno)
```

### Servicios Docker

| Contenedor | Imagen | Rol |
|---|---|---|
| `biocultor-web` | `biocultor-web:latest` | Aplicación Next.js |
| `biocultor-db` | `postgres:16-alpine` | Base de datos |
| `traefik-aiwf-traefik-1` | `traefik:latest` | Proxy inverso + SSL |

---

## ⚠️ Reglas importantes

### ❌ NUNCA usar PM2 directamente
El proceso Node.js se gestiona **dentro del contenedor Docker**. Si arrancas PM2 en el host, no podrá conectar a la base de datos porque `db:5432` solo existe en la red interna de Docker.

```bash
# ❌ MAL — no usar:
pm2 start npm --name "biocultor" -- start

# ✅ BIEN — siempre usar Docker Compose:
docker compose up -d --build web
```

### 🔒 Variables de entorno
El archivo `.env` en `/opt/biocultor/.env` es la fuente de verdad del servidor. **No se commitea al repositorio**.

Campos críticos:
```env
DATABASE_URL="postgresql://biocultor:PASSWORD@db:5432/biocultor?schema=public"
#                                              ^^
#                          "db" es el nombre del servicio Docker — NO cambiar a localhost
```

### 📁 Imágenes subidas (uploads)
Las imágenes del blog y productos se guardan en `/opt/biocultor/uploads/` en el **host**, y se montan como volumen en el contenedor:
```yaml
volumes:
  - ./uploads:/app/public/uploads
```
Esto significa que las imágenes **sobreviven** a los rebuilds del contenedor. ✅

---

## 🔧 Comandos útiles

```bash
# Ver estado de los contenedores
docker ps

# Ver logs en tiempo real del contenedor web
docker logs -f biocultor-web

# Ver logs de la base de datos
docker logs -f biocultor-db

# Reiniciar solo el contenedor web (sin rebuild)
docker restart biocultor-web

# Acceder a la base de datos (desde dentro del contenedor)
docker exec -it biocultor-db psql -U biocultor -d biocultor

# Ejecutar migraciones manualmente
docker exec biocultor-web node node_modules/prisma/build/index.js migrate deploy
```

---

## 🆘 Solución de problemas

### La web no carga / 502 Bad Gateway
```bash
docker logs -f biocultor-web
```
Busca errores de migración o de arranque de Next.js.

### Error: Can't reach database server at `db:5432`
Comprueba que el contenedor de la BD está corriendo:
```bash
docker ps | grep biocultor-db
```
Si no está, arráncalo:
```bash
docker compose up -d db
```

### Error de autenticación de base de datos
Verifica que el `DATABASE_URL` en `.env` coincide con `POSTGRES_USER`, `POSTGRES_PASSWORD` y `POSTGRES_DB`.

### Imagen subida desde el admin no aparece en la web
Las imágenes se guardan en `./uploads/` en el host. Verifica que el volumen está montado:
```bash
ls /opt/biocultor/uploads/
```

---

## 🚀 Primer despliegue (setup desde cero)

Ver `DEPLOY.md` sección "Setup inicial" — pendiente de documentar.
