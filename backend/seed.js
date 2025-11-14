import mongoose from "mongoose";
import Category from "./models/Category.js";

const categories = [
    { name: "Сувениры" },
    { name: "Национальная одежда" },
    { name: "Украшения" },
    { name: "Аксессуары из войлока" },
    { name: "Традиционная посуда" }
];

const MONGO_URI = "mongodb://localhost:27017/shop";

async function seedCategories() {
    try {
        console.log("⏳ Подключаюсь к MongoDB...");
        await mongoose.connect(MONGO_URI);

        console.log("🗑 Очищаю категорию...");
        await Category.deleteMany();

        console.log("🌱 Добавляю новые категории...");
        await Category.insertMany(categories);

        console.log("✅ Готово! Категории успешно добавлены:");
        categories.forEach(c => console.log(" - " + c.name));

        process.exit();
    } catch (err) {
        console.error("❌ Ошибка сидирования:", err);
        process.exit(1);
    }
}

seedCategories();
