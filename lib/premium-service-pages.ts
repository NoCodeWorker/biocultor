export type PremiumServicePage = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  targetKeyword: string;
  segment: string;
  zone: string;
  intent: string;
  problem: string;
  serviceRecommended: string;
  methodology: string[];
  honestLimits: string[];
  visualProof: {
    before: string;
    after: string;
    caption: string;
  };
  reference: {
    title: string;
    authority: string;
    url: string;
    takeaway: string;
  };
  faqs: Array<{ question: string; answer: string }>;
};

export const premiumServicePages: PremiumServicePage[] = [
  {
    slug: 'regeneracion-cesped-chalets',
    title: 'Servicio de regeneración de césped para chalets',
    metaTitle: 'Regeneración de césped para chalets | Biocultor',
    metaDescription:
      'Servicio profesional de regeneración biológica de césped para chalets y jardines privados: diagnóstico, aplicación de té de humus y pauta posterior.',
    targetKeyword: 'regeneración de césped para chalets',
    segment: 'Propietarios de chalets y viviendas unifamiliares',
    zone: 'Madrid, Toledo y Castilla-La Mancha',
    intent: 'Recuperar un césped visible sin convertir al propietario en técnico agronómico.',
    problem:
      'El césped de un chalet suele fallar por riego irregular, compactación, calor, pisoteo o pérdida de rutina. Aplicar más producto sin leer el terreno puede generar gasto sin aprendizaje.',
    serviceRecommended:
      'Diagnóstico de superficie, aplicación homogénea de té de humus de lombriz y pauta posterior de riego y mantenimiento.',
    methodology: [
      'Revisión visual del césped, zonas de sombra, tránsito y riego.',
      'Medición de superficie útil y separación de zonas críticas.',
      'Aplicación líquida de bajo residuo visible con equipo adaptado al jardín.',
      'Pauta posterior para riego, siega y mantenimiento con compra directa si procede.',
    ],
    honestLimits: [
      'No sustituye una resiembra si la densidad vegetal ya se ha perdido.',
      'No corrige por sí solo un riego mal diseñado o una compactación severa.',
      'No debe venderse como verde instantáneo; la respuesta depende del estado inicial.',
    ],
    visualProof: {
      before: '/servicios-cesped-antes.webp',
      after: '/servicios-cesped-despues.webp',
      caption: 'La comparación antes/después ilustra el tipo de mejora buscada, no una garantía universal.',
    },
    reference: {
      title: 'Soil Health',
      authority: 'USDA Natural Resources Conservation Service',
      url: 'https://www.nrcs.usda.gov/conservation-basics/natural-resource-concerns/soils/soil-health',
      takeaway:
        'La salud del suelo depende de funciones físicas, químicas y biológicas; por eso un césped se evalúa como sistema, no solo por el color.',
    },
    faqs: [
      {
        question: '¿Cuándo tiene sentido contratar el servicio en un chalet?',
        answer:
          'Cuando hay superficie amplia, manchas persistentes, dudas de riego o falta de tiempo para aplicar de forma homogénea.',
      },
      {
        question: '¿Puedo mantener después el césped comprando producto?',
        answer:
          'Sí. Una secuencia razonable es servicio inicial para ordenar el problema y compra posterior de té de humus para mantenimiento.',
      },
      {
        question: '¿Es una solución inmediata?',
        answer:
          'No debe venderse así. Es una intervención biológica y operativa que debe acompañarse de riego, siega y seguimiento.',
      },
    ],
  },
  {
    slug: 'aplicacion-humus-comunidades-vecinos',
    title: 'Servicio de aplicación de humus para comunidades de vecinos',
    metaTitle: 'Aplicación de humus para comunidades | Biocultor',
    metaDescription:
      'Aplicación profesional de humus líquido para comunidades de vecinos: intervención limpia, trazable y justificable para zonas comunes.',
    targetKeyword: 'aplicación humus comunidades vecinos',
    segment: 'Comunidades, administradores de fincas y urbanizaciones',
    zone: 'Comunidades de Madrid, Toledo y alrededores',
    intent: 'Justificar una intervención limpia ante vecinos y mejorar zonas comunes sin lenguaje inflado.',
    problem:
      'En una comunidad el jardín no lo decide una sola persona. Hay presupuesto, quejas, expectativas visuales y necesidad de explicar qué se aplica y por qué.',
    serviceRecommended:
      'Servicio con superficie tratada, zonas priorizadas, fecha de intervención, producto aplicado y pauta posterior para jardinería.',
    methodology: [
      'Identificación de zonas comunes con más presión estética o quejas.',
      'Separación entre césped, setos, arriates y zonas de tránsito.',
      'Aplicación discreta sin dejar residuo sólido visible.',
      'Resumen operativo para administrador, presidente o empresa de jardinería.',
    ],
    honestLimits: [
      'No sustituye reparación de riego sectorizado.',
      'No evita reposición vegetal si ya hay pérdida de planta.',
      'No debe presentarse como garantía estética inmediata ante vecinos.',
    ],
    visualProof: {
      before: '/servicios-cesped-antes.webp',
      after: '/servicios-cesped-despues.webp',
      caption: 'La prueba visual debe acompañarse de explicación técnica y límites de la intervención.',
    },
    reference: {
      title: 'Soil Organic Carbon: the hidden potential',
      authority: 'FAO',
      url: 'https://www.fao.org/3/i6937e/i6937e.pdf',
      takeaway:
        'El carbono orgánico se relaciona con funciones de fertilidad, estructura, biodiversidad y agua, claves para zonas verdes mantenidas.',
    },
    faqs: [
      {
        question: '¿Se puede aplicar sin molestar a los vecinos?',
        answer:
          'Sí, si se programa con horario, riego y comunicación. La aplicación líquida evita dejar gránulos o acopios visibles.',
      },
      {
        question: '¿Qué recibe la comunidad después?',
        answer:
          'Una pauta simple: zonas tratadas, objetivo de la intervención y recomendaciones posteriores para jardinería.',
      },
      {
        question: '¿Sirve para presupuestos ajustados?',
        answer:
          'Sí, priorizando zonas críticas en vez de tratar toda la urbanización sin criterio.',
      },
    ],
  },
  {
    slug: 'mantenimiento-biologico-jardines-empresas',
    title: 'Mantenimiento biológico de jardines para empresas',
    metaTitle: 'Mantenimiento biológico de jardines para empresas',
    metaDescription:
      'Servicio de mantenimiento biológico para jardines corporativos: aplicación de té de humus, trazabilidad y bajo residuo visible.',
    targetKeyword: 'mantenimiento biológico jardines empresas',
    segment: 'Empresas con jardines, sedes corporativas y oficinas con zonas verdes',
    zone: 'Madrid, Toledo y Castilla-La Mancha',
    intent: 'Cuidar la imagen corporativa del jardín sin añadir complejidad al mantenimiento.',
    problem:
      'Las zonas verdes de empresa deben verse cuidadas, pero las intervenciones no pueden interferir con clientes, empleados o actividad diaria.',
    serviceRecommended:
      'Aplicación programada de té de humus líquido con metodología discreta, trazabilidad y pauta para mantenimiento recurrente.',
    methodology: [
      'Mapeo de zonas visibles, accesos, horarios y restricciones operativas.',
      'Aplicación de bajo residuo visible en franjas de menor actividad.',
      'Registro de fecha, superficie, producto y pauta de continuidad.',
      'Transición a compra de formato profesional si el equipo interno mantiene la rutina.',
    ],
    honestLimits: [
      'No sustituye reposición vegetal o poda profesional.',
      'No corrige fugas, zonas sin riego o compactación extrema.',
      'Debe medirse por continuidad y trazabilidad, no por un cambio inmediato aislado.',
    ],
    visualProof: {
      before: '/servicios-cesped-antes.webp',
      after: '/servicios-cesped-despues.webp',
      caption: 'El antes/después ayuda a explicar la intervención, pero debe documentarse con contexto.',
    },
    reference: {
      title: 'Soil Health',
      authority: 'USDA Natural Resources Conservation Service',
      url: 'https://www.nrcs.usda.gov/conservation-basics/natural-resource-concerns/soils/soil-health',
      takeaway:
        'El suelo sano sostiene plantas, agua, aire y organismos; una zona verde corporativa debe gestionarse como infraestructura viva.',
    },
    faqs: [
      {
        question: '¿El servicio interfiere con la actividad de la empresa?',
        answer:
          'Debe planificarse para interferir lo mínimo: horarios de bajo uso, aplicación limpia y coordinación con mantenimiento.',
      },
      {
        question: '¿Puede integrarse con mi empresa de jardinería?',
        answer:
          'Sí. Puede actuar como apoyo técnico puntual o como protocolo que luego mantiene la cuadrilla.',
      },
      {
        question: '¿Qué ventaja tiene frente a comprar producto?',
        answer:
          'La trazabilidad, la aplicación homogénea y la reducción de carga operativa para el equipo interno.',
      },
    ],
  },
  {
    slug: 'aplicacion-humus-hoteles-restaurantes-jardin',
    title: 'Aplicación de humus para hoteles y restaurantes con jardín',
    metaTitle: 'Aplicación de humus para hoteles y restaurantes',
    metaDescription:
      'Aplicación profesional de té de humus para hoteles y restaurantes con jardín: bajo residuo, horarios discretos y mantenimiento biológico.',
    targetKeyword: 'aplicación humus hoteles restaurantes jardín',
    segment: 'Hoteles, restaurantes, fincas de eventos y terrazas ajardinadas',
    zone: 'Madrid, Toledo y zonas de servicio cercanas',
    intent: 'Mantener jardines visibles sin olores, residuos ni interrupciones para clientes.',
    problem:
      'En hostelería, el jardín forma parte de la experiencia del cliente. Cualquier intervención debe ser limpia, programable y fácil de explicar.',
    serviceRecommended:
      'Aplicación líquida en horarios de bajo uso, con bajo residuo visible y pauta para mantenimiento recurrente.',
    methodology: [
      'Revisión de horarios, zonas de paso, terrazas y áreas visibles.',
      'Aplicación sin acopios ni restos sólidos sobre césped o arriates.',
      'Coordinación con riego para dejar la zona utilizable cuanto antes.',
      'Informe simple para mantenimiento y dirección.',
    ],
    honestLimits: [
      'No sustituye jardinería ornamental, poda ni reposición de planta.',
      'No debe aplicarse en plena actividad de clientes si puede molestar.',
      'No es una solución estética instantánea si el jardín ya está degradado.',
    ],
    visualProof: {
      before: '/servicios-cesped-antes.webp',
      after: '/servicios-cesped-despues.webp',
      caption: 'La mejora visual debe interpretarse junto al calendario de riego y mantenimiento.',
    },
    reference: {
      title: 'Soil Organic Carbon: the hidden potential',
      authority: 'FAO',
      url: 'https://www.fao.org/3/i6937e/i6937e.pdf',
      takeaway:
        'La materia orgánica del suelo se relaciona con funciones clave para mantener zonas verdes resilientes y menos dependientes de correcciones puntuales.',
    },
    faqs: [
      {
        question: '¿Puede aplicarse antes de un evento?',
        answer:
          'Solo si hay margen operativo suficiente. Lo prudente es programarlo fuera de picos de uso y coordinar riego posterior.',
      },
      {
        question: '¿Deja olor o residuos visibles?',
        answer:
          'La aplicación líquida está pensada para bajo residuo visible. La conservación y aplicación correcta son claves para evitar molestias.',
      },
      {
        question: '¿Es mejor comprar producto o contratar servicio?',
        answer:
          'Si el hotel o restaurante tiene equipo formado, puede comprar. Si necesita discreción y trazabilidad, conviene servicio.',
      },
    ],
  },
  {
    slug: 'tratamiento-biologico-cesped-amarillo',
    title: 'Tratamiento biológico para césped amarillo',
    metaTitle: 'Tratamiento biológico para césped amarillo',
    metaDescription:
      'Servicio para césped amarillo: diagnóstico de riego, compactación y suelo antes de aplicar té de humus de lombriz con criterio.',
    targetKeyword: 'tratamiento biológico césped amarillo',
    segment: 'Jardines residenciales, comunidades y empresas con césped debilitado',
    zone: 'Madrid, Toledo y Castilla-La Mancha',
    intent: 'Tratar el césped amarillo sin confundir síntoma visual con falta simple de abono.',
    problem:
      'El césped amarillo puede deberse a estrés hídrico, compactación, fieltro, sombra, calor, riego irregular o suelo empobrecido. Aplicar sin diagnosticar puede ocultar el problema real.',
    serviceRecommended:
      'Diagnóstico visual, revisión de riego y aplicación de té de humus cuando el suelo puede beneficiarse de una rutina biológica.',
    methodology: [
      'Separar zonas amarillas por patrón: manchas, bordes, sombra o pisoteo.',
      'Revisar riego e infiltración antes de decidir dosis.',
      'Aplicar té de humus de forma homogénea si procede.',
      'Definir seguimiento, siega y riego posterior.',
    ],
    honestLimits: [
      'No todo césped amarillo se recupera con humus líquido.',
      'Si falta planta, puede hacer falta resiembra.',
      'Si el riego falla, el producto no corregirá la causa.',
    ],
    visualProof: {
      before: '/servicios-cesped-antes.webp',
      after: '/servicios-cesped-despues.webp',
      caption: 'El antes/después debe leerse como ejemplo de intervención, no como promesa.',
    },
    reference: {
      title: 'Soil Health',
      authority: 'USDA Natural Resources Conservation Service',
      url: 'https://www.nrcs.usda.gov/conservation-basics/natural-resource-concerns/soils/soil-health',
      takeaway:
        'La salud del suelo implica agua, aire, raíces y organismos; un síntoma visual puede tener varias causas bajo superficie.',
    },
    faqs: [
      {
        question: '¿Por qué se pone amarillo el césped?',
        answer:
          'Puede ser riego, compactación, calor, sombra, falta de raíz o suelo agotado. Por eso conviene diagnosticar antes de aplicar.',
      },
      {
        question: '¿Cuándo se nota el tratamiento?',
        answer:
          'Depende del estado inicial y del riego. No debe prometerse una respuesta uniforme inmediata.',
      },
      {
        question: '¿Puedo empezar comprando producto?',
        answer:
          'Sí si el problema es leve y puedes aplicar bien. Si hay manchas persistentes, el servicio reduce incertidumbre.',
      },
    ],
  },
  {
    slug: 'servicio-paisajistas-madrid-toledo',
    title: 'Servicio para paisajistas en Madrid y Toledo',
    metaTitle: 'Servicio para paisajistas en Madrid y Toledo',
    metaDescription:
      'Servicio B2B para paisajistas y jardineros en Madrid y Toledo: suministro fresco, cálculo de litros y aplicación de té de humus.',
    targetKeyword: 'servicio paisajistas Madrid Toledo',
    segment: 'Paisajistas, jardineros profesionales y mantenedores',
    zone: 'Madrid, Toledo, Guadalajara y Castilla-La Mancha',
    intent: 'Dar soporte técnico y logístico a profesionales que quieren microbiología aplicada sin improvisar.',
    problem:
      'El profesional no necesita promesas genéricas: necesita volumen, logística, compatibilidad con equipos, cálculo de superficie y una forma clara de explicarlo al cliente final.',
    serviceRecommended:
      'Suministro fresco, protocolo de aplicación o intervención completa con equipo de aplicación según proyecto.',
    methodology: [
      'Definir superficie y tipo de cubierta vegetal.',
      'Calcular formato, volumen de caldo y método de aplicación.',
      'Revisar compatibilidad con riego, mochila, cuba o Venturi.',
      'Documentar pauta para que el profesional pueda mantener o justificar el servicio.',
    ],
    honestLimits: [
      'No sustituye la responsabilidad técnica del paisajista sobre diseño y riego.',
      'No promete resolver patologías sin diagnóstico.',
      'No debe mezclarse con productos incompatibles sin revisión previa.',
    ],
    visualProof: {
      before: '/servicios-cesped-antes.webp',
      after: '/servicios-cesped-despues.webp',
      caption: 'La prueba visual puede acompañar propuestas profesionales si se explica el contexto.',
    },
    reference: {
      title: 'Effects of humic acids from vermicomposts on plant growth',
      authority: 'European Journal of Soil Biology',
      url: 'https://doi.org/10.1016/j.ejsobi.2006.06.004',
      takeaway:
        'Los derivados húmicos de vermicompost se estudian por sus respuestas en crecimiento vegetal, siempre dependientes del contexto de uso.',
    },
    faqs: [
      {
        question: '¿Trabajáis como proveedor o como aplicador?',
        answer:
          'Ambas opciones: suministro profesional, protocolo o aplicación completa según equipo, superficie y calendario.',
      },
      {
        question: '¿Es compatible con mi sistema de riego?',
        answer:
          'Depende de filtros, presión y mantenimiento. Puede valorarse fertirrigación, pulverización o cuba.',
      },
      {
        question: '¿Puedo comprar formatos directamente?',
        answer:
          'Sí. Si ya tienes método y equipo, la compra directa del producto es la vía eficiente.',
      },
    ],
  },
  {
    slug: 'aplicacion-humus-parques-empresariales',
    title: 'Aplicación de humus en parques empresariales',
    metaTitle: 'Aplicación de humus en parques empresariales',
    metaDescription:
      'Aplicación profesional de humus líquido para parques empresariales y zonas verdes corporativas: intervención limpia y trazable.',
    targetKeyword: 'aplicación humus parques empresariales',
    segment: 'Parques empresariales, complejos comerciales y sedes corporativas',
    zone: 'Áreas empresariales de Madrid, Toledo y alrededores',
    intent: 'Mantener zonas verdes corporativas con intervención discreta, documentada y compatible con actividad diaria.',
    problem:
      'Los parques empresariales tienen superficies amplias, tránsito, expectativas de imagen y contratos de mantenimiento donde la trazabilidad pesa más que una aplicación improvisada.',
    serviceRecommended:
      'Aplicación planificada por zonas, con prioridad en áreas visibles, registro de intervención y pauta de continuidad.',
    methodology: [
      'Mapeo de accesos, zonas visibles, horarios y restricciones.',
      'Priorización por estado del césped y valor visual.',
      'Aplicación por sectores para no interferir con usuarios.',
      'Informe de intervención para propiedad o mantenimiento.',
    ],
    honestLimits: [
      'No corrige diseño de riego ni compactación severa sin medidas adicionales.',
      'No sustituye contratos de jardinería; los complementa.',
      'No debe prometer uniformidad si el parque tiene zonas muy distintas.',
    ],
    visualProof: {
      before: '/servicios-cesped-antes.webp',
      after: '/servicios-cesped-despues.webp',
      caption: 'La prueba visual debe segmentarse por zonas para no ocultar diferencias de riego o uso.',
    },
    reference: {
      title: 'Soil Organic Carbon: the hidden potential',
      authority: 'FAO',
      url: 'https://www.fao.org/3/i6937e/i6937e.pdf',
      takeaway:
        'El carbono orgánico participa en funciones de suelo que afectan agua, estructura y resiliencia, relevantes para superficies verdes extensas.',
    },
    faqs: [
      {
        question: '¿Puede hacerse por fases?',
        answer:
          'Sí. En parques empresariales suele ser más sensato priorizar zonas visibles o críticas.',
      },
      {
        question: '¿El servicio sustituye a mi empresa de jardinería?',
        answer:
          'No. Funciona como apoyo técnico o intervención concreta que la empresa puede mantener después.',
      },
      {
        question: '¿Qué se entrega al cliente?',
        answer:
          'Una pauta o resumen con zonas tratadas, objetivo, producto aplicado y recomendaciones posteriores.',
      },
    ],
  },
  {
    slug: 'zonas-verdes-sin-abonos-quimicos-agresivos',
    title: 'Mantenimiento de zonas verdes sin abonos químicos agresivos',
    metaTitle: 'Zonas verdes sin abonos químicos agresivos',
    metaDescription:
      'Servicio de mantenimiento biológico de zonas verdes con té de humus: bajo residuo, límites honestos y alternativa a rutinas químicas agresivas.',
    targetKeyword: 'mantenimiento zonas verdes sin abonos químicos agresivos',
    segment: 'Comunidades, empresas, hoteles y responsables de mantenimiento',
    zone: 'España con foco operativo en Madrid, Toledo y Castilla-La Mancha',
    intent: 'Reducir dependencia de rutinas químicas agresivas sin caer en promesas ecológicas vacías.',
    problem:
      'Muchas zonas verdes alternan fertilizantes de choque con correcciones puntuales. Eso puede dar color rápido, pero no siempre mejora rutina, suelo o trazabilidad.',
    serviceRecommended:
      'Aplicación de té de humus como intervención biológica de bajo residuo visible, conectada con riego, siega y seguimiento.',
    methodology: [
      'Revisar historial de fertilización, riego y síntomas recurrentes.',
      'Aplicar humus líquido sin dejar residuo sólido visible.',
      'Separar mantenimiento preventivo de recuperación de zonas degradadas.',
      'Proponer continuidad con producto o servicio según capacidad del cliente.',
    ],
    honestLimits: [
      'No todos los fertilizantes químicos son iguales ni deben demonizarse sin contexto.',
      'No sustituye correcciones físicas o hidráulicas necesarias.',
      'No debe prometer cero problemas; reduce incertidumbre dentro de una rutina.',
    ],
    visualProof: {
      before: '/servicios-cesped-antes.webp',
      after: '/servicios-cesped-despues.webp',
      caption: 'La comparación visual debe acompañarse de una explicación de manejo, no de claims absolutos.',
    },
    reference: {
      title: 'Soil Health',
      authority: 'USDA Natural Resources Conservation Service',
      url: 'https://www.nrcs.usda.gov/conservation-basics/natural-resource-concerns/soils/soil-health',
      takeaway:
        'El enfoque de salud del suelo prioriza funcionamiento del sistema, no solo respuesta rápida a una aplicación.',
    },
    faqs: [
      {
        question: '¿Significa que nunca se usa fertilización convencional?',
        answer:
          'No. Significa priorizar una rutina biológica y prudente, evaluando cada jardín según estado, uso y objetivo.',
      },
      {
        question: '¿Es apto para zonas con tránsito?',
        answer:
          'Sí, si se programa correctamente y se respeta riego/secado antes de uso intenso.',
      },
      {
        question: '¿Puedo comprar producto para mantenerlo?',
        answer:
          'Sí. Tras una intervención inicial, la compra directa puede sostener la rutina si el equipo sabe aplicarlo.',
      },
    ],
  },
];

export function getPremiumServicePage(slug: string) {
  return premiumServicePages.find((page) => page.slug === slug);
}
