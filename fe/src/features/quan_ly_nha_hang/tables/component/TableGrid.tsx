import React from 'react';
import { TableType } from '../type/table.type';
import { TableCard } from './TableCard';
import FadeIn from '@/src/core/components/animation/FadeIn';

interface TableGridProps {
    tables: TableType[];
    onTableClick: (table: TableType) => void;
}

export const TableGrid: React.FC<TableGridProps> = ({ tables, onTableClick }) => {
    if (!tables || tables.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500 w-full">
                <div className="text-4xl mb-4 opacity-50">🍽️</div>
                <p>Khu vực này hiện chưa có bàn nào.</p>
            </div>
        );
    }

    return (
        <FadeIn className="w-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full">
                {tables.map(table => (
                    <TableCard 
                        key={table.id} 
                        table={table} 
                        onClick={onTableClick} 
                    />
                ))}
            </div>
        </FadeIn>
    );
};
