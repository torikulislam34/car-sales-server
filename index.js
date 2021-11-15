const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nnpij.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run () {
    try{
        await client.connect();
        // console.log('connected to database');
        const database = client.db('carSales');
        const serviceCollection = database.collection('products');

        // Get products API
        app.get('/products', async(req, res) => {
            // console.log('hit the post api');
            const cursor = serviceCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });

        // POST API
        app.post('/products', async(req, res) => {
            const service = req.body;
            console.log('hit the post api', service);
            
            const result = await serviceCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });
    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('running car sales server');
})

app.listen(port, () => {
    console.log('running car sales server port', port);
})