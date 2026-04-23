import Navbar from "@/components/Navbar";
import Cart from "@/components/Cart";
import Footer from "@/components/Footer";

import AgronomicAdvisorChat from "@/components/AgronomicAdvisorChat";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <Cart />

      <AgronomicAdvisorChat />
      <div className="flex-1 flex flex-col min-h-screen">{children}</div>
      <Footer />
    </>
  )
}
