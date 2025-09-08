import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
      <h2 className="text-3xl font-bold text-center text-primary m-3">
        Page Not Found
      </h2>
      <p className="text-center">Could not find requested resource.</p>
      <Link href="/" className="btn btn-primary m-5">
        Return Home
      </Link>
    </div>
  );
}
