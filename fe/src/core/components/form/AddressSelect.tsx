import React, { useState, useEffect } from 'react';

interface Province {
    code: number;
    name: string;
    districts: District[];
}

interface District {
    code: number;
    name: string;
    wards: Ward[];
}

interface Ward {
    code: number;
    name: string;
}

interface AddressSelectProps {
    value?: {
        provinceCode?: string;
        province?: string;
        districtCode?: string;
        district?: string;
        wardCode?: string;
        ward?: string;
        street?: string;
    };
    onChange: (value: any) => void;
}

const AddressSelect: React.FC<AddressSelectProps> = ({ value, onChange }) => {
    const [provinces, setProvinces] = useState<Province[]>([]);
    
    // Derived state based on the current value prop
    const selectedProvince = provinces.find((x: any) => x.code.toString() === value?.provinceCode) || null;
    const selectedDistrict = selectedProvince?.districts?.find((x: any) => x.code.toString() === value?.districtCode) || null;

    useEffect(() => {
        // Load data from local JSON
        fetch('/data/vietnam_provinces.json')
            .then(res => res.json())
            .then(data => {
                setProvinces(data);
            })
            .catch(err => console.error("Error loading provinces:", err));
    }, []);

    // Auto-detect codes if only names are provided (backward compatibility)
    useEffect(() => {
        const provinceName = value?.province || (value as any)?.city;
        if (provinces.length > 0 && provinceName && !value?.provinceCode) {
            const p = provinces.find(x => x.name === provinceName);
            if (p) {
                const d = p.districts?.find(x => x.name === value?.district);
                const w = d?.wards?.find(x => x.name === value?.ward);
                
                onChange({
                    ...value,
                    provinceCode: p.code.toString(),
                    province: p.name,
                    districtCode: d ? d.code.toString() : "",
                    wardCode: w ? w.code.toString() : ""
                });
            }
        }
    }, [provinces, value?.province, (value as any)?.city, value?.provinceCode]);

    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        const p = provinces.find(x => x.code.toString() === code) || null;
        
        onChange({
            ...value,
            provinceCode: code,
            province: p ? p.name : "",
            districtCode: "",
            district: "",
            wardCode: "",
            ward: ""
        });
    };

    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        const d = selectedProvince?.districts?.find(x => x.code.toString() === code) || null;
        
        onChange({
            ...value,
            districtCode: code,
            district: d ? d.name : "",
            wardCode: "",
            ward: ""
        });
    };

    const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        const w = selectedDistrict?.wards?.find(x => x.code.toString() === code) || null;
        
        onChange({
            ...value,
            wardCode: code,
            ward: w ? w.name : ""
        });
    };

    const handleStreetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({
            ...value,
            street: e.target.value
        });
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Tỉnh / Thành phố</label>
                    <select
                        value={value?.provinceCode || ""}
                        onChange={handleProvinceChange}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    >
                        <option value="">Chọn Tỉnh/Thành</option>
                        {provinces.map(p => (
                            <option key={p.code} value={p.code.toString()}>{p.name}</option>
                        ))}
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Quận / Huyện</label>
                    <select
                        value={value?.districtCode || ""}
                        onChange={handleDistrictChange}
                        disabled={!selectedProvince}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-slate-50 disabled:text-slate-400"
                    >
                        <option value="">Chọn Quận/Huyện</option>
                        {selectedProvince?.districts?.map(d => (
                            <option key={d.code} value={d.code.toString()}>{d.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phường / Xã</label>
                    <select
                        value={value?.wardCode || ""}
                        onChange={handleWardChange}
                        disabled={!selectedDistrict}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-slate-50 disabled:text-slate-400"
                    >
                        <option value="">Chọn Phường/Xã</option>
                        {selectedDistrict?.wards?.map(w => (
                            <option key={w.code} value={w.code.toString()}>{w.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Số nhà, Tên đường</label>
                <input 
                    type="text" 
                    value={value?.street || ""}
                    onChange={handleStreetChange}
                    placeholder="VD: 123 Nguyễn Văn Linh..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
            </div>
        </div>
    );
};

export default AddressSelect;
