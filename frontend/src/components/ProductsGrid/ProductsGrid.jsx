import React, {useEffect, useState} from "react";
import axiosInstance from "../../api/axios.js";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/dialog";
import { Slider} from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {ChevronLeft, ChevronRight, ShoppingCart, Trash2, Edit3} from "lucide-react";
import {toast} from "react-hot-toast";
import { Plus, Minus, X } from "lucide-react";
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
import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"

const ProductsGrid = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentImage, setCurrentImage] = useState(0);
    const [minPriceInput, setMinPriceInput] = useState(0);
    const [maxPriceInput, setMaxPriceInput] = useState(10000); // допустим
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const {user, searchText} = useUserStore();
    const [categories, setCategories] = useState([]);
    const [catLoading, setCatLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const { isCartOpen, openCart, closeCart } = useUserStore();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axiosInstance.get("/products");
                setProducts(res.data);

                // автоматически устанавливаем диапазон цен по товарам
                const prices = res.data.map(p => p.price);
                const min = Math.min(...prices);
                const max = Math.max(...prices);
                setMinPriceInput(min);
                setMaxPriceInput(max);
                setPriceRange([min, max]);
            } catch (err) {
                console.error("Ошибка загрузки товаров:", err);
                toast.error("Не удалось загрузить товары");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const fetchCart = async () => {
        if (!user) return;
        try {
            const res = await axiosInstance.get("/cart");
            setCart(res.data.items || []);
        } catch (err) {
            console.error(err);
        }
    };

    // при монтировании подгружаем корзину
    useEffect(() => {
        fetchCart();
    }, [user]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axiosInstance.get("/categories");
                setCategories(res.data);
            } catch (err) {
                console.error("Ошибка при получении категорий:", err);
                toast.error("Не удалось загрузить категории");
            } finally {
                setCatLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const openModal = (product) => {
        setSelectedProduct(product);
        setCurrentImage(0);
    };

    const addToCart = async (productId) => {
        try {
            const res = await axiosInstance.post("/cart/add", { productId, quantity: 1 });
            setCart(res.data.items);
            toast.success("Товар добавлен в корзину");
        } catch (err) {
            console.error(err);
            toast.error("Не удалось добавить товар");
        }
    };

    const updateCartItem = async (productId, newQuantity) => {
        if (newQuantity < 1) return; // нельзя меньше 1
        try {
            const res = await axiosInstance.post("/cart/update", { productId, quantity: newQuantity });
            setCart(res.data.items);
            toast.success("Количество обновлено");
        } catch (err) {
            console.error(err);
            const message = err.response?.data?.message || "Не удалось изменить количество";
            toast.error(message);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const res = await axiosInstance.delete(`/cart/remove/${productId}`);
            setCart(res.data.items);
            toast.success("Товар удалён из корзины");
        } catch (err) {
            console.error(err);
            toast.error("Не удалось удалить товар");
        }
    };

    const clearCart = async () => {
        try {
            const res = await axiosInstance.post("/cart/clear");
            setCart(res.data.items);
            toast.success("Корзина очищена");
        } catch (err) {
            console.error(err);
            toast.error("Не удалось очистить корзину");
        }
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

    const filteredProducts = products.filter(p =>
        (!selectedCategory || p.category?._id === selectedCategory) &&
        p.name.toLowerCase().includes(searchText.toLowerCase()) &&
        p.price >= priceRange[0] &&
        p.price <= priceRange[1]
    )

    if (loading) return <div className="p-4 text-center">Загрузка товаров...</div>;

    return (
        <div className={styles.container}>
            <div className="flex flex-wrap gap-2 mb-4 mt-25">
                {catLoading ? (
                    <div>Загрузка категорий...</div>
                ) : (
                    categories.map(cat => (
                        <Button
                            key={cat._id}
                            variant={selectedCategory === cat._id ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                                setSelectedCategory(selectedCategory === cat._id ? null : cat._id);
                            }}
                        >
                            {cat.name}
                        </Button>
                    ))
                )}
            </div>
            <div className="mb-4 flex items-center gap-4">
                {/* Инпуты */}
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                        <label className="text-sm font-medium text-gray-700 mb-1">Мин</label>
                        <Input
                            type="number"
                            value={minPriceInput}
                            onChange={(e) => {
                                let val = Number(e.target.value);
                                if (val > priceRange[1]) val = priceRange[1];
                                setMinPriceInput(val);
                                setPriceRange([val, priceRange[1]]);
                            }}
                            className="w-24"
                        />
                    </div>
                    <div className="flex flex-col items-center">
                        <label className="text-sm font-medium text-gray-700 mb-1">Макс</label>
                        <Input
                            type="number"
                            value={maxPriceInput}
                            onChange={(e) => {
                                let val = Number(e.target.value);
                                if (val < priceRange[0]) val = priceRange[0];
                                setMaxPriceInput(val);
                                setPriceRange([priceRange[0], val]);
                            }}
                            className="w-24"
                        />
                    </div>
                </div>

                {/* Слайдер */}
                <div className="flex items-center justify-start w-64">
                    <Slider
                        value={priceRange}
                        min={0}
                        max={10000}
                        step={10}
                        onValueChange={(val) => {
                            setPriceRange(val);
                            setMinPriceInput(val[0]);
                            setMaxPriceInput(val[1]);
                        }}
                        className="h-5 w-full"
                    >
                        <div className="relative w-full h-1 bg-gray-300 rounded">
                            <div
                                className="absolute h-1 bg-blue-500 rounded"
                                style={{
                                    left: `${(priceRange[0] / 10000) * 100}%`,
                                    width: `${((priceRange[1] - priceRange[0]) / 10000) * 100}%`
                                }}
                            />
                        </div>
                    </Slider>
                </div>
            </div>


            <div className="p-2 flex flex-wrap justify-start gap-4 mt-5">
                {filteredProducts.map((product) => (
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
                                onClick={() => addToCart(product._id)}
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

                <Drawer  direction="right"
                         open={isCartOpen}
                         onOpenChange={(open) => open ? openCart() : closeCart()}>
                    <DrawerContent className="w-96 ml-auto"> {/* ml-auto → прижать вправо */}
                        <DrawerHeader>
                            <DrawerTitle>Корзина</DrawerTitle>
                        </DrawerHeader>

                        <div className="flex flex-col gap-3 p-4">
                            {cart.length === 0 && <div>Корзина пуста</div>}

                            {cart.map((item) => (
                                <div
                                    key={item.product._id}
                                    className="flex items-center justify-between border p-3 rounded-xl shadow-sm bg-white hover:shadow-md transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={config.IMAGE_BASE_URL + item.product.images[0]}
                                            className="w-16 h-16 object-cover rounded-lg border"
                                            alt={item.product.name}
                                        />
                                        <div className="flex flex-col">
                                            <div className="font-semibold text-gray-800">{item.product.name}</div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="p-1 rounded"
                                                    onClick={() => updateCartItem(item.product._id, item.quantity - 1)}
                                                >
                                                    <Minus size={16} />
                                                </Button>
                                                <span className="px-2 font-medium">{item.quantity}</span>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="p-1 rounded"
                                                    onClick={() => updateCartItem(item.product._id, item.quantity + 1)}
                                                >
                                                    <Plus size={16} />
                                                </Button>
                                            </div>
                                            <div className="text-gray-700 font-medium mt-1">
                                                {item.product.price * item.quantity} сом
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="hover:bg-red-50 rounded-full p-1"
                                        onClick={() => removeFromCart(item.product._id)}
                                    >
                                        <X size={18} className="text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <DrawerFooter className="flex flex-col gap-2">
                            {cart.length > 0 && (
                                <>
                                    <div className="font-bold text-lg">
                                        Итого: {
                                        cart.reduce(
                                            (sum, item) =>
                                                sum + item.product.price * item.quantity,
                                            0
                                        )
                                    } сом
                                    </div>

                                    <Button variant="destructive" onClick={clearCart}>
                                        Очистить корзину
                                    </Button>
                                </>
                            )}
                            <Button onClick={closeCart}>Закрыть</Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </div>
        </div>
    );
};

export default ProductsGrid;
