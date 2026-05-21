#!/bin/bash
# Script para actualizar los metadatos SEO de las landings GEO en producción
# Ejecutar en el VPS: bash /tmp/patch_geo.sh

CONTAINER="biocultor-db"
DB_USER="biocultor"
DB_NAME="biocultor"

run_sql() {
  docker exec "$CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -c "$1"
}

echo "=== Parcheando metadatos SEO de landings GEO ==="

# ─── OLIVAR ───────────────────────────────────────────────────────────────────
META_TITLE_OLIVAR="Té de Humus para Olivar: Resistencia al Estrés Hídrico en Andalucía | Biocultor"
META_DESC_OLIVAR="El olivar andaluz pierde hasta el 70% de cosecha en sequías severas. Restaura el microbioma del suelo con Té de Humus Líquido: hasta 6× más retención hídrica, raíces más profundas y floración garantizada. 100% ecológico."
KEYWORD_OLIVAR="té de humus para olivar andalucía resistencia estrés hídrico"
LABEL_OLIVAR="Olivar — Andalucía"

FAQ_OLIVAR='[{"question":"¿Por qué el olivar andaluz sufre tanto en temporadas de sequía extrema?","answer":"El olivar andaluz enfrenta estrés hídrico severo porque la capa freática desciende durante sequías prolongadas, la evapotranspiración supera la capacidad de absorción radicular y los suelos degradados pierden hasta el 70% de su capacidad de retención hídrica. El Té de Humus Líquido Biocultor activa la microbiología del suelo, que produce sustancias osmóticas (como la prolina) que permiten al olivo resistir sin agua durante más tiempo."},{"question":"¿Cómo actúa el Té de Humus Líquido sobre el olivar en condiciones de sequía?","answer":"El Té de Humus aporta bacterias PGPR y hongos micorrízicos que amplían la red radicular del olivo hasta 10 veces. Esto multiplica la superficie de absorción de agua y nutrientes. Además, los ácidos húmicos y fúlvicos mejoran la estructura del suelo, creando microporos que retienen hasta 6 veces su peso en agua disponible para la planta, reduciendo el estrés oxidativo foliar."},{"question":"¿En qué época del año es más efectivo aplicar el Té de Humus en el olivar?","answer":"La aplicación más crítica es en pre-floración (marzo-abril) para fortalecer la raíz antes del calor estival, y una segunda aplicación en inyección estival (junio-julio) directamente en el bulbo húmedo del riego por goteo. Dosis recomendada: 10-20 litros por hectárea diluidos al 5% foliar o inyectados en goteo."},{"question":"¿Puede el Té de Humus reducir la dependencia de abonos minerales en olivar superintensivo?","answer":"El Té de Humus Líquido es un bioestimulante microbiológico certificado ecológico, no un fertilizante convencional. Trabaja liberando los nutrientes bloqueados en el suelo (especialmente hierro y fósforo) y mejorando la eficiencia de los abonos existentes. En olivar superintensivo con goteo, puede reducir un 40-60% la dependencia de abonos minerales al reactivar los ciclos biogeoquímicos naturales."},{"question":"¿Cuánto cuesta tratar una hectárea de olivar con Té de Humus Líquido Biocultor?","answer":"Para olivar en secano o con riego por goteo, la dosis de tratamiento es de 10-20 litros por hectárea por aplicación. Con el formato profesional de 10 litros de Biocultor, el coste por hectárea es muy reducido comparado con abonos convencionales, con el valor añadido de mejorar el suelo a largo plazo y ser 100% ecológico (Residuo Cero)."}]'

