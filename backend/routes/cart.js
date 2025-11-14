import express from "express";
import {getCart, addToCart, removeFromCart, clearCart, updateCartItem} from "../controllers/cart.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.delete("/remove/:productId", protect, removeFromCart);
router.post("/clear", protect, clearCart);
router.post("/update", protect, updateCartItem);

export default router;
