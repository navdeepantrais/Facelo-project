// Event tracking helpers.
// Wire up to PostHog, Mixpanel, or another provider as needed.
// Add the provider SDK and API key before using.

export type AnalyticsEvent =
  | { name: 'product_view'; productId: string; sessionId?: string }
  | { name: 'creator_visit'; creatorId: string; sessionId?: string }
  | { name: 'checkout_start'; orderId: string; total: number }
  | { name: 'purchase_complete'; orderId: string; revenue: number; creatorId?: string }
  | { name: 'referral_click'; creatorId: string; productId?: string }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function trackEvent(_event: AnalyticsEvent): Promise<void> {
  // TODO: wire up analytics provider
  // Example with PostHog:
  // posthog.capture(_event.name, _event)
}
