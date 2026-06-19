export type AuthorityReference = {
  label: string;
  source: string;
  url: string;
  note: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  segment: string;
  location: string;
  status: 'documentable' | 'captacion';
  problem: string;
  intervention: string[];
  evidenceToCollect: string[];
  limits: string[];
  commercialFit: string;
  primaryCta: string;
  primaryHref: string;
  secondaryCta: string;
  secondaryHref: string;
  reference: AuthorityReference;
};

export type DownloadResource = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  audience: string;
  summary: string;
  checklist: string[];
  whenToUse: string[];
  cta: string;
  ctaHref: string;
  reference: AuthorityReference;
};

export const authorityReferences = {
  lawnCompaction: {
    label: 'Compactacion y aireacion en cesped',
    source: 'Better Homes & Gardens, guia divulgativa con criterios de aireacion',
    url: 'https://www.bhg.com/how-to-tell-if-your-lawn-needs-aerating-11832106',
    note:
      'La aireacion se plantea como respuesta a compactacion, exceso de thatch o drenaje deficiente; no como solucion universal.',
  },
  compostTeaSafety: {
    label: 'Te de compost y seguridad de preparacion',
    source: 'Gardening Know How, guia divulgativa sobre te de compost',
    url: 'https://www.gardeningknowhow.com/composting/basics/how-to-make-compost-tea.htm',
    note:
      'Refuerza la importancia de material maduro, preparacion controlada y prudencia con claims sobre patogenos o resultados.',
  },
  coreAeration: {
    label: 'Aireacion mecanica del suelo',
    source: 'The Spruce, guia divulgativa sobre core aeration',
    url: 'https://www.thespruce.com/how-to-use-core-aeration-2131031',
    note:
      'La aireacion con extraccion de testigos se usa para reducir compactacion y facilitar entrada de agua, aire y nutrientes.',
  },
} satisfies Record<string, AuthorityReference>;

