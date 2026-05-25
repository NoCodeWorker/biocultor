#!/bin/bash
CONTAINER="biocultor-db"
DB_USER="biocultor"
DB_NAME="biocultor"

echo "=== VARIANTES DE PRODUCTOS EN BD ==="
docker exec "$CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -c "
SELECT v.sku, v.price, v.size, p.name
FROM \"Variant\" v
JOIN \"Product\" p ON v.\"productId\" = p.id
ORDER BY p.name, v.price ASC;
"
