import Link from "next/link";

export default function NotFound() {
  return (
    <div className="glass mx-auto my-12 flex max-w-lg flex-col items-center gap-4 rounded-xl py-12">
      <h2 className="text-xl">Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/" passHref legacyBehavior>
        <span className="text-primary">Return Home</span>
      </Link>
    </div>
  );
}
