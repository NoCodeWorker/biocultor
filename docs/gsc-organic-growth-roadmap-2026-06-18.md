# Informe GSC y Roadmap SEO/GEO/AIO para crecimiento orgánico premium

Fecha: 2026-06-18  
Propiedad GSC: `https://biocultor.com/`  
Fuente principal de datos: Google Search Console vía MCP local `mcp-gsc`  
Marco editorial obligatorio: `docs/decisions/ADR-002-editorial-evidence-policy.md`

## 1. Resumen ejecutivo

Biocultor tiene una base orgánica real pero todavía temprana. Google ya reconoce e indexa correctamente la home y las dos fichas de producto principales, incluidos rich results de producto, merchant listings, breadcrumbs y review snippets. La oportunidad está en convertir esa base en una arquitectura de autoridad alrededor de tres líneas de negocio:

1. Venta de té de humus de lombriz.
2. Venta de purín de ortiga concentrado.
3. Servicios profesionales de aplicación para jardines, césped, paisajistas, comunidades, chalets, empresas con jardines y complejos comerciales.

La señal actual en GSC muestra que el sitio empieza a ganar visibilidad por términos core de humus, pero aún no existe visibilidad orgánica para servicios, jardines premium, césped, paisajismo o mantenimiento de zonas verdes. Eso no es un fallo de demanda: es un gap de descubrimiento, enlazado, autoridad temática y cobertura semántica.

La estrategia recomendada no es publicar más contenido genérico. Es construir una red evidence-led, comercialmente orientada, donde cada pieza responda a una objeción de compra o contratación y enlace hacia producto o servicio con intención clara.

## 2. Datos actuales extraídos de GSC

### 2.1 Rendimiento global

Periodo 2026-05-21 a 2026-06-18:

| Métrica | Valor |
| --- | ---: |
| Clics | 12 |
| Impresiones | 263 |
| CTR | 4,56% |
| Posición media | 23,0 |

Periodo 2026-03-20 a 2026-06-18:

| Métrica | Valor |
| --- | ---: |
| Clics | 18 |
| Impresiones | 304 |
| CTR | 5,92% |
| Posición media | 21,1 |

Interpretación: el sitio está en etapa de arranque orgánico. Hay señales de indexación y primeros clics, pero la mayoría de términos están en segunda o tercera página. La prioridad no es optimizar por micro-CTR todavía; la prioridad es subir cobertura, autoridad y ranking medio.

### 2.2 Consultas con visibilidad

| Consulta | Clics | Impresiones | CTR | Posición |
| --- | ---: | ---: | ---: | ---: |
| te de humus de lombriz | 11 | 84 | 13,1% | 22,4 |
| te de humus | 0 | 41 | 0% | 16,8 |
| té de humus | 0 | 38 | 0% | 20,6 |
| te de lombriz | 0 | 23 | 0% | 27,3 |
| purin ortiga | 0 | 9 | 0% | 53,4 |
| purin de ortigas comprar | 0 | 3 | 0% | 25,7 |

Lectura:

- La familia "té de humus" ya tiene señales. Hay que empujar de posiciones 16-27 a top 10.
- La familia "purín de ortiga" está mucho más débil. Necesita clúster transaccional y comparativo propio.
- No hay visibilidad todavía para "jardín", "césped", "servicio", "paisajismo" o variantes premium.

### 2.3 Páginas con visibilidad

| Página | Clics | Impresiones | CTR | Posición |
| --- | ---: | ---: | ---: | ---: |
| `/producto/te-humus-liquido-premium` | 12 | 202 | 5,94% | 21,7 |
| `/` | 6 | 56 | 10,71% | 16,7 |
| `/producto/purin-ortiga-concentrado` | 0 | 37 | 0% | 24,2 |
| `/aprende/cuantas-plantas-marihuana-legales-espana` | 0 | 13 | 0% | 10 |
| `/aprende/comprar-te-de-humus-para-el-jardin...` | 0 | 5 | 0% | 37,8 |

