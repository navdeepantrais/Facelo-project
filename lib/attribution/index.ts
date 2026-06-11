import type { NextRequest, NextResponse } from 'next/server'

export const ATTRIBUTION_COOKIE_NAME = 'facelo_attribution'
export const ATTRIBUTION_WINDOW_DAYS = 7

export type UTMParams = {
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
  utmContent: string | null
}

export function parseUTMParams(searchParams: URLSearchParams): UTMParams {
  return {
    utmSource: searchParams.get('utm_source'),
    utmMedium: searchParams.get('utm_medium'),
    utmCampaign: searchParams.get('utm_campaign'),
    utmContent: searchParams.get('utm_content'),
  }
}

export function getAttributionSessionId(request: NextRequest): string | null {
  return request.cookies.get(ATTRIBUTION_COOKIE_NAME)?.value ?? null
}

export function setAttributionCookie(
  response: NextResponse,
  sessionId: string,
  windowDays = ATTRIBUTION_WINDOW_DAYS
): void {
  response.cookies.set(ATTRIBUTION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: windowDays * 24 * 60 * 60,
    path: '/',
  })
}

export function clearAttributionCookie(response: NextResponse): void {
  response.cookies.delete(ATTRIBUTION_COOKIE_NAME)
}
