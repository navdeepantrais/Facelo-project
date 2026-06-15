import {
  Gem,
  Baby,
  Sparkles,
  Laptop,
  Shirt,
  Dumbbell,
  Apple,
  HeartPulse,
  Home,
  BookOpen,
  PawPrint,
  Plane,
  ShoppingBag,
  type LucideIcon,
} from 'lucide-react'

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  accessories:        Gem,
  'baby-kids':        Baby,
  'beauty-skincare':  Sparkles,
  'electronics-tech': Laptop,
  'fashion-apparel':  Shirt,
  'fitness-sports':   Dumbbell,
  'food-nutrition':   Apple,
  'health-wellness':  HeartPulse,
  'home-living':      Home,
  'books-education':  BookOpen,
  pets:               PawPrint,
  travel:             Plane,
}

export const DEFAULT_CATEGORY_ICON: LucideIcon = ShoppingBag

export type CategoryStyle = {
  /** Gradient classes for the icon tile background on category cards */
  cardBg: string
  /** Icon colour class */
  cardIcon: string
  /** Label text colour class */
  cardText: string
  /** Gradient classes for the product card image-fallback background */
  productBg: string
}

export const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  accessories:        { cardBg: 'from-violet-100 to-indigo-100',  cardIcon: 'text-violet-600',  cardText: 'text-violet-700',  productBg: 'from-indigo-50 via-violet-50 to-indigo-100'   },
  'baby-kids':        { cardBg: 'from-sky-100 to-cyan-100',       cardIcon: 'text-sky-600',     cardText: 'text-sky-700',     productBg: 'from-sky-50 via-cyan-50 to-sky-100'           },
  'beauty-skincare':  { cardBg: 'from-rose-100 to-pink-100',      cardIcon: 'text-rose-600',    cardText: 'text-rose-700',    productBg: 'from-pink-50 via-rose-50 to-pink-100'         },
  'electronics-tech': { cardBg: 'from-blue-100 to-indigo-100',    cardIcon: 'text-blue-600',    cardText: 'text-blue-700',    productBg: 'from-blue-50 via-sky-50 to-indigo-100'        },
  'fashion-apparel':  { cardBg: 'from-fuchsia-100 to-purple-100', cardIcon: 'text-fuchsia-600', cardText: 'text-fuchsia-700', productBg: 'from-purple-50 via-fuchsia-50 to-purple-100'  },
  'fitness-sports':   { cardBg: 'from-emerald-100 to-teal-100',   cardIcon: 'text-emerald-600', cardText: 'text-emerald-700', productBg: 'from-green-50 via-emerald-50 to-teal-100'     },
  'food-nutrition':   { cardBg: 'from-amber-100 to-orange-100',   cardIcon: 'text-amber-600',   cardText: 'text-amber-700',   productBg: 'from-orange-50 via-amber-50 to-yellow-100'    },
  'health-wellness':  { cardBg: 'from-cyan-100 to-teal-100',      cardIcon: 'text-cyan-600',    cardText: 'text-cyan-700',    productBg: 'from-teal-50 via-cyan-50 to-teal-100'         },
  'home-living':      { cardBg: 'from-yellow-100 to-amber-100',   cardIcon: 'text-yellow-700',  cardText: 'text-yellow-800',  productBg: 'from-yellow-50 via-amber-50 to-orange-100'    },
  'books-education':  { cardBg: 'from-orange-100 to-amber-100',   cardIcon: 'text-orange-600',  cardText: 'text-orange-700',  productBg: 'from-orange-50 via-amber-50 to-orange-100'    },
  pets:               { cardBg: 'from-green-100 to-emerald-100',  cardIcon: 'text-green-600',   cardText: 'text-green-700',   productBg: 'from-green-50 via-emerald-50 to-green-100'    },
  travel:             { cardBg: 'from-indigo-100 to-blue-100',    cardIcon: 'text-indigo-600',  cardText: 'text-indigo-700',  productBg: 'from-indigo-50 via-blue-50 to-indigo-100'     },
}

export const DEFAULT_CATEGORY_STYLE: CategoryStyle = {
  cardBg:    'from-gray-100 to-slate-100',
  cardIcon:  'text-gray-500',
  cardText:  'text-gray-700',
  productBg: 'from-gray-50 via-slate-50 to-gray-100',
}