Lectura:

- La ficha de té de humus es el activo comercial más importante y debe recibir más enlaces internos desde guías y landings.
- La ficha de purín necesita más soporte semántico y enlazado desde casos de uso.
- Parte de la visibilidad actual proviene de contenido no alineado con el público premium de jardines. Hay que redirigir la fuerza editorial hacia césped, jardines, paisajismo, mantenimiento y servicios.

### 2.4 Dispositivo y país

| Segmento | Clics | Impresiones | CTR | Posición |
| --- | ---: | ---: | ---: | ---: |
| España | 18 | 276 | 6,52% | 22,6 |
| Mobile | 14 | 93 | 15,05% | 12,6 |
| Desktop | 4 | 211 | 1,9% | 24,8 |

Lectura:

- España concentra el valor real.
- Mobile convierte mejor en SERP. Las páginas de servicio deben estar muy enfocadas en móvil: CTA visible, WhatsApp/contexto, precio orientativo, prueba social y formulario corto.
- Desktop tiene muchas impresiones y bajo CTR. Para público de empresas, paisajistas y administradores, hay que mejorar titles/descriptions y páginas B2B.

## 3. Estado de indexación

Inspección GSC de URLs críticas:

| URL | Estado GSC | Último rastreo | Rich results |
| --- | --- | --- | --- |
| `/` | Submitted and indexed | 2026-06-15 | Breadcrumbs |
| `/producto/te-humus-liquido-premium` | Submitted and indexed | 2026-06-16 | Product snippets, Merchant listings, Breadcrumbs, Review snippets |
| `/producto/purin-ortiga-concentrado` | Submitted and indexed | 2026-05-12 | Product snippets, Merchant listings, Breadcrumbs, Review snippets |
| `/servicios/regeneracion-cesped-y-jardines` | URL is unknown to Google | Never | None |
| `/servicios/te-humus-paisajistas-jardineros` | URL is unknown to Google | Never | None |
| Nuevos artículos de servicios | URL is unknown to Google | Never | None |

Riesgo: los activos de servicios existen, pero Google todavía no los conoce. Para posicionar servicios, el primer hito no es ranking; es descubrimiento, rastreo e indexación.

Acción inmediata recomendada:

1. Desplegar el commit local `8b4e8cb`, que enlaza los artículos de servicios desde `/aprende` y los añade de forma curada al sitemap.
2. Reenviar `https://biocultor.com/sitemap.xml` en GSC.
3. Solicitar inspección/indexación manual de las dos landings de servicios y de los 6 artículos nuevos.

## 4. Diagnóstico estratégico

### 4.1 Lo que ya funciona

- El producto de té de humus ya está indexado y obtiene los primeros clics.
- Google reconoce los rich results de producto y reviews.
- La home empieza a rankear por términos de extracto/humus.
- El sitemap no tiene errores ni warnings según GSC.
- La arquitectura ya soporta contenido editorial, producto, GEO y servicios.

### 4.2 Lo que falta

- Falta autoridad específica para "jardines premium", "césped", "chalets", "paisajistas", "mantenimiento de zonas verdes" y "servicio de aplicación".
- Falta indexación de servicios.
- Falta enlazado interno fuerte desde home, `/aprende`, artículos y páginas de producto hacia servicios.
- Falta capturar búsquedas con intención económica alta: comunidades, empresas, hoteles, parques empresariales, centros comerciales, urbanizaciones, chalets de alto valor.
- Falta contenido comparativo contra alternativas: abono químico, jardinero tradicional, mantillo, compost sólido, empresas de mantenimiento sin microbiología.
- Falta prueba visible para público premium: casos, fotos antes/después, garantías razonables, metodología, cobertura geográfica, proceso de visita.

## 5. Principio editorial obligatorio

Todo el crecimiento debe seguir ADR-002:

