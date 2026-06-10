import { config } from 'dotenv'
config({ path: '.env.local' })
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { categories, adminRoles, adminPermissions, attributionConfig } from '../schema/index'
import { categoriesData } from './data/categories'
import { adminRolesData } from './data/admin-roles'
import { attributionConfigData } from './data/attribution'

const client = postgres(process.env.DIRECT_URL ?? process.env.DATABASE_URL!)
const db = drizzle(client)

function log(label: string, count: number) {
  console.log(`  ✓ ${label}: ${count} row(s) upserted`)
}

async function seedCategories() {
  const rows = await db
    .insert(categories)
    .values(categoriesData)
    .onConflictDoUpdate({
      target: categories.slug,
      set: { name: categories.name },
    })
    .returning({ slug: categories.slug })

  log('categories', rows.length)
}

async function seedAdminRoles() {
  for (const roleData of adminRolesData) {
    const { permissions, ...role } = roleData

    // Upsert the role description
    const [inserted] = await db
      .insert(adminRoles)
      .values(role)
      .onConflictDoUpdate({
        target: adminRoles.name,
        set: { description: adminRoles.description },
      })
      .returning({ name: adminRoles.name })

    // Upsert permissions using role enum directly (no FK)
    if (permissions.length > 0) {
      await db
        .insert(adminPermissions)
        .values(permissions.map(p => ({ role: inserted.name, ...p })))
        .onConflictDoUpdate({
          target: [adminPermissions.role, adminPermissions.resource],
          set: {
            canRead:    adminPermissions.canRead,
            canWrite:   adminPermissions.canWrite,
            canApprove: adminPermissions.canApprove,
          },
        })
    }

    console.log(`  ✓ admin role [${inserted.name}]: ${permissions.length} permission(s) upserted`)
  }
}

async function seedAttributionConfig() {
  const existing = await db.select().from(attributionConfig).limit(1)

  if (existing.length === 0) {
    await db.insert(attributionConfig).values(attributionConfigData)
    log('attribution_config', 1)
  } else {
    console.log('  – attribution_config: already exists, skipped')
  }
}

async function main() {
  console.log('\n🌱 Seeding database...\n')

  console.log('› Categories')
  await seedCategories()

  console.log('\n› Admin Roles & Permissions')
  await seedAdminRoles()

  console.log('\n› Attribution Config')
  await seedAttributionConfig()

  console.log('\n✅ Seed complete.\n')
  await client.end()
}

main().catch(err => {
  console.error('\n❌ Seed failed:', err)
  process.exit(1)
})
