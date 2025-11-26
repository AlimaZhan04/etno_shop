import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axiosInstance from "../../api/axios.js";
import useUserStore from "@/store/user.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import config from '../../api/config.js';
import { ShoppingCart, CheckCircle, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea"; // Нужен этот импорт для поля комментария
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Нужен этот импорт для радио-кнопок

// --- Компонент страницы оплаты ---
const CheckoutPage = () => {
    const navigate = useNavigate();
    const { user } = useUserStore();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    // Состояние формы для контактных данных
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        address: '',
        phone: '',
        comment: '',
        paymentMethod: 'cash' // Устанавливаем способ оплаты по умолчанию
    });

    // 1. Загрузка данных корзины при монтировании
    const fetchCart = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            const res = await axiosInstance.get("/cart");
            const items = res.data.items || [];
            if (items.length === 0) {
                toast.error("Корзина пуста. Добавьте товары для оформления заказа.");
                navigate('/');
            }
            setCart(items);
        } catch (err) {
            console.error(err);
            toast.error("Не удалось загрузить корзину.");
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user, navigate]);

    // Обработчик изменения полей формы
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            toast.error("Нечего заказывать. Корзина пуста.");
            return;
        }

        if (!formData.name || !formData.address || !formData.phone || !formData.paymentMethod) {
            toast.error("Пожалуйста, заполните все обязательные поля.");
            return;
        }

        setIsProcessing(true);
        try {
            const orderData = {
                shippingAddress: formData.address,
                contactInfo: {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone
                },
                paymentMethod: formData.paymentMethod,
                // Поле 'comment' исключено, так как вы его удалили из модели.
                // Бэкенд сам берет товары из корзины.
            };

            const res = await axiosInstance.post("/orders", orderData); // POST запрос на /api/orders

            // Контроллер сам очищает корзину на бэкенде.
            // Очищаем локальное состояние, чтобы обновить UI
            setCart([]);

            toast.success(`✅ Заказ №${res.data.orderId} успешно оформлен! Вы можете просмотреть его в вашем профиле.`);

        } catch (err) {
            console.error("Ошибка оформления заказа:", err);
            const message = err.response?.data?.message || "Не удалось оформить заказ. Попробуйте позже.";
            toast.error(message);
        } finally {
            setIsProcessing(false);
        }
    };

    const totalAmount = cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    if (loading) {
        return <div className="p-8 text-center"><Loader2 className="animate-spin inline mr-2" /> Загрузка корзины...</div>;
    }

    // Если корзина пуста после загрузки (или после успешного заказа)
    if (cart.length === 0 && !loading) {
        return (
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-center mt-20">
                <h1 className="text-3xl font-bold mb-4">Корзина пуста</h1>
                <p className="mb-6">Вы успешно оформили заказ, или ваша корзина еще не содержит товаров.</p>
                <Button onClick={() => navigate('/')}>Перейти к покупкам</Button>
            </div>
        );
    }

    // Если корзина пуста, но страница не должна отображаться (во время перехода)
    if (cart.length === 0) return null;

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 mt-15">
            <h1 className="text-3xl font-bold mb-6 flex items-center" style={{fontFamily: 'Comfortaa, cursive'}}>
                <ShoppingCart className="mr-3 h-8 w-8 text-blue-600"/> Оформление заказа
            </h1>

            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 1. Контактная информация и Адрес Доставки */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Контактные данные и Доставка */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Контактные данные и доставка</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Имя и фамилия *</Label>
                                    <Input id="name" required value={formData.name} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={formData.email} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Номер телефона *</Label>
                                <Input id="phone" type="tel" required value={formData.phone} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Адрес доставки *</Label>
                                <Input id="address" required placeholder="Город, улица, дом, квартира" value={formData.address} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="comment">Комментарий к заказу (необязательно)</Label>
                                <Textarea id="comment" placeholder="Пожелания, особенности доставки..." value={formData.comment} onChange={handleInputChange} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Выбор Способа Оплаты */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Способ оплаты *</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup
                                defaultValue={formData.paymentMethod}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
                                className="space-y-3"
                            >
                                <div className="flex items-center space-x-2 p-3 border rounded-lg transition hover:bg-gray-50">
                                    <RadioGroupItem value="cash" id="cash" />
                                    <Label htmlFor="cash" className="font-medium cursor-pointer">
                                        Наличными курьеру
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 p-3 border rounded-lg transition hover:bg-gray-50">
                                    <RadioGroupItem value="card_online" id="card_online" disabled />
                                    <Label htmlFor="card_online" className="font-medium text-gray-400">
                                        Картой онлайн (временно недоступно)
                                    </Label>
                                </div>
                            </RadioGroup>
                        </CardContent>
                    </Card>
                </div>

                {/* 2. Обзор заказа (Сайдбар) */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ваш заказ</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                            {cart.map((item) => (
                                <div key={item.product._id} className="flex items-center justify-between border-b pb-2 last:border-b-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={config.IMAGE_BASE_URL + item.product.images[0]}
                                            className="w-12 h-12 object-cover rounded-md"
                                            alt={item.product.name}
                                        />
                                        <div>
                                            <div className="font-medium text-sm">{item.product.name}</div>
                                            <div className="text-xs text-gray-500">
                                                {item.quantity} шт. × {item.product.price} сом
                                            </div>
                                        </div>
                                    </div>
                                    <div className="font-semibold text-gray-800">
                                        {item.product.price * item.quantity} сом
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter className="flex flex-col pt-4">
                            <div className="flex justify-between w-full font-bold text-lg mb-4">
                                <span>ИТОГО:</span>
                                <span>{totalAmount} сом</span>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-lg"
                                disabled={isProcessing || cart.length === 0}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Обработка...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="mr-2 h-5 w-5" />
                                        Подтвердить заказ
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </form>
        </div>
    );
};

export default CheckoutPage;