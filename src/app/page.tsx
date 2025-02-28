// import Image from "next/image";
// import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import Contact from './components/Contact'
import Footer from './components/Footer'
import HeroSection from './components/HeroSection'
import ServicesSection from './components/ServicesSection'
import ContactUs from './components/ContactUs'

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* <Header /> */}
      <main>
        <HeroSection />
        <ServicesSection />
        <ContactUs />
      </main>
      <Footer />
    </div>
  )
}