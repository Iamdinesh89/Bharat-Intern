const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

const url = 'mongodb://0.0.0.0:27017';
const dbName = 'moneyTracker';

app.use(express.json());
app.use(express.static('public')); // Assuming your HTML, CSS, and JS files are in the "public" folder

let db;

async function connectToMongoDB() {
  try {
    const client = await MongoClient.connect(url);
    console.log('Connected to MongoDB');
    return client.db(dbName);
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err;
  }
}

app.post('/api/transactions', async (req, res) => {
  const transaction = req.body;

  try {
    const db = await connectToMongoDB();
    const result = await db.collection('transactions').insertOne(transaction);
    console.log('Transaction added to MongoDB');
    res.status(201).json({ message: 'Transaction added', insertedId: result.insertedId });
  } catch (err) {
    console.error('Error adding transaction to MongoDB:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/transactions', async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const transactions = await db.collection('transactions').find().toArray();
    res.json(transactions);
  } catch (err) {
    console.error('Error fetching transactions from MongoDB:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/transactions/:id', async (req, res) => {
    try {
      const db = await connectToMongoDB();
      const id = req.params.id;
      const result = await db.collection('transactions').deleteOne({ _id: new ObjectId(id) });
  
      if (result.deletedCount === 0) {
        res.status(404).json({ error: 'Transaction not found' });
      } else {
        console.log('Transaction removed from MongoDB');
        res.json({ message: 'Transaction removed' });
      }
    } catch (err) {
      console.error('Error removing transaction from MongoDB:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});


