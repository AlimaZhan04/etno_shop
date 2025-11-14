import React from "react";
import { ShoppingCart, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useUserStore from "@/store/user.js";
import {Link, useNavigate} from "react-router"; // исправил на react-router-dom

const Header = () => {
    const { user } = useUserStore();
    const navigate = useNavigate();

    return (
        <header className="bg-white shadow-md fixed top-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Логотип */}
                    <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate("/")}>
                        <h1 className="text-xl font-bold text-indigo-700">EthnoKG</h1>
                    </div>

                    {/* Поиск + кнопки */}
                    <div className="flex items-center space-x-2">
                        <Input
                            type="text"
                            placeholder="Поиск..."
                            className="w-32 sm:w-64"
                        />

                        {/* Админ ссылка */}
                        {user?.role === "user" && (
                            <>
                                {/* Десктоп: иконка + текст */}
                                <Link to="/create-product" className="hidden sm:flex ml-2">
                                    <Button variant="outline" className="items-center space-x-1">
                                        <Plus size={16} />
                                        <span>Создать товар</span>
                                    </Button>
                                </Link>

                                {/* Мобильный: только иконка */}
                                <Link to="/create-product" className="flex sm:hidden ml-2">
                                    <Button variant="outline" className="p-2">
                                        <Plus size={20} />
                                    </Button>
                                </Link>
                            </>
                        )}

                        <Button variant="ghost" className="p-2">
                            <ShoppingCart size={20} />
                        </Button>
                        <Button variant="ghost" className="p-2">
                            <User size={20} />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
