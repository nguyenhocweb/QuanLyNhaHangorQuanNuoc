"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useKioskSession } from "@/src/features/public/table_kiosk/hook/useKioskSession";
import { useGetDineInMenu } from "@/src/features/customer/dine_in_order/hook/useGetDineInMenu";
import { useKioskOrder } from "@/src/features/public/table_kiosk/hook/useKioskOrder";
import { useKioskCancelItem } from "@/src/features/public/table_kiosk/hook/useKioskCancelItem";
import { useKioskPromotion } from "@/src/features/public/table_kiosk/hook/useKioskPromotion";
import { KioskStandbyScreen } from "@/src/features/public/table_kiosk/component/KioskStandbyScreen";
import { KioskServiceCallBar } from "@/src/features/public/table_kiosk/component/KioskServiceCallBar";
import { CartItem, MenuItemData, MenuItemVariant, ModifierOptionData } from "@/src/features/customer/dine_in_order/type/dine_in_order.type";
import { 
    FaShoppingCart, FaSearch, FaUtensils, FaQrcode, 
    FaPlus, FaMinus, FaTimes, FaCheck, FaFireAlt, FaLock, FaShieldAlt, FaTabletAlt, FaKey, FaExclamationTriangle, FaTicketAlt
} from "react-icons/fa";
import { 
    MdOutlineFastfood, MdOutlineReceiptLong, MdEditNote, MdTune, 
    MdOutlineRestaurantMenu, MdBlock, MdCancel, MdCheckCircle, MdOutdoorGrill
} from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import useDebounce from "@/src/core/hooks/useDebounce";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { toast } from "sonner";

const QUICK_NOTES = [
    "Ít đá", "Ít đường", "Không cay", "Không hành", "Không rau mùi", 
    "Lên món sau cùng", "Lên món trước", "Mang thêm đá", "Ăn chín kỹ"
];

// Thời gian tự động trở về Standby nếu không có tương tác: 3 Phút (180.000 ms)
const INACTIVITY_TIMEOUT_MS = 3 * 60 * 1000;

