import React from 'react';
import { Users, Plus, MessageSquare } from 'lucide-react';

const TeamCollaboration = () => {
  const members = [
    { id: 1, name: 'Ansa', role: 'Dev', status: 'Active' },
    { id: 2, name: 'Team Member', role: 'Designer', status: 'Away' },
  ];

  return (
    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-800">Team Collaboration</h2>
        </div>
        <button className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-3 border border-gray-50 rounded-xl hover:bg-gray-50 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">
                {member.name[0]}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{member.name}</p>
                <p className="text-xs text-gray-500">{member.role}</p>
              </div>
            </div>
            <span className={`text-[10px] px-2 py-1 rounded-full ${member.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
              {member.status}
            </span>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 py-3 flex items-center justify-center gap-2 text-sm text-gray-600 border border-dashed border-gray-200 rounded-xl hover:bg-gray-50 transition-dashed">
        <MessageSquare className="w-4 h-4" />
        Open Team Chat
      </button>
    </div>
  );
};

export default TeamCollaboration;