- Fuentes identificables.
- Evidencia traducida a decisión de compra.
- Limitaciones honestas.
- Citas visibles.
- Nada de promesas milagrosas.
- Nada de claims agronómicos cerrados si la fuente no los sostiene.

El sesgo de autoridad correcto para Biocultor es:

> "No vendemos magia verde; vendemos microbiología aplicada con criterio técnico, trazabilidad y una decisión clara: comprar producto si puedes aplicarlo bien, contratar servicio si necesitas diagnóstico, cálculo y ejecución profesional."

## 6. Público objetivo premium

### 6.1 Segmentos prioritarios

1. Chalets y viviendas unifamiliares de alto poder adquisitivo.
   - Dolor: jardín visible, césped amarillento, miedo a productos tóxicos, falta de tiempo.
   - Oferta: diagnóstico + aplicación + mantenimiento posterior.

2. Comunidades de vecinos y urbanizaciones.
   - Dolor: quejas, presupuesto, zonas comunes degradadas, necesidad de justificar intervención.
   - Oferta: informe simple + intervención por zonas + mantenimiento.

3. Paisajistas y jardineros profesionales.
   - Dolor: quieren mejorar resultados sin añadir complejidad ni riesgo.
   - Oferta: suministro profesional, cálculo de litros, aplicación puntual o protocolo.

4. Empresas con jardines, hoteles, residencias, restaurantes y complejos comerciales.
   - Dolor: imagen corporativa, tránsito, estética, costes de mantenimiento.
   - Oferta: servicio limpio, sin residuos visibles, con trazabilidad.

5. Campos deportivos, clubes y césped de uso intensivo.
   - Dolor: compactación, estrés, recuperación, costes.
   - Oferta: plan técnico con humus, riego y seguimiento.

### 6.2 Mensajes por segmento

| Segmento | Mensaje dominante |
| --- | --- |
| Chalet premium | "Recupera el jardín sin convertirte en técnico agrónomo." |
| Comunidad | "Intervención documentada, limpia y justificable ante vecinos." |
| Paisajista | "Microbiología aplicada sin improvisar litros ni logística." |
| Empresa | "Jardines con mejor presencia, menos ruido operativo y trazabilidad." |
| Centro comercial/hotel | "Mantenimiento visible, discreto y compatible con espacios de alto tránsito." |

## 7. Arquitectura de palabras clave objetivo

### 7.1 Pilar 1: Té de humus de lombriz

Objetivo: dominar búsquedas transaccionales e informacionales de producto.

Clusters:

- comprar té de humus de lombriz
- té de humus líquido
- extracto de humus de lombriz
- humus líquido para jardín
- humus líquido para césped
- té de humus para riego por goteo
- té de humus para plantas ornamentales
- té de humus para suelos compactados
- té de humus para jardín premium

### 7.2 Pilar 2: Purín de ortiga

Objetivo: convertir un activo débil en una segunda línea orgánica.

Clusters:

- comprar purín de ortiga
- purín de ortiga concentrado
- purín de ortiga para rosales
- purín de ortiga para jardín
- purín de ortiga para plagas
- purín de ortiga para pulgón
- purín de ortiga ecológico
- purín de ortiga para mantenimiento de plantas
- humus de lombriz y purín de ortiga

### 7.3 Pilar 3: Servicios de aplicación

Objetivo: capturar leads de alto valor.

Clusters:

- servicio aplicación humus de lombriz
- regeneración de césped
- recuperar césped amarillo
- tratamiento biológico para césped
- mantenimiento sostenible de jardines
- aplicación de humus para jardines
- servicio jardinería biológica
- aplicación de abono orgánico en jardines
- servicio para paisajistas
- mantenimiento de zonas verdes con humus
- regeneración de jardines en Madrid
- regeneración de jardines en Toledo
- mantenimiento de jardines para empresas
- recuperación de césped en chalets

### 7.4 Pilar 4: GEO premium

Objetivo: dominar zonas con alto valor de servicio.

Prioridad inicial:

- Madrid capital
- Pozuelo
- Majadahonda
- Las Rozas
- Boadilla del Monte
- La Moraleja / Alcobendas
- San Sebastián de los Reyes
- Aravaca
- Torrelodones
- Villaviciosa de Odón
- Toledo
- Seseña
- Illescas
- Aranjuez
- Guadalajara

Formato:

- Landing GEO por zona premium.
- Cada landing debe tener: problema local, tipo de jardín, clima/suelo, servicio recomendado, CTA, FAQ, referencias, enlaces a producto.

## 8. Roadmap para liderazgo orgánico

### Fase 0: Indexación y saneamiento técnico, 0-7 días

Objetivo: que Google descubra servicios y nuevos artículos.

Acciones:

1. Desplegar `8b4e8cb` para enlazar los 6 artículos de servicios desde `/aprende` y sitemap.
2. Reenviar sitemap en GSC.
3. Inspeccionar manualmente:
   - `/servicios/regeneracion-cesped-y-jardines`
   - `/servicios/te-humus-paisajistas-jardineros`
   - los 6 artículos nuevos de servicios
4. Añadir bloque de servicios en home ya realizado, pero reforzar desde footer/nav si no compromete ecommerce.
5. Confirmar que sitemap contiene las rutas de servicios y artículos.
6. Revisar que `/aprende` enlaza los artículos de servicios sin depender de caché de BD.

KPIs:

- 8 URLs de servicios/artículos pasan de "URL unknown to Google" a descubiertas.
- Sitemap descargado por Google después de la actualización.
- Primeras impresiones para "servicio", "césped", "jardín", "paisajistas".

### Ejecución Fase 0 - 2026-06-18

Estado tras desplegar `8b4e8cb` y operar GSC mediante MCP:

| Acción | Estado | Evidencia |
| --- | --- | --- |
| Desplegar `8b4e8cb` | Completado | Producción en `8b4e8cb`; `/aprende` enlaza los 6 artículos; `sitemap.xml` contiene las 6 URLs nuevas |
| Reenviar sitemap en GSC | Completado | `https://biocultor.com/sitemap.xml` reenviado a las 21:23; estado GSC: `Pending processing`; 0 errores y 0 warnings |
| Inspeccionar 2 landings de servicios | Completado | `regeneracion-cesped-y-jardines`: `Discovered - currently not indexed`; `te-humus-paisajistas-jardineros`: `URL is unknown to Google` |
| Inspeccionar 6 artículos nuevos | Completado | 2 URLs descubiertas pero no indexadas; 4 URLs todavía desconocidas para Google |
| Solicitud manual de indexación | Pendiente manual | Search Console API no ofrece solicitud de indexación para páginas normales; debe hacerse desde la interfaz de GSC URL Inspection |

Detalle de inspección GSC:

| URL | Estado |
| --- | --- |
| `/servicios/regeneracion-cesped-y-jardines` | `Discovered - currently not indexed` |
| `/servicios/te-humus-paisajistas-jardineros` | `URL is unknown to Google` |
| `/aprende/servicio-aplicacion-te-humus-cuando-contratar` | `URL is unknown to Google` |
| `/aprende/regeneracion-cesped-servicio-aplicacion-humus` | `URL is unknown to Google` |
| `/aprende/calcular-litros-coste-m2-te-humus-paisajistas` | `Discovered - currently not indexed` |
| `/aprende/aplicacion-humus-comunidades-jardines-madrid-toledo` | `URL is unknown to Google` |
| `/aprende/servicio-aplicacion-humus-zonas-verdes-mantenimiento` | `Discovered - currently not indexed` |
| `/aprende/servicio-aplicacion-humus-madrid-toledo-castilla-la-mancha` | `URL is unknown to Google` |

Siguiente paso manual recomendado:

1. Abrir GSC > Inspección de URL.
2. Probar URL publicada para las 8 URLs anteriores.
3. Pulsar "Solicitar indexación" en este orden:
   - las dos landings de servicios;
   - los dos artículos ya descubiertos;
   - los cuatro artículos todavía desconocidos.