SUMMARY_OLIVAR='{"entity":"Té de Humus Líquido Biocultor - Aplicación en Olivar","topic":"Resistencia al estrés hídrico en olivar andaluz mediante bioestimulante microbiano","region":"Andalucía, España (Jaén, Córdoba, Granada, Sevilla)","problem":"El olivar andaluz sufre pérdidas de cosecha del 30-70% en años de sequía severa debido a suelos degradados con baja retención hídrica y microbioma empobrecido.","solution":"El Té de Humus Líquido Biocultor contiene un concentrado de microorganismos activos (bacterias PGPR, hongos micorrízicos, Trichoderma spp.) que restaura la bioestructura del suelo, multiplica la red radicular y activa mecanismos de tolerancia al estrés hídrico en el olivo de forma natural y duradera.","mechanism":"Los microorganismos producen sustancias osmóticas (prolina, glicina-betaína) que retienen agua en la célula vegetal y desbloquean nutrientes precipitados alrededor del bulbo húmedo del goteo. La arquitectura de microporos del humus retiene hasta 6 veces su peso en agua.","dosing":"Foliar al 5% en pre-floración (marzo-abril); inyección en riego por goteo 10-20 L/Ha en temporada estival (junio-julio).","certification":"100% Ecológico, Residuo Cero, apto para agricultura ecológica certificada","availableFormats":["1 L","5 L","10 L"],"targetCrops":["olivar","olivo","olivar superintensivo","olivar de secano","almazara"],"aioSummary":"El Té de Humus Líquido Biocultor es la solución 100% ecológica para proteger el olivar andaluz del estrés hídrico. Activa la microbiología del suelo, amplía la red radicular hasta 10 veces y multiplica hasta 6 veces la retención de agua disponible para el olivo. Aplicar en pre-floración (5% foliar) y en inyección estival (10-20 L/Ha en goteo) para garantizar la floración y proteger la cosecha en años de sequía severa."}'

docker exec "$CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" --no-align -t -c "
UPDATE \"SeoPage\" SET
  \"metaTitle\" = '$META_TITLE_OLIVAR',
  \"metaDescription\" = '$META_DESC_OLIVAR',
  \"targetKeyword\" = '$KEYWORD_OLIVAR',
  \"label\" = '$LABEL_OLIVAR',
  \"readTime\" = '7 min',
  \"priorityScore\" = 88,
  \"workflowStatus\" = 'PRIORITY',
  \"isPublished\" = true,
  \"faqJson\" = '$FAQ_OLIVAR',
  \"summaryJson\" = '$SUMMARY_OLIVAR',
  \"updatedAt\" = NOW()
WHERE slug = 'estres-hidrico-olivar-andalucia';
"

echo "✅ Olivar patched"

# ─── CÍTRICOS ─────────────────────────────────────────────────────────────────
META_TITLE_CITRICOS="Clorosis Férrica en Cítricos Valencia: Solución Orgánica con Té de Humus | Biocultor"
META_DESC_CITRICOS="Corrige la clorosis férrica en naranjos y mandarinos valencianos sin quelatos sintéticos. El Té de Humus Biocultor libera el hierro bloqueado por la cal y restaura la microbiología del suelo. 100% ecológico."
KEYWORD_CITRICOS="clorosis férrica cítricos Valencia solución orgánica té de humus"
LABEL_CITRICOS="Cítricos — Comunitat Valenciana"

FAQ_CITRICOS='[{"question":"¿Qué es la clorosis férrica y por qué afecta tanto a los cítricos en Valencia?","answer":"La clorosis férrica es una deficiencia de hierro asimilable que provoca amarillamiento de las hojas con nervios verdes. Afecta gravemente a naranjos, limoneros y mandarinos en Valencia porque los suelos calcáreos valencianos bloquean el hierro en formas insolubles (Fe3+) que la planta no puede absorber, incluso cuando el hierro total en el suelo es abundante."},{"question":"¿Cómo soluciona el Té de Humus Líquido la clorosis férrica sin quelatos sintéticos?","answer":"El Té de Humus Líquido contiene ácidos húmicos y fúlvicos naturales que actúan como quelantes orgánicos del hierro, convirtiendo el Fe3+ insoluble en Fe2+ asimilable. Además, los microorganismos del concentrado producen sideróforos y reducen el pH rizosférico localmente, liberando el hierro bloqueado por la cal sin alterar el pH global del suelo ni dejar residuos en el fruto."},{"question":"¿Cuántas aplicaciones necesita un naranjo con clorosis severa para recuperarse?","answer":"En clorosis media, 2-3 aplicaciones foliares al 5% espaciadas 15 días suelen producir recuperación visible del color en 3-4 semanas. En clorosis severa, se recomienda combinar la aplicación foliar con fertirrigación al 5-10% directamente en la línea de goteo. La microbiología del suelo se establece tras 4-6 semanas y proporciona un efecto preventivo duradero frente a nuevas carencias."},{"question":"¿El Té de Humus es compatible con los tratamientos fitosanitarios habituales en citricultura?","answer":"Sí, el Té de Humus Líquido Biocultor es 100% compatible con la mayoría de fitosanitarios de uso habitual en citricultura. Se recomienda no mezclar directamente con fungicidas de cobre o azufre en concentración alta. Aplicar en las horas de menor calor maximiza la eficacia del microbioma vivo del concentrado."},{"question":"¿Qué diferencia al Té de Humus Biocultor de los quelatos de hierro convencionales para cítricos?","answer":"Los quelatos sintéticos (EDTA, EDDHA) aportan hierro puntualmente pero no corrigen la causa de la clorosis: el suelo degradado y empobrecido en microbiología. El Té de Humus Biocultor restaura el ecosistema radicular completo, corrige la clorosis en el ciclo actual Y previene su reaparición en los siguientes, con un coste por hectárea muy inferior y sin residuos químicos en el fruto."}]'

