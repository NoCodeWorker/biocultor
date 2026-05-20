export interface Testimonial {
  id: number;
  name: string;
  role: string;
  region: string;
  regionShort: string;
  cultivo: string;
  text: string;
  rating: number;
  date: string;
  highlight: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Javier M.',
    role: 'Olivicultor',
    region: 'Jaén, Andalucía',
    regionShort: 'Jaén',
    cultivo: 'Olivar en regadío — 42 ha',
    text: 'Llevaba dos temporadas buscando un extracto biológico que encajase en mi sistema de fertirrigación sin atascos. Lo aplico quincenal desde brotación. La lógica de uso que explican tiene más sentido que lo que me vendía el distribuidor de siempre.',
    rating: 5,
    date: '2025-10-15',
    highlight: 'Encaje perfecto en fertirrigación',
  },
  {
    id: 2,
    name: 'Cristina R.',
    role: 'Productora de cítricos',
    region: 'Valencia, Comunitat Valenciana',
    regionShort: 'Valencia',
    cultivo: 'Naranjos y mandarinos — 18 ha',
    text: 'El producto llegó en 36 horas. Lo que más valoro es que no venden milagros: explican formato, frecuencia y cómo leer la respuesta del suelo. Para naranjo con riego localizado funciona bien cuando sigues la guía.',
    rating: 5,
    date: '2025-11-20',
    highlight: '36 h de entrega a Valencia',
  },
  {
    id: 3,
    name: 'Alberto S.',
    role: 'Técnico de vivero',
    region: 'Almería, Andalucía',
    regionShort: 'Almería',
    cultivo: 'Vivero ornamental — producción profesional',
    text: 'Compro el formato de 25L para el vivero. La reposición es rápida y el packaging aguanta el transporte sin problemas. Para planta ornamental en producción intensiva es una herramienta que ya integro en el calendario.',
    rating: 5,
    date: '2025-09-08',
    highlight: 'Reposición fiable formato profesional',
  },
  {
    id: 4,
    name: 'Marta F.',
    role: 'Agricultora ecológica',
    region: 'Extremadura',
    regionShort: 'Extremadura',
    cultivo: 'Finca mixta — tomate, pimiento y frutales',
    text: 'Trabajo en ecológico certificado y necesito que todo lo que entra en la finca sea coherente con el pliego. El té de humus encaja. La ficha es clara y el contacto antes de comprar me aclaró las dudas sin presionar.',
    rating: 5,
    date: '2025-12-05',
    highlight: 'Coherente con producción ecológica',
  },
  {
    id: 5,
    name: 'Roberto P.',
    role: 'Productor de viñedo',
    region: 'La Rioja',
    regionShort: 'La Rioja',
    cultivo: 'Viñedo — 28 ha',
    text: 'Lo uso como inoculante biológico en la fase de brotación. No espero resultados rápidos, sino una mejora sostenida en el perfil de suelo. Llevan tres temporadas siendo coherentes en lo que dicen y en lo que mandan.',
    rating: 5,
    date: '2025-08-22',
    highlight: 'Coherencia producto–comunicación',
  },
  {
    id: 6,
    name: 'Laura G.',
    role: 'Jardinería profesional',
    region: 'Barcelona, Cataluña',
    regionShort: 'Barcelona',
    cultivo: 'Mantenimiento de zonas verdes municipales',
    text: 'Gestionamos zonas verdes para ayuntamientos y necesitamos fiabilidad en la cadena de suministro. El servicio de Biocultor nos funciona: pedido, entrega y calidad constante. Ya tenemos el 25L en el plan de temporada.',
    rating: 5,
    date: '2025-10-02',
    highlight: 'Fiabilidad en cadena de suministro',
  },
  {
    id: 7,
    name: 'Andrés V.',
    role: 'Agricultor ecológico',
    region: 'Navarra',
    regionShort: 'Navarra',
    cultivo: 'Hortícola en regadío — 8 ha',
    text: 'El producto funciona bien cuando se aplica con constancia. Al principio tardé en encontrar la dosis correcta para mi suelo arcilloso — tardé dos aplicaciones en calibrarlo. El soporte por email me ayudó a ajustarlo. Desde entonces, integrado en la rutina semanal.',
    rating: 4,
    date: '2025-11-12',
    highlight: 'Buena respuesta tras ajuste de dosis',
  },
  {
    id: 8,
    name: 'Isabel T.',
    role: 'Jardinera profesional',
    region: 'Asturias',
    regionShort: 'Asturias',
    cultivo: 'Jardines privados y terrazas urbanas',
    text: 'La entrega llegó bien y el producto es de calidad. El único punto a mejorar sería una guía de inicio más visual para clientes sin formación agronómica. La ficha técnica es buena pero algo técnica para el público general. Para profesionales, perfecta.',
    rating: 4,
    date: '2025-12-18',
    highlight: 'Calidad de producto confirmada',
  },
];
