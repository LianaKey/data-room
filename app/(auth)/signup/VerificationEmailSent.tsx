import Link from "next/link";

interface VerificationEmailSentProps {
  email: string;
}

export function VerificationEmailSent({ email }: VerificationEmailSentProps) {
  return (
    <div className="text-center">
      <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-green-600 dark:text-green-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <title>Email sent</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
          />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-4">
        Check Your Email!
      </h1>
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-6 mb-6">
        <p className="text-lg text-green-800 dark:text-green-300 font-semibold mb-2">
          Account created successfully!
        </p>
        <p className="text-green-700 dark:text-green-400">
          We've sent a verification link to{" "}
          <span className="font-medium">{email}</span>
        </p>
        <p className="text-green-600 dark:text-green-500 text-sm mt-3">
          Please check your inbox and click the verification link to activate
          your account.
        </p>
      </div>
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-700 dark:text-blue-400">
          💡 <strong>Tip:</strong> Check your spam folder if you don't see the
          email within a few minutes.
        </p>
      </div>
      <Link
        href="/login"
        className="inline-block w-full rounded-full bg-blue-700 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:bg-blue-800 transition"
      >
        Go to Login
      </Link>
    </div>
  );
}