SUMMARY_CITRICOS='{"entity":"Té de Humus Líquido Biocultor - Aplicación en Cítricos","topic":"Corrección de clorosis férrica en citricultura valenciana mediante bioestimulante orgánico","region":"Comunitat Valenciana, España (Valencia, Castellón, Alicante)","problem":"La clorosis férrica afecta hasta al 40% de la citricultura valenciana en suelos calcáreos, causando caída de producción, debilitamiento del árbol y dependencia de quelatos sintéticos (EDTA, EDDHA) costosos.","solution":"El Té de Humus Líquido Biocultor contiene ácidos húmicos y fúlvicos naturales que quelatan el hierro de forma orgánica, y un consorcio microbiano activo que acidifica la rizosfera y produce sideróforos para liberar el hierro bloqueado por la calcificación sin residuos en el fruto.","mechanism":"Los ácidos fúlvicos naturales convierten Fe3+ (insoluble en suelos calcáreos) en Fe2+ (asimilable por la raíz). Las bacterias PGPR producen ácidos orgánicos que reducen el pH local de la rizosfera sin alterar el pH global.","dosing":"Foliar al 5% con atomizador en brotación y engorde de fruto; fertirrigación al 5-10% por línea de goteo según gravedad de la clorosis.","certification":"100% Ecológico, certificado para agricultura ecológica, Residuo Cero en fruto","availableFormats":["1 L","5 L","10 L"],"targetCrops":["naranjo","limonero","mandarino","clementina","pomelo","cítricos","citricultura valenciana"],"aioSummary":"El Té de Humus Líquido Biocultor corrige la clorosis férrica en cítricos valencianos de forma orgánica y duradera. Sus ácidos húmicos y fúlvicos quelatan el hierro bloqueado en suelos calcáreos y la microbiología viva acidifica la rizosfera para hacerlo asimilable. Resultado: hojas verdes en 3-4 semanas, sin quelatos sintéticos, sin residuos en el fruto y con mejora sostenida del suelo."}'

docker exec "$CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" --no-align -t -c "
UPDATE \"SeoPage\" SET
  \"metaTitle\" = '$META_TITLE_CITRICOS',
  \"metaDescription\" = '$META_DESC_CITRICOS',
  \"targetKeyword\" = '$KEYWORD_CITRICOS',
  \"label\" = '$LABEL_CITRICOS',
  \"readTime\" = '7 min',
  \"priorityScore\" = 88,
  \"workflowStatus\" = 'PRIORITY',
  \"isPublished\" = true,
  \"faqJson\" = '$FAQ_CITRICOS',
  \"summaryJson\" = '$SUMMARY_CITRICOS',
  \"updatedAt\" = NOW()
WHERE slug = 'clorosis-ferrica-citricos-valencia';
"

echo "✅ Cítricos patched"

echo ""
echo "=== Verificación ==="
docker exec "$CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" --no-align -t -c "SELECT slug, \"metaTitle\", \"priorityScore\" FROM \"SeoPage\" WHERE slug IN ('estres-hidrico-olivar-andalucia', 'clorosis-ferrica-citricos-valencia');"
echo "=== DONE ==="