export const caseStudies: CaseStudy[] = [
  {
    slug: 'chalet-premium-cesped-compactado',
    title: 'Chalet premium con cesped compactado: ficha de documentacion',
    metaTitle: 'Caso documentable de cesped compactado en chalet | Biocultor',
    metaDescription:
      'Plantilla de caso para documentar diagnostico, aplicacion de humus liquido y seguimiento en jardines de chalets premium sin prometer resultados cerrados.',
    segment: 'Chalet y vivienda unifamiliar',
    location: 'Zona centro, Madrid/Toledo bajo confirmacion',
    status: 'captacion',
    problem:
      'Cesped con perdida de vigor, zonas endurecidas por uso familiar y dudas sobre si aplicar producto, airear o contratar intervencion.',
    intervention: [
      'Inspeccion visual de compactacion, riego, sombra y zonas de transito.',
      'Registro fotografico antes de cualquier tratamiento.',
      'Aplicacion de te de humus si el diagnostico confirma que la via biologica tiene sentido.',
      'Pauta posterior de riego y siega para no atribuir al producto problemas de manejo.',
    ],
    evidenceToCollect: [
      'Fotos antes/despues tomadas con la misma perspectiva y luz aproximada.',
      'Fecha de aplicacion, superficie estimada y litros aplicados.',
      'Notas de riego, siega, temperatura y transito durante el seguimiento.',
      'Observaciones a 14, 30 y 60 dias sin transformar observaciones en garantia.',
    ],
    limits: [
      'Si hay calvas severas, puede requerir resiembra o recebo.',
      'Si el suelo esta muy compactado, la aplicacion biologica no sustituye aireacion mecanica.',
      'Si el riego esta mal ajustado, la mejora estetica puede quedar limitada.',
    ],
    commercialFit:
      'Encaja cuando el propietario quiere recuperar presencia visual sin gestionar dosis, filtrado, calendario ni seguimiento.',
    primaryCta: 'Solicitar diagnostico',
    primaryHref: '/contacto?servicio=chalet-premium-cesped',
    secondaryCta: 'Comprar te de humus',
    secondaryHref: '/producto/te-humus-liquido-premium',
    reference: authorityReferences.lawnCompaction,
  },
  {
    slug: 'comunidad-zonas-comunes-documentadas',
    title: 'Comunidad de vecinos: intervencion justificable ante propietarios',
    metaTitle: 'Caso documentable para comunidades con zonas verdes | Biocultor',
    metaDescription:
      'Modelo de documentacion para comunidades que necesitan justificar una intervencion biologica en zonas verdes con fotos, limites y seguimiento.',
    segment: 'Comunidad de vecinos y urbanizacion',
    location: 'Madrid, Toledo y Castilla-La Mancha bajo disponibilidad',
    status: 'captacion',
    problem:
      'Zonas comunes con quejas por aspecto irregular, presupuesto sensible y necesidad de explicar la intervencion sin lenguaje tecnico excesivo.',
    intervention: [
      'Division por zonas para priorizar areas visibles o de mayor uso.',
      'Ficha breve para administrador: problema, propuesta, limites y calendario.',
      'Aplicacion por sectores para reducir interrupciones de uso.',
      'Entrega de resumen posterior con fotos y recomendaciones de mantenimiento.',
    ],
    evidenceToCollect: [
      'Plano simple o listado de zonas tratadas.',
      'Fotos antes/despues por sector.',
      'Incidencias de riego, sombra, transito o obras cercanas.',
      'Resumen final entendible por vecinos no tecnicos.',
    ],
    limits: [
      'No sustituye reparaciones de riego, drenaje o obra civil.',
      'En zonas muy pisadas puede requerir cierre temporal o resiembra.',
      'El resultado depende de mantenimiento posterior y uso de la zona.',
    ],
    commercialFit:
      'Aporta valor cuando el administrador necesita trazabilidad, orden y una intervencion defendible ante la comunidad.',
    primaryCta: 'Pedir propuesta para comunidad',
    primaryHref: '/contacto?servicio=comunidad-zonas-verdes',
    secondaryCta: 'Ver servicio para comunidades',
    secondaryHref: '/servicios/aplicacion-humus-comunidades-vecinos',
    reference: authorityReferences.coreAeration,
  },
  {
    slug: 'empresa-jardin-representativo-bajo-residuo',
    title: 'Empresa con jardin representativo: mantenimiento biologico de bajo residuo',
    metaTitle: 'Caso documentable para empresas con jardines representativos | Biocultor',
    metaDescription:
      'Ficha de autoridad para documentar mantenimiento biologico en empresas, hoteles o restaurantes con jardines visibles y necesidad de bajo residuo operativo.',
    segment: 'Empresa, hotel, restaurante o complejo comercial',
    location: 'Zonas empresariales y proyectos bajo presupuesto',
    status: 'documentable',
    problem:
      'Jardin con valor reputacional donde el mantenimiento debe ser discreto, trazable y compatible con clientes, empleados o visitantes.',
    intervention: [
      'Evaluacion de horarios, transito, riego y zonas de maxima visibilidad.',
      'Aplicacion biologica planificada fuera de picos de uso.',
      'Registro de producto, dosis orientativa, fecha y responsable.',
      'Recomendaciones para mantenimiento recurrente sin generar residuos visibles.',
    ],
    evidenceToCollect: [
      'Fotos de zonas representativas antes/despues.',
      'Registro de aplicacion y condiciones del dia.',
      'Observaciones de mantenimiento a 30 dias.',
      'Feedback operativo: interrupciones, olor, residuos o incidencias.',
    ],
    limits: [
      'No reemplaza un plan de jardineria si hay abandono prolongado.',
      'No corrige compactacion estructural sin intervencion fisica complementaria.',
      'No debe prometer uniformidad estetica si hay riego desigual.',
    ],
    commercialFit:
      'Encaja cuando el jardin forma parte de la imagen corporativa y se busca una intervencion de bajo ruido operativo.',
    primaryCta: 'Solicitar plan para empresa',
    primaryHref: '/contacto?servicio=empresa-jardin-representativo',
    secondaryCta: 'Ver mantenimiento para empresas',
    secondaryHref: '/servicios/mantenimiento-biologico-jardines-empresas',
    reference: authorityReferences.compostTeaSafety,
  },
];

