import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axios.js";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, ImagePlus, Loader2 } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router";
import config from "@/api/config.js";

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        name: "",
        price: "",
        quantity: "",
        description: "",
        category: "",
    });

    const [oldImages, setOldImages] = useState([]); // уже загруженные картинки
    const [newImages, setNewImages] = useState([]); // новые файлы
    const [preview, setPreview] = useState([]); // для отображения превью
    const [loading, setLoading] = useState(false);

    const [categories, setCategories] = useState([]);
    const [catLoading, setCatLoading] = useState(true);

    // Получение категорий
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

    // Получение данных товара
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axiosInstance.get(`/products/${id}`);
                const data = res.data;
                setProduct({
                    name: data.name,
                    price: data.price,
                    quantity: data.quantity,
                    description: data.description,
                    category: data.category._id,
                });
                setOldImages(data.images); // массив серверных путей
                setPreview(data.images.map(img => `${config.IMAGE_BASE_URL}${img}`));
            } catch (err) {
                console.error("Ошибка при получении товара:", err);
                toast.error("Не удалось загрузить товар");
            }
        };
        fetchProduct();
    }, [id]);

    const handleChange = (e) => setProduct({ ...product, [e.target.name]: e.target.value });

    const handleImages = (e) => {
        const files = Array.from(e.target.files);
        setNewImages(prev => [...prev, ...files]);
        setPreview(prev => [
            ...prev,
            ...files.map(f => URL.createObjectURL(f))
        ]);
    };

    const handleRemoveImage = (idx) => {
        // Если удаляем старую картинку
        if (idx < oldImages.length) {
            const removed = [...oldImages];
            removed.splice(idx, 1);
            setOldImages(removed);
        } else {
            // удаляем новую
            const newIdx = idx - oldImages.length;
            const removed = [...newImages];
            removed.splice(newIdx, 1);
            setNewImages(removed);
        }
        // обновляем превью
        setPreview(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", product.name);
            formData.append("price", product.price);
            formData.append("quantity", product.quantity);
            formData.append("description", product.description);
            formData.append("category", product.category);

            // новые файлы
            newImages.forEach(file => formData.append("images", file));
            // старые картинки
            formData.append("existingImages", JSON.stringify(oldImages));

            await axiosInstance.put(`/products/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("Товар успешно обновлён!");
            // navigate("/admin/products");
        } catch (err) {
            console.error("Ошибка при обновлении товара:", err);
            toast.error("Не удалось обновить товар. Попробуйте снова.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center py-10 px-4 mt-20">
            <Toaster position="top-right" />

            <Card className="w-full max-w-2xl shadow-xl border border-neutral-200 rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold">Редактирование товара</CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div className="flex flex-col space-y-2">
                            <Label>Название товара</Label>
                            <Input
                                name="name"
                                placeholder="Например: Кыргыз чапан"
                                value={product.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Price + Quantity */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col space-y-2">
                                <Label>Цена (сом)</Label>
                                <Input
                                    name="price"
                                    type="number"
                                    min="0"
                                    placeholder="1500"
                                    value={product.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <Label>Количество</Label>
                                <Input
                                    name="quantity"
                                    type="number"
                                    min="0"
                                    placeholder="10"
                                    value={product.quantity}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div className="flex flex-col space-y-2">
                            <Label>Категория</Label>
                            {catLoading ? (
                                <div className="text-neutral-500">Загрузка категорий...</div>
                            ) : (
                                <select
                                    name="category"
                                    onChange={handleChange}
                                    value={product.category}
                                    className="border rounded-md p-2"
                                    required
                                >
                                    <option value="">Выберите категорию</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Description */}
                        <div className="flex flex-col space-y-2">
                            <Label>Описание</Label>
                            <Textarea
                                name="description"
                                placeholder="Краткое описание товара..."
                                value={product.description}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Images */}
                        <div className="flex flex-col space-y-2">
                            <Label>Изображения товара</Label>
                            <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center">
                                <ImagePlus className="w-10 h-10 opacity-60 mb-2" />
                                <label
                                    htmlFor="images"
                                    className="cursor-pointer flex items-center gap-2 bg-neutral-100 px-4 py-2 rounded-md hover:bg-neutral-200 transition"
                                >
                                    <Upload size={18} />
                                    Добавить изображения
                                </label>
                                <input
                                    id="images"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    hidden
                                    onChange={handleImages}
                                />
                            </div>

                            {preview.length > 0 && (
                                <div className="grid grid-cols-3 gap-3 mt-4">
                                    {preview.map((src, idx) => (
                                        <div key={idx} className="relative group">
                                            <img
                                                src={src}
                                                alt="preview"
                                                className="rounded-xl w-full h-28 object-cover shadow"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(idx)}
                                                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Button
                            className="w-full py-3 text-lg rounded-xl"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Сохранить изменения"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditProduct;
