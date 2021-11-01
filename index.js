require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lbdvb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const userCollection = client.db("delevery_db").collection("users");
  const productCollection = client.db("delevery_db").collection("products");

  // INSERT TO DB
  app.post("/users", async (req, res) => {
    const newUser = req.body;
    const result = await userCollection.insertOne(newUser);
    res.send(result);
  });

  // LOAD USERS API
  app.get("/users", async (req, res) => {
    const result = await userCollection.find({}).toArray();
    res.json(result);
  });

  // LOAD PRODUCTS API
  app.get("/products", async (req, res) => {
    const result = await productCollection.find({}).toArray();
    res.json(result);
  });

  // LOAD PRODUCTS WITH ID API
  app.get("/products/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await productCollection.findOne(query);
    res.json(result);
  });

  // LOAD USER WITH ID API
  app.get("/users/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await userCollection.findOne(query);
    res.send(result);
  });

  // UPDATE USER API
  let newList = [];
  app.put("/users/:id", async (req, res) => {
    const id = req.params.id;
    const updatedUser = req.body;
    // console.log([...updatedUser.cart]);
    newList.push(updatedUser.cart);
    const result = await userCollection.updateOne(
      {},
      { $set: { cart: [...updatedUser.cart] } },
      false,
      true
    );
    res.send(result);
  });

  // DELETE API
  app.delete("/users/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await userCollection.deleteOne(query);
    res.json(result);
  });

  // client.close();
});

app.get("/", async (req, res) => {
  res.send("This is main");
});

app.listen(port, () => {
  console.log("Listening from port", port);
});
