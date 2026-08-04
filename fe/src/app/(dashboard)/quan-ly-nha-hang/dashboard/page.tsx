import React from 'react';

const RestaurantDashboard = () => {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Tổng quan Chi nhánh</h1>
            <p className="text-gray-600 mb-8">Xin chào! Dưới đây là thông tin tổng quan về tình hình kinh doanh của chi nhánh.</p>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[300px]">
                <div className="text-5xl mb-4">🚧</div>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Giao diện đang được phát triển</h2>
                <p className="text-gray-500 text-center max-w-md">Các tính năng dành riêng cho Quản lý chi nhánh và Nhân viên sẽ sớm được cập nhật tại đây.</p>
            </div>
        </div>
    );
};

export default RestaurantDashboard;
