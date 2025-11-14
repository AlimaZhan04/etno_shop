import React, {useEffect, useState} from "react";
import axiosInstance from "../../api/axios.js";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {ChevronLeft, ChevronRight, ShoppingCart, Trash2, Edit3} from "lucide-react";
import {toast} from "react-hot-toast";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction
} from "@/components/ui/alert-dialog";
import config from '../../api/config.js';
import useUserStore from "@/store/user.js";
import styles from './ProductsGrid.module.scss';
import {useNavigate} from "react-router";

const ProductsGrid = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentImage, setCurrentImage] = useState(0);
    const {user} = useUserStore();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axiosInstance.get("/products");
                setProducts(res.data);
            } catch (err) {
                console.error("Ошибка загрузки товаров:", err);
                toast.error("Не удалось загрузить товары");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const openModal = (product) => {
        setSelectedProduct(product);
        setCurrentImage(0);
    };

    const closeModal = () => setSelectedProduct(null);
    const nextImage = () => setCurrentImage((prev) => (prev + 1) % selectedProduct.images.length);
    const prevImage = () => setCurrentImage((prev) => (prev - 1 + selectedProduct.images.length) % selectedProduct.images.length);

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/products/${id}`);
            setProducts(products.filter(p => p._id !== id));
            toast.success("Товар успешно удалён");
        } catch (err) {
            console.error("Ошибка удаления товара:", err);
            toast.error("Не удалось удалить товар");
        }
    };

    if (loading) return <div className="p-4 text-center">Загрузка товаров...</div>;

    return (
        <div className={styles.container}>
            <div className="p-2 flex flex-wrap justify-start gap-4 mt-25">
                {products.map((product) => (
                    <Card
                        key={product._id}
                        className="cursor-pointer hover:shadow-xl transition-all duration-300 flex flex-col max-w-xs border border-gray-200 rounded-xl overflow-hidden bg-white relative"
                    >
                        {/* Иконка удаления */}
                        {user?.role === 'user' && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <button
                                        className="absolute top-2 right-2 p-1 bg-white/50 rounded-full hover:bg-white/70 transition"
                                        title="Удалить товар"
                                    >
                                        <Trash2 size={18} className="text-black opacity-70"/>
                                    </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Вы действительно хотите удалить товар <b>{product.name}</b>? Это действие
                                            нельзя будет отменить.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <div className="flex justify-end gap-2 mt-4">
                                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => handleDelete(product._id)}>Удалить</AlertDialogAction>
                                    </div>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                        {user?.role === 'user' && (
                            <button
                                className="absolute top-2 right-10 p-1 bg-white/50 rounded-full hover:bg-white/70 transition"
                                title="Редактировать товар"
                                onClick={() => navigate(`/edit-product/${product._id}`)}
                            >
                                <Edit3 size={18} className="text-black opacity-70"/>
                            </button>
                        )}

                        {/* Название над картинкой */}
                        <CardHeader className="px-3 pt-2 pb-1">
                            <CardTitle
                                className="text-base sm:text-lg font-bold text-black text-center leading-tight opacity-90"
                                style={{fontFamily: 'Comfortaa, cursive'}}
                            >
                                {product.name}
                            </CardTitle>
                        </CardHeader>

                        {/* Изображение на всю ширину */}
                        <div onClick={() => openModal(product)} className="flex-1">
                            <img
                                src={config.IMAGE_BASE_URL + product.images[0]}
                                alt={product.name}
                                className="w-full h-48 sm:h-52 object-cover bg-gray-50"
                            />
                        </div>

                        {/* Цена */}
                        <CardContent className="flex flex-col items-center py-2 px-3">
                            <div className="text-black font-bold text-base opacity-85"
                                 style={{fontFamily: 'Comfortaa, cursive'}}>
                                {product.price} сом
                            </div>
                        </CardContent>

                        {/* Кнопка корзины */}
                        <div className="px-3 pb-3">
                            <Button
                                variant="outline"
                                className="w-full flex items-center justify-center space-x-2 text-black border-black hover:bg-black hover:text-white"
                                style={{fontFamily: 'Comfortaa, cursive'}}
                            >
                                <ShoppingCart size={16}/>
                                <span>Добавить в корзину</span>
                            </Button>
                        </div>
                    </Card>
                ))}

                {/* Модалка с мини-каруселью */}
                {selectedProduct && (
                    <Dialog open={!!selectedProduct} onOpenChange={closeModal}>
                        <DialogContent className="max-w-3xl p-4 max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle
                                    className="text-lg sm:text-xl font-bold opacity-90"
                                    style={{fontFamily: 'Comfortaa, cursive'}}
                                >
                                    {selectedProduct.name}
                                </DialogTitle>
                                <DialogDescription
                                    className="text-sm opacity-80"
                                    style={{fontFamily: 'Comfortaa, cursive'}}
                                >
                                    {selectedProduct.description}
                                </DialogDescription>
                            </DialogHeader>

                            {/* Основная карусель */}
                            <div className="relative mt-4 w-full h-96 flex items-center justify-center">
                                <div
                                    className="w-full h-full bg-white rounded-xl shadow-lg flex items-center justify-center overflow-hidden">
                                    <img
                                        src={config.IMAGE_BASE_URL + selectedProduct.images[currentImage]}
                                        alt={`${selectedProduct.name} ${currentImage + 1}`}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full shadow-lg"
                                    onClick={prevImage}
                                >
                                    <ChevronLeft size={24}/>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full shadow-lg"
                                    onClick={nextImage}
                                >
                                    <ChevronRight size={24}/>
                                </Button>
                            </div>

                            {/* Мини-карусель */}
                            <div
                                className="mt-2 flex gap-2 overflow-x-auto px-1 py-1 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                                {selectedProduct.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImage(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden transition-transform relative
                                        ${index === currentImage
                                            ? 'border-2 border-blue-500 scale-105'
                                            : 'border border-gray-300'}`}
                                    >
                                        <div
                                            className="w-full h-full bg-white shadow-md rounded-md overflow-hidden flex items-center justify-center">
                                            <img
                                                src={config.IMAGE_BASE_URL + img}
                                                alt={`thumb-${index}`}
                                                className={`w-full h-full object-cover transition-all duration-200
                                                ${index !== currentImage ? 'opacity-95 blur-[0.5px]' : ''}`}
                                                style={{fontFamily: 'Comfortaa, cursive'}}
                                            />
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-4 flex justify-end">
                                <Button
                                    onClick={closeModal}
                                    variant="outline"
                                    style={{fontFamily: 'Comfortaa, cursive'}}
                                >
                                    Закрыть
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </div>
    );
};

export default ProductsGrid;
