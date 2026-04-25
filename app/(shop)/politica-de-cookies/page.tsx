import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Cookies · Biocultor',
  description: 'Política de Cookies de Biocultor. Aprende qué son, cómo las usamos y cómo puedes gestionarlas.',
};

export default function CookiesPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20 min-h-screen pt-32">
      <h1 className="text-4xl font-heading font-bold text-brand-brown-dark mb-8">Política de Cookies</h1>
      
      <div className="prose prose-stone max-w-none text-muted-foreground space-y-6">
        <p>
          En <strong>Biocultor</strong> utilizamos cookies propias y de terceros para asegurar el correcto funcionamiento de nuestra web, mejorar la experiencia de usuario y realizar análisis de tráfico. A continuación, te explicamos en detalle qué son y cómo las usamos, cumpliendo con la normativa del GDPR (RGPD).
        </p>

        <h2 className="text-2xl font-bold text-brand-brown-dark mt-10">1. ¿Qué son las cookies?</h2>
        <p>
          Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo (ordenador, tablet o móvil) cuando los visitas. Permiten que la web recuerde tus acciones y preferencias (como el inicio de sesión, el contenido de tu carrito y otras preferencias de visualización) durante un período de tiempo determinado, para que no tengas que volver a configurarlas cada vez que regresas.
        </p>

        <h2 className="text-2xl font-bold text-brand-brown-dark mt-10">2. Tipos de cookies que utilizamos</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Cookies estrictamente necesarias (Técnicas):</strong> Son esenciales para que puedas navegar por la web y usar sus funciones, como acceder a áreas seguras (tu cuenta, el proceso de pago). Sin ellas, la tienda no funcionaría.
          </li>
          <li>
            <strong>Cookies de rendimiento y análisis:</strong> Nos permiten contar el número de visitantes y ver cómo se mueven por nuestra web. Esto nos ayuda a mejorar su funcionamiento, asegurándonos, por ejemplo, de que encuentras fácilmente lo que buscas. Toda la información que recogen es agregada y, por lo tanto, anónima.
          </li>
          <li>
            <strong>Cookies de marketing:</strong> Se utilizan para rastrear a los visitantes a través de las páginas web. La intención es mostrar anuncios que sean relevantes y atractivos para el usuario individual (aunque actualmente nuestro uso de estas cookies es mínimo y enfocado a entender qué productos resultan más interesantes).
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-brand-brown-dark mt-10">3. ¿Cómo gestionar o desactivar las cookies?</h2>
        <p>
          En cualquier momento puedes cambiar tus preferencias de cookies en nuestra web. Si deseas eliminar las cookies que ya se encuentran en tu equipo, puedes hacerlo directamente desde las opciones de configuración de tu navegador:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Google Chrome:</strong> Configuración &gt; Privacidad y seguridad &gt; Cookies y otros datos de sitios.</li>
          <li><strong>Safari:</strong> Preferencias &gt; Privacidad.</li>
          <li><strong>Firefox:</strong> Opciones &gt; Privacidad &amp; Seguridad &gt; Cookies y datos del sitio.</li>
          <li><strong>Edge:</strong> Configuración &gt; Privacidad, búsqueda y servicios.</li>
        </ul>

        <h2 className="text-2xl font-bold text-brand-brown-dark mt-10">4. Cambios en la Política</h2>
        <p>
          Podemos actualizar nuestra Política de Cookies para reflejar cambios en nuestras prácticas o por motivos legales o regulatorios. Te recomendamos revisar esta página periódicamente.
        </p>
      </div>
    </main>
  );
}
