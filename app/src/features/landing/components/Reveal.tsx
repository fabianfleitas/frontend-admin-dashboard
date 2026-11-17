import type { ReactNode } from 'react'
import type { Variants } from 'motion/react'
import * as m from 'motion/react-m'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const TAGS = {
  div: m.div,
  dl: m.dl,
  li: m.li,
  ol: m.ol,
  ul: m.ul,
} as const

export type RevealTag = keyof typeof TAGS

interface RevealBaseProps {
  children: ReactNode
  className?: string
}

interface RevealProps extends RevealBaseProps {
  as?: RevealTag
  amount?: number
  delay?: number
}

interface RevealGroupProps extends RevealBaseProps {
  as?: RevealTag
  amount?: number
  stagger?: number
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

export function Reveal({ children, className, as = 'div', amount = 0.25, delay = 0 }: RevealProps) {
  const Tag = TAGS[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.5, ease: EASE, delay }}
    >
      {children}
    </Tag>
  )
}

export function RevealGroup({
  children,
  className,
  as = 'div',
  amount = 0.15,
  stagger = 0.06,
}: RevealGroupProps) {
  const Tag = TAGS[as]
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={{ visible: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </Tag>
  )
}

interface RevealItemProps extends RevealBaseProps {
  as?: RevealTag
}

export function RevealItem({ children, className, as = 'div' }: RevealItemProps) {
  const Tag = TAGS[as]
  return (
    <Tag className={className} variants={itemVariants}>
      {children}
    </Tag>
  )
}
