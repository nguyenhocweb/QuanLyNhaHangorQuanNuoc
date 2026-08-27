import React from 'react';
import { BiRestaurant, BiStar } from 'react-icons/bi';
import { FiStar } from 'react-icons/fi';

interface MyBrandRestaurantsProps {
    restaurants: any[] | undefined;
    isRestaurantsLoading: boolean;
}

const renderStatusBadge = (status: string | undefined) => {
    switch (status) {
        case 'ACTIVE': return <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-md text-xs font-semibold whitespace-nowrap">Hoạt động</span>;
        case 'INACTIVE': return <span className="bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-md text-xs font-semibold whitespace-nowrap">Tạm nghỉ</span>;
        case 'PENDING': return <span className="bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-md text-xs font-semibold whitespace-nowrap">Chờ duyệt</span>;
        case 'TERMINATED': return <span className="bg-red-100 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-md text-xs font-semibold whitespace-nowrap">Nghỉ vĩnh viễn</span>;
        default: return <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-md text-xs font-semibold whitespace-nowrap">Không xác định</span>;
    }
};

const MyBrandRestaurants = ({ restaurants, isRestaurantsLoading }: MyBrandRestaurantsProps) => {
    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <BiRestaurant className="text-blue-500" />
                    Danh sách nhà hàng ({restaurants?.length || 0})
                </h3>
            </div>

            {isRestaurantsLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                </div>
            ) : restaurants && restaurants.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {restaurants.map((restaurant) => (
                        <div key={restaurant.id} className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                            <div className="h-48 bg-slate-200 relative overflow-hidden">
                                {restaurant.imageMain ? (
                                    <img src={restaurant.imageMain} alt={restaurant.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-100">
                                        <BiRestaurant className="text-4xl text-slate-300" />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold shadow-sm border border-slate-100">
                                    <FiStar className="text-amber-400 fill-amber-400" />
                                    <span className="text-slate-700">{restaurant.ratingStats?.averageRating || restaurant.averageRating || 0}</span>
                                </div>
                            </div>
                            <div className="p-5">
                                <h4 className="text-lg font-bold text-slate-800 mb-1 line-clamp-1">{restaurant.name}</h4>
                                <p className="text-sm text-slate-500 mb-3 line-clamp-1">
                                    {restaurant.address ? `${restaurant.address.street || ''}, ${restaurant.address.ward || ''}, ${restaurant.address.district || ''}, ${restaurant.address.province || ''}`.replace(/^[\s,]+|[\s,]+$/g, '').replace(/,\s*,/g, ',') : "Chưa cập nhật địa chỉ"}
                                </p>
                                
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {restaurant.categories?.slice(0, 2).map((cat: any, idx: number) => (
                                        <span 
                                            key={idx} 
                                            className="px-2.5 py-0.5 rounded-md text-xs font-medium border"
                                            style={{
                                                backgroundColor: cat.bgColor || '#EEF2FF',
                                                color: cat.textColor || '#6366F1',
                                                borderColor: cat.textColor ? `${cat.textColor}30` : '#6366F130'
                                            }}
                                        >
                                            {cat.name}
                                        </span>
                                    ))}
                                    {restaurant.tags?.slice(0, 2).map((tag: any, idx: number) => (
                                        <span key={idx} className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md text-xs font-medium border border-slate-200">
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>
                                
                                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                                    <span className="text-xs text-slate-400">
                                        Thành lập: {restaurant.createdAt ? new Date(restaurant.createdAt).getFullYear() : 'N/A'}
                                    </span>
                                    {renderStatusBadge(
                                        restaurant.statusByAdmin && restaurant.statusByAdmin !== 'ACTIVE' 
                                            ? restaurant.statusByAdmin 
                                            : (restaurant.statusByBrand || restaurant.isActive)
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                    <BiRestaurant className="text-5xl text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">Chưa có nhà hàng nào thuộc thương hiệu này.</p>
                </div>
            )}
        </div>
    );
};

export default MyBrandRestaurants;
