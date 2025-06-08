import React from "react";

const TabNav = ({ tabs, activeTab, onTabClick }) => (
    <nav className="flex space-x-8 border-b border-gray-200 mb-8 select-none">
        {tabs.map(tab => (
            <button
                key={tab.id}
                onClick={() => onTabClick(tab.id)}
                className={`py-2 px-1 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                        ? "border-b-2 border-gray-900 text-gray-900"
                        : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
                {tab.label}
            </button>
        ))}
    </nav>
);

export default TabNav;
