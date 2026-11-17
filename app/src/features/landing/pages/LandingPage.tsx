import { LandingNav } from '../components/LandingNav'
import { HeroSection } from '../components/HeroSection'
import { ProblemSolutionSection } from '../components/ProblemSolutionSection'
import { FeaturesSection } from '../components/FeaturesSection'
import { ProductTourSection } from '../components/ProductTourSection'
import { EvidenciaSection } from '../components/EvidenciaSection'
import { PlanesSection } from '../components/PlanesSection'
import { AccesoSection } from '../components/AccesoSection'
import { FaqSection } from '../components/FaqSection'
import { CTASection } from '../components/CTASection'
import { LandingFooter } from '../components/LandingFooter'
import { useSession } from '@/features/auth/hooks/useSession'
import { useValidSession } from '@/features/auth/hooks/useValidSession'
import { Navigate } from 'react-router-dom'
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'

export function LandingPage() {
  const { sessionLoaded, isAuthenticated } = useSession()
  const { sessionValid, sessionChecked } = useValidSession()

  if (sessionLoaded && isAuthenticated && sessionChecked && sessionValid) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div className="flex min-h-screen flex-col bg-surface-canvas">
          <LandingNav />
          <main className="flex-1">
            <HeroSection />
            <ProblemSolutionSection />
            <FeaturesSection />
            <ProductTourSection />
            <EvidenciaSection />
            <PlanesSection />
            <AccesoSection />
            <FaqSection />
            <CTASection />
          </main>
          <LandingFooter />
        </div>
      </MotionConfig>
    </LazyMotion>
  )
}
