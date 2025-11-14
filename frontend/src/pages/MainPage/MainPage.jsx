import Header from "@/components/Header/Header.jsx";
import { Heart } from "lucide-react";
import {Button} from "@/components/ui/button.jsx";

const products = [
    {
        _id: "1",
        name: "Сувенирная кукла",
        price: 1500,
        quantity: 10,
        image: "https://via.placeholder.com/300x300?text=Кукла",
    },
    {
        _id: "2",
        name: "Кыргызский браслет",
        price: 800,
        quantity: 25,
        image: "https://via.placeholder.com/300x300?text=Браслет",
    },
    {
        _id: "3",
        name: "Традиционный шарф",
        price: 1200,
        quantity: 15,
        image: "https://via.placeholder.com/300x300?text=Шарф",
    },
    {
        _id: "4",
        name: "Национальная сумка",
        price: 2000,
        quantity: 5,
        image: "https://via.placeholder.com/300x300?text=Сумка",
    },
    {
        _id: "5",
        name: "Этно серьги",
        price: 600,
        quantity: 30,
        image: "https://via.placeholder.com/300x300?text=Серьги",
    },
];

import React from "react";
import { Facebook, Instagram, Twitter } from "lucide-react";

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
                        <a href="#" className="hover:text-indigo-400">
                            Главная
                        </a>
                        <a href="#" className="hover:text-indigo-400">
                            Категории
                        </a>
                        <a href="#" className="hover:text-indigo-400">
                            О нас
                        </a>
                        <a href="#" className="hover:text-indigo-400">
                            Контакты
                        </a>
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


const ProductGrid = ({ products }) => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products?.map((product) => (
                    <div
                        key={product._id}
                        className="border rounded-lg shadow-sm hover:shadow-lg transition p-4 flex flex-col"
                    >
                        <div className="h-48 w-full mb-4 bg-gray-100 flex items-center justify-center overflow-hidden rounded">
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="object-cover h-full w-full"
                                />
                            ) : (
                                <span className="text-gray-400">Нет изображения</span>
                            )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                        <p className="text-gray-600 mt-1">Цена: {product.price} сом</p>
                        <p className="text-gray-500 text-sm">В наличии: {product.quantity}</p>
                        <div className="mt-auto flex justify-between items-center">
                            <Button size="sm">В корзину</Button>
                            <Heart size={20} className="text-red-500 cursor-pointer" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const MainPage = () => {
    return (
        <div>
            <Header/>
            <ProductGrid products={products} />

            <Footer/>
        </div>
    );
};

export default MainPage;
