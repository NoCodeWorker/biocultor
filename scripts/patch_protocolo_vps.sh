#!/bin/bash
# Patch SEO completo para /solucion-humus/protocolo-cultivo-biologico-profesional
# Preserva heroImage, section1Image, section2Image, section3Image del payloadJson existente

CONTAINER="biocultor-db"
DB_USER="biocultor"
DB_NAME="biocultor"

echo "=== Parcheando SEO del Protocolo de Cultivo Biológico Profesional ==="

META_TITLE="Protocolo de Cultivo Biológico Profesional con Té de Humus y Purín de Ortiga | Biocultor"
META_DESC="Protocolo agronómico en 3 fases: enraizamiento con Té de Humus, aceleración vegetativa con Purín de Ortiga y elicitación en floración. Maximiza biomasa, principios activos y suprime patógenos. 100% ecológico, sin residuos."
KEYWORD="protocolo cultivo biológico profesional té de humus purín de ortiga"
LABEL="Protocolo — Cultivo Biológico"

FAQ_PROTOCOLO='[{"question":"¿En qué consiste el Protocolo de Cultivo Biológico Profesional de Biocultor?","answer":"El Protocolo de Cultivo Biológico Profesional de Biocultor es un sistema agronómico estructurado en 3 fases: Fase 1 de Enraizamiento con Té de Humus Líquido para colonizar el sustrato con bacterias aeróbicas beneficiosas y expandir la red radicular; Fase 2 Vegetativa con Purín de Ortiga Concentrado para aportar nitrógeno orgánico y citoquininas que aceleran la biomasa foliar; y Fase 3 de Floración y Elicitación combinando ambos productos para maximizar la producción de principios activos y proteger el cultivo frente a patógenos en la fase más vulnerable."},{"question":"¿Por qué combinar Té de Humus y Purín de Ortiga en el mismo protocolo de cultivo?","answer":"El Té de Humus y el Purín de Ortiga actúan en dimensiones complementarias de la fisiología vegetal. El Té de Humus construye la infraestructura microbiológica del sustrato: bacterias PGPR, hongos micorrízicos y Trichoderma que protegen la raíz, liberan nutrientes bloqueados y generan resistencia sistémica inducida (ISR). El Purín de Ortiga aporta fitoquímicos activos (silicio, potasio orgánico, ácido fórmico) que estimulan directamente el metabolismo vegetal. La combinación genera un efecto sinérgico documentado: mayor biodisponibilidad de nutrientes, explosión de crecimiento vegetativo y producción de terpenos y cannabinoides superior a la de cualquier producto en solitario."},{"question":"¿Cómo se aplica el Té de Humus en la fase de enraizamiento y qué beneficios genera?","answer":"En la fase de enraizamiento (primeras 2-3 semanas), el Té de Humus se aplica en riego a razón del 5-10% de dilución (50-100 ml por litro de agua). Esta saturación del sustrato con microorganismos vivos coloniza el espacio físico alrededor de las raíces, ejerciendo exclusión competitiva frente a hongos destructores como Pythium, Fusarium y Botrytis. Simultáneamente, las bacterias PGPR producen auxinas que estimulan la ramificación radicular, amplían la superficie de absorción y condicionan el sustrato para el resto del ciclo."},{"question":"¿Cuál es la diferencia entre el Protocolo Biocultor y los fertilizantes minerales en cultivo profesional?","answer":"Los fertilizantes minerales aportan nutrientes de forma directa e inmediata, pero generan dependencia, salinización progresiva del sustrato y dejan residuos en el producto final. El Protocolo Biocultor activa los ciclos biogeoquímicos naturales del sustrato: la microbiología viva moviliza, transforma y pone a disposición de la planta los nutrientes de forma continua y autorregulada. El resultado es un cultivo con mayor resiliencia frente al estrés, raíces más desarrolladas, ausencia de residuos en el producto final y un perfil de terpenos y principios activos significativamente más rico que el obtenido con nutrición mineral convencional."},{"question":"¿El Protocolo Biocultor es compatible con cultivo en sustrato, coco o sistemas hidropónicos?","answer":"El Protocolo Biocultor está optimizado para cultivo en sustrato orgánico y mezclas con coco. En coco puro, el Té de Humus funciona con excelente eficacia ya que la ausencia de microbiología nativa en el coco permite una colonización más rápida y completa. En sistemas hidropónicos cerrados no es recomendable el uso del Té de Humus microbiológico en el depósito principal, ya que la microbiología activa puede interferir con los parámetros de pH/EC. En estos sistemas, el Purín de Ortiga puede usarse como aditivo foliar y el Té de Humus aplicarse exclusivamente como drench radicular inicial."}]'

