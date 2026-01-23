import Footer from "@components/website/Footer";
import Header from "@components/website/Header";
import HeroSection from "@components/website/HeroSection";
import HowItWorks from "@components/website/HowItWorks";
import Pricing from "@components/website/Pricing";
import SampleReport from "@components/website/SampleReport";
import Testimonials from "@components/website/Testimonials";
import TrustBadges from "@components/website/TrustBadges";
import VerificationShowcase from "@components/website/VerificationShowcase";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">

      <Header />
      <main>
        <HeroSection />
        <TrustBadges />
        <HowItWorks />
        <VerificationShowcase />
        <SampleReport />
        <Pricing />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
