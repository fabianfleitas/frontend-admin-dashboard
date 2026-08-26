import { LandingNav } from '../components/LandingNav'
import { HeroSection } from '../components/HeroSection'
import { ProblemSolutionSection } from '../components/ProblemSolutionSection'
import { FeaturesSection } from '../components/FeaturesSection'
import { ProductTourSection } from '../components/ProductTourSection'
import { PricingSection } from '../components/PricingSection'
import { FaqSection } from '../components/FaqSection'
import { CTASection } from '../components/CTASection'
import { LandingFooter } from '../components/LandingFooter'
import { useSession } from '@/features/auth/hooks/useSession'
import { Navigate } from 'react-router-dom'

export function LandingPage() {
  const { sessionLoaded, isAuthenticated } = useSession()

  if (sessionLoaded && isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingNav />
      <main className="flex-1">
        <HeroSection />
        <ProblemSolutionSection />
        <FeaturesSection />
        <ProductTourSection />
        <PricingSection />
        <FaqSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  )
}