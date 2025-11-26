import express from "express";
import {protect} from "../middleware/authMiddleware.js";
import {createOrder, getAllOrders, getMyOrders} from "../controllers/orders.js";

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/all', getAllOrders);

export default router;