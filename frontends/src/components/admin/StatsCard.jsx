import React from "react";

const StatsCard = ({ icon, label, value, bgColor }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow flex items-center gap-4">
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${bgColor}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

export default StatsCard;
