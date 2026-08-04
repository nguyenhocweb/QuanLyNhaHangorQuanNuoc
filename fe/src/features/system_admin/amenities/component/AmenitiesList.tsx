"use client";
import React, { useState } from "react";
import { Div, Button, Input, H, P } from "@/src/core/components/ui";
import { FiSearch, FiEdit2, FiTrash2, FiPlus, FiList } from "react-icons/fi";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { useAmenities, useDeleteAmenity } from "../hook/useAmenity_hook";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";
import CreateAmenityForm from "./CreateAmenityForm";
import UpdateAmenityForm from "./UpdateAmenityForm";
import { AMENITY_ICONS } from "../constants/amenity_icons";

const AmenitiesList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const { data: listData, isLoading } = useAmenities({ page, limit: 10, search });
  const { mutate: deleteMutation, isPending: isDeleting } = useDeleteAmenity();

  const items = listData?.data || [];

  return (
    <FadeIn delay={0.2} className="w-full mt-6">
      <Div vitri="col_none" variant="bg_white" className="gap-y-6 !p-6 md:!p-8 !rounded-3xl border border-gray-100 shadow-sm" size="full">
        <Div className="w-full justify-between flex-wrap gap-4 items-center border-b border-gray-50 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500 text-white flex items-center justify-center text-xl shadow-sm shadow-indigo-200"><FiList /></div>
            <div>
              <H variant="text_black" className="text-xl md:text-2xl font-bold text-gray-900">Quản lý Ti�!n ích</H>
              <P className="text-sm text-gray-500 mt-1">Danh sách các ti�!n ích chuẩn (VD: Wifi, Bãi �� xe) cho nhà hàng chọn lựa</P>
            </div>
          </div>
          <Button onClick={() => setIsCreateOpen(true)} variant="default" shape="square" sizea="p4_2" className="flex items-center whitespace-nowrap gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white shadow-md shadow-indigo-200 transition-all">
            <FiPlus className="text-lg" /> Thêm ti�!n ích m�:i
          </Button>
        </Div>

        <div className="flex gap-4">
          <div className="relative max-w-sm w-full">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Tìm kiếm..." 
              value={search} 
              onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
              className="pl-10 !rounded-xl !bg-gray-50 border-transparent focus:!bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all w-full" 
            />
          </div>
        </div>

        <div className="w-full overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-100 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl">Tên ti�!n ích</th>
                <th className="px-6 py-4">Mô tả</th>
                <th className="px-6 py-4 rounded-tr-xl w-32 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {items.map((item: any) => (
                <tr key={item.id} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      {item.icon && <span className="text-xl text-indigo-500">{AMENITY_ICONS[item.icon] || item.icon}</span>}
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{item.description || "Không có"}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button onClick={() => { setSelected(item); setIsUpdateOpen(true); }} variant="outline" sizea="p2_1" className="!w-8 !h-8 !p-0 !min-h-0 flex items-center justify-center rounded-lg text-blue-500 border-blue-200 hover:bg-blue-50">
                        <FiEdit2 className="text-sm" />
                      </Button>
                      <Button onClick={() => { setSelected(item); setIsDeleteOpen(true); }} variant="outline" sizea="p2_1" className="!w-8 !h-8 !p-0 !min-h-0 flex items-center justify-center rounded-lg text-red-500 border-red-200 hover:bg-red-50">
                        <FiTrash2 className="text-sm" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">Không có dữ li�!u</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Div>
      
      {isCreateOpen && <CreateAmenityForm isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />}
      {isUpdateOpen && <UpdateAmenityForm isOpen={isUpdateOpen} onClose={() => setIsUpdateOpen(false)} initialData={selected} />}
      {isDeleteOpen && (
        <ConfirmModal
          open={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={() => {
            deleteMutation(selected.id);
            setIsDeleteOpen(false);
          }}
          title="Xác nhận xóa"
          content={`Bạn có chắc chắn mu�n xóa "${selected?.name}"? Hành ��"ng này không thỒ hoàn tác.`}
          confirmText="Xóa"
          cancelText="Hủy"
        />
      )}
    </FadeIn>
  );
};

export default AmenitiesList;
