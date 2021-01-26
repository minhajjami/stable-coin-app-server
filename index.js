const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fileUpload = require('express-fileupload')
require('dotenv').config();
const app = express()
app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }))
const port = 5000
const ObjectID = require('mongodb').ObjectID;

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fuyuk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const userInfoCollection = client.db(process.env.DB_NAME).collection("userInfo");
    const bankInfoCollection = client.db(process.env.DB_NAME).collection("banks");
    const coinInfoCollection = client.db(process.env.DB_NAME).collection("coins");
    const tokenInfoCollection = client.db(process.env.DB_NAME).collection("tokens");
    
       // add UserInfo 
       app.post('/buySubmit', (req, res) => {
          
          const coinID = req.body.coin;
          const quantity = req.body.quantity;
          const walletAddress = req.body.address;
          const bankID = req.body.bank;
  
          userInfoCollection.insertOne({ coinID, quantity, walletAddress, bankID })
              .then(result => {
                  res.status(200).send(result.insertedCount > 0);
              })
      })
      
      app.get('/getAllBank', (req, res) => {
        bankInfoCollection.find()
            .toArray((err, documents) => {
                res.status(200).send(documents);
            })
    })

    app.get('/getAllCoin', (req, res) => {
        coinInfoCollection.find()
            .toArray((err, documents) => {
                res.status(200).send(documents);
            })
    })

    app.get('/getBankByCoin', (req, res) => {
        const coinName = req.query.coin;
        bankInfoCollection.find({ coin: coinName })
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    app.get('/getAllToken', (req, res) => {
        tokenInfoCollection.find()
            .toArray((err, documents) => {
                res.status(200).send(documents);
            })
    })

   });

  
  app.get('/', (req, res) => {
      res.send('server is running')
  })
  
  app.listen(process.env.PORT || port)