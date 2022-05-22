const express = require('express')
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

const app = express()
app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qlpqx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
  try{
    await client.connect();
    const bikePartCollection = client.db('bikeManufacture').collection('bikeParts');

    app.get('/bikeParts', async(req, res)=> {
      const query = {};
      const result = await bikePartCollection.find(query).toArray()
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