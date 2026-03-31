import OutreachTracker from "@/components/Outreach Tracker";

export default function ProfessionalPage() {
  return (
    <main className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100">Professional Growth</h1>
        <p className="text-zinc-400 text-sm">Track your job applications and networking reach-outs.</p>
      </div>
      
      <OutreachTracker />
    </main>
  );
}