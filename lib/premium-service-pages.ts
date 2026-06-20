export type PremiumServicePage = {
  kind?: 'segment' | 'geo';
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
  localJustification?: {
    title: string;
    points: string[];
  };
  faqs: Array<{ question: string; answer: string }>;
};

export const premiumSegmentServicePages: PremiumServicePage[] = [
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
      before: '/media/editorial/servicios-regeneracion-cesped-chalets.webp',
      after: '/media/editorial/servicios-regeneracion-cesped-chalets.webp',
      caption: 'Visual de diagnóstico y aplicación para chalets; representa la metodología de trabajo, no una garantía universal de resultado.',
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
      before: '/media/editorial/servicios-aplicacion-humus-comunidades-vecinos.webp',
      after: '/media/editorial/servicios-aplicacion-humus-comunidades-vecinos.webp',
      caption: 'Visual de intervención limpia en comunidades; la trazabilidad y la pauta posterior son parte del servicio.',
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
      before: '/media/editorial/servicios-mantenimiento-biologico-jardines-empresas.webp',
      after: '/media/editorial/servicios-mantenimiento-biologico-jardines-empresas.webp',
      caption: 'Visual de mantenimiento biológico para jardines corporativos y zonas verdes representativas.',
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
      before: '/media/editorial/servicios-aplicacion-humus-hoteles-restaurantes-jardin.webp',
      after: '/media/editorial/servicios-aplicacion-humus-hoteles-restaurantes-jardin.webp',
      caption: 'Visual de aplicación discreta en jardines visibles al cliente, con enfoque de bajo residuo.',
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
      before: '/media/editorial/servicios-tratamiento-biologico-cesped-amarillo.webp',
      after: '/media/editorial/servicios-tratamiento-biologico-cesped-amarillo.webp',
      caption: 'Visual de diagnóstico de césped amarillo; la causa debe leerse antes de aplicar cualquier tratamiento.',
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
      before: '/media/editorial/servicios-servicio-paisajistas-madrid-toledo.webp',
      after: '/media/editorial/servicios-servicio-paisajistas-madrid-toledo.webp',
      caption: 'Visual B2B para paisajistas: cálculo de litros, suministro fresco y aplicación técnica cuando procede.',
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
      before: '/media/editorial/servicios-aplicacion-humus-parques-empresariales.webp',
      after: '/media/editorial/servicios-aplicacion-humus-parques-empresariales.webp',
      caption: 'Visual de aplicación en parques empresariales y complejos comerciales con planificación operativa.',
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
      before: '/media/editorial/servicios-zonas-verdes-sin-abonos-quimicos-agresivos.webp',
      after: '/media/editorial/servicios-zonas-verdes-sin-abonos-quimicos-agresivos.webp',
      caption: 'Visual de mantenimiento biológico de zonas verdes con enfoque prudente y bajo residuo visible.',
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

export const premiumGeoServicePages: PremiumServicePage[] = [
  {
    kind: 'geo',
    slug: 'regeneracion-cesped-pozuelo',
    title: 'Regeneración de césped en Pozuelo',
    metaTitle: 'Regeneración de césped en Pozuelo | Biocultor',
    metaDescription:
      'Servicio de regeneración biológica de césped en Pozuelo: diagnóstico de riego, suelo y aplicación de té de humus para jardines residenciales.',
    targetKeyword: 'regeneración de césped en Pozuelo',
    segment: 'Chalets, urbanizaciones y jardines privados de Pozuelo de Alarcón',
    zone: 'Pozuelo de Alarcón y entorno oeste de Madrid',
    intent: 'Recuperar césped de jardines residenciales con una intervención local, discreta y medible.',
    problem:
      'En Pozuelo conviven jardines de alto uso, zonas de sombra, riego por sectores y exigencia estética elevada. El fallo no suele resolverse aplicando más producto sin revisar riego, tránsito y compactación.',
    serviceRecommended:
      'Diagnóstico por sectores, aplicación de té de humus líquido y pauta de continuidad para mantener el césped sin depender de correcciones de choque.',
    methodology: [
      'Separar zonas soleadas, sombra, tránsito familiar y bordes de piscina o terraza.',
      'Revisar uniformidad de riego antes de recomendar dosis o frecuencia.',
      'Aplicar té de humus por sectores para priorizar zonas visibles del chalet.',
      'Entregar pauta posterior de riego, siega y compra directa si el mantenimiento queda en manos del propietario o jardinero.',
    ],
    honestLimits: [
      'No corrige un sistema de riego mal sectorizado.',
      'No evita resiembra si ya falta densidad vegetal.',
      'No debe prometer verde inmediato en céspedes quemados o con raíz agotada.',
    ],
    localJustification: {
      title: 'Por qué Pozuelo requiere una página propia',
      points: [
        'Alta presencia de jardines privados donde la estética del césped pesa en la decisión de compra.',
        'Parcelas con zonas de sombra, piscinas, tránsito familiar y riego sectorizado que obligan a diagnosticar por áreas.',
        'Cliente con capacidad de contratar servicio si se explica la intervención con límites y trazabilidad.',
      ],
    },
    visualProof: {
      before: '/media/editorial/servicios-regeneracion-cesped-pozuelo.webp',
      after: '/media/editorial/servicios-regeneracion-cesped-pozuelo.webp',
      caption: 'Visual local para jardines privados en Pozuelo: diagnóstico, aplicación biológica y pauta posterior.',
    },
    reference: {
      title: 'Soil Health',
      authority: 'USDA Natural Resources Conservation Service',
      url: 'https://www.nrcs.usda.gov/conservation-basics/natural-resource-concerns/soils/soil-health',
      takeaway:
        'La salud del suelo integra agua, aire, raíces y actividad biológica; por eso el diagnóstico local importa antes de aplicar.',
    },
    faqs: [
      {
        question: '¿Atendéis chalets en Pozuelo?',
        answer:
          'Sí. La intervención se valora por superficie, acceso, estado del césped y coordinación con el riego existente.',
      },
      {
        question: '¿Se puede hacer por zonas del jardín?',
        answer:
          'Sí. En jardines grandes suele ser mejor priorizar zonas visibles o más degradadas antes que tratar todo sin criterio.',
      },
      {
        question: '¿Puedo continuar después con producto comprado?',
        answer:
          'Sí. El servicio inicial puede ordenar el problema y la compra directa mantener la rutina.',
      },
    ],
  },
  {
    kind: 'geo',
    slug: 'jardineria-biologica-la-moraleja',
    title: 'Jardinería biológica en La Moraleja',
    metaTitle: 'Jardinería biológica en La Moraleja | Biocultor',
    metaDescription:
      'Servicio de jardinería biológica en La Moraleja para jardines de alto valor: humus líquido, bajo residuo visible y protocolo técnico.',
    targetKeyword: 'jardinería biológica en La Moraleja',
    segment: 'Viviendas premium, jardines privados y mantenimiento residencial',
    zone: 'La Moraleja, Alcobendas y entorno norte de Madrid',
    intent: 'Mantener jardines premium con una intervención limpia, técnica y fácil de coordinar.',
    problem:
      'En jardines de alto valor la intervención debe ser discreta, compatible con uso residencial y explicable al personal de mantenimiento. El reto no es solo aplicar, sino no generar molestias ni claims exagerados.',
    serviceRecommended:
      'Aplicación programada de té de humus líquido, revisión de zonas sensibles y pauta para mantenimiento biológico recurrente.',
    methodology: [
      'Identificar zonas ornamentales, césped, setos, sombra y áreas de paso.',
      'Programar la aplicación fuera de momentos de uso familiar o visitas.',
      'Aplicar con bajo residuo visible y coordinación con riego posterior.',
      'Definir si conviene servicio recurrente o suministro para el jardinero habitual.',
    ],
    honestLimits: [
      'No sustituye diseño paisajístico, poda ni reposición ornamental.',
      'No corrige problemas de drenaje o riego sin intervención adicional.',
      'No debe presentarse como tratamiento cosmético instantáneo.',
    ],
    localJustification: {
      title: 'Por qué La Moraleja requiere una página propia',
      points: [
        'La decisión combina estética, privacidad, coordinación operativa y bajo residuo visible.',
        'Los jardines suelen tener mezcla de césped, setos, arbolado y zonas ornamentales que no admiten una pauta única.',
        'El cliente valora el servicio si reduce carga operativa y evita intervenciones agresivas.',
      ],
    },
    visualProof: {
      before: '/media/editorial/servicios-jardineria-biologica-la-moraleja.webp',
      after: '/media/editorial/servicios-jardineria-biologica-la-moraleja.webp',
      caption: 'Visual local para jardines premium en La Moraleja con intervención discreta y bajo residuo.',
    },
    reference: {
      title: 'Soil Organic Carbon: the hidden potential',
      authority: 'FAO',
      url: 'https://www.fao.org/3/i6937e/i6937e.pdf',
      takeaway:
        'La materia orgánica se relaciona con estructura, agua, biodiversidad y fertilidad; en jardines premium importa la continuidad, no solo el efecto inmediato.',
    },
    faqs: [
      {
        question: '¿El servicio deja residuos visibles?',
        answer:
          'La aplicación líquida está pensada para bajo residuo visible y debe coordinarse con riego y horario.',
      },
      {
        question: '¿Puede trabajar con mi jardinero?',
        answer:
          'Sí. Puede ser una intervención puntual, un protocolo o suministro para el equipo habitual.',
      },
      {
        question: '¿Sirve para jardines ornamentales además de césped?',
        answer:
          'Sí, siempre ajustando método, dosis y objetivo según arriates, setos, césped o zonas de sombra.',
      },
    ],
  },
  {
    kind: 'geo',
    slug: 'recuperacion-jardines-las-rozas',
    title: 'Recuperación de jardines en Las Rozas',
    metaTitle: 'Recuperación de jardines en Las Rozas | Biocultor',
    metaDescription:
      'Recuperación biológica de jardines en Las Rozas: césped debilitado, suelo compacto, riego irregular y aplicación profesional de humus líquido.',
    targetKeyword: 'recuperación de jardines en Las Rozas',
    segment: 'Chalets, comunidades y jardines residenciales',
    zone: 'Las Rozas, Majadahonda y noroeste de Madrid',
    intent: 'Recuperar jardines con diagnóstico previo y una intervención biológica sin prometer milagros.',
    problem:
      'En Las Rozas son frecuentes jardines con zonas secas, sombra, tránsito y riego desigual. Si se trata todo igual, el presupuesto se diluye y la causa real queda sin resolver.',
    serviceRecommended:
      'Evaluación por zonas, aplicación de té de humus donde aporta valor y pauta de recuperación conectada con riego y siega.',
    methodology: [
      'Clasificar zonas por síntoma: amarilleo, calvas, sombra, compactación o bordes secos.',
      'Diferenciar recuperación posible de zonas que exigen resiembra o reparación física.',
      'Aplicar humus líquido en sectores con raíz y suelo recuperable.',
      'Recomendar continuidad con servicio o compra según capacidad de mantenimiento.',
    ],
    honestLimits: [
      'No toda calva se recupera sin resiembra.',
      'No corrige drenaje deficiente ni riego mal diseñado.',
      'No garantiza una respuesta homogénea si el jardín tiene zonas muy distintas.',
    ],
    localJustification: {
      title: 'Por qué Las Rozas requiere una página propia',
      points: [
        'Zona con urbanizaciones y jardines residenciales donde se mezclan césped, arbolado y uso familiar.',
        'La recuperación debe diferenciar síntomas de riego, suelo y falta real de planta.',
        'La proximidad al corredor noroeste permite plantear servicio por sectores y seguimiento.',
      ],
    },
    visualProof: {
      before: '/media/editorial/servicios-recuperacion-jardines-las-rozas.webp',
      after: '/media/editorial/servicios-recuperacion-jardines-las-rozas.webp',
      caption: 'Visual local para recuperación de jardines en Las Rozas basada en diagnóstico, riego y seguimiento.',
    },
    reference: {
      title: 'Soil Health',
      authority: 'USDA Natural Resources Conservation Service',
      url: 'https://www.nrcs.usda.gov/conservation-basics/natural-resource-concerns/soils/soil-health',
      takeaway:
        'La función del suelo condiciona la respuesta vegetal; una recuperación seria debe mirar más que el color.',
    },
    faqs: [
      {
        question: '¿Podéis recuperar jardines con calvas?',
        answer:
          'Depende. Si queda raíz y suelo funcional, puede haber margen. Si falta planta, se recomienda resiembra o reposición.',
      },
      {
        question: '¿La intervención puede hacerse por sectores?',
        answer:
          'Sí. Es lo recomendable cuando el jardín tiene zonas con causas distintas.',
      },
      {
        question: '¿Incluye diagnóstico de riego?',
        answer:
          'Incluye revisión visual y pauta práctica; reparaciones de riego se tratan como trabajo adicional o con el jardinero habitual.',
      },
    ],
  },
  {
    kind: 'geo',
    slug: 'mantenimiento-jardines-boadilla-del-monte',
    title: 'Mantenimiento de jardines en Boadilla del Monte',
    metaTitle: 'Mantenimiento de jardines en Boadilla del Monte',
    metaDescription:
      'Mantenimiento biológico de jardines en Boadilla del Monte: aplicación de té de humus, bajo residuo y pauta para chalets y urbanizaciones.',
    targetKeyword: 'mantenimiento de jardines en Boadilla del Monte',
    segment: 'Chalets, comunidades y urbanizaciones de Boadilla',
    zone: 'Boadilla del Monte y entorno oeste de Madrid',
    intent: 'Añadir una capa biológica al mantenimiento de jardines residenciales sin sustituir al jardinero habitual.',
    problem:
      'El mantenimiento recurrente puede centrarse en siega, poda y limpieza, pero dejar el suelo como una caja negra. Sin suelo funcional, el jardín depende más de correcciones puntuales.',
    serviceRecommended:
      'Aplicación periódica de té de humus líquido vinculada al calendario de riego, siega y mantenimiento existente.',
    methodology: [
      'Revisar rutina actual de siega, riego, abonado y zonas problemáticas.',
      'Definir frecuencia de intervención según superficie y objetivo.',
      'Aplicar humus líquido en momentos compatibles con riego y uso del jardín.',
      'Coordinar pauta con propietario, comunidad o empresa de jardinería.',
    ],
    honestLimits: [
      'No sustituye mantenimiento de siega, poda o limpieza.',
      'No debe aplicarse sin revisar riego y calendario.',
      'No elimina la necesidad de reposición vegetal cuando hay pérdida irreversible.',
    ],
    localJustification: {
      title: 'Por qué Boadilla requiere una página propia',
      points: [
        'Mercado residencial con jardines y urbanizaciones donde el mantenimiento continuo pesa más que una intervención aislada.',
        'La aplicación biológica puede integrarse con rutinas existentes sin desplazar al jardinero.',
        'El cliente suele necesitar claridad de calendario, coste y responsabilidad operativa.',
      ],
    },
    visualProof: {
      before: '/media/editorial/servicios-mantenimiento-jardines-boadilla-del-monte.webp',
      after: '/media/editorial/servicios-mantenimiento-jardines-boadilla-del-monte.webp',
      caption: 'Visual local para mantenimiento de jardines en Boadilla del Monte con continuidad y bajo residuo.',
    },
    reference: {
      title: 'Soil Organic Carbon: the hidden potential',
      authority: 'FAO',
      url: 'https://www.fao.org/3/i6937e/i6937e.pdf',
      takeaway:
        'La materia orgánica participa en funciones de suelo relevantes para zonas verdes mantenidas a largo plazo.',
    },
    faqs: [
      {
        question: '¿Sustituye al jardinero habitual?',
        answer:
          'No. Es una intervención complementaria que puede integrarse con su calendario de mantenimiento.',
      },
      {
        question: '¿Tiene sentido hacerlo de forma recurrente?',
        answer:
          'Sí, si el jardín tiene superficie suficiente, objetivo estético claro y una rutina de riego estable.',
      },
      {
        question: '¿Se puede presupuestar para una comunidad?',
        answer:
          'Sí. Se priorizan zonas visibles, superficie y frecuencia para ajustar el presupuesto.',
      },
    ],
  },
  {
    kind: 'geo',
    slug: 'aplicacion-humus-majadahonda',
    title: 'Aplicación de humus en Majadahonda',
    metaTitle: 'Aplicación de humus en Majadahonda | Biocultor',
    metaDescription:
      'Aplicación profesional de humus líquido en Majadahonda para césped, chalets, comunidades y jardines con mantenimiento técnico.',
    targetKeyword: 'aplicación de humus en Majadahonda',
    segment: 'Chalets, comunidades y paisajistas de Majadahonda',
    zone: 'Majadahonda y municipios cercanos del oeste de Madrid',
    intent: 'Aplicar humus líquido con criterio local cuando la compra directa no basta por superficie, logística o diagnóstico.',
    problem:
      'En jardines amplios, el problema no es solo comprar producto: hay que calcular litros, repartir bien la aplicación y coordinar riego para no perder eficacia.',
    serviceRecommended:
      'Cálculo de superficie, aplicación de té de humus líquido y pauta para continuar mediante servicio o compra directa.',
    methodology: [
      'Calcular superficie real y separar césped, setos y arriates.',
      'Definir volumen de aplicación y método operativo.',
      'Aplicar sin dejar residuo sólido visible y coordinar riego posterior.',
      'Recomendar formato de compra si el equipo puede mantener la rutina.',
    ],
    honestLimits: [
      'No sustituye un cálculo correcto de superficie.',
      'No corrige averías de riego o drenaje.',
      'No garantiza respuesta si se aplica fuera de una rutina coherente.',
    ],
    localJustification: {
      title: 'Por qué Majadahonda requiere una página propia',
      points: [
        'Alta concentración de jardines residenciales y comunidades con necesidad de aplicación ordenada.',
        'La cercanía con Pozuelo, Las Rozas y Boadilla permite agrupar rutas sin perder especificidad local.',
        'La intención de búsqueda puede alternar compra de producto y contratación de aplicación.',
      ],
    },
    visualProof: {
      before: '/media/editorial/servicios-aplicacion-humus-majadahonda.webp',
      after: '/media/editorial/servicios-aplicacion-humus-majadahonda.webp',
      caption: 'Visual local para aplicación de humus líquido en jardines de Majadahonda con pauta técnica.',
    },
    reference: {
      title: 'Effects of humic acids from vermicomposts on plant growth',
      authority: 'European Journal of Soil Biology',
      url: 'https://doi.org/10.1016/j.ejsobi.2006.06.004',
      takeaway:
        'Los derivados húmicos de vermicompost se estudian por respuestas en crecimiento vegetal, siempre condicionadas por dosis y contexto.',
    },
    faqs: [
      {
        question: '¿Aplicáis humus líquido en Majadahonda?',
        answer:
          'Sí, sujeto a superficie, acceso y calendario. Para superficies pequeñas puede ser más eficiente comprar producto.',
      },
      {
        question: '¿Calculáis litros necesarios?',
        answer:
          'Sí. El cálculo parte de superficie útil, método de aplicación y objetivo de mantenimiento o recuperación.',
      },
      {
        question: '¿Puede contratarlo una comunidad?',
        answer:
          'Sí. Se puede priorizar césped y zonas comunes de mayor visibilidad.',
      },
    ],
  },
  {
    kind: 'geo',
    slug: 'servicio-humus-jardines-aravaca',
    title: 'Servicio de humus para jardines en Aravaca',
    metaTitle: 'Servicio de humus para jardines en Aravaca',
    metaDescription:
      'Servicio de humus líquido para jardines en Aravaca: aplicación biológica para chalets, césped y zonas verdes de alto valor.',
    targetKeyword: 'servicio de humus para jardines en Aravaca',
    segment: 'Chalets, jardines privados y mantenimiento residencial',
    zone: 'Aravaca, Valdemarín y entorno noroeste de Madrid',
    intent: 'Ofrecer una intervención biológica de alta confianza para jardines residenciales exigentes.',
    problem:
      'En Aravaca y zonas cercanas hay jardines con exigencia estética, privacidad y coordinación con mantenimiento externo. Una aplicación sin planificación puede molestar o no integrarse con la rutina.',
    serviceRecommended:
      'Servicio de aplicación de humus líquido con diagnóstico, bajo residuo visible y coordinación con jardinero o propiedad.',
    methodology: [
      'Revisar accesos, horarios, zonas visibles y restricciones de uso.',
      'Diferenciar césped, setos, arriates y zonas de sombra.',
      'Aplicar en horario discreto y coordinar riego posterior.',
      'Definir si el mantenimiento continúa con servicio o compra directa.',
    ],
    honestLimits: [
      'No sustituye paisajismo ni mantenimiento ornamental.',
      'No corrige por sí solo una mala programación de riego.',
      'No debe prometer resultados uniformes en jardines con zonas muy distintas.',
    ],
    localJustification: {
      title: 'Por qué Aravaca requiere una página propia',
      points: [
        'Intención local compatible con chalets, privacidad y servicio a domicilio.',
        'Necesidad de coordinación fina con horarios, accesos y equipos de mantenimiento.',
        'Alta afinidad con compra posterior de producto para continuidad.',
      ],
    },
    visualProof: {
      before: '/media/editorial/servicios-servicio-humus-jardines-aravaca.webp',
      after: '/media/editorial/servicios-servicio-humus-jardines-aravaca.webp',
      caption: 'Visual local para jardines en Aravaca con diagnóstico, aplicación limpia y bajo residuo.',
    },
    reference: {
      title: 'Soil Health',
      authority: 'USDA Natural Resources Conservation Service',
      url: 'https://www.nrcs.usda.gov/conservation-basics/natural-resource-concerns/soils/soil-health',
      takeaway:
        'El manejo del suelo debe considerar agua, organismos, raíces y estructura física; no solo fertilización.',
    },
    faqs: [
      {
        question: '¿El servicio se adapta a horarios discretos?',
        answer:
          'Sí. En jardines residenciales se coordina horario, acceso y riego para reducir molestias.',
      },
      {
        question: '¿Puede aplicarse en setos y arriates?',
        answer:
          'Sí, ajustando método y objetivo. No se trata igual un césped que un arriate ornamental.',
      },
      {
        question: '¿Hay opción de compra para mantenimiento?',
        answer:
          'Sí. Tras el servicio, la compra directa puede ser la opción más eficiente si hay equipo de aplicación.',
      },
    ],
  },
  {
    kind: 'geo',
    slug: 'regeneracion-cesped-toledo',
    title: 'Regeneración de césped en Toledo',
    metaTitle: 'Regeneración de césped en Toledo | Biocultor',
    metaDescription:
      'Regeneración biológica de césped en Toledo: intervención con té de humus para jardines afectados por calor, compactación y riego irregular.',
    targetKeyword: 'regeneración de césped en Toledo',
    segment: 'Chalets, cigarrales, comunidades y jardines privados',
    zone: 'Toledo, Olías del Rey, Bargas y entorno cercano',
    intent: 'Recuperar césped sometido a calor y estrés hídrico con un enfoque prudente de suelo y riego.',
    problem:
      'En Toledo el calor y los veranos exigentes hacen visible cualquier fallo de riego, suelo o raíz. Aplicar sin revisar causa puede producir una mejora corta y poco estable.',
    serviceRecommended:
      'Diagnóstico de estrés, aplicación de té de humus líquido y pauta de riego/siega adaptada a condiciones de calor.',
    methodology: [
      'Identificar zonas de estrés por sol, compactación, pendiente o riego insuficiente.',
      'Evaluar si hay planta recuperable antes de aplicar.',
      'Aplicar humus líquido en ventanas de menor estrés térmico.',
      'Definir pauta de riego posterior y continuidad de mantenimiento.',
    ],
    honestLimits: [
      'No resuelve estrés hídrico si el riego sigue siendo insuficiente.',
      'No recupera zonas sin planta viva.',
      'No conviene aplicarlo como única medida en episodios de calor extremo.',
    ],
    localJustification: {
      title: 'Por qué Toledo requiere una página propia',
      points: [
        'Condiciones de calor y estrés hídrico que cambian la pauta frente a jardines del norte de Madrid.',
        'Necesidad de coordinar aplicación con riego y momentos de menor temperatura.',
        'Zona operativa natural para Biocultor por proximidad logística.',
      ],
    },
    visualProof: {
      before: '/media/editorial/servicios-regeneracion-cesped-toledo.webp',
      after: '/media/editorial/servicios-regeneracion-cesped-toledo.webp',
      caption: 'Visual local para regeneración de césped en Toledo, con atención a calor, riego y suelo calizo.',
    },
    reference: {
      title: 'Soil Organic Carbon: the hidden potential',
      authority: 'FAO',
      url: 'https://www.fao.org/3/i6937e/i6937e.pdf',
      takeaway:
        'La materia orgánica influye en estructura y agua disponible, dos factores críticos para césped sometido a estrés térmico.',
    },
    faqs: [
      {
        question: '¿Es viable aplicar en verano en Toledo?',
        answer:
          'Se valora caso a caso. En calor fuerte se priorizan horarios, riego y estado de la planta para no vender una intervención poco útil.',
      },
      {
        question: '¿Sirve para césped muy seco?',
        answer:
          'Solo si queda planta recuperable. Si falta densidad, puede hacer falta resiembra.',
      },
      {
        question: '¿Atendéis jardines fuera de Toledo capital?',
        answer:
          'Sí, en entorno cercano según superficie, acceso y calendario de ruta.',
      },
    ],
  },
  {
    kind: 'geo',
    slug: 'aplicacion-humus-jardines-illescas-sesena',
    title: 'Aplicación de humus para jardines en Illescas y Seseña',
    metaTitle: 'Aplicación de humus en Illescas y Seseña',
    metaDescription:
      'Aplicación profesional de humus líquido para jardines en Illescas y Seseña: césped, chalets, comunidades y zonas verdes residenciales.',
    targetKeyword: 'aplicación de humus para jardines en Illescas Seseña',
    segment: 'Chalets, comunidades y jardines residenciales de La Sagra',
    zone: 'Illescas, Seseña y norte de Toledo',
    intent: 'Dar servicio local a jardines residenciales con suelos pesados, calor y necesidad de aplicación práctica.',
    problem:
      'En La Sagra aparecen jardines jóvenes, suelos pesados, riegos ajustados y céspedes que sufren rápido con calor. El tratamiento debe diferenciar mantenimiento, recuperación y falta real de planta.',
    serviceRecommended:
      'Aplicación de té de humus líquido por zonas, con pauta de riego posterior y opción de compra para mantenimiento recurrente.',
    methodology: [
      'Revisar suelo, riego, orientación y edad del jardín.',
      'Separar zonas de mantenimiento de zonas que exigen recuperación o resiembra.',
      'Aplicar humus líquido en horario compatible con temperatura y riego.',
      'Entregar pauta sencilla para comunidad, propietario o jardinero.',
    ],
    honestLimits: [
      'No sustituye mejora física de suelo si hay compactación severa.',
      'No corrige un riego insuficiente en verano.',
      'No debe venderse como solución única para césped perdido.',
    ],
    localJustification: {
      title: 'Por qué Illescas y Seseña requieren una página propia',
      points: [
        'Zona de crecimiento residencial con jardines nuevos que necesitan rutinas claras desde el inicio.',
        'Suelos y condiciones de calor que obligan a coordinar aplicación con riego y calendario.',
        'Cercanía logística con Toledo y Madrid sur, útil para rutas de servicio.',
      ],
    },
    visualProof: {
      before: '/media/editorial/servicios-aplicacion-humus-jardines-illescas-sesena.webp',
      after: '/media/editorial/servicios-aplicacion-humus-jardines-illescas-sesena.webp',
      caption: 'Visual local para aplicación de humus en jardines residenciales del eje Illescas-Seseña.',
    },
    reference: {
      title: 'Soil Health',
      authority: 'USDA Natural Resources Conservation Service',
      url: 'https://www.nrcs.usda.gov/conservation-basics/natural-resource-concerns/soils/soil-health',
      takeaway:
        'El suelo sano funciona como sistema vivo; en suelos pesados conviene intervenir con diagnóstico, no solo con producto.',
    },
    faqs: [
      {
        question: '¿Trabajáis en Illescas y Seseña?',
        answer:
          'Sí, sujeto a superficie, acceso y calendario. Para pequeñas superficies puede convenir compra directa.',
      },
      {
        question: '¿Ayuda en suelos pesados?',
        answer:
          'Puede ayudar dentro de una rutina biológica, pero no sustituye aireación, mejora física o correcciones de riego si son necesarias.',
      },
      {
        question: '¿Se puede hacer para comunidades?',
        answer:
          'Sí. Se priorizan zonas comunes y se entrega pauta de continuidad para mantenimiento.',
      },
    ],
  },
];

export const premiumServicePages: PremiumServicePage[] = [
  ...premiumSegmentServicePages,
  ...premiumGeoServicePages,
];

export function getPremiumServicePage(slug: string) {
  return premiumServicePages.find((page) => page.slug === slug);
}