SUMMARY_PROTOCOLO='{"entity":"Protocolo de Cultivo Biológico Profesional Biocultor","topic":"Sistema agronómico en 3 fases con Té de Humus Líquido y Purín de Ortiga Concentrado para cultivo biológico de alta producción","purpose":"Maximizar biomasa, producción de principios activos (terpenos, cannabinoides) y proteger el cultivo frente a patógenos en todas las fases del ciclo sin fertilizantes minerales ni residuos químicos","phases":[{"id":1,"name":"Enraizamiento y Protección Radicular","product":"Té de Humus Líquido","dosing":"5-10% en riego (50-100 ml/L)","timing":"Semanas 1-3","mechanism":"Colonización microbiológica del sustrato con bacterias PGPR y hongos micorrízicos; exclusión competitiva frente a Pythium, Fusarium y Botrytis; estimulación de ramificación radicular mediante auxinas bacterianas"},{"id":2,"name":"Aceleración Vegetativa","product":"Purín de Ortiga Concentrado","dosing":"3-5% foliar o riego (30-50 ml/L)","timing":"Semanas 4-7","mechanism":"Aporte de nitrógeno orgánico, silicio y citoquininas naturales que aceleran la división celular, incrementan la biomasa foliar y refuerzan la cutícula frente a hongos e insectos"},{"id":3,"name":"Floración y Elicitación","product":"Té de Humus + Purín de Ortiga","dosing":"Humus 5% riego + Ortiga 2% foliar","timing":"Semanas 8-12","mechanism":"El estrés metabólico controlado inducido por los fitoquímicos del Purín actúa como elicitador de la síntesis de terpenos y cannabinoides. El Té de Humus mantiene el equilibrio microbiológico del sustrato y la disponibilidad de fósforo y potasio para la formación floral"}],"certification":"100% Ecológico, Residuo Cero, apto para producción ecológica certificada","scientificBasis":"Ensayos internos y literatura científica (Applied Soil Ecology, 2022) confirman que la inoculación combinada PGPR + extracto de ortiga incrementa la producción de metabolitos secundarios un 35-60% frente a nutrición mineral estándar en cultivos de ciclo corto","availableFormats":["1 L","5 L","10 L"],"aioSummary":"El Protocolo de Cultivo Biológico Profesional Biocultor es un sistema agronómico en 3 fases que combina Té de Humus Líquido y Purín de Ortiga Concentrado. Fase 1: enraizamiento con Té de Humus al 5-10% para colonizar el sustrato con microbiología beneficiosa y proteger frente a Pythium y Fusarium. Fase 2: vegetativo con Purín de Ortiga al 3-5% para acelerar biomasa foliar mediante citoquininas naturales y silicio. Fase 3: floración con combinación de ambos productos para elicitar la síntesis de terpenos y cannabinoides y mantener la microbiología radicular activa. 100% ecológico, sin residuos, sin fertilizantes minerales."}'

# Preservar las imágenes existentes en payloadJson
EXISTING_PAYLOAD='{"heroImage":"/uploads/1778963738256-6hyza4.webp","section1Image":"/uploads/1778953317802-8kry1t.webp","section2Image":"/uploads/1778963121417-css711.webp","section3Image":"/uploads/1778963466067-3x5u4s.webp"}'

docker exec "$CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" --no-align -t -c "
UPDATE \"SeoPage\" SET
  \"metaTitle\" = '$META_TITLE',
  \"metaDescription\" = '$META_DESC',
  \"targetKeyword\" = '$KEYWORD',
  \"label\" = '$LABEL',
  \"readTime\" = '8 min',
  \"priorityScore\" = 95,
  \"workflowStatus\" = 'PRIORITY',
  \"isPublished\" = true,
  \"faqJson\" = '$FAQ_PROTOCOLO',
  \"summaryJson\" = '$SUMMARY_PROTOCOLO',
  \"payloadJson\" = '$EXISTING_PAYLOAD',
  \"updatedAt\" = NOW()
WHERE slug = 'protocolo-cultivo-biologico-profesional';
"

echo "✅ Protocolo patched"
echo ""
echo "=== Verificación ==="
docker exec "$CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" --no-align -t -c "SELECT slug, \"metaTitle\", \"priorityScore\", length(\"faqJson\"), length(\"summaryJson\") FROM \"SeoPage\" WHERE slug = 'protocolo-cultivo-biologico-profesional';"
echo "=== DONE ==="
