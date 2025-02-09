import React from 'react';

interface TabItem {
    key: string;
    label: string;
}

interface TabNavigationProps {
    tabs: TabItem[];
    activeTab: string;
    onTabChange: (tabKey: string) => void;
}

export function TabNavigation({
                                  tabs,
                                  activeTab,
                                  onTabChange
                              }: TabNavigationProps) {
    return (
        <div className="border-b">
            <div className="flex gap-8 px-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        className={`py-2 ${
                            activeTab === tab.key
                                ? "border-b-2 border-[#11c9d6] text-[#11c9d6]"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => onTabChange(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default TabNavigation;