4. Volver a medir con MCP en 48-72 horas.

### Fase 1: Authority foundation, 2-4 semanas

Objetivo: subir el cluster "té de humus" de posiciones 16-27 a top 10-15.

Acciones:

1. Crear 8 artículos evidence-led alrededor de objeciones de compra:
   - té de humus líquido vs humus sólido en jardines premium
   - cómo aplicar té de humus en césped sin quemarlo
   - cuándo contratar aplicación profesional
   - humus líquido para suelos compactados
   - humus de lombriz en jardines con mascotas
   - mantenimiento de jardines con bajo residuo visible
   - riego por goteo en jardines ornamentales
   - coste por m2 de aplicar humus líquido
2. Enlazar todos hacia:
   - ficha de té de humus
   - landing de regeneración de césped
   - landing de paisajistas
3. Añadir FAQ schema específico en servicios:
   - precio orientativo
   - zonas cubiertas
   - cuándo se nota
   - compatibilidad con riego
   - mascotas/niños
4. Crear una página "Servicios de jardinería biológica" como hub superior.

KPIs:

- 1.000 impresiones/28 días.
- 50 consultas distintas en GSC.
- Posición media de "te de humus" < 12.
- Primeras 20 impresiones para servicios.

### Ejecución Fase 1 - 2026-06-19

Estado preparado localmente para reforzar el clúster "té de humus" sin competir con ecommerce:

| Acción | Estado | Evidencia |
| --- | --- | --- |
| Crear 8 artículos evidence-led de objeciones de compra | Preparado | Seed `scripts/seed-phase1-authority-posts.ts` con 8 artículos: comparativa líquido/sólido, césped, servicio profesional, compactación, mascotas/niños, bajo residuo visible, riego por goteo y coste por m2 |
| Enlazar hacia ficha de té de humus y servicios | Preparado | Cada artículo incluye CTA a `/producto/te-humus-liquido-premium` y, según intención, a `/servicios`, `/servicios/regeneracion-cesped-y-jardines` o `/servicios/te-humus-paisajistas-jardineros` |
| Añadir FAQ schema específico en servicios | Completado | Landings de servicios fusionan FAQ obligatorias de precio, zonas, riego y seguridad familiar |
| Crear hub superior de servicios | Completado | `/servicios` creado con schema de colección/listado de servicios y enlazado desde navegación |
| Forzar descubrimiento de artículos Fase 1 | Preparado | `/aprende` muestra los 8 artículos en sección "Objeciones de compra"; `sitemap.ts` contiene rutas estáticas con lastmod estable |

### Fase 2: Dominio de servicios premium, 1-3 meses

Objetivo: ser visible para búsquedas de alto ticket.

Crear landings:

1. Servicio de regeneración de césped para chalets.
2. Servicio de aplicación de humus para comunidades de vecinos.
3. Mantenimiento biológico de jardines para empresas.
4. Aplicación de humus para hoteles y restaurantes con jardín.
5. Tratamiento biológico para césped amarillo.
6. Servicio para paisajistas en Madrid y Toledo.
7. Aplicación de humus en parques empresariales.
8. Mantenimiento de zonas verdes sin abonos químicos agresivos.

Cada landing debe incluir:

- intención clara;
- zona o segmento;
- metodología;
- límites honestos;
- CTA a presupuesto;
- CTA secundario a compra de producto;
- pruebas visuales;
- referencia técnica;
- FAQ transaccional.

KPIs:

- 5.000 impresiones/28 días.
- 50-100 clics/28 días.
- 10 leads orgánicos/mes.
- Servicios indexados y con primeras posiciones top 30.

### Ejecución Fase 2 - 2026-06-19

Estado preparado localmente para capturar búsquedas transaccionales de servicios premium sin desplazar la ecommerce:

