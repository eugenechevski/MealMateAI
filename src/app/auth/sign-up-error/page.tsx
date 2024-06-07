import Link from "next/link";

export default function SignUpErrorPage() {
  return (
    <div className="primary-form">
      <h1 className="font-secondary text-2xl">Error Signing Up</h1>
      <p className="font-primary italic">
        There was an error signing up. Please try again.
      </p>
      <button className="primary-button">
        <Link href="/auth/sign-up">Try again</Link>
      </button>
    </div>
  );
}
