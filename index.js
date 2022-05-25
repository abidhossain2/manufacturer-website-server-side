const express = require('express')
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express()
app.use(cors())
const stripe = require('stripe')(process.env.PAYMENT_SECRET_KEY);
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qlpqx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
  try{
    await client.connect();
    const bikePartCollection = client.db('bikeManufacture').collection('bikeParts');
    const reviewCollection = client.db('bikeManufacture').collection('reviews');
    const orderCollection = client.db('bikeManufacture').collection('orders');
    
    app.get('/bikeParts', async(req, res)=> {
      const query = {};
      const result = await bikePartCollection.find(query).toArray()
      res.send(result)
    })
    app.get('/bikeParts/:id', async(req, res)=> {
      const id = req.params.id;
      const query = {_id:ObjectId(id)}
      const result = await bikePartCollection.findOne(query);
      res.send(result)
    })
    app.put('/bikeParts/:id', async(req, res)=> {
      const id = req.params.id;
      const amount = req.body;
      const query = {_id:ObjectId(id)}
      const options = {upsert: true}
      const updateAmount = {
        $set: {
          minimumOrder: amount.orderAmount + 1
        }
      }
      const result = await bikePartCollection.updateOne(query, updateAmount, options);
      res.send(result)
    })
    app.patch('/bikeParts/:id', async(req, res)=> {
      const id = req.params.id;
      const amount = req.body;
      const query = {_id:ObjectId(id)}
      const options = {upsert: true}
      const updateAmount = {
        $set: {
          minimumOrder: amount.orderAmount - 1
        }
      }
      const result = await bikePartCollection.updateOne(query, updateAmount, options);
      res.send(result)
    })

    app.post('/orders', async(req, res) => {
      const filter = req.body;
      const query = {name: filter.name, userEmail:filter.userEmail}
      const existOrder = await orderCollection.findOne(query);
      if(!existOrder){
        const result = await orderCollection.insertOne(filter)
        res.send(result)
      }else{
        return res.send({success: false})
      }
    })

    app.get('/orders', async(req, res)=> {
      const filter = req.query.email;
      const filterEmail = {userEmail: filter}
      const result = await orderCollection.find(filterEmail).toArray()
      res.send(result)
    })
    app.get('/orders/:id', async(req, res)=> {
      const filter = req.params.id;
      const filterId = {_id: ObjectId(filter)}
      const result = await orderCollection.findOne(filterId)
      res.send(result)
    })
    app.post('/create-payment-intent', async(req, res) => {
      const price = req.body;
      const payPrice = price.price;
      const total = payPrice * 100;
    
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 2000,
        currency: 'usd',
        payment_method_types: ['card']
      });
      res.send({
        clientSecret: paymentIntent.client_secret
      });
    })
    app.get('/reviews', async(req, res)=> {
      const query = {};
      const result = await reviewCollection.find(query).toArray()
      res.send(result)
    })
    app.delete('/orders/:id', async(req, res) => {
      const id = req.params.id;
      const orderId = {_id:ObjectId(id)}
      const result = await orderCollection.deleteOne(orderId)
      res.send(result)
    })
    

  }finally{

  }

}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Server is running')
})

app.listen(port, () => {
  console.log(`Listening to  ${port}`)
})