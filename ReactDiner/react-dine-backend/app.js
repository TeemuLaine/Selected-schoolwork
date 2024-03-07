const fs = require("node:fs/promises");

const { v4: uuidv4 } = require("uuid");

const bodyParser = require("body-parser");
const express = require("express");

const app = express();

app.use(bodyParser.json());
app.use(express.static("./public"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/api/dishes", async (req, res) => {
  const meals = await fs.readFile("./data/available-dishes.json", "utf8");
  res.json(JSON.parse(meals));
});

app.get("/api/dishes/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id)
  const meals = await fs.readFile("./data/available-dishes.json", "utf8");
  console.log(meals)
  const dishes = JSON.parse(meals);
  const dish = dishes.find((dish) => dish.id === id);

  if (!dish) {
    return res.status(404).json({ message: "Dish not found" });
  }
  console.log(dish);
  res.json(dish);
});

app.get("/api/orders", async (req, res) => {
  const meals = await fs.readFile("./data/orders.json", "utf8");
  res.json(JSON.parse(meals));
});

app.post("/api/orders", async (req, res) => {
  const orderData = req.body.order;

  if (
    orderData === undefined ||
    orderData === null ||
    orderData.items === null ||
    orderData.items === []
  ) {
    return res.status(400).json({ message: "Missing data." });
  }

  if (
    orderData.customer.specialInfo === null ||
    orderData.customer.name === null ||
    orderData.customer.name.trim() === "" ||
    orderData.customer.street === null ||
    orderData.customer.street.trim() === "" ||
    orderData.customer.postalCode === null ||
    orderData.customer.postalCode.trim() === "" ||
    orderData.customer.city === null ||
    orderData.customer.city.trim() === ""
  ) {
    return res.status(400).json({
      message:
        "Missing data: Email, name, street, postal code or city is missing.",
    });
  }

  const newOrder = {
    ...orderData,
    id: uuidv4(),
  };

  const orders = await fs.readFile("./data/orders.json", "utf8");
  const allOrders = JSON.parse(orders);
  allOrders.push(newOrder);

  await fs.writeFile("./data/orders.json", JSON.stringify(allOrders));
  res.status(201).json({ message: "Order created!" });
});

app.use((req, res) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  res.status(404).json({ message: "Not found" });
});

module.exports = app;
