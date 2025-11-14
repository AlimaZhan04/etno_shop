import {Facebook, Instagram, Twitter} from "lucide-react";
import {Link} from "react-router";
import React from "react";

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-gray-200 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
                    {/* Логотип */}
                    <div>
                        <h2 className="text-xl font-bold text-indigo-400">EthnoKG</h2>
                        <p className="mt-2 text-gray-400 text-sm">
                            Кыргызский этно-магазин сувениров и аксессуаров.
                        </p>
                    </div>

                    {/* Ссылки */}
                    <div className="flex space-x-6">
                        <Link to="/" className="hover:text-indigo-400">
                            Главная
                        </Link>
                        <a href="#" className="hover:text-indigo-400">
                            Категории
                        </a>
                        <Link to="/contacts" className="hover:text-indigo-400">
                            Контакты
                        </Link>
                    </div>

                    {/* Соцсети */}
                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-indigo-400">
                            <Facebook size={20} />
                        </a>
                        <a href="#" className="hover:text-indigo-400">
                            <Instagram size={20} />
                        </a>
                        <a href="#" className="hover:text-indigo-400">
                            <Twitter size={20} />
                        </a>
                    </div>
                </div>

                {/* Копирайт */}
                <div className="mt-8 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} EthnoKG. Все права защищены.
                </div>
            </div>
        </footer>
    );
};

export default Footer;