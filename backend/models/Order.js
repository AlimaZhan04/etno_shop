import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    priceAtPurchase: {
        type: Number,
        required: true,
        min: 0
    }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    items: [OrderItemSchema],

    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },

    contactInfo: {
        name: { type: String, required: true },
        email: { type: String, required: false },
        phone: { type: String, required: true },
    },

    shippingAddress: {
        type: String,
        required: true
    },

    paymentMethod: {
        type: String,
        required: true,
        enum: ['cash', 'card_courier', 'card_online'],
        default: 'cash'
    },

}, { timestamps: true });

const Order = mongoose.model("Order", OrderSchema);

export default Order;