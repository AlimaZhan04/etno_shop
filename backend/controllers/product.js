import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
    try {
        const { name, price, quantity, description, category } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "Необходимо добавить хотя бы одно изображение" });
        }

        const images = req.files.map(file => "/uploads/" + file.filename);

        const newProduct = new Product({
            name,
            price,
            quantity,
            description,
            category,
            images
        });

        await newProduct.save();

        res.status(201).json(newProduct);
    } catch (err) {
        console.error("Ошибка создания продукта:", err);
        res.status(500).json({ message: "Не удалось создать продукт" });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({})
            .sort({ salesCount: -1, createdAt: -1 })
            .populate("category");

        res.status(200).json(products);
    } catch (err) {
        console.error("Ошибка получения продуктов:", err);
        res.status(500).json({ message: "Не удалось получить продукты" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ message: "Продукт не найден" });
        }

        res.status(200).json({ message: "Продукт успешно удалён" });
    } catch (err) {
        console.error("Ошибка удаления продукта:", err);
        res.status(500).json({ message: "Не удалось удалить продукт" });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, quantity, description, category, existingImages } = req.body;

        const newImages = req.files?.map(file => "/uploads/" + file.filename) || [];

        // existingImages приходит как JSON-строка
        const existing = existingImages ? JSON.parse(existingImages) : [];

        const images = [...existing, ...newImages];

        const updatedData = { name, price, quantity, description, category, images };

        const product = await Product.findByIdAndUpdate(id, updatedData, { new: true });

        if (!product) return res.status(404).json({ message: "Продукт не найден" });

        res.status(200).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Не удалось обновить продукт" });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate("category");

        if (!product) {
            return res.status(404).json({ message: "Продукт не найден" });
        }

        res.status(200).json(product);
    } catch (err) {
        console.error("Ошибка получения продукта:", err);
        res.status(500).json({ message: "Не удалось получить продукт" });
    }
};