import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User as UserIcon, Lock, Save, LogOut } from "lucide-react";
import useUserStore from "@/store/user.js";
import { toast } from "react-hot-toast";
import axiosInstance from "@/api/axios.js";
import {useNavigate} from "react-router";

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, setUser, logout } = useUserStore();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Подгружаем имя при старте
    useEffect(() => {
        if (user) setName(user.name);
    }, [user]);

    const handleSave = async () => {
        if (!name.trim()) {
            toast.error("Имя не может быть пустым");
            return;
        }

        setLoading(true);
        try {
            const res = await axiosInstance.put("/auth/update", { name, password });
            // API возвращает объект: { user: {...} }
            if (res.data && res.data.user) {
                setUser(res.data.user); // обновляем store
                toast.success("Профиль обновлён");
                setPassword(""); // очищаем поле пароля
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
        <div className="max-w-3xl mx-auto p-6">
            <Card className="bg-white shadow-xl rounded-2xl overflow-hidden">
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
    );
};

export default ProfilePage;
