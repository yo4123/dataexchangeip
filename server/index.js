import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';

const app = express();
const MONGO_URI = 'mongodb+srv://myovani:4xINA2niMrkFg56a@connectionstring.xamjt.mongodb.net/?retryWrites=true&w=majority&appName=connectionstring';

app.use(cors());
app.use(express.json());

let client;

async function connectDB() {
    if (!client) {
        client = new MongoClient(MONGO_URI);
        await client.connect();
    }
    return client;
}

app.post('/api/visitors', async (req, res) => {
    try {
        const client = await connectDB();
        const db = client.db('visitor_tracker');
        const collection = db.collection('visitors');
        
        const visitorData = {
            host: req.body.host,
            name: req.body.name,
            mostVisitedPage: req.body.mostVisitedPage,
            country: req.body.country,
            data: JSON.stringify(req.body.data),
            timestamp: new Date()
        };
        
        await collection.insertOne(visitorData);
        res.json({ success: true });
    } catch (error) {
        console.error('MongoDB Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/visitors', async (req, res) => {
    try {
        const client = await connectDB();
        const db = client.db('visitor_tracker');
        const collection = db.collection('visitors');
        
        const visitors = await collection.find().toArray();
        res.json(visitors);
    } catch (error) {
        console.error('MongoDB Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));