| Acción | Estado | Evidencia |
| --- | --- | --- |
| Crear 8 landings premium de servicios | Preparado | Contenido tipado en `lib/premium-service-pages.ts` y ruta dinámica `/servicios/[slug]` |
| Cubrir intención, segmento, zona y metodología | Preparado | Cada landing declara `intent`, `segment`, `zone` y pasos de `methodology` específicos |
| Añadir límites honestos y referencia técnica | Preparado | Cada landing incluye `honestLimits` y una referencia externa de autoridad para reforzar E-E-A-T/AIO |
| Mantener doble vía de conversión | Preparado | CTA principal a presupuesto en `/contacto?servicio=...` y CTA secundario a `/producto/te-humus-liquido-premium` |
| Reforzar descubrimiento interno y sitemap | Preparado | Hub `/servicios` enlaza las 8 landings y `app/sitemap.ts` las declara con `lastmod` estable |

### Fase 3: GEO premium, 3-6 meses

Objetivo: dominar búsquedas locales de alto valor.

Crear páginas GEO con contenido útil y no duplicado:

1. Regeneración de césped en Pozuelo.
2. Jardinería biológica en La Moraleja.
3. Recuperación de jardines en Las Rozas.
4. Mantenimiento de jardines en Boadilla del Monte.
5. Aplicación de humus en Majadahonda.
6. Servicio de humus para jardines en Aravaca.
7. Regeneración de césped en Toledo.
8. Aplicación de humus para jardines en Illescas/Seseña.

Regla editorial:

- No hacer plantillas clonadas.
- Cada página debe justificar por clima, tipo de vivienda, suelo, riego, jardín o demanda local.

KPIs:

- 20-30 páginas GEO indexadas.
- Primeras impresiones por zona.
- 20 leads orgánicos/mes.
- Top 10 en long-tail local.

### Ejecución Fase 3 - 2026-06-19

Estado preparado localmente para ampliar servicios premium hacia búsquedas locales de alto valor:

| Acción | Estado | Evidencia |
| --- | --- | --- |
| Crear 8 landings GEO premium | Preparado | `premiumGeoServicePages` añade Pozuelo, La Moraleja, Las Rozas, Boadilla, Majadahonda, Aravaca, Toledo e Illescas/Seseña |
| Evitar plantillas clonadas | Preparado | Cada landing incluye `localJustification` con razones propias de zona, tipo de jardín, uso, logística o clima |
| Mantener foco en lead de servicio | Preparado | Las rutas viven en `/servicios/[slug]`, con CTA a presupuesto y compra secundaria de producto |
| Reforzar sitemap y enlazado interno | Preparado | `app/sitemap.ts` hereda las nuevas rutas y `/servicios` añade sección "Servicios por zona premium" |
| Respetar sesgo de autoridad | Preparado | Cada página conserva referencia técnica externa y límites honestos sobre riego, resiembra, compactación o calor |

### Fase 4: Autoridad externa y prueba, 6-12 meses

Objetivo: pasar de "sitio que publica" a "marca citada".

Acciones:

1. Crear 3 casos reales documentados:
   - chalet;
   - comunidad;
   - empresa/complejo comercial.
2. Publicar fichas "antes/después" con:
   - fecha;
   - problema;
   - intervención;
   - limitaciones;
   - evolución.
3. Conseguir menciones/enlaces desde:
   - blogs de jardinería;
   - asociaciones de paisajistas;
   - proveedores de mantenimiento;
   - directorios locales premium;
   - medios regionales de Toledo/Madrid.
4. Crear descargables:
   - checklist de mantenimiento de césped premium;
   - protocolo de aplicación para paisajistas;
   - guía para administradores de comunidades.

KPIs:

- 20 dominios de referencia relevantes.
- 15.000 impresiones/28 días.
- 200-500 clics/28 días.
- Leads orgánicos regulares para servicios.

### Ejecución Fase 4 - 2026-06-19

Estado preparado localmente para iniciar autoridad externa y prueba sin fabricar casos reales:

