const express=require('express');
const app=express();
const cors=require('cors')
require('dotenv').config()

const port=process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion } = require('mongodb');
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
     await client.connect();

    const classCollection=client.db("LanguageDB").collection("classes");
    const topCollection=client.db("LanguageDB").collection("topSlider");
    const instructorCollection=client.db("LanguageDB").collection("instructor");

    app.get('/classes',async(req,res)=>{
        console.log(req.query);
        const limit=parseInt(req.query.limit)
        const result=await classCollection.find().limit(limit).toArray();
        res.send(result)
    })
    app.get('/class',async(req,res)=>{
        const query = {};
        const options = {
          sort: { students: -1 },
        };
        const result=await classCollection.find(query,options).toArray();
        res.send(result)
    })
    app.get('/top',async(req,res)=>{
        const result=await topCollection.find().toArray();
        res.send(result)
    })
    app.get('/instructor',async(req,res)=>{
        const result=await instructorCollection.find().toArray();
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


app.get('/',(req,res)=>{
    res.send('assignment 12 server is running ...')
})

app.listen(port,()=>{
    console.log(`server is running on port:${port}`)
})