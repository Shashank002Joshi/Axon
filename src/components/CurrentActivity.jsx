import React from 'react';
import { MessageSquare, Award, TrendingUp } from 'lucide-react';

const CurrentActivity = ({ activities }) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-6">Current Activity</h3>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="border-l-2 border-emerald-400/30 pl-4 pb-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                {activity.type === 'answer' && <MessageSquare size={16} className="text-emerald-400" />}
                {activity.type === 'bounty' && <Award size={16} className="text-blue-400" />}
                {activity.type === 'token' && <TrendingUp size={16} className="text-purple-400" />}
                <span className="font-semibold text-white">{activity.action}</span>
              </div>
              <span className="text-white/60 text-sm">{activity.time}</span>
            </div>
            <p className="text-white/80 text-sm mb-2">{activity.description}</p>
            {activity.amount && (
              <div className="text-emerald-400 font-semibold text-sm">
                +{activity.amount}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentActivity;
