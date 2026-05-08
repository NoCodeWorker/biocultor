import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { weight, width, height, length } = body;

    const apiKey = process.env.PACKLINK_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'PACKLINK_API_KEY no configurada en las variables de entorno (.env)' },
        { status: 500 }
      );
    }

    // Datos por defecto (Basados en el envío estándar de Biocultor)
    const payload = {
      from: {
        country: 'ES',
        zip: '45370', // Santa Cruz de la Zarza, Toledo
      },
      to: {
        country: 'ES',
        zip: '28005', // Destino genérico (Madrid centro) para simulaciones
      },
      packages: [
        {
          weight: weight || 1,
          width: width || 20,
          height: height || 20,
          length: length || 20,
        },
      ],
    };

    const response = await fetch('https://api.packlink.com/v1/services', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json({ error: 'Error en la API de Packlink', details: errorData }, { status: response.status });
    }

    const data = await response.json();
    
    // Devolver todas las tarifas disponibles para que el frontend pueda elegir la más barata (ej. Correos Express)
    return NextResponse.json(data);
    
  } catch (error: any) {
    return NextResponse.json({ error: 'Error interno del servidor', details: error.message }, { status: 500 });
  }
}
