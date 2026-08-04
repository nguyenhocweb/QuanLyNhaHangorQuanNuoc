import React from 'react';
import { Div, H, P, Button } from '@/src/core/components/ui';
import FadeIn from '@/src/core/components/animation/FadeIn';

const mockBranches = [
    { name: 'Foleat Quận 1', address: '123 Nguyễn Huệ, Q1, TP.HCM', status: 'Hoạt động', revenue: '120.000.000đ' },
    { name: 'Foleat Quận 3', address: '45 Lê Văn Sỹ, Q3, TP.HCM', status: 'Hoạt động', revenue: '95.000.000đ' },
    { name: 'Foleat Gò Vấp', address: '89 Quang Trung, Gò Vấp', status: 'Bảo trì', revenue: '0đ' },
];

const BranchesListComponent = () => {
    return (
        <FadeIn delay={0.3} className="w-full">
            <Div vitri="col_none" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm w-full">
                <div className="flex justify-between items-center mb-6">
                    <H className="text-lg font-bold text-gray-900">Chi nhánh nổi bật</H>
                    <Button variant="outline" sizea="p2_1" className="text-sm rounded-xl">Xem tất cả</Button>
                </div>
                
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-100 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-3 rounded-tl-xl">Tên Chi Nhánh</th>
                                <th className="px-4 py-3">Trạng thái</th>
                                <th className="px-4 py-3 text-right rounded-tr-xl">Doanh thu tuần</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {mockBranches.map((branch, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-4">
                                        <div className="font-semibold text-gray-900">{branch.name}</div>
                                        <div className="text-xs text-gray-500 mt-1">{branch.address}</div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${branch.status === 'Hoạt động' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {branch.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-right font-medium text-gray-900">
                                        {branch.revenue}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Div>
        </FadeIn>
    );
};

export default BranchesListComponent;