export default function TableKioskMainPage() {
    const params = useParams();
    const router = useRouter();
    const restaurantId = params.restaurantId as string;
    const tableId = params.tableId as string;

    // 1. KIỂM TRA XÁC THỰC THIẾT BỊ BÀN (Hardware Pairing Guard)
    const [isDeviceAuthorized, setIsDeviceAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("tableDeviceToken");
        const storedTableId = localStorage.getItem("kioskTableId");
        const storedRestaurantId = localStorage.getItem("kioskRestaurantId");

        // Nếu thiết bị đã được ghép nối đúng bàn và đúng nhà hàng
        if (storedToken && storedTableId === tableId && storedRestaurantId === restaurantId) {
            setIsDeviceAuthorized(true);
        } else {
            // Thiết bị lạ / Trình duyệt copy link chưa được cấp Token ghép nối
            setIsDeviceAuthorized(false);
        }
    }, [tableId, restaurantId]);

    // Queries & Mutations
    const { data: sessionData, isLoading: isSessionLoading } = useKioskSession(restaurantId, tableId);
    const { data: menuData, isLoading: isMenuLoading } = useGetDineInMenu(restaurantId);
    const { mutate: placeOrder, isPending: isOrdering } = useKioskOrder();
    const { mutate: cancelOrderItem, isPending: isCancelling } = useKioskCancelItem();
    const { applyPromotion, isApplying: isApplyingPromo, removePromotion, isRemoving: isRemovingPromo } = useKioskPromotion();

    // Cancellation Confirmation State
    const [cancellingItem, setCancellingItem] = useState<{ id: string; name: string } | null>(null);

    // Promotion Code Input State
    const [promoCodeInput, setPromoCodeInput] = useState("");

    // UI States (Giao diện Dark theme cao cấp Ảnh 1)
    const [isStandbyUnlocked, setIsStandbyUnlocked] = useState(false);
    const [selectedMenuId, setSelectedMenuId] = useState<string>("");
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("ALL");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isTrackerOpen, setIsTrackerOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    // Debounce tìm kiếm
    const debouncedSearch = useDebounce({ value: searchKeyword, delay: 300 });

    // Giỏ hàng
    const [cart, setCart] = useState<CartItem[]>([]);

    // Modals
    const [noteModalItem, setNoteModalItem] = useState<MenuItemData | null>(null);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [optionModalItem, setOptionModalItem] = useState<MenuItemData | null>(null);
    const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);

    // Option Modal Internal States
    const [selectedVariant, setSelectedVariant] = useState<MenuItemVariant | null>(null);
    const [selectedModifiers, setSelectedModifiers] = useState<ModifierOptionData[]>([]);
    const [optionQuantity, setOptionQuantity] = useState(1);
    const [optionNote, setOptionNote] = useState("");

    // Note Modal Internal State
    const [customNote, setCustomNote] = useState("");

    const session = sessionData?.metadata;

    // 2. CƠ CHẾ TỰ ĐỘNG TIMEOUT KHI KHÔNG CÓ TƯƠNG TÁC (Inactivity Auto-Reset)
    const lastActivityRef = useRef<number>(Date.now());

    const handleUserInteraction = useCallback(() => {
        lastActivityRef.current = Date.now();
    }, []);

    useEffect(() => {
        const events = ["mousedown", "mousemove", "touchstart", "scroll", "keydown"];
        events.forEach(event => window.addEventListener(event, handleUserInteraction));

        const interval = setInterval(() => {
            const timeSinceLastActivity = Date.now() - lastActivityRef.current;
            // Nếu quá thời gian và không có đơn đang ăn hoạt động -> Đưa về Standby Screen & Dọn giỏ tạm
            if (timeSinceLastActivity >= INACTIVITY_TIMEOUT_MS && isStandbyUnlocked) {
                if (!session?.activeOrder) {
                    setCart([]);
                    setIsStandbyUnlocked(false);
                    setIsCartOpen(false);
                    setIsOptionModalOpen(false);
                    setIsNoteModalOpen(false);
                    setIsTrackerOpen(false);
                }
            }
        }, 10000);

        return () => {
            events.forEach(event => window.removeEventListener(event, handleUserInteraction));
            clearInterval(interval);
        };
    }, [handleUserInteraction, isStandbyUnlocked, session?.activeOrder]);

    // 3. Trích xuất danh sách Thực Đơn (Menus)
    const menus = useMemo(() => {
        if (!menuData?.metadata || !Array.isArray(menuData.metadata)) return [];
        return menuData.metadata.map((m: any) => ({
            id: m.id,
            name: m.name
        }));
    }, [menuData]);

    useEffect(() => {
        if (menus.length > 0 && (!selectedMenuId || !menus.some(m => m.id === selectedMenuId))) {
            setSelectedMenuId(menus[0].id);
        }
    }, [menus, selectedMenuId]);

    const activeMenuId = selectedMenuId || menus[0]?.id || "";

    // 4. Trích xuất danh mục & món ăn theo Thực đơn
    const categories = useMemo(() => {
        if (!menuData?.metadata) return [];
        const rawList = Array.isArray(menuData.metadata) ? menuData.metadata : [menuData.metadata];
        const targetMenus = activeMenuId ? rawList.filter((m: any) => m.id === activeMenuId) : rawList;

        const catMap = new Map();
        targetMenus.forEach((entry: any) => {
            const subCategories = entry.categories || entry.menucategory || [];
            if (Array.isArray(subCategories) && subCategories.length > 0) {
                subCategories.forEach((cat: any) => {
                    const catKey = cat.id || cat.name;
                    if (cat && !catMap.has(catKey)) {
                        const items = (cat.items || cat.menuItems || cat.dishes || []).map((item: any) => ({
                            id: item.id,
                            name: item.name,
                            description: item.description,
                            image: item.image || item.imageUrl,
                            images: item.images || [],
                            price: Number(item.base_price ?? item.basePrice ?? item.price ?? 0),
                            basePrice: Number(item.base_price ?? item.basePrice ?? item.price ?? 0),
                            is_featured: item.is_featured || item.isFeatured || false,
                            is_available: item.is_available ?? item.isAvailable ?? true,
                            allergens: item.allergens || [],
                            spice_level: item.spice_level,
                            prep_time: item.prep_time,
                            categoryName: cat.name || entry.name || "Món ăn",
                            variants: (item.variants || item.itemVariants || []).map((v: any) => ({
                                id: v.id,
                                name: v.name,
                                price: Number(v.price ?? v.priceAdjustment ?? 0),
                                priceAdjustment: Number(v.priceAdjustment ?? 0)
                            })),
                            modifierGroups: (item.modifierGroups || []).map((mg: any) => ({
                                id: mg.id,
                                name: mg.name,
                                minSelections: mg.minSelections,
                                maxSelections: mg.maxSelections,
                                options: (mg.options || mg.modifierOptions || []).map((opt: any) => ({
                                    id: opt.id,
                                    name: opt.name,
                                    priceExtra: Number(opt.priceExtra ?? opt.price ?? 0)
                                }))
                            }))
                        }));
                        catMap.set(catKey, {
                            id: cat.id || cat.name,
                            name: cat.name,
                            items
                        });
                    }
                });
            } else if (entry.items || entry.menuItems) {
                const catKey = entry.id || entry.name;
                const items = (entry.items || entry.menuItems || []).map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    image: item.image || item.imageUrl,
                    price: Number(item.base_price ?? item.basePrice ?? item.price ?? 0),
                    basePrice: Number(item.base_price ?? item.basePrice ?? item.price ?? 0),
                    is_featured: item.is_featured || item.isFeatured || false,
                    is_available: item.is_available ?? item.isAvailable ?? true,
                    categoryName: entry.name || "Món ăn",
                    variants: item.variants || [],
                    modifierGroups: item.modifierGroups || []
                }));
                catMap.set(catKey, {
                    id: entry.id || entry.name,
                    name: entry.name,
                    items
                });
            }
        });

        return Array.from(catMap.values());
    }, [menuData, activeMenuId]);

    // Tổng số lượng món ăn trong thực đơn
    const totalMenuItemsCount = useMemo(() => {
        return categories.reduce((acc, cat) => acc + (cat.items?.length || 0), 0);
    }, [categories]);

    // 5. Lọc danh mục theo Danh mục đang chọn & Từ khóa tìm kiếm
    const filteredCategories = useMemo(() => {
        const keyword = debouncedSearch.toLowerCase().trim();

        return categories.map((cat: any) => {
            const matchedItems = (cat.items || []).filter((item: any) => {
                const matchSearch = !keyword || item.name.toLowerCase().includes(keyword) || (item.description && item.description.toLowerCase().includes(keyword));
                const matchCategory = selectedCategoryId === "ALL" || cat.id === selectedCategoryId || cat.name === selectedCategoryId;
                return matchSearch && matchCategory;
            });

            return {
                ...cat,
                items: matchedItems
            };
        }).filter((cat: any) => cat.items.length > 0);
    }, [categories, selectedCategoryId, debouncedSearch]);

    // Map số lượng trong giỏ
    const cartQuantityMap = useMemo(() => {
        const map = new Map<string, number>();
        cart.forEach(i => {
            const current = map.get(i.menuItemId) || 0;
            map.set(i.menuItemId, current + i.quantity);
        });
        return map;
    }, [cart]);

    // Map ghi chú món đơn
    const cartNoteMap = useMemo(() => {
        const map = new Map<string, string>();
        cart.forEach(i => {
            if (i.note) map.set(i.menuItemId, i.note);
        });
        return map;
    }, [cart]);

    const taxConfig = sessionData?.metadata?.taxConfig;

    // Tính toán giỏ hàng & các loại phí
    const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);
    const cartSubtotal = useMemo(() => cart.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0), [cart]);
    
    const cartServiceFee = useMemo(() => {
        if (taxConfig?.applyServiceCharge && taxConfig?.serviceChargeRate > 0) {
            return Math.round(cartSubtotal * (taxConfig.serviceChargeRate / 100));
        }
        return 0;
    }, [cartSubtotal, taxConfig]);

    const cartVatAmount = useMemo(() => {
        if (!taxConfig?.isVatInclusive && taxConfig?.defaultVatRate > 0) {
            return Math.round((cartSubtotal + cartServiceFee) * (taxConfig.defaultVatRate / 100));
        }
        return 0;
    }, [cartSubtotal, cartServiceFee, taxConfig]);

    const cartFinalTotal = useMemo(() => {
        return cartSubtotal + cartServiceFee + cartVatAmount;
    }, [cartSubtotal, cartServiceFee, cartVatAmount]);

    // Món đã gọi đếm
    const orderedItemsCount = useMemo(() => {
        return session?.activeOrder?.items?.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0) || 0;
    }, [session?.activeOrder]);

    // Thao tác giỏ hàng
    const addToCart = (dish: any) => {
        if (dish.is_available === false) {
            toast.error(`Món "${dish.name}" hiện đang tạm hết hàng.`);
            return;
        }

        const hasVariants = dish.variants && dish.variants.length > 0;
        const hasModifiers = dish.modifierGroups && dish.modifierGroups.length > 0;

        if (hasVariants || hasModifiers) {
            openOptionModal(dish);
            return;
        }

        setCart((prev) => {
            const existingIdx = prev.findIndex((i) => i.menuItemId === dish.id && !i.selectedVariant && (!i.selectedModifiers || i.selectedModifiers.length === 0));
            if (existingIdx > -1) {
                const next = [...prev];
                next[existingIdx].quantity += 1;
                return next;
            }
            return [...prev, {
                cartItemId: `${dish.id}_default`,
                menuItemId: dish.id,
                name: dish.name,
                unitPrice: dish.price,
                quantity: 1,
                image: dish.image
            }];
        });
        toast.success(`Đã thêm "${dish.name}" vào giỏ!`);
    };

    const removeFromCart = (dish: any) => {
        setCart((prev) => {
            const existingIdx = prev.findIndex((i) => i.menuItemId === dish.id);
            if (existingIdx === -1) return prev;
            if (prev[existingIdx].quantity > 1) {
                const next = [...prev];
                next[existingIdx].quantity -= 1;
                return next;
            }
            return prev.filter((_, idx) => idx !== existingIdx);
        });
    };

    const openOptionModal = (dish: any) => {
        if (dish.is_available === false) {
            toast.error(`Món "${dish.name}" hiện đang tạm hết hàng.`);
            return;
        }
        setOptionModalItem(dish);
        setSelectedVariant(dish.variants && dish.variants.length > 0 ? dish.variants[0] : null);
        setSelectedModifiers([]);
        setOptionQuantity(1);
        setOptionNote(cartNoteMap.get(dish.id) || "");
        setIsOptionModalOpen(true);
    };

    const handleConfirmOptionModal = () => {
        if (!optionModalItem) return;

        const modifierIds = selectedModifiers.map(m => m.id).sort().join("-");
        const variantId = selectedVariant?.id || "default";
        const cartItemId = `${optionModalItem.id}_${variantId}_${modifierIds}_${optionNote.trim()}`;

        let displayName = optionModalItem.name;
        if (selectedVariant) {
            displayName += ` (${selectedVariant.name})`;
        }

        const basePrice = selectedVariant ? selectedVariant.price : optionModalItem.price;
        const extraPrice = selectedModifiers.reduce((acc, m) => acc + (m.priceExtra || 0), 0);
        const unitPrice = basePrice + extraPrice;

        const newItem: CartItem = {
            cartItemId,
            menuItemId: optionModalItem.id,
            name: displayName,
            unitPrice,
            quantity: optionQuantity,
            selectedVariant,
            selectedModifiers,
            note: optionNote.trim() || undefined,
            image: optionModalItem.image
        };

        setCart((prev) => {
            const existingIdx = prev.findIndex(i => i.cartItemId === cartItemId);
            if (existingIdx > -1) {
                const next = [...prev];
                next[existingIdx].quantity += optionQuantity;
                return next;
            }
            return [...prev, newItem];
        });

        setIsOptionModalOpen(false);
        toast.success(`Đã thêm "${displayName}" vào giỏ!`);
    };

    const openNoteModal = (dish: any) => {
        setNoteModalItem(dish);
        setCustomNote(cartNoteMap.get(dish.id) || "");
        setIsNoteModalOpen(true);
    };

    const handleSaveNote = () => {
        if (!noteModalItem) return;
        const noteText = customNote.trim();

        setCart((prev) => {
            const existingIdx = prev.findIndex(i => i.menuItemId === noteModalItem.id);
            if (existingIdx > -1) {
                const next = [...prev];
                next[existingIdx].note = noteText;
                return next;
            }
            return [...prev, {
                cartItemId: `${noteModalItem.id}_note_${Date.now()}`,
                menuItemId: noteModalItem.id,
                name: noteModalItem.name,
                unitPrice: noteModalItem.price,
                quantity: 1,
                note: noteText,
                image: noteModalItem.image
            }];
        });

        setIsNoteModalOpen(false);
        toast.success(`Đã lưu ghi chú cho "${noteModalItem.name}"`);
    };

    const updateQuantity = (cartItemId: string, delta: number) => {
        setCart((prev) => {
            return prev
                .map((item) => {
                    if (item.cartItemId === cartItemId) {
                        const newQty = item.quantity + delta;
                        return newQty > 0 ? { ...item, quantity: newQty } : null;
                    }
                    return item;
                })
                .filter(Boolean) as CartItem[];
        });
    };

    const handleSendToKitchen = () => {
        if (cart.length === 0) return;

        placeOrder(
            {
                restaurantId,
                tableId,
                items: cart.map((i) => ({
                    menuItemId: i.menuItemId,
                    quantity: i.quantity,
                    notes: i.note || (i.selectedModifiers?.map(m => m.name).join(", ") || "")
                })),
                reservationId: session?.activeReservationId || undefined
            },
            {
                onSuccess: () => {
                    setCart([]);
                    setIsCartOpen(false);
                    setIsTrackerOpen(true);
                }
            }
        );
    };

    // MÀN HÌNH KHÓA BẢO VỆ KHI THIẾT BỊ CHƯA ĐƯỢC GHÉP NỐI (Chống copy link)
    if (isDeviceAuthorized === false) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 select-none relative overflow-hidden">
                <div className="absolute top-1/3 -left-32 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <FadeIn className="w-full max-w-md bg-slate-900/90 border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center z-10">
                    <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mb-5">
                        <FaShieldAlt className="text-3xl" />
                    </div>

                    <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
                        Thiết Bị Chưa Được Kích Hoạt
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                        Trình duyệt hoặc thiết bị này chưa được ghép nối bảo mật với <strong className="text-amber-400">Bàn {session?.table?.tableNumber || ""}</strong>. Vui lòng liên hệ Quản lý nhà hàng để nhập mã PIN kích hoạt.
                    </p>

                    <button
                        onClick={() => router.push("/kiosk/pairing")}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                    >
                        <FaKey className="text-base" />
                        Nhập Mã PIN Ghép Nối Thiết Bị
                    </button>
                </FadeIn>
            </div>
        );
    }

    if (isSessionLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
                <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                <span className="text-slate-400 text-sm font-medium">Đang tải cấu hình Bàn Kiosk...</span>
            </div>
        );
    }

    // Nếu bàn đang trống và chưa được khách chạm mở -> hiện Standby Screensaver
    if (session?.sessionStatus === "IDLE" && !isStandbyUnlocked && !session?.activeOrder) {
        return (
            <KioskStandbyScreen
                restaurant={session?.restaurant}
                tableNumber={session?.table?.tableNumber || "N/A"}
                onUnlock={() => setIsStandbyUnlocked(true)}
            />
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col select-none pb-28">
            {/* Top Navigation Header (Ảnh 1 Theme) */}
            <header className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-4 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-white/10 p-1.5 border border-white/10 flex items-center justify-center shrink-0">
                        {session?.restaurant?.logoUrl ? (
                            <img src={session.restaurant.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                        ) : (
                            <FaUtensils className="text-amber-400 text-lg" />
                        )}
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight truncate max-w-xs sm:max-w-md">
                                {session?.restaurant?.name || "Nhà hàng"}
                            </h1>
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold font-mono shrink-0">
                                Bàn {session?.table?.tableNumber}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 truncate">
                            {session?.guestInfo?.name
                                ? `Chào mừng: ${session.guestInfo.name} (${session.guestInfo.partySize || 4} khách)`
                                : "Chế độ gọi món tự phục vụ tại bàn"}
                        </p>
                    </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    {/* View Ordered Items Tracker */}
                    {session?.activeOrder && (
                        <button
                            onClick={() => setIsTrackerOpen(true)}
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/30 font-semibold text-xs sm:text-sm transition-all"
                        >
                            <MdOutlineReceiptLong className="text-base text-indigo-400" />
                            <span>Món đã gọi ({orderedItemsCount})</span>
                        </button>
                    )}

                    {/* Cart Button */}
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-xs sm:text-sm hover:from-amber-400 hover:to-amber-300 shadow-lg shadow-amber-500/20 transition-all"
                    >
                        <FaShoppingCart className="text-base" />
                        <span>Giỏ món</span>
                        {cartCount > 0 && (
                            <span className="px-2 py-0.5 bg-slate-950 text-amber-400 rounded-full text-xs font-extrabold font-mono">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-6">
                
                {/* 1. DÒNG CHỌN THỰC ĐƠN (MENU SELECTOR - ẢNH 2) */}
                {menus.length > 0 && (
                    <div className="flex items-center gap-3 bg-slate-950/60 border border-white/10 rounded-2xl px-4 py-3 shadow-sm">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                            <MdOutlineRestaurantMenu className="text-amber-400 text-base" /> Thực đơn:
                        </span>
                        {menus.length > 1 ? (
                            <div className="relative max-w-xs sm:max-w-sm">
                                <select
                                    value={selectedMenuId}
                                    onChange={(e) => {
                                        setSelectedMenuId(e.target.value);
                                        setSelectedCategoryId("ALL");
                                    }}
                                    className="w-full text-xs sm:text-sm font-bold text-amber-300 bg-slate-800 border border-white/15 rounded-xl px-3 py-1.5 pr-8 focus:outline-none focus:border-amber-400 cursor-pointer shadow-sm transition-all"
                                >
                                    {menus.map((m: any) => (
                                        <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                                            {m.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <span className="text-xs sm:text-sm font-bold text-amber-300 bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-white/10 shadow-xs">
                                {menus[0]?.name}
                            </span>
                        )}
                    </div>
                )}

                {/* 2. DẢI NÚT DANH MỤC (CATEGORY PILLS VỚI SỐ LƯỢNG MÓN) */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    <button
                        onClick={() => setSelectedCategoryId("ALL")}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                            selectedCategoryId === "ALL"
                                ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                                : "bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-white/5"
                        }`}
                    >
                        <span>Tất cả</span>
                        <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                            selectedCategoryId === "ALL" ? "bg-slate-950 text-amber-400 font-extrabold" : "bg-white/10 text-slate-400"
                        }`}>
                            {totalMenuItemsCount}
                        </span>
                    </button>
                    {categories.map((cat: any) => {
                        const isCatSelected = selectedCategoryId === cat.id || selectedCategoryId === cat.name;
                        const catCount = cat.items?.length || 0;
                        return (
                            <button
                                key={cat.id || cat.name}
                                onClick={() => setSelectedCategoryId(cat.id || cat.name)}
                                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                                    isCatSelected
                                        ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-bold"
                                        : "bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-white/5"
                                }`}
                            >
                                <span>{cat.name}</span>
                                <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                                    isCatSelected ? "bg-slate-950 text-amber-400 font-extrabold" : "bg-white/10 text-slate-400"
                                }`}>
                                    {catCount}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* 3. Ô TÌM KIẾM MÓN ĂN */}
                <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                    <input
                        type="text"
                        placeholder="Tìm món ăn, đồ uống, tráng miệng..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-800/80 border border-white/10 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 shadow-sm transition-all"
                    />
                </div>

                {/* 4. DANH SÁCH MÓN ĂN PHÂN THEO TỪNG NHÓM DANH MỤC (CATEGORIZED SECTIONS) */}
                {isMenuLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 py-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="bg-slate-800/50 rounded-2xl h-72 animate-pulse border border-white/5"></div>
                        ))}
                    </div>
                ) : filteredCategories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-slate-950/40 rounded-3xl border border-white/5">
                        <MdOutlineFastfood className="text-5xl mb-3 text-slate-600" />
                        <p className="text-base font-medium">Không tìm thấy món ăn nào</p>
                    </div>
                ) : (
                    <FadeIn className="space-y-8">
                        {filteredCategories.map((category: any) => (
                            <section key={category.id || category.name} className="space-y-4">
                                {/* Tiêu đề Danh mục & Số lượng món */}
                                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                                    <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                        <span>{category.name}</span>
                                    </h3>
                                    <span className="text-xs text-slate-400 font-medium font-mono">
                                        {category.items.length} món
                                    </span>
                                </div>

                                {/* Lưới thẻ món ăn (Dark Theme) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                    {category.items.map((dish: any) => {
                                        const quantityInCart = cartQuantityMap.get(dish.id) || 0;
                                        const itemNote = cartNoteMap.get(dish.id);
                                        const hasVariants = dish.variants && dish.variants.length > 0;
                                        const hasModifiers = dish.modifierGroups && dish.modifierGroups.length > 0;
                                        const hasOptions = hasVariants || hasModifiers;
                                        const isSoldOut = dish.is_available === false;

                                        return (
                                            <div
                                                key={dish.id}
                                                className={`bg-slate-800/70 hover:bg-slate-800/90 border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-xl transition-all duration-200 group relative ${
                                                    isSoldOut ? "opacity-60 grayscale" : ""
                                                }`}
                                            >
                                                {/* Dish Image */}
                                                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                                                    {dish.image ? (
                                                        <img
                                                            src={dish.image}
                                                            alt={dish.name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                                                            <FaUtensils className="text-3xl" />
                                                        </div>
                                                    )}

                                                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-sm text-[11px] font-medium text-amber-300 border border-white/10">
                                                        {dish.categoryName}
                                                    </span>

                                                    {dish.is_featured && !isSoldOut && (
                                                        <span className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
                                                            <FaFireAlt className="text-xs" /> HOT
                                                        </span>
                                                    )}

                                                    {/* Nhãn Tạm Hết Hàng */}
                                                    {isSoldOut && (
                                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs flex items-center justify-center">
                                                            <span className="px-3 py-1 rounded-xl bg-rose-500/80 text-white text-xs font-bold flex items-center gap-1.5 shadow-md">
                                                                <MdBlock className="text-sm" /> Tạm hết món
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Dish Info */}
                                                <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                                                    <div>
                                                        <div className="flex items-start justify-between gap-2">
                                                            <h4 className="font-bold text-white text-sm sm:text-base line-clamp-1 group-hover:text-amber-300 transition-colors">
                                                                {dish.name}
                                                            </h4>
                                                            {dish.spice_level && dish.spice_level > 0 ? (
                                                                <span className="text-xs text-red-400 font-bold shrink-0 flex items-center">
                                                                    🌶️ {dish.spice_level > 1 && `x${dish.spice_level}`}
                                                                </span>
                                                            ) : null}
                                                        </div>

                                                        <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                                                            {dish.description || "Món ăn thơm ngon, chuẩn vị chế biến từ nguyên liệu tươi mới."}
                                                        </p>

                                                        {/* Size Preview */}
                                                        {hasVariants && (
                                                            <div className="flex flex-wrap items-center gap-1 mt-2">
                                                                <span className="text-[11px] text-slate-400">Size:</span>
                                                                {dish.variants.map((v: any) => (
                                                                    <span key={v.id} className="text-[10px] bg-white/10 text-amber-300 font-semibold px-2 py-0.5 rounded-md border border-white/10">
                                                                        {v.name}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* Note Preview */}
                                                        {itemNote && (
                                                            <p 
                                                                onClick={() => !isSoldOut && openNoteModal(dish)}
                                                                className="text-[11px] text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-md mt-2 inline-block cursor-pointer hover:bg-amber-400/20 transition-colors truncate max-w-full"
                                                            >
                                                                📝 {itemNote}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Bottom Action Bar */}
                                                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                                                        <div>
                                                            <span className="text-amber-400 font-extrabold text-sm sm:text-base font-mono">
                                                                {hasVariants ? `Từ ${dish.price?.toLocaleString("vi-VN")}đ` : `${dish.price?.toLocaleString("vi-VN")}đ`}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            {!isSoldOut && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => hasOptions ? openOptionModal(dish) : openNoteModal(dish)}
                                                                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                                                    title="Ghi chú món ăn"
                                                                >
                                                                    <MdEditNote className="text-base" />
                                                                </button>
                                                            )}

                                                            {isSoldOut ? (
                                                                <span className="text-xs text-slate-500 font-semibold px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 cursor-not-allowed">
                                                                    Hết hàng
                                                                </span>
                                                            ) : quantityInCart > 0 && !hasOptions ? (
                                                                <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-xl border border-white/10">
                                                                    <button
                                                                        onClick={() => removeFromCart(dish)}
                                                                        className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center"
                                                                    >
                                                                        <FaMinus className="text-[10px]" />
                                                                    </button>
                                                                    <span className="text-xs font-bold text-amber-400 px-1 font-mono">
                                                                        {quantityInCart}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => addToCart(dish)}
                                                                        className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center"
                                                                    >
                                                                        <FaPlus className="text-[10px]" />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => hasOptions ? openOptionModal(dish) : addToCart(dish)}
                                                                    className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-bold text-xs transition-all shadow-sm flex items-center gap-1.5"
                                                                >
                                                                    {hasOptions ? <MdTune className="text-sm" /> : <FaPlus className="text-[10px]" />}
                                                                    <span>{hasOptions ? (quantityInCart > 0 ? `Đã chọn (${quantityInCart})` : "Chọn món") : "+ Chọn"}</span>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        ))}
                    </FadeIn>
                )}
            </main>

            {/* Modal Tùy Chọn Size & Topping (DishOptionModal Dark Mode) */}
            {isOptionModalOpen && optionModalItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
                    <div className="bg-slate-900 border border-white/15 w-full max-w-md rounded-3xl p-6 flex flex-col gap-4 shadow-2xl max-h-[90vh] overflow-hidden">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <div>
                                <h3 className="font-bold text-white text-base">{optionModalItem.name}</h3>
                                <span className="text-xs text-amber-400 font-bold font-mono">
                                    Giá gốc: {optionModalItem.price?.toLocaleString("vi-VN")}đ
                                </span>
                            </div>
                            <button
                                onClick={() => setIsOptionModalOpen(false)}
                                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 py-2 pr-1">
                            {/* Variants Selection */}
                            {optionModalItem.variants && optionModalItem.variants.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                                        1. Chọn Kích Cỡ / Size:
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {optionModalItem.variants.map((v) => {
                                            const isSelected = selectedVariant?.id === v.id;
                                            return (
                                                <button
                                                    key={v.id}
                                                    type="button"
                                                    onClick={() => setSelectedVariant(v)}
                                                    className={`p-3 rounded-2xl border text-left transition-all ${
                                                        isSelected
                                                            ? "bg-amber-400/15 border-amber-400 text-amber-300"
                                                            : "bg-slate-800/80 border-white/10 text-slate-300 hover:bg-slate-800"
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold">{v.name}</span>
                                                        {isSelected && <FaCheck className="text-amber-400 text-xs" />}
                                                    </div>
                                                    <span className="text-xs font-mono font-bold text-amber-400 block mt-1">
                                                        {v.price?.toLocaleString("vi-VN")}đ
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Modifiers Selection */}
                            {optionModalItem.modifierGroups && optionModalItem.modifierGroups.length > 0 && (
                                <div className="space-y-3">
                                    {optionModalItem.modifierGroups.map((group) => (
                                        <div key={group.id}>
                                            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                                                {group.name}:
                                            </h4>
                                            <div className="space-y-1.5">
                                                {group.options.map((opt) => {
                                                    const isSelected = selectedModifiers.some(m => m.id === opt.id);
                                                    return (
                                                        <div
                                                            key={opt.id}
                                                            onClick={() => {
                                                                if (isSelected) {
                                                                    setSelectedModifiers(prev => prev.filter(m => m.id !== opt.id));
                                                                } else {
                                                                    setSelectedModifiers(prev => [...prev, opt]);
                                                                }
                                                            }}
                                                            className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                                                isSelected
                                                                    ? "bg-amber-400/10 border-amber-400 text-amber-300"
                                                                    : "bg-slate-800/60 border-white/5 text-slate-300 hover:bg-slate-800"
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                                                                    isSelected ? "bg-amber-400 border-amber-400 text-slate-950" : "border-slate-600 bg-slate-800"
                                                                }`}>
                                                                    {isSelected && <FaCheck className="text-[10px]" />}
                                                                </div>
                                                                <span className="text-xs font-medium">{opt.name}</span>
                                                            </div>
                                                            <span className="text-xs font-mono font-bold text-amber-400">
                                                                {opt.priceExtra > 0 ? `+${opt.priceExtra.toLocaleString("vi-VN")}đ` : "Miễn phí"}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Notes Input */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                                    Ghi chú cho món ăn:
                                </h4>
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                    {QUICK_NOTES.map(tag => (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => setOptionNote(prev => prev ? `${prev}, ${tag}` : tag)}
                                            className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 border border-white/10 text-slate-300 hover:text-white hover:border-amber-400 transition-all"
                                        >
                                            + {tag}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Ghi chú thêm (ít đá, không hành, v.v.)..."
                                    value={optionNote}
                                    onChange={(e) => setOptionNote(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-xl border border-white/10">
                                <button
                                    onClick={() => setOptionQuantity(prev => Math.max(1, prev - 1))}
                                    className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center"
                                >
                                    <FaMinus className="text-[10px]" />
                                </button>
                                <span className="text-sm font-bold text-white px-2 font-mono">{optionQuantity}</span>
                                <button
                                    onClick={() => setOptionQuantity(prev => prev + 1)}
                                    className="w-6 h-6 rounded bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center"
                                >
                                    <FaPlus className="text-[10px]" />
                                </button>
                            </div>

                            <button
                                onClick={handleConfirmOptionModal}
                                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm transition-all shadow-md flex items-center justify-between"
                            >
                                <span>Thêm vào giỏ</span>
                                <span className="font-mono">
                                    {(((selectedVariant ? selectedVariant.price : optionModalItem.price) + selectedModifiers.reduce((acc, m) => acc + (m.priceExtra || 0), 0)) * optionQuantity).toLocaleString("vi-VN")}đ
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Ghi Chú Riêng (DishNoteModal Dark Mode) */}
            {isNoteModalOpen && noteModalItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
                    <div className="bg-slate-900 border border-white/15 w-full max-w-md rounded-3xl p-6 flex flex-col gap-4 shadow-2xl">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <div>
                                <h3 className="font-bold text-white text-base">{noteModalItem.name}</h3>
                                <span className="text-xs text-amber-400 font-bold font-mono">
                                    {noteModalItem.price?.toLocaleString("vi-VN")}đ
                                </span>
                            </div>
                            <button
                                onClick={() => setIsNoteModalOpen(false)}
                                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-300 block mb-2">Gợi ý ghi chú nhanh:</label>
                            <div className="flex flex-wrap gap-1.5">
                                {QUICK_NOTES.map(tag => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => setCustomNote(prev => prev ? `${prev}, ${tag}` : tag)}
                                        className="text-xs px-3 py-1.5 rounded-full bg-slate-800 border border-white/10 text-slate-300 hover:text-white hover:border-amber-400 transition-all"
                                    >
                                        + {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Ghi chú đặc biệt cho món ăn:</label>
                            <textarea
                                value={customNote}
                                onChange={(e) => setCustomNote(e.target.value)}
                                placeholder="Ví dụ: Ăn chín kỹ, nhiều sốt,..."
                                rows={3}
                                className="w-full text-sm rounded-xl bg-slate-800 border border-white/10 p-3 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 resize-none"
                            />
                        </div>

                        <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                            <button
                                type="button"
                                onClick={() => setIsNoteModalOpen(false)}
                                className="flex-1 py-2.5 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveNote}
                                className="flex-1 py-2.5 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md"
                            >
                                Lưu ghi chú
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cart Drawer (Giỏ Hàng Trượt Dark Mode) */}
            {isCartOpen && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-slate-900 border-l border-white/10 w-full max-w-md h-full flex flex-col justify-between p-6 shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <FaShoppingCart className="text-amber-400 text-lg" />
                                <h3 className="text-lg font-bold text-white">Giỏ Gọi Món ({cartCount})</h3>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Items list */}
                        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3">
                            {cart.length === 0 ? (
                                <div className="text-center py-20 text-slate-500 text-sm">
                                    Giỏ món đang trống. Hãy chọn món để bắt đầu gọi!
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div
                                        key={item.cartItemId}
                                        className="p-3.5 bg-slate-800/80 rounded-2xl border border-white/5 flex items-center justify-between gap-3"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <h4 className="font-semibold text-white text-sm truncate">
                                                {item.name}
                                            </h4>
                                            {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                                                <p className="text-[11px] text-amber-300 font-medium mt-0.5">
                                                    + {item.selectedModifiers.map(m => m.name).join(", ")}
                                                </p>
                                            )}
                                            {item.note && (
                                                <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                                                    📝 Ghi chú: {item.note}
                                                </p>
                                            )}
                                            <span className="text-amber-400 text-xs font-mono font-bold block mt-1">
                                                {(item.unitPrice * item.quantity).toLocaleString("vi-VN")} đ
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 bg-slate-900 px-2.5 py-1.5 rounded-xl border border-white/10 shrink-0">
                                            <button
                                                onClick={() => updateQuantity(item.cartItemId, -1)}
                                                className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center"
                                            >
                                                <FaMinus className="text-[10px]" />
                                            </button>
                                            <span className="text-xs font-bold text-white px-1 font-mono">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.cartItemId, 1)}
                                                className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center"
                                            >
                                                <FaPlus className="text-[10px]" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer với phân tích chi tiết thuế & phí */}
                        <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
                            <div className="space-y-1.5 text-xs text-slate-300">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Tạm tính ({cartCount} món):</span>
                                    <span className="font-mono font-semibold text-white">
                                        {cartSubtotal.toLocaleString("vi-VN")} đ
                                    </span>
                                </div>

                                {taxConfig?.applyServiceCharge && taxConfig?.serviceChargeRate > 0 && (
                                    <div className="flex justify-between items-center text-slate-300">
                                        <span className="text-slate-400">Phí phục vụ ({taxConfig.serviceChargeRate}%):</span>
                                        <span className="font-mono font-semibold text-white">
                                            +{cartServiceFee.toLocaleString("vi-VN")} đ
                                        </span>
                                    </div>
                                )}

                                {taxConfig?.defaultVatRate > 0 && (
                                    <div className="flex justify-between items-center text-slate-300">
                                        <span className="text-slate-400">
                                            Thuế VAT ({taxConfig.defaultVatRate}%):
                                        </span>
                                        <span className="font-mono font-semibold text-white">
                                            {taxConfig.isVatInclusive ? "Đã gồm trong giá" : `+${cartVatAmount.toLocaleString("vi-VN")} đ`}
                                        </span>
                                    </div>
                                )}

                                <div className="border-t border-white/10 pt-2 flex justify-between items-center">
                                    <div>
                                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Tổng tạm tính:</span>
                                        <span className="text-[10px] text-slate-500">Đã bao gồm thuế & phí</span>
                                    </div>
                                    <span className="text-xl font-extrabold text-amber-400 font-mono">
                                        {cartFinalTotal.toLocaleString("vi-VN")} đ
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleSendToKitchen}
                                disabled={cart.length === 0 || isOrdering}
                                className="w-full py-4 mt-1 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:opacity-40 text-slate-950 font-extrabold text-base transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                            >
                                {isOrdering ? "Đang gửi vào bếp..." : "🚀 Gửi Gọi Món Vào Bếp"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Active Order Tracker Drawer (Tiến độ món đã gọi Dark Mode) */}
            {isTrackerOpen && session?.activeOrder && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-slate-900 border-l border-white/10 w-full max-w-md h-full flex flex-col justify-between p-6 shadow-2xl">
                        <div className="flex items-center justify-between pb-4 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <MdOutlineReceiptLong className="text-indigo-400 text-xl" />
                                <div>
                                    <h3 className="text-lg font-bold text-white">Tiến Độ Món Đã Gọi</h3>
                                    <span className="text-xs text-slate-400 font-mono">
                                        Mã đơn: #{session.activeOrder.orderNumber}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsTrackerOpen(false)}
                                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Dishes status list */}
                        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3">
                            {(session.activeOrder.items || []).map((item: any) => {
                                const isQueued = item.status === "QUEUED";
                                const isCancelled = item.status === "CANCELLED";
                                const isPreparing = item.status === "PREPARING";
                                const isReady = item.status === "READY";
                                const isServed = item.status === "SERVED" || item.status === "SERVING";

                                return (
                                    <div
                                        key={item.id}
                                        className={`p-3.5 rounded-2xl border transition-all ${
                                            isCancelled 
                                                ? "bg-slate-900/50 border-white/5 opacity-60" 
                                                : "bg-slate-800/80 border-white/5"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 flex-1">
                                                <h4 className={`font-semibold text-sm ${isCancelled ? "line-through text-slate-400" : "text-white"}`}>
                                                    {item.name}
                                                </h4>
                                                {item.note || item.notes ? (
                                                    <p className="text-[11px] text-amber-300 mt-0.5">
                                                        📝 Ghi chú: {item.note || item.notes}
                                                    </p>
                                                ) : null}
                                                <span className="text-xs text-slate-400 block mt-0.5 font-mono">
                                                    {item.quantity}x • {(item.price || item.unitPrice)?.toLocaleString("vi-VN")} đ
                                                </span>
                                            </div>

                                            {/* Trạng thái chế biến */}
                                            <div className="flex flex-col items-end gap-1.5 shrink-0">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${
                                                    isReady 
                                                        ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                                                        : isServed
                                                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                                        : isPreparing 
                                                        ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                                        : isCancelled
                                                        ? "bg-rose-500/15 text-rose-400 border-rose-500/20"
                                                        : "bg-amber-400/15 text-amber-300 border-amber-400/20"
                                                }`}>
                                                    {isReady ? "✅ Đã xong" : isServed ? "🍽️ Đã lên bàn" : isPreparing ? "⏳ Đang nấu" : isCancelled ? "❌ Đã hủy" : "📝 Đã nhận đơn"}
                                                </span>

                                                {/* NÚT HỦY MÓN KHI CHƯA NẤU (QUEUED) */}
                                                {isQueued && (
                                                    <button
                                                        onClick={() => setCancellingItem({ id: item.id, name: item.name })}
                                                        className="text-[11px] px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-semibold transition-all flex items-center gap-1"
                                                        title="Hủy món ăn nếu lỡ bấm nhầm"
                                                    >
                                                        <FaTimes className="text-[10px]" />
                                                        <span>Hủy món</span>
                                                    </button>
                                                )}

                                                {/* THÔNG BÁO KHÔNG THỂ HỦY KHI ĐANG NẤU / ĐÃ XONG */}
                                                {(isPreparing || isReady || isServed) && (
                                                    <span className="text-[10px] text-slate-500 font-medium italic">
                                                        (Không thể tự hủy)
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Voucher / Mã giảm giá Block */}
                        <div className="pt-3 border-t border-white/10">
                            {(!session.activeOrder.discountAmount || session.activeOrder.discountAmount === 0) ? (
                                <div className="p-3 bg-slate-800/80 rounded-2xl border border-white/10 flex flex-col gap-2">
                                    <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold">
                                        <FaTicketAlt className="text-amber-400" />
                                        <span>Nhập Mã Giảm Giá / Voucher:</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Nhập mã (VD: WELCOME, VIP10)..."
                                            value={promoCodeInput}
                                            onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && promoCodeInput.trim()) {
                                                    applyPromotion({
                                                        restaurantId,
                                                        tableId,
                                                        code: promoCodeInput.trim()
                                                    }, {
                                                        onSuccess: () => setPromoCodeInput("")
                                                    });
                                                }
                                            }}
                                            className="flex-1 px-3 py-2 bg-slate-900 border border-white/15 rounded-xl text-white text-xs font-mono placeholder:text-slate-500 focus:outline-none focus:border-amber-400 uppercase"
                                        />
                                        <button
                                            type="button"
                                            disabled={!promoCodeInput.trim() || isApplyingPromo}
                                            onClick={() => {
                                                applyPromotion({
                                                    restaurantId,
                                                    tableId,
                                                    code: promoCodeInput.trim()
                                                }, {
                                                    onSuccess: () => setPromoCodeInput("")
                                                });
                                            }}
                                            className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-sm shrink-0"
                                        >
                                            {isApplyingPromo ? "Đang áp dụng..." : "Áp dụng"}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/25 flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm shrink-0">
                                            <FaTicketAlt />
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-emerald-300 block">
                                                Đã Áp Dụng Mã Giảm Giá
                                            </span>
                                            <span className="text-[11px] text-slate-400 font-mono">
                                                Tiết kiệm: -{session.activeOrder.discountAmount?.toLocaleString("vi-VN")} đ
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        disabled={isRemovingPromo}
                                        onClick={() => removePromotion({ restaurantId, tableId })}
                                        className="text-[11px] px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-medium transition-all"
                                        title="Gỡ bỏ mã giảm giá"
                                    >
                                        {isRemovingPromo ? "Đang gỡ..." : "Gỡ mã"}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Total & Checkout với đầy đủ chi tiết phí */}
                        <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
                            <div className="space-y-1.5 text-xs text-slate-300">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Tạm tính món ăn:</span>
                                    <span className="font-mono font-semibold text-white">
                                        {session.activeOrder.subtotal?.toLocaleString("vi-VN")} đ
                                    </span>
                                </div>

                                {taxConfig?.applyServiceCharge && taxConfig?.serviceChargeRate > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">Phí phục vụ ({taxConfig.serviceChargeRate}%):</span>
                                        <span className="font-mono font-semibold text-white">
                                            +{Math.round((session.activeOrder.subtotal || 0) * (taxConfig.serviceChargeRate / 100)).toLocaleString("vi-VN")} đ
                                        </span>
                                    </div>
                                )}

                                {taxConfig?.defaultVatRate > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">Thuế VAT ({taxConfig.defaultVatRate}%):</span>
                                        <span className="font-mono font-semibold text-white">
                                            {taxConfig.isVatInclusive 
                                                ? "Đã gồm trong giá" 
                                                : `+${(session.activeOrder.taxAmount || 0).toLocaleString("vi-VN")} đ`}
                                        </span>
                                    </div>
                                )}

                                {session.activeOrder.discountAmount > 0 && (
                                    <div className="flex justify-between items-center text-emerald-400">
                                        <span>Giảm giá ưu đãi:</span>
                                        <span className="font-mono font-bold">
                                            -{(session.activeOrder.discountAmount).toLocaleString("vi-VN")} đ
                                        </span>
                                    </div>
                                )}

                                <div className="border-t border-white/10 pt-2 flex justify-between items-center">
                                    <div>
                                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Tổng thanh toán:</span>
                                        <span className="text-[10px] text-slate-500">Đã gồm thuế, phí & ưu đãi</span>
                                    </div>
                                    <span className="text-2xl font-extrabold text-amber-400 font-mono">
                                        {session.activeOrder.totalAmount?.toLocaleString("vi-VN")} đ
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setIsTrackerOpen(false);
                                    setIsPaymentModalOpen(true);
                                }}
                                className="w-full py-4 mt-1 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-base transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                            >
                                <FaQrcode className="text-lg" />
                                Thanh Toán VietQR Tại Bàn
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment VietQR Modal */}
            {isPaymentModalOpen && session?.activeOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
                    <div className="bg-slate-900 border border-white/15 w-full max-w-sm rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-1">Thanh Toán Tại Bàn</h3>
                        <p className="text-xs text-slate-400 mb-6">
                            Quét mã VietQR bằng bất kỳ ứng dụng ngân hàng hoặc ví điện tử nào
                        </p>

                        <div className="p-4 bg-white rounded-2xl border-4 border-emerald-400 shadow-xl mb-4">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=VIETQR_RESTAURANT_${session.activeOrder.id}_AMOUNT_${session.activeOrder.totalAmount}`}
                                alt="VietQR"
                                className="w-48 h-48 object-contain"
                            />
                        </div>

                        <div className="text-2xl font-extrabold text-amber-400 font-mono mb-2">
                            {session.activeOrder.totalAmount?.toLocaleString("vi-VN")} đ
                        </div>
                        <span className="text-xs text-slate-400 font-mono mb-6">
                            Nội dung CK: {session.activeOrder.orderNumber}
                        </span>

                        <button
                            onClick={() => {
                                setIsPaymentModalOpen(false);
                                toast.success("Cảm ơn quý khách đã thanh toán! Chúc quý khách ngon miệng!");
                            }}
                            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm transition-all"
                        >
                            Đóng cửa sổ
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Xác Nhận Hủy Món */}
            {cancellingItem && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
                    <div className="bg-slate-900 border border-white/15 w-full max-w-sm rounded-3xl p-6 sm:p-7 flex flex-col items-center text-center shadow-2xl">
                        <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mb-4">
                            <FaExclamationTriangle className="text-2xl" />
                        </div>

                        <h3 className="text-lg font-bold text-white mb-1.5">
                            Xác Nhận Hủy Món?
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
                            Quý khách có chắc chắn muốn hủy món <strong className="text-amber-400">"{cancellingItem.name}"</strong> khỏi đơn gọi món không?
                        </p>

                        <div className="grid grid-cols-2 gap-3 w-full">
                            <button
                                type="button"
                                onClick={() => setCancellingItem(null)}
                                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs sm:text-sm transition-all"
                            >
                                Giữ lại món
                            </button>
                            <button
                                type="button"
                                disabled={isCancelling}
                                onClick={() => {
                                    cancelOrderItem(
                                        {
                                            restaurantId,
                                            tableId,
                                            orderItemId: cancellingItem.id,
                                            reason: "Khách hủy trên Tablet Kiosk (Bấm nhầm)"
                                        },
                                        {
                                            onSettled: () => setCancellingItem(null)
                                        }
                                    );
                                }}
                                className="py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-rose-600/30 flex items-center justify-center gap-1.5"
                            >
                                {isCancelling ? "Đang hủy..." : "Xác nhận hủy"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Service Call Bar (Thanh Gọi Phục Vụ Nổi 1 Chạm) */}
            <KioskServiceCallBar
                restaurantId={restaurantId}
                tableId={tableId}
                tableNumber={session?.table?.tableNumber || "N/A"}
            />
        </div>
    );
}
