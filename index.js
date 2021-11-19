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
// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run () {
    try{
        await client.connect();
        // console.log('connected to database');
        const database = client.db('carSales');
        const ProductsCollection = database.collection('products');
        const ProductsReviewCollection = database.collection('productsReview');
        const bookingCollection = database.collection("booking");

        // Get products API
        app.get('/products', async(req, res) => {
            // console.log('hit the post api');
            const cursor = ProductsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });
         // Get productsReview API
        app.get('/productsReview', async(req, res) => {
            // console.log('hit the post api');
            const cursor = ProductsReviewCollection.find({});
            const productsReview = await cursor.toArray();
            res.send(productsReview);
        });

          // get booking
        app.get('/addBook', async(req, res) => {
            // const { email } = req.params
            const email = req.query.email
            const query = {email: email}
           const cursor = bookingCollection.find(query)
               const booking = await cursor.toArray();
                    res.send(booking);
                    console.log(result);
               
        })
        //add booking
        app.post("/addBook", async(req, res) => {
            const booking = req.body;
            // console.log(booking);
            bookingCollection.insertOne(booking).then((result) => {
            res.send(result);
            });
        });

        // POST API
        app.post('/products', async(req, res) => {
            const service = req.body;
            console.log('hit the post api', service);
            
            const result = await ProductsCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });
        // POST REVIEW API
        app.post('/productsReview', async(req, res) => {
            const review = req.body;
            console.log('hit the post api', review);
            
            const result = await ProductsReviewCollection.insertOne(review);
            console.log(result);
            res.json(result)
        });

        // DELETE BOOKER
        app.delete('/addBook/:id', async(req,res)=>{
            const id = req.params.id;
            console.log('delete user id', id);
            res.json('hello')
        })
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