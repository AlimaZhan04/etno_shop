import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res) => {
    try {
        const {
            shippingAddress,
            contactInfo,
            paymentMethod
        } = req.body;

        const userId = req.user._id;

        if (!shippingAddress || !contactInfo?.name || !contactInfo?.phone || !paymentMethod) {
            return res.status(400).json({ message: 'Необходимо указать адрес, имя, телефон и способ оплаты.' });
        }

        const userCart = await Cart.findOne({ user: userId })
            .populate('items.product');

        if (!userCart || userCart.items.length === 0) {
            return res.status(400).json({ message: 'Корзина пуста. Невозможно оформить заказ.' });
        }

        let totalAmount = 0;
        const orderItems = [];

        for (const cartItem of userCart.items) {
            const product = cartItem.product;

            if (!product) {
                console.error(`Товар с ID ${cartItem.product} не найден.`);
                continue;
            }

            const price = product.price;
            const itemTotal = price * cartItem.quantity;
            totalAmount += itemTotal;

            orderItems.push({
                product: product._id,
                name: product.name,
                quantity: cartItem.quantity,
                priceAtPurchase: price,
            });
        }

        const order = new Order({
            user: userId,
            items: orderItems,
            totalAmount: totalAmount,
            contactInfo,
            shippingAddress,
            paymentMethod,
        });

        const createdOrder = await order.save();

        userCart.items = [];
        await userCart.save();

        res.status(201).json({
            message: 'Заказ успешно оформлен',
            orderId: createdOrder._id,
            totalAmount: createdOrder.totalAmount
        });

    } catch (error) {
        console.error('Ошибка при создании заказа:', error);
        res.status(500).json({ message: 'Ошибка сервера при оформлении заказа.' });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Ошибка при получении заказов:', error);
        res.status(500).json({ message: 'Ошибка сервера при получении заказов.' });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error('Ошибка при получении всех заказов:', error);
        res.status(500).json({ message: 'Ошибка сервера при получении всех заказов.' });
    }
};
