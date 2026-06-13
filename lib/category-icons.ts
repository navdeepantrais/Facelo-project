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
  accessories: Gem,
  'baby-kids': Baby,
  'beauty-skincare': Sparkles,
  'electronics-tech': Laptop,
  'fashion-apparel': Shirt,
  'fitness-sports': Dumbbell,
  'food-nutrition': Apple,
  'health-wellness': HeartPulse,
  'home-living': Home,
  'books-education': BookOpen,
  pets: PawPrint,
  travel: Plane,
}

export const DEFAULT_CATEGORY_ICON: LucideIcon = ShoppingBag
