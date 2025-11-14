import React from "react";
import { ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
    return (
        <header className="bg-white shadow-md fixed top-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Логотип */}
                    <div className="flex-shrink-0">
                        <h1 className="text-xl font-bold text-indigo-700">EthnoKG</h1>
                    </div>

                    {/* Меню */}
                    <nav className="hidden md:flex space-x-6">
                        <a href="#" className="text-gray-700 hover:text-indigo-700">
                            Сувениры
                        </a>
                        <a href="#" className="text-gray-700 hover:text-indigo-700">
                            Аксессуары
                        </a>
                        <a href="#" className="text-gray-700 hover:text-indigo-700">
                            Одежда
                        </a>
                        <a href="#" className="text-gray-700 hover:text-indigo-700">
                            Украшения
                        </a>
                    </nav>

                    {/* Поиск + кнопки */}
                    <div className="flex items-center space-x-4">
                        <Input
                            type="text"
                            placeholder="Поиск..."
                            className="hidden sm:block w-64"
                        />
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
