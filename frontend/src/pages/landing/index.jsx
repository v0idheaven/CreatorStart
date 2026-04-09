import LandingHeader from "./LandingHeader"
import HeroSection from "./HeroSection"
import FeaturesSection from "./FeaturesSection"
import PlannerSection from "./PlannerSection"
import PricingSection from "./PricingSection"
import CTASection from "./CTASection"
import LandingFooter from "./LandingFooter"
import "./Landing.css"

export default function LandingPage() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })

  return (
    <div className="landing">
      <div className="landing-wrap">
        <LandingHeader scrollTo={scrollTo} />
        <main>
          <HeroSection scrollTo={scrollTo} />
          <FeaturesSection />
          <PlannerSection />
          <PricingSection />
          <CTASection scrollTo={scrollTo} />
        </main>
        <LandingFooter scrollTo={scrollTo} />
      </div>
    </div>
  )
}
