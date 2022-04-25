const express = require("express");
require("dotenv").config();
const cors = require("cors");
const jwt = require("jsonwebtoken");
// import to mongodb client
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

function varifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).send({ message: "unauthorize" });
  }
  const token = auth.split(" ")[1];
  const tok =
    "49ab537d9701badd8b9fc609d8773acc4107515b0f68c1f5266c9a78c32b1a0fa04aefed3ce0c39fad85eaa803a663d41f1b204792ac0eb54101ba4ff4302ebe";
  jwt.verify(token, tok, (err, decode) => {
    if (err) {
      return res.status(403).send({ error: "forbidden" });
    }
    req.decode = decode;
    next();
  });
}

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

    // access token
    app.post("/login", async (req, res) => {
      const user = req.body;
      const tok =
        "49ab537d9701badd8b9fc609d8773acc4107515b0f68c1f5266c9a78c32b1a0fa04aefed3ce0c39fad85eaa803a663d41f1b204792ac0eb54101ba4ff4302ebe";
      const token = jwt.sign(user, tok, { expiresIn: "1d" });
      res.send({ token });
    });

    // get all order
    app.get("/order", varifyToken, async (req, res) => {
      const tokenEmail = req.decode.email;
      const email = req.query.email;
      if (email === tokenEmail) {
        const cursor = orderCollection.find({ email });
        const order = await cursor.toArray();
        res.send(order);
      } else {
        res.status(403).send({ error: "forbidden" });
      }
    });

    // send to order collection
    app.post("/order", async (req, res) => {
      const query = req.body;
      const order = await orderCollection.insertOne(query);
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
