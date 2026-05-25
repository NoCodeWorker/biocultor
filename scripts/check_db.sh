#!/bin/bash
CONTAINER="biocultor-db"
DB_USER="biocultor"
DB_NAME="biocultor"

echo "=== CONSULTA DE LANDINGS EN BD ==="
docker exec "$CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -c "
SELECT slug, kind, \"isPublished\", \"priorityScore\", \"workflowStatus\"
FROM \"SeoPage\"
WHERE slug IN (
  'estres-hidrico-olivar-andalucia',
  'clorosis-ferrica-citricos-valencia',
  'protocolo-cultivo-biologico-profesional'
);
"
