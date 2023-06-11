const express = require('express');
const app = express();
const cors = require('cors')
require('dotenv').config()

const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wiqpkut.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const classCollection = client.db("LanguageDB").collection("classes");
    const topCollection = client.db("LanguageDB").collection("topSlider");
    const instructorCollection = client.db("LanguageDB").collection("instructor");
    const myClassCollection = client.db("LanguageDB").collection("mySelectdClass")
    const userCollection = client.db("LanguageDB").collection("users")

    //users
    app.get('/users',async(req,res)=>{
      const result=await userCollection.find().toArray();
      res.send(result);
    })
    //for admin role
    app.get('/users/admin/:email',async(req,res)=>{
      const email=req.params.email;
      const query={email:email};
      const user=await userCollection.findOne(query)
      const result={admin:user?.role === 'admin'}
      res.send(result);
    })

    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log(user)
      const query = { email: user.email }
      const existingUser = await userCollection.findOne(query);
      console.log(existingUser)
      if (existingUser) {
        return res.send({ message: 'user already exist' })
      }
      const result = await userCollection.insertOne(user)
      res.send(result)
    })

    app.patch('/users/admin/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: 'admin'
        },
      };

      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);

    })
    app.patch('/users/instructor/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: 'instructor'
        },
      };

      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);

    })

    app.get('/classes', async (req, res) => {
      // console.log(req.query);
      const query = {};
      const options = {
        sort: { students: -1 },
      };
      const limit = parseInt(req.query.limit)
      const result = await classCollection.find(query, options).limit(limit).toArray();
      res.send(result)
    })
    app.get('/class', async (req, res) => {
      const query = {};
      const options = {
        sort: { students: -1 },
      };
      const result = await classCollection.find(query, options).toArray();
      res.send(result)
    })
    app.get('/top', async (req, res) => {
      const result = await topCollection.find().toArray();
      res.send(result)
    })
    app.get('/instructor', async (req, res) => {
      const result = await instructorCollection.find().toArray();
      res.send(result)
    })
    app.get('/PInstructor', async (req, res) => {
      const limit = parseInt(req.query.limit)
      const result = await instructorCollection.find().limit(limit).toArray();
      res.send(result)
    })

    //MySelectedClass
    app.get('/myclass', async (req, res) => {
      const email = req.query.email;
      if (!email) {
        res.send([])
      }
      const query = { email: email }
      const result = await myClassCollection.find(query).toArray();
      res.send(result)
    })

    app.post('/myclass', async (req, res) => {
      const item = req.body;
      console.log(item)
      const result = await myClassCollection.insertOne(item)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('assignment 12 server is running ...')
})

app.listen(port, () => {
  console.log(`server is running on port:${port}`)
})