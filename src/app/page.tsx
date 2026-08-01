import { BookingProvider } from "@/components/booking-context";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { ServicesSection } from "@/components/services-section";
import { Gallery } from "@/components/gallery";
import { Testimonials } from "@/components/testimonials";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <BookingProvider>
      <Navbar />
      <main>
        <Hero />
        <About />
        <ServicesSection />
        <Gallery />
        <Testimonials />
      </main>
      <Footer />
    </BookingProvider>
  );
}
