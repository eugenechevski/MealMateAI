import Link from "next/link";

export default function SignUpErrorPage() {
  return (
    <div className="primary-form">
      <h1 className="font-secondary text-3xl">Error Signing Up</h1>
      <p className="font-primary italic">
        There was an error signing up. Please try again.
      </p>
      <Link href="/auth/sign-up">
        <button className="primary-button">Try again</button>
      </Link>
    </div>
  );
}
