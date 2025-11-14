import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Mail, Phone, Clock, MapPin, Instagram, MessageCircle } from "lucide-react";

const ContactsPage = () => {
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <Card className="bg-white shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="bg-blue-50 p-6">
                    <CardTitle className="text-3xl font-bold text-blue-700">
                        Контакты
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 flex flex-col gap-6 text-gray-700">

                    {/* Электронная почта */}
                    <div className="flex items-center gap-3">
                        <Mail size={24} className="text-blue-500" />
                        <div>
                            <h4 className="font-semibold">Электронная почта</h4>
                            <p>testemail@gmai.com</p>
                            <p className="text-sm text-gray-500">Для вопросов по заказам и сотрудничеству</p>
                        </div>
                    </div>

                    {/* Телефон */}
                    <div className="flex items-center gap-3">
                        <Phone size={24} className="text-green-500" />
                        <div>
                            <h4 className="font-semibold">Телефон</h4>
                            <p>+996 505 31 08 91 (WhatsApp)</p>
                            <p className="text-sm text-gray-500">Консультации по продуктам и заказам</p>
                        </div>
                    </div>

                    {/* Адрес */}
                    <div className="flex items-center gap-3">
                        <MapPin size={24} className="text-red-500" />
                        <div>
                            <h4 className="font-semibold">Адрес магазина</h4>
                            <p>г. Бишкек, ул. Советская 123</p>
                            <p className="text-sm text-gray-500">
                                Приглашаем посетить наш шоурум и ознакомиться с национальными подарками
                            </p>
                        </div>
                    </div>

                    {/* Рабочее время */}
                    <div className="flex items-center gap-3">
                        <Clock size={24} className="text-orange-500" />
                        <div>
                            <h4 className="font-semibold">Рабочее время</h4>
                            <p>Пн-Сб: 10:00 - 20:00</p>
                            <p>Вс: выходной</p>
                        </div>
                    </div>

                    {/* Соцсети */}
                    <div className="flex items-center gap-3">
                        <Instagram size={24} className="text-pink-500" />
                        <div>
                            <h4 className="font-semibold">Instagram</h4>
                            <p className="text-blue-500">@ethno.market</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <MessageCircle size={24} className="text-teal-500" />
                        <div>
                            <h4 className="font-semibold">Telegram</h4>
                            <p className="text-blue-500">@ethno_market</p>
                        </div>
                    </div>

                    {/* Отделы / направления */}
                    <div>
                        <h4 className="font-semibold mb-2">Направления</h4>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                            <li>Национальные сувениры</li>
                            <li>Традиционные украшения</li>
                            <li>Домашний декор</li>
                            <li>Подарочные наборы</li>
                        </ul>
                    </div>

                    {/* Карта (ссылка) */}
                    <div className="mt-4">
                        <a
                            href="https://www.google.com/maps?q=Этно-магазин+Ethno.Market+Бишкек"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline flex items-center gap-2"
                        >
                            <MapPin size={20} /> Посмотреть на карте
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ContactsPage;
