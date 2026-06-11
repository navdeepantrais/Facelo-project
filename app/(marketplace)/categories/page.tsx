import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getCategories } from '@/lib/actions/products'

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Shop by category on Facelo.',
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Shop by Category</h1>
        <p className="mt-1 text-muted-foreground">Find exactly what you&apos;re looking for.</p>
      </div>

      {categories.length === 0 ? (
        <p className="text-muted-foreground">No categories available yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group flex flex-col items-center gap-3 rounded-xl border bg-card p-4 text-center transition-shadow hover:shadow-md"
            >
              <div className="relative h-16 w-16 overflow-hidden rounded-full bg-muted">
                {cat.imageUrl ? (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl">
                    🛍️
                  </div>
                )}
              </div>
              <span className="text-sm font-medium group-hover:text-primary transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
