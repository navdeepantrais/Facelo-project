import Link from 'next/link'

export default function ApplySignInPrompt() {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-gray-500">
        Sign in or create a free account to submit your creator application.
      </p>

      <div className="space-y-3">
        <Link
          href="/auth/login?redirectTo=/creator/apply"
          className="flex h-10 w-full cursor-pointer items-center justify-center rounded-xl bg-gradient-to-r from-violet-700 to-indigo-700 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(109,40,217,0.22),inset_0_1px_0_rgba(255,255,255,0.12)] transition-all hover:from-violet-800 hover:to-indigo-800 hover:shadow-[0_6px_18px_rgba(109,40,217,0.30),inset_0_1px_0_rgba(255,255,255,0.12)]"
        >
          Sign in to apply
        </Link>

        <Link
          href="/auth/register?redirectTo=/creator/apply"
          className="flex h-10 w-full items-center justify-center rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Create a free account
        </Link>
      </div>

      <p className="text-center text-sm text-gray-500">
        Already a creator?{' '}
        <Link
          href="/auth/login?redirectTo=/creator/dashboard"
          className="font-medium text-violet-600 hover:text-violet-700"
        >
          Sign in to your dashboard
        </Link>
      </p>
    </div>
  )
}
