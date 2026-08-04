import React from 'react';
import { AreaType } from '../type/table.type';
import { Div } from '@/src/core/components/ui';

interface TableAreaTabsProps {
    areas: AreaType[];
    activeAreaId: string;
    onChange: (areaId: string) => void;
}

export const TableAreaTabs: React.FC<TableAreaTabsProps> = ({ areas, activeAreaId, onChange }) => {
    if (!areas || areas.length === 0) return null;

    return (
        <Div className="w-full flex gap-2 overflow-x-auto pb-2 border-b border-gray-100" shape="none">
            {areas.map((area) => (
                <button
                    key={area.id}
                    onClick={() => onChange(area.id)}
                    className={`
                        whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                        ${activeAreaId === area.id 
                            ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700' 
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300'
                        }
                    `}
                >
                    {area.name}
                    {area.tables && (
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                            activeAreaId === area.id ? 'bg-indigo-500/50 text-white' : 'bg-gray-100 text-gray-500'
                        }`}>
                            {area.tables.length}
                        </span>
                    )}
                </button>
            ))}
        </Div>
    );
};
