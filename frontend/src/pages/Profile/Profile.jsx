// import React, { useState, useEffect } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { User as UserIcon, Lock, Save, LogOut } from "lucide-react";
// import useUserStore from "@/store/user.js";
// import { toast } from "react-hot-toast";
// import axiosInstance from "@/api/axios.js";
// import {useNavigate} from "react-router";
//
// const ProfilePage = () => {
//     const navigate = useNavigate();
//     const { user, setUser, logout } = useUserStore();
//     const [name, setName] = useState("");
//     const [password, setPassword] = useState("");
//     const [loading, setLoading] = useState(false);
//
//     // Подгружаем имя при старте
//     useEffect(() => {
//         if (user) setName(user.name);
//     }, [user]);
//
//     const handleSave = async () => {
//         if (!name.trim()) {
//             toast.error("Имя не может быть пустым");
//             return;
//         }
//
//         setLoading(true);
//         try {
//             const res = await axiosInstance.put("/auth/update", { name, password });
//             // API возвращает объект: { user: {...} }
//             if (res.data && res.data.user) {
//                 setUser(res.data.user); // обновляем store
//                 toast.success("Профиль обновлён");
//                 setPassword(""); // очищаем поле пароля
//             } else {
//                 toast.error("Не удалось обновить профиль");
//             }
//         } catch (err) {
//             console.error(err);
//             toast.error(err.response?.data?.message || "Не удалось обновить профиль");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     if (!user) {
//         return (
//             <div className="flex justify-center items-center h-[70vh]">
//                 <span className="text-gray-500">Загрузка профиля...</span>
//             </div>
//         );
//     }
//
//     return (
//         <div className="max-w-3xl mx-auto p-6">
//             <Card className="bg-white shadow-xl rounded-2xl overflow-hidden">
//                 <CardHeader className="flex items-center gap-4 bg-blue-50 p-6">
//                     <UserIcon size={40} className="text-blue-500" />
//                     <CardTitle className="text-3xl font-bold">{user.name}</CardTitle>
//                 </CardHeader>
//                 <CardContent className="p-6 flex flex-col gap-6">
//                     {/* Email */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                         <Input value={user.email} disabled className="bg-gray-100 cursor-not-allowed" />
//                     </div>
//
//                     {/* Имя */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
//                         <Input value={name} onChange={(e) => setName(e.target.value)} />
//                     </div>
//
//                     {/* Пароль */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Новый пароль</label>
//                         <Input
//                             type="password"
//                             value={password}
//                             placeholder="Введите новый пароль"
//                             onChange={(e) => setPassword(e.target.value)}
//                         />
//                     </div>
//
//                     {/* Кнопки */}
//                     <div className="flex justify-between mt-4">
//                         <Button
//                             variant="outline"
//                             onClick={() => {
//                                 logout()
//                                 navigate("/login")
//                             }}
//                             className="flex items-center gap-2"
//                         >
//                             <LogOut size={16} />
//                             Выйти
//                         </Button>
//                         <Button
//                             onClick={handleSave}
//                             className="flex items-center gap-2"
//                             disabled={loading}
//                         >
//                             <Save size={16} />
//                             {loading ? "Сохраняем..." : "Сохранить"}
//                         </Button>
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// };
//
// export default ProfilePage;

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User as UserIcon, Save, LogOut, Package } from "lucide-react";
import useUserStore from "@/store/user.js";
import { toast } from "react-hot-toast";
import axiosInstance from "@/api/axios.js";
import { useNavigate } from "react-router";

