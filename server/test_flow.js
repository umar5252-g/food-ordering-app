const axios = require("axios");

const API_URL = "http://localhost:5000/api";

const testFlow = async () => {
  try {
    console.log("🚀 Starting Test Flow...");

    // 1. Register
    console.log("\n1. Registering user...");
    const regRes = await axios.post(`${API_URL}/auth/register`, {
      name: "Test User",
      email: `test_${Date.now()}@example.com`,
      password: "password123",
    });
    const token = regRes.data.data.accessToken;
    console.log("✅ User registered and token received");

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    // 2. Get Products
    console.log("\n2. Fetching products...");
    const prodRes = await axios.get(`${API_URL}/products`);
    const products = prodRes.data.data;
    if (products.length < 2) throw new Error("Not enough products seeded!");
    console.log(`✅ Found ${products.length} products`);

    // 3. Create First Order
    console.log("\n3. Placing First Order...");
    const order1Data = {
      items: [
        {
          product: products[0]._id,
          name: products[0].name,
          price: products[0].price,
          quantity: 1,
          image: products[0].image,
        },
      ],
      orderType: "Delivery",
      deliveryAddress: { address: "123 Test St", city: "Lahore" },
      paymentMethod: "Cash on Delivery",
      totalPrice: products[0].price + 150,
      customerDetails: { name: "Test User", phone: "03001234567" },
    };
    const o1Res = await axios.post(`${API_URL}/orders`, order1Data, config);
    console.log(`✅ Order 1 placed. ID: ${o1Res.data.data._id}`);

    // 4. Create Second Order
    console.log("\n4. Placing Second Order...");
    const order2Data = {
      items: [
        {
          product: products[1]._id,
          name: products[1].name,
          price: products[1].price,
          quantity: 2,
          image: products[1].image,
        },
      ],
      orderType: "Pickup",
      paymentMethod: "JazzCash",
      totalPrice: products[1].price * 2,
      customerDetails: { name: "Test User", phone: "03001234567" },
    };
    const o2Res = await axios.post(`${API_URL}/orders`, order2Data, config);
    console.log(`✅ Order 2 placed. ID: ${o2Res.data.data._id}`);

    // 5. Verify Orders
    console.log("\n5. Verifying orders in profile...");
    const myOrdersRes = await axios.get(`${API_URL}/orders/my-orders`, config);
    console.log(`✅ Verification complete. Found ${myOrdersRes.data.count} orders for user.`);
    
    console.log("\n🎉 ALL TESTS PASSED!");
  } catch (err) {
    console.error("\n❌ Test failed!");
    console.error(err.response?.data || err.message);
  }
};

testFlow();
