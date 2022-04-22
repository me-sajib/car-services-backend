const express = require("express");
require("dotenv").config();
const cors = require("cors");
// import to mongodb client
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
// 6JXOx7bPqtp1ucTj sajibDb
// mongodb uri and connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.USER_PASS}@cluster0.gttgi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
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

client.connect((err) => {
  const collection = client.db("test").collection("devices");
  async function run() {
    try {
      console.log("Connected to MongoDB");
    } finally {
      client.close();
    }
  }
  run();
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
