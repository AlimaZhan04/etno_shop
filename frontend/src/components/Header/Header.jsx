import React from "react";
import { ShoppingCart, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useUserStore from "@/store/user.js";
import { Link, useNavigate } from "react-router";
import { ShoppingBag } from 'lucide-react';

const Header = () => {
    const { user, searchText, setSearchText, toggleCart } = useUserStore();
    const navigate = useNavigate();

    return (
        <header className="bg-white shadow-md fixed top-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Лого */}
                    <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate("/")}>
                        <h1 className="text-xl font-bold text-indigo-700">EtnoKG</h1>
                    </div>

                    {/* Поиск + кнопки */}
                    <div className="flex items-center space-x-2">

                        <Input
                            type="text"
                            placeholder="Поиск..."
                            className="w-32 sm:w-64"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />

                        {/* Admin */}
                        {user?.role === "user" && (
                            <>
                                <Link to="/create-product" className="hidden sm:flex ml-2">
                                    <Button variant="outline">
                                        <Plus size={16} />
                                        <span>Создать товар</span>
                                    </Button>
                                </Link>
                                <Link to="/create-product" className="flex sm:hidden ml-2">
                                    <Button variant="outline" className="p-2">
                                        <Plus size={20} />
                                    </Button>
                                </Link>
                            </>
                        )}

                        {/* CART BUTTON */}
                        <Button
                            variant="ghost"
                            className="p-2 relative"
                            onClick={toggleCart}
                        >
                            <ShoppingCart size={20} />
                        </Button>

                        {/* Admin po idee*/}
                        {user?.role === 'user' && (
                            <Button
                                variant="ghost"
                                className="p-2 relative"
                                onClick={() => navigate("/admin-orders")}
                            >
                                <ShoppingBag size={20} />
                            </Button>
                        )}

                        {/* User */}
                        <Button variant="ghost" className="p-2" onClick={() => navigate("/profile")}>
                            <User size={20} />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
