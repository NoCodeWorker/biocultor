import AdminSidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/Header';

// Layout fullscreen del panel: sidebar fija + área de contenido sin
// `max-width` artificial. Cada página decide si su grid interno se
// constriñe (formularios largos suelen capear a `max-w-4xl`).
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background border-t border-border">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto bg-muted/10 relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] pointer-events-none rounded-full" />
          <div className="relative z-10 w-full px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
