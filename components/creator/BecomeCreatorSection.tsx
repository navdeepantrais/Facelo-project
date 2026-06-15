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
      <div className="bg-card rounded-xl border p-6">
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="text-muted-foreground hover:text-foreground mb-5 flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <h2 className="mb-1 text-lg font-semibold">Set up your creator account</h2>
        <p className="text-muted-foreground mb-5 text-sm">
          All fields are optional — you can update them later from your creator dashboard.
        </p>

        <BecomeCreatorForm />
      </div>
    )
  }

  return (
    <div className="bg-card overflow-hidden rounded-xl border">
      {/* Header band */}
      <div className="bg-foreground px-6 py-5">
        <p className="mb-1 text-xs font-semibold tracking-widest text-white/60 uppercase">
          Creator Program
        </p>
        <h2 className="text-xl font-bold text-white">Switch to a Creator Account</h2>
        <p className="mt-1 text-sm text-white/75">
          Turn your recommendations into income. Free to join, no minimum followers.
        </p>
      </div>

      {/* Benefits */}
      <div className="px-6 py-5">
        <ul className="space-y-4">
          {BENEFITS.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex items-start gap-3">
              <span className="bg-primary/10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                <Icon className="text-primary h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-muted-foreground mt-0.5 text-xs">{description}</p>
              </div>
            </li>
          ))}
        </ul>

        <Separator className="my-5" />

        <Button className="w-full" onClick={() => setShowForm(true)}>
          Get Started
        </Button>
        <p className="text-muted-foreground mt-3 text-center text-xs">
          Free forever. No credit card required.
        </p>
      </div>
    </div>
  )
}
