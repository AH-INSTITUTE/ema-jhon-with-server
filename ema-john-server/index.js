const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ubnkj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.get('/', (req, res) => {
    res.send('ABU HASAN');
})

client.connect(err => {
    const emaJohnProducts = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION}`);

    const emaJohnOrders = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION_ORDERS}`);
    // console.log('data base Connect Success');

    //post
    app.post('/addProduct', (req, res) => {
        const product = req.body;
        // console.log(product);
        emaJohnProducts.insertOne(product)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount)
            })
    })

    //get
    app.get('/getProduct', (req, res) => {
        emaJohnProducts.find({})
            .toArray((err, doc) => {
                res.send(doc);
            })
    })
    //get Single product
    app.get('/product/:key', (req, res) => {
        emaJohnProducts.find({ key: req.params.key })
            .toArray((err, doc) => {
                res.send(doc[0]);
            })
    })

    //post get by key
    app.post('/getPdByKey', (req, res) => {
        const productKeys = req.body;
        emaJohnProducts.find({ key: { $in: productKeys} })
        .toArray((err,doc) => {
            res.send(doc);
        })
    })
    //update

    //delete

    // client.close();

    // emaJohnOrders collection
    app.post('/addOrder', (req, res) => {
        const order = req.body;
        // console.log(product);
        emaJohnOrders.insertOne(order)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount > 0);
            })
    })
});



app.listen(5000);