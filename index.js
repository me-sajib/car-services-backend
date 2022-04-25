const express = require("express");
require("dotenv").config();
const cors = require("cors");
// import to mongodb client
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
// 6JXOx7bPqtp1ucTj sajibDb
// mongodb uri and connect
const uri = `mongodb+srv://sajibDb:6JXOx7bPqtp1ucTj@cluster0.gttgi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

async function run() {
  try {
    await client.connect();
    const serviceCollection = client.db("services").collection("allService");
    const orderCollection = client.db("services").collection("orders");

    // send to order collection
    app.post("/order", async (req, res) => {
      const query = req.body;
      const order = await orderCollection.insertOne(query);
      res.send(order);
    });

    // get all order
    app.get("/order", async (req, res) => {
      const email = req.query.email;
      const cursor = orderCollection.find({ email });
      const order = await cursor.toArray();
      res.send(order);
    });

    // show all services
    app.get("/service", async (req, res) => {
      const cursor = serviceCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // show single service
    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const cursor = serviceCollection.find({ _id: ObjectId(id) });
      const result = await cursor.toArray();
      res.send(result);
    });

    // add new service
    app.post("/service", async (req, res) => {
      const query = req.body;
      const result = await serviceCollection.insertOne(query);
      res.send(result);
    });

    app.delete("/service/:id", async (req, res) => {
      const id = req.params.id;
      const result = await serviceCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });
  } finally {
  }
}
run();

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