export const downloadResources: DownloadResource[] = [
  {
    slug: 'checklist-mantenimiento-cesped-premium',
    title: 'Checklist de mantenimiento de cesped premium',
    metaTitle: 'Checklist de mantenimiento de cesped premium | Biocultor',
    metaDescription:
      'Checklist accionable para revisar riego, compactacion, siega, transito y aplicacion biologica antes de intervenir un cesped de alto valor.',
    audience: 'Propietarios de chalets, comunidades y responsables de mantenimiento',
    summary:
      'Una hoja de control para decidir si el problema del cesped pide producto, servicio, aireacion, resiembra o ajuste de riego.',
    checklist: [
      'Fotografiar zonas amarillas, calvas, sombras y areas de mayor transito.',
      'Comprobar si el agua encharca, corre por superficie o penetra correctamente.',
      'Revisar altura de siega y frecuencia real, no solo la planificada.',
      'Identificar zonas endurecidas donde una herramienta entra con dificultad.',
      'Anotar ultima fertilizacion, resiembra, aireacion o recebo.',
      'Separar problemas de riego de problemas de suelo antes de aplicar producto.',
      'Definir si se busca recuperacion estetica, mantenimiento o preparacion estacional.',
    ],
    whenToUse: [
      'Antes de contratar una intervencion profesional.',
      'Antes de aplicar te de humus en una superficie grande.',
      'Cuando una comunidad necesita justificar presupuesto o prioridad por zonas.',
    ],
    cta: 'Solicitar diagnostico de cesped',
    ctaHref: '/contacto?servicio=checklist-cesped-premium',
    reference: authorityReferences.lawnCompaction,
  },
  {
    slug: 'protocolo-aplicacion-paisajistas',
    title: 'Protocolo de aplicacion para paisajistas',
    metaTitle: 'Protocolo de aplicacion de humus para paisajistas | Biocultor',
    metaDescription:
      'Guia operativa para paisajistas que necesitan integrar te de humus fresco en mantenimiento de jardines sin improvisar dosis, filtrado o comunicacion al cliente.',
    audience: 'Paisajistas, jardineros profesionales y empresas de mantenimiento',
    summary:
      'Un protocolo de trabajo para decidir compra, suministro fresco o aplicacion tecnica segun superficie, riego, acceso y expectativas.',
    checklist: [
      'Confirmar superficie, acceso, toma de agua y ventana horaria de aplicacion.',
      'Revisar compatibilidad con tratamientos recientes que puedan afectar microbiologia.',
      'Filtrar y aplicar con equipo adecuado para evitar obstrucciones.',
      'Documentar lote, fecha, litros y dilucion empleada.',
      'Explicar al cliente que el seguimiento requiere riego y manejo coherente.',
      'Separar aplicacion biologica de promesas de reverdecimiento inmediato.',
      'Planificar revision a 30 dias cuando el proyecto tenga valor alto.',
    ],
    whenToUse: [
      'En jardines ornamentales con cliente exigente.',
      'En mantenimiento recurrente donde se busca reducir improvisacion.',
      'En proyectos donde la trazabilidad mejora la confianza del cliente.',
    ],
    cta: 'Hablar sobre suministro profesional',
    ctaHref: '/contacto?servicio=protocolo-paisajistas',
    reference: authorityReferences.compostTeaSafety,
  },
  {
    slug: 'guia-administradores-comunidades-zonas-verdes',
    title: 'Guia para administradores de comunidades con zonas verdes',
    metaTitle: 'Guia para comunidades con jardines y zonas verdes | Biocultor',
    metaDescription:
      'Guia para administradores que necesitan presentar una intervencion biologica en jardines comunitarios con presupuesto, fases y limites claros.',
    audience: 'Administradores de fincas, presidentes de comunidad y urbanizaciones',
    summary:
      'Un guion para explicar una intervencion biologica sin prometer milagros y con criterios de priorizacion por zonas.',
    checklist: [
      'Separar zonas visibles, zonas de paso y zonas con dano severo.',
      'Pedir fotos comparables antes de aprobar presupuesto.',
      'Confirmar si el riego funciona por sectores y sin fugas evidentes.',
      'Definir si la comunidad necesita mantenimiento, recuperacion o resiembra.',
      'Solicitar limites por escrito: que se puede esperar y que no.',
      'Planificar comunicacion simple para vecinos antes de intervenir.',
      'Guardar fecha, producto aplicado, superficie y observaciones posteriores.',
    ],
    whenToUse: [
      'Cuando hay que justificar presupuesto ante vecinos.',
      'Cuando las zonas comunes tienen usos muy distintos.',
      'Cuando se quiere reducir conflicto entre estetica, coste y mantenimiento.',
    ],
    cta: 'Pedir propuesta para comunidad',
    ctaHref: '/contacto?servicio=guia-comunidades',
    reference: authorityReferences.coreAeration,
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((item) => item.slug === slug) ?? null;
}

export function getDownloadResource(slug: string) {
  return downloadResources.find((item) => item.slug === slug) ?? null;
}
