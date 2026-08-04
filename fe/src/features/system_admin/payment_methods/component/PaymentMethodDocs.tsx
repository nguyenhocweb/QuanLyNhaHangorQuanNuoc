"use client";
import React from 'react';
import FadeIn from "@/src/core/components/animation/FadeIn";
import { FiBookOpen, FiKey, FiTool, FiCheckCircle, FiChevronRight, FiCreditCard } from "react-icons/fi";
import { Button } from "@/src/core/components/ui";
import { useRouter } from 'next/navigation';

export function PaymentMethodDocs() {
    const router = useRouter();

    const [activeTab, setActiveTab] = React.useState('vnpay');

    const providers = [
        { id: 'vnpay', name: 'VNPay', icon: <FiCreditCard className="text-blue-500" /> },
        { id: 'momo', name: 'Momo', icon: <FiCreditCard className="text-pink-500" /> },
        { id: 'payos', name: 'PayOS', icon: <FiCreditCard className="text-green-500" /> },
    ];

    return (
        <FadeIn className="w-full flex flex-col gap-6 max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <FiBookOpen className="text-2xl" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Hướng Dẫn Cấu Hình Thanh Toán</h2>
                        <p className="text-sm text-gray-500 mt-1">Các bước chi tiết để thiết lập từng cổng thanh toán</p>
                    </div>
                </div>
                <Button 
                    variant="outline" 
                    onClick={() => router.push('/system/payment-methods')}
                    className="flex items-center gap-2 rounded-xl border-gray-200"
                >
                    Quay lại danh sách
                </Button>
            </div>

            {/* Content Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left side: Main Content */}
                <div className="md:col-span-8 space-y-6">
                    
                    {/* Tabs */}
                    <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex gap-2">
                        {providers.map(p => (
                            <button 
                                key={p.id}
                                onClick={() => setActiveTab(p.id)}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                                    activeTab === p.id 
                                    ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100/50' 
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                }`}
                            >
                                {p.icon}
                                {p.name}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                        
                        {/* VNPay Content */}
                        {activeTab === 'vnpay' && (
                            <FadeIn>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-full -z-10"></div>
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="text-blue-600">VNPay</span> - Hướng dẫn tích hợp
                                </h3>
                                
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-gray-800 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">1</span> Đăng ký Sandbox</h4>
                                        <p className="text-sm text-gray-600 pl-8">Truy cập <a href="https://sandbox.vnpayment.vn/devreg/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">sandbox.vnpayment.vn/devreg</a> và đăng ký tài khoản nhà phát triển. Sau khi đăng ký thành công, check email để lấy thông tin kết nối.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-gray-800 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">2</span> Lấy thông số API</h4>
                                        <div className="pl-8 text-sm text-gray-600 space-y-2">
                                            <p>Trong email hoặc trang quản lý Sandbox, bạn sẽ nhận được:</p>
                                            <ul className="list-disc ml-4 space-y-1 marker:text-blue-400">
                                                <li><strong>TmnCode (Terminal ID):</strong> Mã website (VD: GHX72IJA)</li>
                                                <li><strong>HashSecret:</strong> Chuỗi bí mật tạo checksum (VD: ASDASDASDASDASDASDASDASDASD)</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-gray-800 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">3</span> Cấu hình JSON trên hệ thống</h4>
                                        <p className="text-sm text-gray-600 pl-8 mb-2">Thêm phương thức VNPay trên hệ thống với JSON sau:</p>
                                        <div className="pl-8">
                                            <pre className="bg-gray-900 text-gray-300 text-xs p-4 rounded-xl overflow-x-auto">
{`{
  "tmnCode": "YOUR_TMN_CODE",
  "hashSecret": "YOUR_HASH_SECRET",
  "vnpUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  "vnpApi": "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
  "returnUrl": "http://localhost:3000/api/v1/payment/vnpay/callback"
}`}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        )}

                        {/* Momo Content */}
                        {activeTab === 'momo' && (
                            <FadeIn>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50/50 rounded-bl-full -z-10"></div>
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="text-pink-600">Momo</span> - Hướng dẫn tích hợp
                                </h3>
                                
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-gray-800 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs">1</span> Đăng ký Doanh nghiệp</h4>
                                        <p className="text-sm text-gray-600 pl-8">Truy cập <a href="https://business.momo.vn/" target="_blank" rel="noreferrer" className="text-pink-600 hover:underline">business.momo.vn</a> để tạo tài khoản doanh nghiệp. MoMo cung cấp môi trường Sandbox mặc định cho developer.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-gray-800 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs">2</span> Lấy thông số API</h4>
                                        <div className="pl-8 text-sm text-gray-600 space-y-2">
                                            <p>Truy cập mục <strong>Tích hợp thanh toán</strong> để lấy:</p>
                                            <ul className="list-disc ml-4 space-y-1 marker:text-pink-400">
                                                <li><strong>Partner Code:</strong> Mã đối tác (VD: MOMOXXXX)</li>
                                                <li><strong>Access Key:</strong> Khóa truy cập</li>
                                                <li><strong>Secret Key:</strong> Khóa bí mật tạo chữ ký (Signature)</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-gray-800 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs">3</span> Cấu hình JSON trên hệ thống</h4>
                                        <p className="text-sm text-gray-600 pl-8 mb-2">Thêm phương thức Momo trên hệ thống với JSON sau:</p>
                                        <div className="pl-8">
                                            <pre className="bg-gray-900 text-gray-300 text-xs p-4 rounded-xl overflow-x-auto">
{`{
  "partnerCode": "YOUR_PARTNER_CODE",
  "accessKey": "YOUR_ACCESS_KEY",
  "secretKey": "YOUR_SECRET_KEY",
  "endpoint": "https://test-payment.momo.vn/v2/gateway/api/create",
  "redirectUrl": "http://localhost:3000/api/v1/payment/momo/callback",
  "ipnUrl": "http://localhost:3000/api/v1/payment/momo/ipn"
}`}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        )}

                        {/* PayOS Content */}
                        {activeTab === 'payos' && (
                            <FadeIn>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-green-50/50 rounded-bl-full -z-10"></div>
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="text-green-600">PayOS</span> - Hướng dẫn tích hợp
                                </h3>
                                
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-gray-800 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">1</span> Đăng ký tài khoản</h4>
                                        <p className="text-sm text-gray-600 pl-8">Truy cập <a href="https://payos.vn/" target="_blank" rel="noreferrer" className="text-green-600 hover:underline">payos.vn</a> tạo tài khoản. Tạo mới một Kênh thanh toán trong Dashboard.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-gray-800 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">2</span> Cấu hình Webhook & Lấy API Key</h4>
                                        <div className="pl-8 text-sm text-gray-600 space-y-2">
                                            <p>Trong mục cài đặt Kênh thanh toán:</p>
                                            <ul className="list-disc ml-4 space-y-1 marker:text-green-400">
                                                <li>Copy <strong>Client ID</strong>, <strong>API Key</strong>, và <strong>Checksum Key</strong>.</li>
                                                <li>Thiết lập Webhook URL trỏ về API của hệ thống (VD: <code>/api/v1/payment/payos/webhook</code>).</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-gray-800 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">3</span> Cấu hình JSON trên hệ thống</h4>
                                        <p className="text-sm text-gray-600 pl-8 mb-2">Thêm phương thức PayOS với định dạng JSON sau:</p>
                                        <div className="pl-8">
                                            <pre className="bg-gray-900 text-gray-300 text-xs p-4 rounded-xl overflow-x-auto">
{`{
  "clientId": "YOUR_CLIENT_ID",
  "apiKey": "YOUR_API_KEY",
  "checksumKey": "YOUR_CHECKSUM_KEY",
  "returnUrl": "http://localhost:3000/api/v1/payment/payos/callback",
  "cancelUrl": "http://localhost:3000/api/v1/payment/payos/cancel"
}`}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        )}

                    </div>
                </div>

                {/* Right side: Summary & Tips */}
                <div className="md:col-span-4 space-y-6">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl text-white shadow-md">
                        <div className="flex items-center gap-2 mb-3">
                            <FiTool className="text-xl opacity-90" />
                            <h3 className="font-semibold">Lưu ý bảo mật</h3>
                        </div>
                        <ul className="text-sm space-y-3 opacity-90">
                            <li className="flex items-start gap-2">
                                <FiChevronRight className="mt-1 flex-shrink-0" />
                                <span>Tuyệt đối không chia sẻ <strong>Secret/Checksum Key</strong> ra bên ngoài.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <FiChevronRight className="mt-1 flex-shrink-0" />
                                <span>Môi trường Sandbox không bị trừ tiền thật. Hãy dùng tài khoản test của cổng thanh toán.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </FadeIn>
    );
}
