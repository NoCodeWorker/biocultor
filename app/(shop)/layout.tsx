import dynamic from 'next/dynamic';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AgronomicAdvisorChatLazy from "@/components/AgronomicAdvisorChatLazy";

const Cart = dynamic(() => import("@/components/Cart"), { ssr: false });

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <Cart />

      <AgronomicAdvisorChatLazy />
      <div className="flex-1 flex flex-col min-h-screen">{children}</div>
      <Footer />
    </>
  )
}
