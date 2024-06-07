import Link from "next/link";

export default function LoginErrorPage() {
  return (
    <div className="primary-form">
      <h1 className="font-secondary text-2xl">Error Logging In</h1>
      <p className="font-primary italic">
        There was an error logging in. Please try again.
      </p>
      <button className="primary-button">
        <Link href="/auth/login">Try again</Link>
      </button>
    </div>
  );
}
