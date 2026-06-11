'use client'

import { useState } from 'react'
import { ArrowLeft, BadgeDollarSign, BarChart3, Link2, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import BecomeCreatorForm from '@/components/creator/BecomeCreatorForm'

const BENEFITS = [
  {
    icon: BadgeDollarSign,
    title: 'Earn commissions',
    description: 'Get paid on every sale you drive through your referral links.',
  },
  {
    icon: Link2,
    title: 'Your own referral links',
    description: 'Share product links with your promo code embedded automatically.',
  },
  {
    icon: BarChart3,
    title: 'Track your earnings',
    description: 'See clicks, orders, and commission breakdown in your dashboard.',
  },
  {
    icon: UserCheck,
    title: 'Creator profile page',
    description: 'A public page at facelo.com/yourname to showcase your picks.',
  },
]

export default function BecomeCreatorSection() {
  const [showForm, setShowForm] = useState(false)

  if (showForm) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="mb-5 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <h2 className="text-lg font-semibold mb-1">Set up your creator account</h2>
        <p className="text-sm text-muted-foreground mb-5">
          All fields are optional — you can update them later from your creator dashboard.
        </p>

        <BecomeCreatorForm />
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      {/* Header band */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-500 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-200 mb-1">
          Creator Program
        </p>
        <h2 className="text-xl font-bold text-white">Switch to a Creator Account</h2>
        <p className="mt-1 text-sm text-violet-100">
          Turn your recommendations into income. Free to join, no minimum followers.
        </p>
      </div>

      {/* Benefits */}
      <div className="px-6 py-5">
        <ul className="space-y-4">
          {BENEFITS.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </span>
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
              </div>
            </li>
          ))}
        </ul>

        <Separator className="my-5" />

        <Button className="w-full" onClick={() => setShowForm(true)}>
          Get Started
        </Button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Free forever. No credit card required.
        </p>
      </div>
    </div>
  )
}
