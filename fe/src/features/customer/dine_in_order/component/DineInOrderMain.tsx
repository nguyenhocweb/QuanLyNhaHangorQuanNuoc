'use client';

import React, { useState, useMemo } from 'react';
import FadeIn from '@/src/core/components/animation/FadeIn';
import useDebounce from '@/src/core/hooks/useDebounce';
import { useGetDineInMenu } from '../hook/useGetDineInMenu';
import { useGetActiveOrder } from '../hook/useGetActiveOrder';
import { useCreateDineInOrder } from '../hook/useCreateDineInOrder';
import { CartItem, MenuItemData } from '../type/dine_in_order.type';
import { DineInHeader } from './DineInHeader';
import { CategoryBar } from './CategoryBar';
import { DishCard } from './DishCard';
import { DishNoteModal } from './DishNoteModal';
import { DishOptionModal } from './DishOptionModal';
import { CartDrawer } from './CartDrawer';
import { OrderedItemsTracker } from './OrderedItemsTracker';
import { FiSearch } from 'react-icons/fi';
import { MdOutlineRestaurantMenu } from 'react-icons/md';

interface Props {
    restaurantId: string;
    reservationId?: string;
}

export const DineInOrderMain: React.FC<Props> = ({
    restaurantId,
    reservationId
}) => {
    // 1. Data queries
    const { data: menuData, isLoading: isMenuLoading } = useGetDineInMenu(restaurantId);
    const { data: activeOrderData, isLoading: isActiveOrderLoading } = useGetActiveOrder(reservationId);
    const createOrderMutation = useCreateDineInOrder(reservationId);

    // 2. UI States
    const [activeTab, setActiveTab] = useState<'MENU' | 'TRACKER'>('MENU');
    const [selectedMenuId, setSelectedMenuId] = useState<string>('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('ALL');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

    // Tối ưu tìm kiếm với debounce (300ms)
    const debouncedSearch = useDebounce({ value: searchKeyword, delay: 300 });

    // 3. Cart State
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // 4. Modals State
    const [noteModalItem, setNoteModalItem] = useState<MenuItemData | null>(null);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

    const [optionModalItem, setOptionModalItem] = useState<MenuItemData | null>(null);
    const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);

    // Trích xuất danh sách Thực Đơn (Menus)
    const menus = useMemo(() => {
        if (!menuData?.metadata || !Array.isArray(menuData.metadata)) return [];
        return menuData.metadata.map((m: any) => ({
            id: m.id,
            name: m.name
        }));
    }, [menuData]);

    // Mặc định chọn thực đơn đầu tiên nếu chưa chọn hoặc id không hợp lệ
    React.useEffect(() => {
        if (menus.length > 0 && (!selectedMenuId || !menus.some(m => m.id === selectedMenuId))) {
            setSelectedMenuId(menus[0].id);
        }
    }, [menus, selectedMenuId]);

    const activeMenuId = selectedMenuId || menus[0]?.id || '';

    // Trích xuất danh mục theo Thực đơn đã chọn
    const categories = useMemo(() => {
        if (!menuData?.metadata || !Array.isArray(menuData.metadata) || !activeMenuId) return [];
        
        const targetMenus = menuData.metadata.filter((m: any) => m.id === activeMenuId);

        const allCats = targetMenus.flatMap((m: any) => m.categories || m.menucategory || []);
        const uniqueCatsMap = new Map();
        allCats.forEach((cat: any) => {
            if (cat && !uniqueCatsMap.has(cat.id)) {
                uniqueCatsMap.set(cat.id, {
                    ...cat,
                    items: (cat.items || []).map((item: any) => ({
                        ...item,
                        price: Number(item.price ?? item.basePrice ?? item.base_price ?? 0),
                        variants: item.variants || item.itemVariants || [],
                        modifierGroups: item.modifierGroups || []
                    }))
                });
            }
        });
        return Array.from(uniqueCatsMap.values());
    }, [menuData, activeMenuId]);

    // Lọc danh mục theo Danh mục đang chọn (Tùy chọn B) và Từ khóa tìm kiếm (Debounced)
    const filteredCategories = useMemo(() => {
        const keyword = debouncedSearch.toLowerCase().trim();

        return categories.map(cat => {
            const matchedItems = (cat.items || []).filter(item => {
                const matchSearch = !keyword || item.name.toLowerCase().includes(keyword) || (item.description && item.description.toLowerCase().includes(keyword));
                const matchCategory = selectedCategoryId === 'ALL' || cat.id === selectedCategoryId;
                return matchSearch && matchCategory;
            });

            return {
                ...cat,
                items: matchedItems
            };
        }).filter(cat => cat.items.length > 0);
    }, [categories, selectedCategoryId, debouncedSearch]);

    const handleSelectMenu = (menuId: string) => {
        setSelectedMenuId(menuId);
        setSelectedCategoryId('ALL'); // Reset danh mục khi đổi thực đơn
    };

    // Cart actions
    const handleAddToCart = (item: MenuItemData) => {
        const defaultCartId = `${item.id}_default`;
        setCartItems(prev => {
            const existing = prev.find(i => i.cartItemId === defaultCartId || (i.menuItemId === item.id && !i.selectedVariant && (!i.selectedModifiers || i.selectedModifiers.length === 0)));
            if (existing) {
                return prev.map(i => i.cartItemId === existing.cartItemId ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, {
                cartItemId: defaultCartId,
                menuItemId: item.id,
                name: item.name,
                unitPrice: item.price,
                quantity: 1,
                image: item.image
            }];
        });
    };

    const handleRemoveFromCart = (item: MenuItemData) => {
        setCartItems(prev => {
            const existing = prev.find(i => i.menuItemId === item.id);
            if (!existing) return prev;
            if (existing.quantity <= 1) {
                return prev.filter(i => i.cartItemId !== existing.cartItemId);
            }
            return prev.map(i => i.cartItemId === existing.cartItemId ? { ...i, quantity: i.quantity - 1 } : i);
        });
    };

    const handleAddCustomizedItemToCart = (customizedItem: CartItem) => {
        setCartItems(prev => {
            const existing = prev.find(i => i.cartItemId === customizedItem.cartItemId);
            if (existing) {
                return prev.map(i => i.cartItemId === customizedItem.cartItemId ? { ...i, quantity: i.quantity + customizedItem.quantity } : i);
            }
            return [...prev, customizedItem];
        });
    };

    const handleIncreaseCartItem = (cartItemId: string) => {
        setCartItems(prev => prev.map(i => i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i));
    };

    const handleDecreaseCartItem = (cartItemId: string) => {
        setCartItems(prev => {
            const existing = prev.find(i => i.cartItemId === cartItemId);
            if (!existing) return prev;
            if (existing.quantity <= 1) {
                return prev.filter(i => i.cartItemId !== cartItemId);
            }
            return prev.map(i => i.cartItemId === cartItemId ? { ...i, quantity: i.quantity - 1 } : i);
        });
    };

    const handleOpenOptionModal = (item: MenuItemData) => {
        setOptionModalItem(item);
        setIsOptionModalOpen(true);
    };

    const handleOpenNoteModal = (item: MenuItemData) => {
        setNoteModalItem(item);
        setIsNoteModalOpen(true);
    };

    const handleSaveNote = (item: MenuItemData, note: string) => {
        setCartItems(prev => {
            const existing = prev.find(i => i.menuItemId === item.id);
            if (existing) {
                return prev.map(i => i.cartItemId === existing.cartItemId ? { ...i, note } : i);
            }
            const defaultCartId = `${item.id}_default`;
            return [...prev, {
                cartItemId: defaultCartId,
                menuItemId: item.id,
                name: item.name,
                unitPrice: item.price,
                quantity: 1,
                note,
                image: item.image
            }];
        });
    };

    const handleClearCart = () => {
        setCartItems([]);
        setIsCartDrawerOpen(false);
    };

    const handleSubmitOrder = async () => {
        if (!reservationId) {
            return;
        }

        if (cartItems.length === 0) return;

        createOrderMutation.mutate({
            reservationId,
            items: cartItems.map(item => {
                let fullNote = item.note || '';
                const details = [];
                if (item.selectedModifiers && item.selectedModifiers.length > 0) {
                    details.push(`Topping: ${item.selectedModifiers.map(m => m.name).join(', ')}`);
                }
                if (details.length > 0) {
                    fullNote = fullNote ? `${fullNote} (${details.join(' - ')})` : details.join(' - ');
                }

                return {
                    menuItemId: item.menuItemId,
                    name: item.name,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    note: fullNote || undefined
                };
            })
        }, {
            onSuccess: () => {
                setCartItems([]);
                setIsCartDrawerOpen(false);
                setActiveTab('TRACKER');
            }
        });
    };

    const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
    const orderedItems = activeOrderData?.metadata?.order?.items || [];

    return (
        <div className="min-h-screen bg-gray-50/50 pb-28">
            {/* Header & Table info */}
            <DineInHeader
                reservation={activeOrderData?.metadata?.reservation}
                activeTab={activeTab}
                orderedCount={orderedItems.length}
                cartCount={cartCount}
                onTabChange={setActiveTab}
            />

            {activeTab === 'MENU' ? (
                <FadeIn className="w-full">
                    {/* Category & Menu Navigation Bar */}
                    {categories.length > 0 && (
                        <CategoryBar
                            menus={menus}
                            selectedMenuId={activeMenuId}
                            onSelectMenu={handleSelectMenu}
                            categories={categories}
                            activeCategoryId={selectedCategoryId}
                            onSelectCategory={setSelectedCategoryId}
                        />
                    )}

                    {/* Search bar */}
                    <div className="max-w-5xl mx-auto px-4 mt-4">
                        <div className="relative">
                            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
                            <input
                                type="text"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                placeholder="Tìm kiếm món ăn, đồ uống..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-400 shadow-xs"
                            />
                        </div>
                    </div>

                    {/* Dishes Grid - Animated per category switch */}
                    <FadeIn key={`${selectedCategoryId}_${debouncedSearch}`} className="max-w-5xl mx-auto px-4 mt-6 space-y-8">
                        {isMenuLoading ? (
                            <div className="py-16 text-center text-gray-400">
                                <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                                <p className="text-sm">Đang tải thực đơn nhà hàng...</p>
                            </div>
                        ) : filteredCategories.length === 0 ? (
                            <div className="py-16 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200 p-8">
                                <MdOutlineRestaurantMenu className="text-4xl mx-auto mb-2 opacity-40" />
                                <p className="text-sm font-medium">Không tìm thấy món ăn nào phù hợp</p>
                            </div>
                        ) : (
                            filteredCategories.map(cat => (
                                <div key={cat.id} className="space-y-3">
                                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                        <h3 className="font-bold text-gray-900 text-base sm:text-lg">{cat.name}</h3>
                                        <span className="text-xs text-gray-500 font-medium">
                                            {cat.items.length} món
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {cat.items.map(item => {
                                            const totalItemQty = cartItems
                                                .filter(c => c.menuItemId === item.id)
                                                .reduce((acc, i) => acc + i.quantity, 0);

                                            return (
                                                <DishCard
                                                    key={item.id}
                                                    item={item}
                                                    quantityInCart={totalItemQty}
                                                    currentNote={cartItems.find(c => c.menuItemId === item.id)?.note}
                                                    onAddToCart={handleAddToCart}
                                                    onRemoveFromCart={handleRemoveFromCart}
                                                    onOpenOptionModal={handleOpenOptionModal}
                                                    onOpenNoteModal={handleOpenNoteModal}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        )}
                    </FadeIn>
                </FadeIn>
            ) : (
                <FadeIn className="w-full px-4 mt-6">
                    <OrderedItemsTracker
                        order={activeOrderData?.metadata?.order || null}
                        isLoading={isActiveOrderLoading}
                        taxConfig={activeOrderData?.metadata?.taxConfig}
                        paymentConfigs={(activeOrderData?.metadata?.reservation?.restaurant?.brand as any)?.brandPaymentConfigs || []}
                        onSwitchToMenu={() => setActiveTab('MENU')}
                    />
                </FadeIn>
            )}

            {/* Size & Topping option modal */}
            <DishOptionModal
                item={optionModalItem}
                isOpen={isOptionModalOpen}
                onClose={() => setIsOptionModalOpen(false)}
                onAddToCart={handleAddCustomizedItemToCart}
            />

            {/* Note modal */}
            <DishNoteModal
                item={noteModalItem}
                initialNote={cartItems.find(i => i.menuItemId === noteModalItem?.id)?.note}
                isOpen={isNoteModalOpen}
                onClose={() => setIsNoteModalOpen(false)}
                onSave={handleSaveNote}
            />

            {/* Cart Drawer & Floating Bar */}
            <CartDrawer
                cartItems={cartItems}
                isOpen={isCartDrawerOpen}
                isPending={createOrderMutation.isPending}
                onOpen={() => setIsCartDrawerOpen(true)}
                onClose={() => setIsCartDrawerOpen(false)}
                onIncreaseItem={handleIncreaseCartItem}
                onDecreaseItem={handleDecreaseCartItem}
                onClearCart={handleClearCart}
                onOpenNoteModal={handleOpenNoteModal}
                onSubmitOrder={handleSubmitOrder}
            />
        </div>
    );
};
