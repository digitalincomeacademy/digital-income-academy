import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-[100dvh] grid place-items-center text-center px-4">
      <div>
        <p className="text-8xl font-head font-extrabold text-brand-400">৪০৪</p>
        <h1 className="mt-4 text-2xl font-bold">পেজটি খুঁজে পাওয়া যায়নি</h1>
        <Link href="/" className="btn btn-primary mt-8">হোমে ফিরুন</Link>
      </div>
    </section>
  );
}
