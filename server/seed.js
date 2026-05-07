const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

const products = [
  {
    name: "Classic Cheeseburger",
    description: "Juicy beef patty with cheddar cheese, lettuce, tomato, and our secret sauce.",
    price: 550,
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=500&fit=crop",
    isAvailable: true,
  },
  {
    name: "Zinger Burger",
    description: "Crispy chicken fillet with spicy mayo and crunchy lettuce.",
    price: 480,
    category: "burgers",
    image: "https://images.unsplash.com/photo-1513185158878-8d8c182b013b?w=500&h=500&fit=crop",
    isAvailable: true,
  },
  {
    name: "Pepperoni Pizza",
    description: "Loaded with pepperoni and mozzarella cheese on a thin crust.",
    price: 1200,
    category: "pizza",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&h=500&fit=crop",
    isAvailable: true,
  },
  {
    name: "Fettuccine Alfredo",
    description: "Creamy white sauce pasta with grilled chicken and parmesan.",
    price: 850,
    category: "pasta",
    image: "https://images.unsplash.com/photo-1645112481338-35622bb0702e?w=500&h=500&fit=crop",
    isAvailable: true,
  },
  {
    name: "Caesar Salad",
    description: "Fresh romaine lettuce, croutons, and Caesar dressing.",
    price: 450,
    category: "salads",
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&h=500&fit=crop",
    isAvailable: true,
  },
  {
    name: "French Fries",
    description: "Crispy golden fries seasoned with sea salt.",
    price: 250,
    category: "sides",
    image: "https://images.unsplash.com/photo-1630384066202-18d038253a5d?w=500&h=500&fit=crop",
    isAvailable: true,
  },
  {
    name: "Chocolate Brownie",
    description: "Warm, fudgy brownie topped with chocolate syrup.",
    price: 350,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&h=500&fit=crop",
    isAvailable: true,
  },
  {
    name: "Mango Smoothie",
    description: "Fresh and creamy mango blend.",
    price: 300,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1623065422902-30a2ad44924b?w=500&h=500&fit=crop",
    isAvailable: true,
  },
  {
    name: "BBQ Chicken Wings",
    description: "6 pieces of succulent wings tossed in smoky BBQ sauce.",
    price: 600,
    category: "chicken",
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&h=500&fit=crop",
    isAvailable: true,
  },
  {
    name: "Iced Caramel Macchiato",
    description: "Rich espresso with caramel drizzle and chilled milk.",
    price: 400,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&h=500&fit=crop",
    isAvailable: true,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB for seeding");

    await Product.deleteMany({});
    console.log("🗑️ Cleared existing products");

    await Product.insertMany(products);
    console.log("🌱 Successfully seeded 10 products");

    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seedDB();
