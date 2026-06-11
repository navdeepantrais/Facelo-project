// Each entry defines a role and its full permission matrix.
// canRead  — can view the resource
// canWrite — can create / edit / delete
// canApprove — can approve / reject / suspend

type Permission = {
  resource: string
  canRead: boolean
  canWrite: boolean
  canApprove: boolean
}

type AdminRoleData = {
  name: 'super_admin' | 'product_manager' | 'creator_manager' | 'order_manager' | 'moderator'
  description: string
  permissions: Permission[]
}

const ALL_ACCESS: Permission[] = [
  { resource: 'products', canRead: true, canWrite: true, canApprove: true },
  { resource: 'categories', canRead: true, canWrite: true, canApprove: true },
  { resource: 'creators', canRead: true, canWrite: true, canApprove: true },
  { resource: 'orders', canRead: true, canWrite: true, canApprove: true },
  { resource: 'payments', canRead: true, canWrite: true, canApprove: true },
  { resource: 'refunds', canRead: true, canWrite: true, canApprove: true },
  { resource: 'videos', canRead: true, canWrite: true, canApprove: true },
  { resource: 'users', canRead: true, canWrite: true, canApprove: true },
  { resource: 'commissions', canRead: true, canWrite: true, canApprove: true },
  { resource: 'attribution_config', canRead: true, canWrite: true, canApprove: true },
  { resource: 'admin_roles', canRead: true, canWrite: true, canApprove: true },
]

export const adminRolesData: AdminRoleData[] = [
  {
    name: 'super_admin',
    description: 'Full platform access including attribution config and admin role management.',
    permissions: ALL_ACCESS,
  },
  {
    name: 'product_manager',
    description: 'Manages the product catalog, categories, and per-product reward configuration.',
    permissions: [
      { resource: 'products', canRead: true, canWrite: true, canApprove: true },
      { resource: 'categories', canRead: true, canWrite: true, canApprove: true },
      { resource: 'creators', canRead: true, canWrite: false, canApprove: false },
      { resource: 'orders', canRead: true, canWrite: false, canApprove: false },
    ],
  },
  {
    name: 'creator_manager',
    description:
      'Reviews creator applications, approves or suspends creator accounts, and monitors creator stats.',
    permissions: [
      { resource: 'creators', canRead: true, canWrite: true, canApprove: true },
      { resource: 'users', canRead: true, canWrite: false, canApprove: false },
      { resource: 'videos', canRead: true, canWrite: false, canApprove: false },
      { resource: 'commissions', canRead: true, canWrite: false, canApprove: false },
      { resource: 'products', canRead: true, canWrite: false, canApprove: false },
    ],
  },
  {
    name: 'order_manager',
    description:
      'Handles order lifecycle, initiates refunds, and has visibility into payment records.',
    permissions: [
      { resource: 'orders', canRead: true, canWrite: true, canApprove: true },
      { resource: 'refunds', canRead: true, canWrite: true, canApprove: true },
      { resource: 'payments', canRead: true, canWrite: true, canApprove: false },
      { resource: 'commissions', canRead: true, canWrite: true, canApprove: false },
      { resource: 'users', canRead: true, canWrite: false, canApprove: false },
      { resource: 'products', canRead: true, canWrite: false, canApprove: false },
    ],
  },
  {
    name: 'moderator',
    description:
      'Reviews and approves or rejects creator video submissions, and can suspend user accounts.',
    permissions: [
      { resource: 'videos', canRead: true, canWrite: true, canApprove: true },
      { resource: 'creators', canRead: true, canWrite: false, canApprove: false },
      { resource: 'users', canRead: true, canWrite: true, canApprove: false },
      { resource: 'products', canRead: true, canWrite: false, canApprove: false },
    ],
  },
]