// --- Компонент для отображения одного заказа ---
const OrderCard = ({ order }) => {
    // Форматирование даты
    const date = new Date(order.createdAt).toLocaleDateString('ru-RU', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <Card className="mb-4 border-gray-200 shadow-md">
            <CardHeader className="bg-gray-50 border-b p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-base sm:text-lg font-semibold text-gray-800 flex flex-col sm:flex-row sm:items-center gap-2 mb-2 sm:mb-0">
                    <Package size={20} className="text-blue-500 flex-shrink-0" />
                    {/* Полный ID заказа (теперь не обрезаем) */}
                    <span className="text-xs font-mono break-all sm:text-base">Заказ №{order._id}</span>
                </CardTitle>
                <span className="text-xs sm:text-sm text-gray-500">{date}</span>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
                {/* Элементы заказа */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm border-b last:border-b-0 pb-1">
                            <span className="text-gray-600 truncate mr-2 flex-grow min-w-0">
                                {item.name}
                            </span>
                            <span className="flex-shrink-0 text-gray-700 font-medium whitespace-nowrap">
                                {item.quantity} шт. × {item.priceAtPurchase} сом
                            </span>
                        </div>
                    ))}
                </div>

                {/* Итого и Адрес */}
                <div className="pt-2 border-t mt-3">
                    <div className="flex justify-between items-center font-bold text-lg text-black mb-2">
                        <span>Итого:</span>
                        <span className="flex items-center gap-1 text-blue-600 whitespace-nowrap">
                            {order.totalAmount} сом
                        </span>
                    </div>
                    <div className="text-sm text-gray-600 break-words"> {/* break-words для длинного адреса */}
                        <span className="font-semibold">Адрес:</span> {order.shippingAddress}
                    </div>
                    <div className="text-sm text-gray-600">
                        <span className="font-semibold">Оплата:</span>{" "}
                        {order.paymentMethod === 'cash' ? 'Наличными курьеру' :
                            order.paymentMethod === 'card_courier' ? 'Картой курьеру' :
                                'Картой онлайн'}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// --- Основной компонент Профиля ---
const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, setUser, logout } = useUserStore();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);

    // Подгружаем имя при старте
    useEffect(() => {
        if (user) setName(user.name);
    }, [user]);

    // Функция для загрузки заказов
    const fetchOrders = async () => {
        if (!user) return;
        try {
            const res = await axiosInstance.get("/orders/my");
            setOrders(res.data);
        } catch (err) {
            console.error("Ошибка при загрузке заказов:", err);
            toast.error("Не удалось загрузить историю заказов.");
        } finally {
            setOrdersLoading(false);
        }
    };

    // Загрузка заказов при монтировании
    useEffect(() => {
        fetchOrders();
    }, [user]);

    const handleSave = async () => {
        if (!name.trim()) {
            toast.error("Имя не может быть пустым");
            return;
        }

        setLoading(true);
        try {
            const res = await axiosInstance.put("/auth/update", { name, password });
            if (res.data && res.data.user) {
                setUser(res.data.user);
                toast.success("Профиль обновлён");
                setPassword("");
            } else {
                toast.error("Не удалось обновить профиль");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Не удалось обновить профиль");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <span className="text-gray-500">Загрузка профиля...</span>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 1. Карточка профиля */}
            <div className="lg:col-span-1">
                {/* Убрал 'sticky top-6' на маленьких экранах (мобильный вид, grid-cols-1)
                    и включил его только на lg и выше (lg:sticky lg:top-6)
                */}
                <Card className="bg-white shadow-xl rounded-2xl overflow-hidden lg:sticky lg:top-6">
                    <CardHeader className="flex items-center gap-4 bg-blue-50 p-6">
                        <UserIcon size={40} className="text-blue-500" />
                        <CardTitle className="text-3xl font-bold">{user.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 flex flex-col gap-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <Input value={user.email} disabled className="bg-gray-100 cursor-not-allowed" />
                        </div>

                        {/* Имя */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} />
                        </div>

                        {/* Пароль */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Новый пароль</label>
                            <Input
                                type="password"
                                value={password}
                                placeholder="Введите новый пароль"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Кнопки */}
                        <div className="flex justify-between mt-4">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    logout()
                                    navigate("/login")
                                }}
                                className="flex items-center gap-2"
                            >
                                <LogOut size={16} />
                                Выйти
                            </Button>
                            <Button
                                onClick={handleSave}
                                className="flex items-center gap-2"
                                disabled={loading}
                            >
                                <Save size={16} />
                                {loading ? "Сохраняем..." : "Сохранить"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 2. Карточка заказов */}
            <div className="lg:col-span-2">
                <Card className="bg-white shadow-xl rounded-2xl">
                    <CardHeader className="bg-gray-100 p-6">
                        <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                            <Package size={24} className="text-blue-600" />
                            Мои заказы
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                        {ordersLoading ? (
                            <div className="text-center text-gray-500">Загрузка заказов...</div>
                        ) : orders.length === 0 ? (
                            <div className="text-center text-gray-500">
                                У вас пока нет оформленных заказов.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <OrderCard key={order._id} order={order} />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ProfilePage;