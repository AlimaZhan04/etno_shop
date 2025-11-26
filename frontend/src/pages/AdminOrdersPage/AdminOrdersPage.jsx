import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axios.js";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, Package, User, Phone, MapPin, DollarSign } from "lucide-react";
import { toast } from "react-hot-toast";

// --- Вспомогательный компонент для отображения одного заказа ---
const AdminOrderCard = ({ order }) => {
    const date = new Date(order.createdAt).toLocaleDateString('ru-RU', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const getPaymentMethodLabel = (method) => {
        switch (method) {
            case 'cash': return 'Наличными';
            case 'card_courier': return 'Картой курьеру';
            case 'card_online': return 'Картой онлайн';
            default: return 'Неизвестно';
        }
    };

    return (
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-blue-50/50 border-b p-4 flex flex-col md:flex-row md:items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-3 mb-2 md:mb-0">
                    <Package size={24} className="text-blue-600" />
                    Заказ №<span className="text-base font-mono break-all">{order._id}</span>
                </CardTitle>
                <div className="text-sm text-gray-600 font-medium whitespace-nowrap">
                    Дата: {date}
                </div>
            </CardHeader>

            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Секция 1: Покупатель и Контакты */}
                <div className="md:col-span-1 space-y-2 border-b md:border-b-0 md:border-r pb-3 md:pr-4">
                    <h3 className="font-semibold text-blue-600 flex items-center gap-2">
                        <User size={16} /> Покупатель
                    </h3>
                    <div className="text-sm">
                        <span className="font-medium">Имя:</span> {order.contactInfo.name}
                    </div>
                    {/* Если вы используете populate('user'), отображаем его данные */}
                    {order.user?.name && (
                        <div className="text-sm">
                            <span className="font-medium">Пользователь:</span> {order.user.name} ({order.user.email})
                        </div>
                    )}
                    <div className="text-sm flex items-center gap-1">
                        <Phone size={14} className="text-gray-500 flex-shrink-0" /> {order.contactInfo.phone}
                    </div>
                    {order.contactInfo.email && (
                        <div className="text-sm">{order.contactInfo.email}</div>
                    )}
                </div>

                {/* Секция 2: Адрес и Оплата */}
                <div className="md:col-span-1 space-y-2 border-b md:border-b-0 md:border-r pb-3 md:pr-4">
                    <h3 className="font-semibold text-blue-600 flex items-center gap-2">
                        <MapPin size={16} /> Доставка и оплата
                    </h3>
                    <div className="text-sm break-words">
                        <span className="font-medium">Адрес:</span> {order.shippingAddress}
                    </div>
                    <div className="text-sm flex items-center gap-1 font-medium">
                        <DollarSign size={14} className="text-gray-500 flex-shrink-0" /> {getPaymentMethodLabel(order.paymentMethod)}
                    </div>
                </div>

                {/* Секция 3: Товары и Сумма */}
                <div className="md:col-span-1 space-y-2">
                    <h3 className="font-semibold text-blue-600 flex items-center gap-2">
                        <DollarSign size={16} /> Сумма
                    </h3>
                    <div className="text-sm font-bold text-2xl text-green-600">
                        {order.totalAmount} сом
                    </div>

                    <div className="text-xs text-gray-500 pt-2 border-t max-h-24 overflow-y-auto">
                        <span className="font-medium text-gray-700 block mb-1">Товары:</span>
                        {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between">
                                <span className="truncate mr-1">{item.name}</span>
                                <span className="flex-shrink-0 whitespace-nowrap">({item.quantity} шт.)</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// --- Основной компонент страницы Администратора ---
const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAllOrders = async () => {
        try {
            const res = await axiosInstance.get("/orders/all");
            setOrders(res.data);
        } catch (err) {
            console.error("Ошибка при загрузке всех заказов:", err);
            toast.error("Не удалось загрузить список заказов.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 mt-15">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-blue-700">
                <Package size={30} /> Все заказы (Администратор)
            </h1>

            {loading ? (
                <div className="text-center p-10 text-xl text-gray-600">
                    <Loader2 className="animate-spin inline mr-3" /> Загрузка всех заказов...
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center p-10 text-xl text-gray-500">
                    На данный момент оформленных заказов нет.
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <AdminOrderCard key={order._id} order={order} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminOrdersPage;