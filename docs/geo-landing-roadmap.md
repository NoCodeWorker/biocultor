# Roadmap de Landing Pages GEO (Programática y Estratégica)

**Objetivo:** Captar búsquedas ultra-específicas de agricultores profesionales y técnicos agrícolas combinando **[Cultivo] + [Región] + [Problema Agronómico]**.
**Formato:** Estas no son páginas de blog, son *Landing Pages* transaccionales diseñadas para captar tráfico, explicar la solución técnica (basada en Té de Humus) y dirigir directamente al funnel de compra de formatos grandes (10L, 25L, 1000L).

---

## Matriz de Expansión GEO (España)

### 1. Andalucía (Foco: Estrés Hídrico y Agotamiento)
*El mayor mercado B2B agrícola. El principal dolor es la falta de agua y la degradación del suelo.*
- [ ] **Andalucía / Olivar:** Té de Humus para Olivar en Secano (Aumento de Retención Hídrica).
- [ ] **Almería / Invernadero:** Regeneración de Suelos Saturados por Sales Químicas en Invernaderos.
- [ ] **Huelva / Frutos Rojos (Fresa/Arándano):** Estimulación Radicular sin Químicos para Frutos Rojos.
- [ ] **Jaén / Olivar Superintensivo:** Reducción de Costes de Fertilización en Olivar Superintensivo.

### 2. Comunidad Valenciana (Foco: Clorosis Férrica y Productividad)
*Suelos calcáreos y calizos que bloquean los nutrientes, especialmente el hierro.*
- [ ] **Valencia / Cítricos:** Prevención de Clorosis Férrica en Naranjo y Limonero (Desbloqueo Nutricional).
- [ ] **Alicante / Frutales y Hortalizas:** Aumento de Calibre y Producción en Suelos Calizos con Microbiología.
- [ ] **Castellón / Cítricos:** Recuperación de Árboles con Decaimiento mediante Inyección de Rizobacterias.

### 3. Castilla-La Mancha y Castilla y León (Foco: Viñedo y Leñosos)
*Suelos muy pobres en materia orgánica, altas temperaturas en verano y viñedos de alto valor.*
- [ ] **Castilla-La Mancha / Viñedo:** Cómo Incrementar el Grado Brix y la Calidad de la Uva en Viñedos Agotados.
- [ ] **Castilla-La Mancha / Pistacho y Almendro:** Aceleración del Crecimiento en Plantaciones Jóvenes de Leñosos.
- [ ] **Castilla y León / Viñedo (Ribera del Duero):** Living Soil en Viticultura Premium: Microbiología en Frío.

### 4. Murcia y Alicante (Foco: Hortalizas y Fruta de Hueso)
*Agricultura ultraintensiva con uso masivo de agroquímicos. Necesidad de reducir residuos (Residuo Cero).*
- [ ] **Murcia / Frutales de Hueso:** Programas de Residuo Cero en Frutal de Hueso usando Extractos Húmicos.
- [ ] **Murcia / Hortícolas (Lechuga/Brócoli):** Control Biológico de Suelo para Prevención de Hongos Patógenos.

### 5. Extremadura (Foco: Cultivo Extensivo y Frutales)
*Grandes extensiones buscando ahorro de costes en fertilización convencional.*
- [ ] **Extremadura / Tomate de Industria:** Aumento de Rendimiento y Prevención de Podredumbre Apical (Tuta/Estrés).
- [ ] **Valle del Jerte / Cerezo:** Nutrición Post-Cosecha para Cerezos con Aplicación Foliar y Radicular.

### 6. Galicia, Asturias y Cantabria (Foco: Exceso de Humedad y Hongos)
*Suelos ácidos y mucha humedad. Problemas con patógenos fúngicos (Mildiu, Oídio, Botrytis).*
- [ ] **Galicia / Viñedo (Rías Baixas):** Prevención Ecológica de Mildiu y Botrytis mediante Biopelícula Foliar.
- [ ] **Cornisa Cantábrica / Praderas y Forrajes:** Mejora de la Calidad del Pasto sin Abonos Sintéticos.

### 7. Canarias (Foco: Monocultivo y Nematodos)
*Suelos volcánicos muy castigados por monocultivo continuo.*
- [ ] **Canarias / Platanera:** Regeneración de la Red Trófica del Suelo para el Control Natural de Nematodos en Platanera.

---

## Arquitectura de la URL Propuesta (SEO Técnico)

Para estructurar esto sin ensuciar el blog, deberíamos crear una estructura de carpetas en Next.js dedicada a los casos de uso:

\`\`\`text
biocultor.com/cultivos/andalucia/olivar-secano
biocultor.com/cultivos/valencia/citricos-clorosis
biocultor.com/cultivos/castilla-la-mancha/vinedo
\`\`\`

O una estructura más plana:
\`\`\`text
biocultor.com/soluciones/olivar-andalucia
biocultor.com/soluciones/citricos-comunidad-valenciana
\`\`\`

## Elementos Obligatorios de la Landing Page GEO
Para que conviertan, cada una de estas Landings debe contener:
1. **Hero Geo-Localizado:** "Té de Humus para Olivar en Andalucía" (Con imagen de olivar).
2. **Identificación del Problema:** (Ej. "El 70% de los abonos fosfatados se bloquean en nuestros suelos calizos...").
3. **Mecanismo de Acción Científico (ADR-002):** Cómo las rizobacterias solubilizan el fósforo.
4. **Calculadora de Costes/Dosis:** (Ej. "Con un formato de 10L tienes para X hectáreas").
5. **Llamada a la Acción (CTA) Transaccional:** Dirigiendo al formato industrial (10L o 25L).
