const express = require("express");
require("dotenv").config();
const cors = require("cors");
// import to mongodb client
const { MongoClient, ServerApiVersion } = require("mongodb");
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

    app.get("/service", async (req, res) => {
      const cursor = serviceCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
  } finally {
  }
}
run();

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