| Acción | Estado | Evidencia |
| --- | --- | --- |
| Crear hub de casos y metodología | Preparado | Ruta `/casos` con colección de casos documentables, recursos operativos y CTA para proponer un jardín real |
| Crear 3 fichas de caso | Preparado honesto | `/casos/chalet-premium-cesped-compactado`, `/casos/comunidad-zonas-comunes-documentadas` y `/casos/empresa-jardin-representativo-bajo-residuo` no prometen resultados; declaran evidencia a recoger, límites y estado documentable/captación |
| Crear descargables operativos | Preparado | `/recursos/checklist-mantenimiento-cesped-premium`, `/recursos/protocolo-aplicacion-paisajistas` y `/recursos/guia-administradores-comunidades-zonas-verdes` |
| Reforzar enlazado interno | Preparado | Navbar, footer, hub `/servicios` y sitemap enlazan `/casos` y recursos |
| Respetar ADR-002 | Preparado | Cada ficha y recurso incluye referencia externa identificable y límites honestos; no se publican "casos reales" sin fotos, fecha, intervención y seguimiento |

Pendiente para convertir la fase en autoridad real:

1. Capturar al menos 3 proyectos reales con permiso de uso de imágenes.
2. Registrar fecha, superficie, litros aplicados, condiciones de riego/siega y evolución a 14/30/60 días.
3. Sustituir el estado "captación/documentable" por resultados observacionales solo cuando exista evidencia verificable.
4. Crear outreach externo hacia asociaciones, blogs de jardinería, paisajistas y directorios locales usando los casos ya completados.

### Fase 5: Liderazgo sectorial, 12 meses

Objetivo: ser el sitio más completo y confiable del nicho en España.

Acciones:

1. Biblioteca completa por cultivo, jardín, problema, zona y tipo de cliente.
2. Comparativas contra alternativas:
   - abono químico;
   - mantillo;
   - compost sólido;
   - bioestimulantes genéricos;
   - empresas tradicionales de jardinería.
3. Calculadoras:
   - litros por m2;
   - coste estimado de servicio;
   - calendario de aplicación;
   - mantenimiento por superficie.
4. E-E-A-T:
   - autoría técnica;
   - metodología de producción;
   - trazabilidad;
   - fotos reales;
   - casos reales;
   - reviews específicas de servicios.

KPIs:

- Top 3 para términos long-tail de servicios.
- Top 5 para "comprar té de humus de lombriz".
- Top 10 para "purín de ortiga concentrado/comprar".
- 30+ leads orgánicos/mes de servicios.
- 500+ clics orgánicos/mes.

### Ejecución Fase 5 - 2026-06-20

Estado preparado localmente para iniciar la capa de liderazgo sectorial:

| Acción | Estado | Evidencia |
| --- | --- | --- |
| Crear biblioteca sectorial | Preparado | `/biblioteca` agrupa comparativas, calculadoras, metodología y casos |
| Crear comparativas contra alternativas | Preparado | `/comparativas/te-humus-vs-abono-quimico-cesped`, `/comparativas/te-humus-vs-mantillo-compost-jardin` y `/comparativas/servicio-biologico-vs-jardineria-tradicional` |
| Crear calculadoras públicas | Preparado | `/calculadoras` centraliza estimación de litros, presupuesto de servicio y calendario de decisión |
| Reforzar E-E-A-T operativo | Preparado | `/metodologia` explica diagnóstico, trazabilidad, límites y cómo convertir observaciones en prueba |
| Reforzar enlazado y sitemap | Preparado | Navbar, footer, home y `sitemap.ts` enlazan biblioteca, comparativas, calculadoras y metodología |

Pendiente para liderazgo completo:

1. Ampliar biblioteca por cultivo, problema, zona y tipo de cliente.
2. Añadir comparativas adicionales contra bioestimulantes genéricos, recebo, resiembra, hidrosiembra y mantenimiento tradicional por contrato.
3. Convertir calculadoras en activos con captura de lead y persistencia CRM.
4. Sustituir estimaciones por datos reales derivados de casos documentados cuando existan.
5. Medir en GSC a 28/60/90 días y priorizar ampliaciones por consulta real.

