import Link from "next/link";

export default function LoginErrorPage() {
  return (
    <div className="primary-form">
      <h1 className="font-secondary text-3xl">Error Logging In</h1>
      <p className="font-primary italic">
        There was an error logging in. Please try again.
      </p>
      <Link href="/auth/login">
        <button className="primary-button">Try again</button>
      </Link>
    </div>
  );
}
