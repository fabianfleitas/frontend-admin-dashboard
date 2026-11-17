import type { RefObject } from 'react'
import { useReducedMotion, useScroll, useTransform } from 'motion/react'
import * as m from 'motion/react-m'

interface ParallaxBackgroundProps {
  targetRef: RefObject<HTMLElement | null>
}

export function ParallaxBackground({ targetRef }: ParallaxBackgroundProps) {
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])

  return (
    <m.div
      aria-hidden
      className="pointer-events-none absolute -inset-y-[18%] inset-x-0 overflow-hidden"
      style={{ y: shouldReduceMotion ? 0 : y }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, #d3ebff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage:
            'radial-gradient(ellipse 70% 60% at 50% 40%, transparent 35%, black 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 60% at 50% 40%, transparent 35%, black 100%)',
        }}
      />
      <div className="absolute -left-[12%] top-[6%] h-[26rem] w-[26rem] rounded-full bg-signal-500/5 blur-3xl" />
      <div className="absolute -right-[10%] bottom-[8%] h-[22rem] w-[22rem] rounded-full bg-signal-600/5 blur-3xl" />
    </m.div>
  )
}
