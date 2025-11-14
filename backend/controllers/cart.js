import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Получить корзину пользователя
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
        res.status(200).json(cart || { items: [] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Не удалось получить корзину" });
    }
};

// Добавить товар в корзину
export const addToCart = async (req, res) => {
    const { productId, quantity = 1 } = req.body;

    try {
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        const existingItem = cart.items.find(item => item.product.toString() === productId);

        if (!existingItem) {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        await cart.populate("items.product");
        res.status(200).json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Не удалось добавить товар в корзину" });
    }
};


// Удалить товар из корзины
export const removeFromCart = async (req, res) => {
    const { productId } = req.params;

    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: "Корзина не найдена" });

        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        await cart.save();
        await cart.populate("items.product");
        res.status(200).json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Не удалось удалить товар из корзины" });
    }
};

export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: "Корзина не найдена" });

        cart.items = [];
        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Не удалось очистить корзину" });
    }
};

export const updateCartItem = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: "Корзина не найдена" });

        const item = cart.items.find(i => i.product.toString() === productId);
        if (!item) return res.status(404).json({ message: "Товар не найден в корзине" });

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Товар не найден" });

        if (quantity > product.quantity) {
            return res.status(400).json({
                message: `Нельзя добавить больше ${product.quantity} штук.`
            });
        }

        if (quantity < 1) {
            cart.items = cart.items.filter(i => i.product.toString() !== productId);
        } else {
            item.quantity = quantity;
        }

        await cart.save();
        await cart.populate("items.product");
        res.status(200).json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Не удалось обновить количество" });
    }
};
