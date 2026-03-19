"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Mail, Shield, Trash2, Globe, CheckCircle2, Search, Users } from "lucide-react";
import { toast } from "sonner";

interface Member {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  status: "Active" | "Pending";
}

export default function CollaborationSection() {
  const [members, setMembers] = useState<Member[]>([
    { id: "1", name: "Ansa Asghar", email: "ansa@devvault.com", role: "Admin", status: "Active" },
    { id: "2", name: "John Smith", email: "john@heapware.com", role: "Editor", status: "Pending" },
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchMember, setSearchMember] = useState("");
  const [newMember, setNewMember] = useState({ name: "", email: "", role: "Viewer" });

  // --- Search Logic ---
  const filteredMembers = useMemo(() => {
    return members.filter(m => 
      m.name.toLowerCase().includes(searchMember.toLowerCase()) || 
      m.email.toLowerCase().includes(searchMember.toLowerCase())
    );
  }, [searchMember, members]);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) return toast.error("Please fill all fields");

    const member: Member = {
      id: Math.random().toString(36).substr(2, 9),
      name: newMember.name,
      email: newMember.email,
      role: newMember.role as any,
      status: "Pending",
    };

    setMembers([member, ...members]);
    setIsModalOpen(false);
    setNewMember({ name: "", email: "", role: "Viewer" });
    toast.success(`${member.name} has been invited!`);
  };

  const removeMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
    toast.error("Member removed");
  };

  return (
    <div className="space-y-10 pb-24">
      {/* --- HEADER AREA --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50 dark:bg-slate-900/20 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-600/10 rounded-2xl">
            <Users className="text-blue-600" size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic">
              Team <span className="text-blue-600 not-italic">Hub</span>
            </h2>
            <p className="text-sm text-slate-500 font-medium">Manage your workspace collaborators.</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* SEARCH MEMBERS INPUT */}
          <div className="relative group w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input 
              type="text"
              placeholder="Search members..."
              value={searchMember}
              onChange={(e) => setSearchMember(e.target.value)}
              className="w-full pl-11 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto group flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-500/25 active:scale-95 border border-blue-400/20"
          >
            <UserPlus size={16} className="group-hover:rotate-12 transition-transform" /> 
            Invite
          </button>
        </div>
      </div>

      {/* --- MEMBER GRID --- */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredMembers.map((member) => (
              <motion.div 
                layout
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-6 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 rounded-[2.5rem] hover:border-blue-500/30 transition-all group shadow-sm"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-slate-800 flex items-center justify-center text-xl font-black text-blue-600 dark:text-blue-400 shadow-inner">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {member.name}
                        {member.status === "Active" && <CheckCircle2 size={14} className="text-green-500" />}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium tracking-tight">{member.email}</p>
                    </div>
                  </div>
                  
                  {member.role !== "Admin" && (
                    <button 
                      onClick={() => removeMember(member.id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800/50">
                  <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter border 
                    ${member.role === 'Admin' ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' : 
                      member.role === 'Editor' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' : 
                      'bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'}`}>
                    {member.role}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 capitalize">
                    <Globe size={10} /> {member.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-slate-50/50 dark:bg-slate-900/10 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
          <Users className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500 font-medium italic">No members found matching your search.</p>
        </motion.div>
      )}

      {/* --- INVITE MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-2xl border border-slate-100 dark:border-slate-800"
            >
              <div className="mb-8">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white italic">New <span className="text-blue-600 not-italic">Collaborator</span></h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Add a team member</p>
              </div>

              <form onSubmit={handleAddMember} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Name</label>
                  <input 
                    type="text" placeholder="e.g. Asghar"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-blue-500/50 outline-none text-sm transition-all dark:text-white"
                    value={newMember.name}
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email Address</label>
                  <input 
                    type="email" placeholder="dev@example.com"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-blue-500/50 outline-none text-sm transition-all dark:text-white"
                    value={newMember.email}
                    onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  />
                </div>

                <div className="space-y-1.5 pb-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Assign Role</label>
                  <select 
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-blue-500/50 outline-none text-sm appearance-none dark:text-white"
                    value={newMember.role}
                    onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                  >
                    <option value="Viewer">Viewer</option>
                    <option value="Editor">Editor</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:shadow-xl hover:shadow-blue-500/30 transition-all active:scale-95"
                >
                  Confirm & Send Invite
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}