
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient- from-white to-slate-100 p-4 text-center">
      <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
        Dev<span className="text-blue-600">Vault</span>
      </h1>
      <p className="text-lg text-slate-600 max-w-md mb-8">
        Organize your development world. All your resources, documentation, and tools in one place.
      </p>
      <Link 
        href="/dashboard" 
        className="px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}