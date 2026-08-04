import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MdClose } from 'react-icons/md';
import { reservationFormSchema, ReservationFormValues } from '../schema/reservation.schema';
import { Reservation } from '../type/reservation.type';
import { useCreateReservation } from '../hook/useCreateReservation';
import { useUpdateReservation } from '../hook/useUpdateReservation';
import { Div } from '@/src/core/components/ui/Div';
import { Input } from '@/src/core/components/ui/Input';
import { Label } from '@/src/core/components/ui/Label';
import { Select } from '@/src/core/components/ui/Select';
import { Button } from '@/src/core/components/ui/Button';

import { useCheckTableAvailability } from '../hook/useCheckTableAvailability';
import useDebounce from '@/src/core/hooks/useDebounce';
import { TableAreaTabs } from '../../tables/component/TableAreaTabs';
import { FloorPlanViewer } from '../../tables/component/FloorPlanViewer';
import { TableType, TableOperationalStatus } from '../../tables/type/table.type';
import { toast } from 'sonner';

interface ReservationFormModalProps {
    open: boolean;
    onClose: () => void;
    restaurantId: string;
    editingReservation?: Reservation | null;
}

export const ReservationFormModal = ({ open, onClose, restaurantId, editingReservation }: ReservationFormModalProps) => {
    const { mutate: createReservation, isPending: isCreating } = useCreateReservation(restaurantId);
    const { mutate: updateReservation, isPending: isUpdating } = useUpdateReservation(restaurantId);
    const checkAvailability = useCheckTableAvailability(restaurantId);
    const isPending = isCreating || isUpdating;

    const { register, handleSubmit, formState: { errors, dirtyFields }, reset, watch, setValue } = useForm<ReservationFormValues>({
        resolver: zodResolver(reservationFormSchema) as any,
        defaultValues: {
            source: 'WALK_IN',
            occasion: 'NORMAL',
            party_size: 2,
            reservation_date: new Date(),
            table_ids: []
        }
    });

    const watchDate = watch('reservation_date');
    const watchStartTime = watch('start_time');
    const watchEndTime = watch('end_time');
    const watchPartySize = watch('party_size');
    const watchTableIds = watch('table_ids') || [];

    const debouncedDate = useDebounce({ value: watchDate ? new Date(watchDate).toISOString() : '', delay: 500 });
    const debouncedStartTime = useDebounce({ value: watchStartTime || '', delay: 500 });
    const debouncedEndTime = useDebounce({ value: watchEndTime || '', delay: 500 });
    const debouncedPartySize = useDebounce({ value: watchPartySize ? watchPartySize.toString() : '2', delay: 500 });

    const [activeAreaId, setActiveAreaId] = useState<string>('');

    // Auto-calculate end_time = start_time + 4 hours if user hasn't manually changed it
    useEffect(() => {
        if (watchStartTime && !dirtyFields.end_time && !editingReservation) {
            const [hours, minutes] = watchStartTime.split(':').map(Number);
            if (!isNaN(hours) && !isNaN(minutes)) {
                const endHours = (hours + 4) % 24;
                const newEndTime = `${String(endHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                setValue('end_time', newEndTime, { shouldValidate: true, shouldDirty: false });
            }
        }
    }, [watchStartTime, dirtyFields.end_time, editingReservation, setValue]);

    useEffect(() => {
        if (open) {
            if (editingReservation) {
                reset({
                    guest_name: editingReservation.guest_name,
                    guest_phone: editingReservation.guest_phone,
                    guest_email: editingReservation.guest_email || '',
                    party_size: editingReservation.party_size,
                    reservation_date: new Date(editingReservation.reservation_date),
                    start_time: editingReservation.start_time,
                    end_time: editingReservation.end_time || '',
                    source: editingReservation.source,
                    occasion: editingReservation.occasion,
                    special_requests: editingReservation.special_requests || '',
                    internal_notes: editingReservation.internal_notes || '',
                    table_ids: editingReservation.reservation_tables?.map(rt => rt.tableId) || []
                });
            } else {
                reset({
                    guest_name: '',
                    guest_phone: '',
                    guest_email: '',
                    party_size: 2,
                    reservation_date: new Date(),
                    start_time: '',
                    end_time: '',
                    source: 'PHONE',
                    occasion: 'NORMAL',
                    special_requests: '',
                    internal_notes: '',
                    table_ids: []
                });
            }
        }
    }, [open, editingReservation, reset]);

    useEffect(() => {
        if (debouncedDate && debouncedStartTime) {
            const dateObj = new Date(debouncedDate);
            // Lấy YYYY-MM-DD
            const formattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
            
            checkAvailability.mutate({
                reservation_date: formattedDate,
                start_time: debouncedStartTime,
                end_time: debouncedEndTime,
                party_size: parseInt(debouncedPartySize, 10)
            }, {
                onSuccess: (res) => {
                    if (res.metadata && res.metadata.length > 0 && !activeAreaId) {
                        setActiveAreaId(res.metadata[0].id);
                    }
                }
            });
        }
    }, [debouncedDate, debouncedStartTime, debouncedEndTime, debouncedPartySize]);

    const handleTableClick = (table: TableType) => {
        // Không cho phép chọn bàn nếu bàn đang bận (IN_USE / RESERVED / MAINTENANCE)
        // Lưu ý: Nếu bàn đó ĐÃ LÀ của reservation này (editing), thì vẫn cho phép
        const isEditingThisTable = editingReservation?.reservation_tables?.some(rt => rt.tableId === table.id);
        const currentIds = [...(watch('table_ids') || [])];
        const isCurrentlySelected = currentIds.includes(table.id);
        
        if (table.operational_status !== TableOperationalStatus.AVAILABLE && !isEditingThisTable && !isCurrentlySelected) {
            toast.error(`Bàn ${table.table_number} đã được đặt hoặc không sẵn sàng trong khung giờ này.`);
            return;
        }

        if (isCurrentlySelected) {
            setValue('table_ids', currentIds.filter(id => id !== table.id), { shouldValidate: true, shouldDirty: true });
        } else {
            setValue('table_ids', [...currentIds, table.id], { shouldValidate: true, shouldDirty: true });
        }
    };

    const onSubmit = (data: ReservationFormValues) => {
        if (editingReservation) {
            updateReservation({ id: editingReservation.id, data }, {
                onSuccess: () => onClose()
            });
        } else {
            createReservation(data, {
                onSuccess: () => onClose()
            });
        }
    };

    if (!open) return null;

    const areas = checkAvailability.data?.metadata || [];

    // Tùy chỉnh màu bàn trong Viewer dựa trên state table_ids (chọn thì xanh dương)
    let renderArea = areas.find(a => a.id === activeAreaId);
    if (renderArea) {
        renderArea = {
            ...renderArea,
            tables: renderArea.tables.map(t => {
                const isEditingThisTable = editingReservation?.reservation_tables?.some(rt => rt.tableId === t.id);
                if (watchTableIds.includes(t.id)) {
                    return { ...t, operational_status: TableOperationalStatus.IN_USE }; // Hack color to blue
                }
                if (t.operational_status !== TableOperationalStatus.AVAILABLE && !isEditingThisTable) {
                    return { ...t, operational_status: TableOperationalStatus.RESERVED }; // Yellow
                }
                return { ...t, operational_status: TableOperationalStatus.AVAILABLE }; // Green
            })
        };
    }

    return (
        <div className="fixed inset-0 z-[60] flex justify-center items-center bg-black/40 backdrop-blur-sm transition-all duration-300 p-4">
            <div className="w-full max-w-6xl bg-white h-[90vh] shadow-2xl flex flex-col rounded-2xl overflow-hidden animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {editingReservation ? "Chỉnh sửa đơn đặt bàn" : "Tạo đơn đặt bàn mới"}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">Vui lòng điền thông tin và chọn bàn trực tiếp trên sơ đồ</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <MdClose className="text-xl" />
                    </button>
                </div>

                {/* Content: 2 columns */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Left Col: Form */}
                    <form id="reservation-form" onSubmit={handleSubmit(onSubmit)} className="w-1/3 min-w-[350px] border-r border-gray-100 overflow-y-auto p-6 space-y-5 bg-gray-50/30">
                        <Div vitri="col_none" shape="none">
                            <Label>Tên khách hàng <span className="text-red-500 ml-1">*</span></Label>
                            <Input {...register("guest_name")} placeholder="VD: Nguyễn Văn A" className="w-full bg-white" />
                            {errors.guest_name && <span className="text-red-500 text-sm">{errors.guest_name.message}</span>}
                        </Div>

                        <div className="grid grid-cols-2 gap-4">
                            <Div vitri="col_none" shape="none">
                                <Label>Số điện thoại <span className="text-red-500 ml-1">*</span></Label>
                                <Input {...register("guest_phone")} placeholder="VD: 0912345678" className="w-full bg-white" />
                                {errors.guest_phone && <span className="text-red-500 text-sm">{errors.guest_phone.message}</span>}
                            </Div>
                            <Div vitri="col_none" shape="none">
                                <Label>Email</Label>
                                <Input {...register("guest_email")} placeholder="Email (nếu có)" className="w-full bg-white" />
                                {errors.guest_email && <span className="text-red-500 text-sm">{errors.guest_email.message}</span>}
                            </Div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Div vitri="col_none" shape="none">
                                <Label>Ngày đến <span className="text-red-500 ml-1">*</span></Label>
                                <Input type="date" {...register("reservation_date", { valueAsDate: true })} className="w-full bg-white" />
                                {errors.reservation_date && <span className="text-red-500 text-sm">{errors.reservation_date.message}</span>}
                            </Div>
                            <Div vitri="col_none" shape="none">
                                <Label>Số người <span className="text-red-500 ml-1">*</span></Label>
                                <Input type="number" {...register("party_size", { valueAsNumber: true })} className="w-full bg-white" />
                                {errors.party_size && <span className="text-red-500 text-sm">{errors.party_size.message}</span>}
                            </Div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Div vitri="col_none" shape="none">
                                <Label>Giờ đến <span className="text-red-500 ml-1">*</span></Label>
                                <Input type="time" {...register("start_time")} className="w-full bg-white" />
                                {errors.start_time && <span className="text-red-500 text-sm">{errors.start_time.message}</span>}
                            </Div>
                            <Div vitri="col_none" shape="none">
                                <Label>Giờ đi <span className="text-red-500 ml-1">*</span></Label>
                                <Input type="time" {...register("end_time")} className="w-full bg-white" />
                                {errors.end_time && <span className="text-red-500 text-sm">{errors.end_time.message}</span>}
                            </Div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Div vitri="col_none" shape="none">
                                <Label>Nguồn đặt</Label>
                                <Select {...register("source")} className="w-full h-11 border border-gray-300 rounded-lg text-gray-700 bg-white">
                                    <option value="WALK_IN">Khách vãng lai</option>
                                    <option value="PHONE">Gọi điện thoại</option>
                                    <option value="WEB">Website</option>
                                    <option value="MOBILE">App Mobile</option>
                                </Select>
                            </Div>
                            <Div vitri="col_none" shape="none">
                                <Label>Dịp đặc biệt</Label>
                                <Select {...register("occasion")} className="w-full h-11 border border-gray-300 rounded-lg text-gray-700 bg-white">
                                    <option value="NORMAL">Bình thường</option>
                                    <option value="BIRTHDAY">Sinh nhật</option>
                                    <option value="ANNIVERSARY">Kỷ niệm</option>
                                    <option value="BUSINESS">Công việc</option>
                                    <option value="DATE">Hẹn hò</option>
                                </Select>
                            </Div>
                        </div>

                        <Div vitri="col_none" shape="none">
                            <Label>Yêu cầu đặc biệt</Label>
                            <textarea 
                                {...register("special_requests")} 
                                className="w-full border border-gray-300 rounded-lg p-3 min-h-[80px] outline-none focus:border-indigo-500 bg-white text-gray-700 text-sm" 
                                placeholder="VD: Xin ghế trẻ em, dị ứng hải sản..."
                            ></textarea>
                        </Div>

                        <Div vitri="col_none" shape="none">
                            <Label>Ghi chú nội bộ</Label>
                            <textarea 
                                {...register("internal_notes")} 
                                className="w-full border border-gray-300 bg-amber-50 rounded-lg p-3 min-h-[80px] outline-none focus:border-indigo-500 text-gray-700 text-sm" 
                                placeholder="Khách VIP, cần chăm sóc kỹ..."
                            ></textarea>
                        </Div>
                    </form>

                    {/* Right Col: Floor Plan */}
                    <div className="flex-1 p-6 flex flex-col bg-white overflow-y-auto">
                        <div className="flex items-center justify-between mb-4 shrink-0">
                            <h3 className="text-lg font-bold text-gray-800">Chọn bàn ({watchTableIds.length} bàn đã chọn)</h3>
                            
                            <Div className="flex items-center gap-4" shape="none">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-400"></div><span className="text-sm text-gray-600">Trống</span></div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-400"></div><span className="text-sm text-gray-600">Đã đặt</span></div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-500 ring-2 ring-indigo-200"></div><span className="text-sm text-gray-600 font-bold">Đang chọn</span></div>
                            </Div>
                        </div>

                        {!watchDate || !watchStartTime ? (
                            <div className="flex-1 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400">
                                <div className="text-4xl mb-3">📅</div>
                                <p>Vui lòng chọn Ngày đến và Giờ đến để xem bàn trống</p>
                            </div>
                        ) : checkAvailability.isPending ? (
                            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                                <p className="text-gray-500 animate-pulse">Đang tìm bàn trống...</p>
                            </div>
                        ) : areas.length === 0 ? (
                            <div className="flex-1 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400">
                                <p>Nhà hàng hiện chưa có sơ đồ bàn nào.</p>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col overflow-hidden gap-4">
                                <TableAreaTabs 
                                    areas={areas} 
                                    activeAreaId={activeAreaId} 
                                    onChange={setActiveAreaId} 
                                />
                                {renderArea && (
                                    <div className="flex-1 min-h-0">
                                        <FloorPlanViewer 
                                            area={renderArea}
                                            onTableClick={handleTableClick}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 shrink-0">
                    <Button type="button" variant="gray" onClick={onClose} className="px-6 py-2.5 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-gray-700 font-semibold border border-gray-300">
                        Hủy
                    </Button>
                    <Button 
                        type="submit" 
                        form="reservation-form"
                        disabled={isPending} 
                        variant="green"
                        className="px-8 py-2.5 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 border-none"
                    >
                        {isPending ? "Đang lưu..." : (editingReservation ? "Cập nhật đơn đặt bàn" : "Tạo đơn đặt bàn")}
                    </Button>
                </div>
            </div>
        </div>
    );
};
