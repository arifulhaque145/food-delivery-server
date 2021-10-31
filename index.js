require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lbdvb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const userCollection = client.db("delevery_db").collection("users");

  app.post("/users", async (req, res) => {
    const newUser = req.body;
    const result = await userCollection.insertOne(newUser);
    res.send(result);
  });

  app.get("/users", async (req, res) => {
    const result = await userCollection.find({}).toArray();
    res.json(result);
  });

  // console.error(userCollection.dir);
  // client.close();
});

app.get("/", async (req, res) => {
  res.send("This is main");
});

app.listen(port, () => {
  console.log("Listening from port", port);
});
