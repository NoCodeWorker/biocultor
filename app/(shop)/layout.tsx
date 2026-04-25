import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AgronomicAdvisorChatLazy from "@/components/AgronomicAdvisorChatLazy";
import CartLazy from "@/components/CartLazy";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <CartLazy />

      <AgronomicAdvisorChatLazy />
      <div className="flex-1 flex flex-col min-h-screen">{children}</div>
      <Footer />
    </>
  )
}
