import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axios.js";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, ImagePlus, Loader2 } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

const CreateProduct = () => {
    const [product, setProduct] = useState({
        name: "",
        price: "",
        quantity: "",
        description: "",
        category: "",
    });

    const [images, setImages] = useState([]);
    const [preview, setPreview] = useState([]);
    const [loading, setLoading] = useState(false);

    const [categories, setCategories] = useState([]);
    const [catLoading, setCatLoading] = useState(true);

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

    const handleChange = (e) => setProduct({ ...product, [e.target.name]: e.target.value });

    const handleImages = (e) => {
        const files = Array.from(e.target.files);
        setImages((prev) => [...prev, ...files]);
        setPreview((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
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
            images.forEach((img) => formData.append("images", img));

            const res = await axiosInstance.post("/products", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("Товар успешно создан!");
            console.log("Созданный продукт:", res.data);

            // Очистка формы
            setProduct({
                name: "",
                price: "",
                quantity: "",
                description: "",
                category: "",
            });
            setImages([]);
            setPreview([]);
        } catch (err) {
            console.error("Ошибка при создании товара:", err);
            toast.error("Не удалось создать товар. Попробуйте снова.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center py-10 px-4 mt-20">
            {/* Toaster для отображения уведомлений */}
            <Toaster position="top-right" />

            <Card className="w-full max-w-2xl shadow-xl border border-neutral-200 rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold">Создание товара</CardTitle>
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
                            <Label>История</Label>
                            <Textarea
                                name="description"
                                placeholder="История товара"
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
                                                onClick={() => {
                                                    setPreview((prev) => prev.filter((_, i) => i !== idx));
                                                    setImages((prev) => prev.filter((_, i) => i !== idx));
                                                }}
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
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Создать товар"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateProduct;
