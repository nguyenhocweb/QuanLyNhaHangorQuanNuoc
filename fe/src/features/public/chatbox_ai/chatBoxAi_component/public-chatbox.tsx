'use client'
import { useState, useRef, useEffect } from "react"
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store"
import { BsRobot } from "react-icons/bs";
import { publicChatBoxAiHook } from "../chatBoxAi_hook/public_chatbox_hook";
import LoadingAi from "@/src/core/components/layout/public-loandig-chatAi";
import ReactMarkdown from 'react-markdown';
import { IoClose } from "react-icons/io5";
const ChatBoxAi = () => {

    const [openChat, setOpenChat] = useState(false)
    const getUser = useAuthStore(s => s.user)
    const [mes, setMes] = useState([
        {
            role: "ai",
            message: `xin chào ${getUser?.name ?? "bạn"}! Bạn cần hỗ trợ gì?`
        }
    ]);

    const { mutate: sendMes, isPending } = publicChatBoxAiHook()

    const messagesEndRef = useRef<HTMLDivElement>(null)
    // Hàm tự động cuộn xuống tin nhắn mới nhất
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom() // trượt theo tin nhắm       
    }, [mes])

    const [mesInput, setMesInput] = useState("");
    const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
        // Ngăn chặn hành vi load lại trang mặc định của form
        e.preventDefault();
        if (mesInput === "" || null) return
        const newMesArray = [...mes, { role: "user", message: mesInput }];
        setMes((prev) => [...prev, { role: "user", message: mesInput }]);
        setMesInput("");
        sendMes({
            mes: newMesArray,
            question: mesInput
        }, {
            onSuccess: (data: string) => {
                // Cập nhật thêm tin nhắn của AI vào mảng
                setMes((prev) => [...prev, { role: "ai", message: data }]);
            }
        })

    }
    return (
        <>
            {
                !openChat ?
                    <button
                        onClick={() => setOpenChat(!openChat)}
                        className="fixed bottom-5 right-5 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center text-xl hover:scale-110 transition"
                    >
                        <BsRobot className="text-2xl text-white" />
                    </button>
                    :
                    <div className="fixed bottom-10 right-10 flex flex-col w-full max-w-md h-[500px] border border-gray-200 rounded-2xl shadow-xl bg-white overflow-hidden font-sans">

                        {/* --- Phần Header --- */}
                        <button
                            onClick={() => setOpenChat(!openChat)}
                            className=" absolute right-2 top-2 z-100 cursor-pointer text-white hover:text-black"
                        >
                            <IoClose className="text-3xl" />
                        </button>
                        <div className="bg-blue-600 text-white p-4 flex items-center justify-between shadow-sm z-10">
                            <div className="flex items-center gap-3">
                                {/* Avatar Bot */}
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold">
                                    <BsRobot className="text-2xl text-red-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base">Trợ lý ảo AI</h3>
                                    <p className="text-xs text-blue-100 flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
                                        Đang hoạt động
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* --- Phần Body (Hiển thị tin nhắn) --- */}
                        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4">
                            {mes.map((item, index) => (
                                <div
                                    key={index}
                                    className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${item.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-br-sm' // Tin nhắn User (màu xanh, bên phải)
                                            : 'bg-white text-gray-800 border border-gray-200 shadow-sm rounded-bl-sm' // Tin nhắn Bot (màu trắng xám, bên trái)
                                            }`}
                                    >
                                        <ReactMarkdown>{item.message}</ReactMarkdown>
                                    </div>
                                </div>
                            ))}

                            {/* đang loading */}
                            {
                                isPending &&

                                <LoadingAi />

                            }
                            {/* Dummy div để scroll xuống cuối */}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* --- Phần Footer (Nhập tin nhắn) --- */}
                        <form onSubmit={handleForm} className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
                            <input
                                value={mesInput}
                                onChange={(e) => { setMesInput(e.target.value) }}
                                type="text"
                                placeholder="Hỏi tôi bất cứ điều gì..."
                                className="flex-1 px-4 py-2.5 bg-gray-100 text-sm border-transparent rounded-full focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {/* Icon Gửi (SVG) */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-1">
                                    <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                                </svg>
                            </button>
                        </form>
                    </div>
            }
        </>
    )
}
export default ChatBoxAi