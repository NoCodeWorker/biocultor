import { authorityReferences, type AuthorityReference } from './authority-assets';

export type ComparisonPage = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  alternative: string;
  audience: string;
  summary: string;
  whenBiocultorFits: string[];
  whenAlternativeFits: string[];
  decisionMatrix: Array<{
    criterion: string;
    biocultor: string;
    alternative: string;
  }>;
  limits: string[];
  ctaHref: string;
  ctaLabel: string;
  reference: AuthorityReference;
};

export const comparisonPages: ComparisonPage[] = [
  {
    slug: 'te-humus-vs-abono-quimico-cesped',
    title: 'Te de humus vs abono quimico en cesped',
    metaTitle: 'Te de humus vs abono quimico en cesped | Biocultor',
    metaDescription:
      'Comparativa honesta entre aplicacion biologica de humus liquido y abono mineral en cesped: rapidez, suelo, mantenimiento y limites.',
    alternative: 'Abono quimico mineral',
    audience: 'Propietarios de jardines, comunidades y mantenedores',
    summary:
      'El abono mineral puede ser util cuando se busca una respuesta nutricional rapida y controlada. El te de humus encaja mejor cuando la decision no es solo verde inmediato, sino manejo de suelo, bajo residuo visible y continuidad biologica.',
    whenBiocultorFits: [
      'Jardines donde el suelo esta cansado, compactado o con bajo vigor recurrente.',
      'Espacios con mascotas, ninos, transito o exigencia de bajo residuo visible.',
      'Clientes que valoran diagnostico, seguimiento y mantenimiento a medio plazo.',
    ],
    whenAlternativeFits: [
      'Correcciones nutricionales puntuales con analitica clara.',
      'Programas tecnicos donde el responsable ya controla dosis, sales y riego.',
      'Situaciones donde se necesita respuesta rapida y no se esta abordando estructura del suelo.',
    ],
    decisionMatrix: [
      {
        criterion: 'Velocidad percibida',
        biocultor: 'Mas gradual; depende de riego, suelo y manejo.',
        alternative: 'Puede dar verde rapido si la causa es nutricional.',
      },
      {
        criterion: 'Enfoque de suelo',
        biocultor: 'Trabaja como apoyo biologico y de manejo.',
        alternative: 'Aporta nutrientes solubles, no corrige compactacion.',
      },
      {
        criterion: 'Riesgo operativo',
        biocultor: 'Menor riesgo de quemadura si se aplica con criterio.',
        alternative: 'Mayor exigencia de dosis y riego para evitar excesos.',
      },
    ],
    limits: [
      'No sustituye aireacion, resiembra ni reparacion de riego cuando esas son las causas reales.',
      'No debe venderse como fertilizante NPK equivalente a un abono mineral.',
    ],
    ctaHref: '/servicios/regeneracion-cesped-y-jardines',
    ctaLabel: 'Evaluar mi cesped',
    reference: authorityReferences.lawnCompaction,
  },
  {
    slug: 'te-humus-vs-mantillo-compost-jardin',
    title: 'Te de humus vs mantillo y compost solido',
    metaTitle: 'Te de humus vs mantillo y compost solido | Biocultor',
    metaDescription:
      'Diferencias entre aplicacion liquida de humus, mantillo y compost solido para jardines premium, ornamentales y zonas verdes.',
    alternative: 'Mantillo o compost solido',
    audience: 'Jardines ornamentales, paisajistas y comunidades',
    summary:
      'El compost solido y el mantillo aportan materia organica fisica. El te de humus liquido aporta una via de aplicacion mas limpia y compatible con riego/pulverizacion cuando no se quiere alterar la superficie visible.',
    whenBiocultorFits: [
      'Jardines ya terminados donde no conviene dejar residuo visible.',
      'Aplicaciones por sectores de riego, mochila o cuba.',
      'Mantenimientos en hoteles, empresas o comunidades con alta exigencia estetica.',
    ],
    whenAlternativeFits: [
      'Mejora estructural de bancales, recebos o preparacion de suelo.',
      'Aporte fisico de materia organica en plantaciones o zonas no visibles.',
      'Proyectos donde se acepta movimiento de material y acabado superficial.',
    ],
    decisionMatrix: [
      {
        criterion: 'Residuo visible',
        biocultor: 'Muy bajo si se filtra y aplica correctamente.',
        alternative: 'Visible hasta integracion o recebo.',
      },
      {
        criterion: 'Estructura fisica',
        biocultor: 'No sustituye aporte fisico de materia organica.',
        alternative: 'Aporta volumen y mejora fisica directa.',
      },
      {
        criterion: 'Logistica',
        biocultor: 'Bidones, mochila, cuba o fertirriego.',
        alternative: 'Transporte, acopio, extendido y limpieza.',
      },
    ],
    limits: [
      'En suelos muy pobres puede hacer falta compost solido ademas de aplicacion liquida.',
      'La aplicacion liquida no corrige por si sola desniveles ni falta de capa organica.',
    ],
    ctaHref: '/producto/te-humus-liquido-premium',
    ctaLabel: 'Ver formatos de te de humus',
    reference: authorityReferences.compostTeaSafety,
  },
  {
    slug: 'servicio-biologico-vs-jardineria-tradicional',
    title: 'Servicio biologico vs jardineria tradicional',
    metaTitle: 'Servicio biologico vs jardineria tradicional | Biocultor',
    metaDescription:
      'Comparativa para decidir entre una intervencion biologica documentada y mantenimiento tradicional de jardineria en comunidades, chalets y empresas.',
    alternative: 'Mantenimiento tradicional de jardineria',
    audience: 'Chalets premium, comunidades, empresas y complejos comerciales',
    summary:
      'Un jardinero tradicional puede resolver siega, poda, limpieza y mantenimiento recurrente. Biocultor aporta una capa especifica de diagnostico y aplicacion biologica cuando el problema esta en suelo, vigor o estrategia de recuperacion.',
    whenBiocultorFits: [
      'Hay sintomas repetidos pese a mantenimiento regular.',
      'Se necesita justificar una intervencion con fotos, limites y seguimiento.',
      'El cliente quiere decidir entre compra directa, suministro fresco o aplicacion completa.',
    ],
    whenAlternativeFits: [
      'La necesidad principal es siega, poda, limpieza o mantenimiento rutinario.',
      'Hay obras, riego roto o tareas fisicas que no dependen del producto.',
      'El jardin ya tiene un plan agronomico completo y solo requiere ejecucion.',
    ],
    decisionMatrix: [
      {
        criterion: 'Rol principal',
        biocultor: 'Diagnostico biologico, producto y aplicacion trazable.',
        alternative: 'Mantenimiento general y ejecucion recurrente.',
      },
      {
        criterion: 'Documentacion',
        biocultor: 'Ficha de problema, limites y seguimiento.',
        alternative: 'Depende del proveedor y contrato.',
      },
      {
        criterion: 'Mejor uso',
        biocultor: 'Intervencion puntual o protocolo complementario.',
        alternative: 'Rutina continua de jardineria.',
      },
    ],
    limits: [
      'No reemplaza a una empresa de jardineria si el proyecto requiere mantenimiento integral.',
      'No debe contratarse para solucionar problemas de riego u obra sin corregirlos primero.',
    ],
    ctaHref: '/servicios',
    ctaLabel: 'Comparar servicios',
    reference: authorityReferences.coreAeration,
  },
];

export function getComparisonPage(slug: string) {
  return comparisonPages.find((item) => item.slug === slug) ?? null;
}

export const leadershipLibrarySections = [
  {
    title: 'Comparativas contra alternativas',
    description:
      'Decisiones honestas entre producto biologico, abonos, compost, mantillo y servicios tradicionales.',
    href: '/biblioteca#comparativas',
  },
  {
    title: 'Calculadoras',
    description:
      'Estimaciones de litros, coste por m2, presupuesto de servicio y calendario de decision.',
    href: '/calculadoras',
  },
  {
    title: 'Metodologia y trazabilidad',
    description:
      'Como documentar producto, aplicacion, limites y seguimiento sin convertir observaciones en promesas.',
    href: '/metodologia',
  },
  {
    title: 'Casos y recursos',
    description:
      'Fichas documentables, checklists y protocolos para propietarios, paisajistas y comunidades.',
    href: '/casos',
  },
];
