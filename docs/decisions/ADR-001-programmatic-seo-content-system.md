# ADR-001 Programmatic SEO Content System

## Title

Programmatic, transactional and GEO/IA SEO content system for Spain

## Status

Accepted

## Context

Biocultor necesitaba crecer en SEO transaccional y en visibilidad para motores de respuesta sin convertir la ecommerce en un blog desordenado ni en una colección de landing pages sin gobierno. La base existente resolvía una única home, una ficha de producto y FAQ aisladas.

## Decision

Se adopta una capa SEO de sistema compuesta por:

- configuración central de sitio
- utilidades compartidas para metadata y schema
- matriz tipada de contenidos transaccionales, programáticos, editoriales y GEO/IA
- persistencia opcional en `SeoPage` para overrides operativos
- campos editoriales de priorización para ordenar el trabajo por valor
- landings server-rendered por intención
- sitemap y robots generados desde código

La expansión cubre tres dominios coordinados:

- dominio transaccional para intención explícita de compra
- dominio informacional para guías y comparativas
- dominio GEO/IA para regiones relevantes de España

Además, mantiene un clúster programático por aplicación/cultivo conectado al producto.

## Alternatives considered

- Mantener todo el SEO en la home y la ficha de producto.
- Crear páginas sueltas sin utilidades compartidas.
- Modelar inmediatamente todo en base de datos o CMS.

## Consequences

- Positivas: mejor escalabilidad, mayor coherencia semántica, mejor reutilización y mejor preparación para motores de IA.
- Positivas: contenido y metadata quedan desacoplados de la UI y son más fáciles de auditar.
- Positivas: el sistema ya permite persistencia SEO sin romper el fallback curado.
- Positivas: existe una UI editorial inicial en admin para gobernar `SeoPage`.
- Negativas: si el dominio productivo no se configura vía entorno, los canonicals usarán el fallback `https://biocultor.com`.