## 9. Priorización editorial inmediata

### Publicar primero

1. "Recuperar césped amarillo en chalets: cuándo el problema no es el abono"
2. "Servicio de aplicación de humus para comunidades de vecinos: qué debe incluir"
3. "Té de humus para jardines premium: guía para propietarios sin tiempo"
4. "Purín de ortiga para rosales y jardines ornamentales de alto valor"
5. "Mantenimiento biológico de jardines para empresas y hoteles"
6. "Cuánto cuesta aplicar humus de lombriz por m2 en un jardín"

### Optimizar primero

1. `/producto/te-humus-liquido-premium`
   - reforzar copy para "comprar", "jardín", "césped", "premium";
   - añadir enlaces a servicios;
   - mejorar módulo de casos de uso.

2. `/producto/purin-ortiga-concentrado`
   - reforzar "comprar purín de ortiga";
   - añadir clúster rosales/jardín/ornamentales;
   - enlazar con servicios combinados.

3. `/servicios/regeneracion-cesped-y-jardines`
   - añadir FAQ schema;
   - añadir proceso paso a paso;
   - añadir zonas cubiertas;
   - añadir prueba visual real.

4. `/servicios/te-humus-paisajistas-jardineros`
   - posicionar como B2B;
   - añadir calculadora o tabla de litros;
   - añadir CTA para presupuesto y compra formato profesional.

## 10. Arquitectura de enlazado interno

Estructura recomendada:

- Home enlaza a:
  - ficha té de humus;
  - ficha purín;
  - servicios;
  - hub aprende.

- Ficha té de humus enlaza a:
  - servicio de aplicación;
  - artículos de césped/jardín;
  - landing paisajistas.

- Ficha purín enlaza a:
  - artículos de rosales/ornamentales;
  - guía de combinación humus + ortiga;
  - servicio de mantenimiento.

- Servicios enlazan a:
  - producto para mantenimiento posterior;
  - artículos de evidencia;
  - páginas GEO.

- Artículos enlazan a:
  - producto si la intención es compra directa;
  - servicio si la intención implica superficie, diagnóstico o ejecución.

## 11. Riesgos

1. Publicar contenido sin evidencia erosionaría la autoridad. ADR-002 debe ser obligatorio.
2. Crear landings GEO clonadas puede generar baja calidad percibida.
3. Prometer resultados cerrados en césped o jardinería puede crear problemas comerciales.
4. Si los servicios no se indexan pronto, el esfuerzo editorial tardará más en producir leads.
5. Si no se despliega el enlazado de `8b4e8cb`, los nuevos artículos existen pero quedan peor conectados para Google.

## 12. Próximo sprint recomendado

Orden exacto:

1. Autorizar y desplegar `8b4e8cb`.
2. Reenviar sitemap en GSC.
3. Solicitar inspección de 8 URLs: 2 servicios + 6 artículos.
4. Añadir FAQ schema a landings de servicios.
5. Crear hub `/servicios` o bloque equivalente con Service schema.
6. Publicar 6 piezas premium nuevas centradas en chalets, comunidades, empresas y paisajistas.
7. Crear calculadora de litros/coste por m2 como activo de captación.
8. Medir en GSC a 14, 28 y 60 días.

## 13. Criterio de excelencia

Biocultor no debe competir como "otro ecommerce de fertilizantes". Debe competir como:

> la marca que entiende el suelo vivo, vende productos aplicables y además resuelve la ejecución profesional en jardines donde el resultado estético y la tranquilidad valen dinero.

Esa posición es defendible porque combina producto, servicio, evidencia, GEO y CRO. La ventaja no está solo en rankear una keyword; está en construir un sistema donde cada búsqueda lleve a una decisión: comprar, pedir presupuesto o confiar en la marca.
