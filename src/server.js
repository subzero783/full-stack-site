import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import dotenv from 'dotenv';
import {MongoClient} from 'mongodb';

const app = express();

dotenv.config()

app.use(express.static(path.join(__dirname, '/build')));
app.use(bodyParser.json());

const withDB = async(operations, res)=>{
    try{
        const mongoClient = await MongoClient.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true  
        });

        const db = mongoClient.db('full-stack-site-db');

        await operations(db);
        mongoClient.close();
    }catch(error){
        res.status(500).json({message:'Error connecting', error});
    }
};

app.get('/api/articles/:name', async (req, res)=>{
    withDB(async (db)=>{
        const articleName = req.params.name;
        const articleInfo = await db.collection('collection-01').findOne({name:articleName});
        res.status(200).json(articleInfo);
    }, res);
});


app.post('/api/articles/:name/upvote', (req, res) => {
    const articleName = req.params.name;

    articlesInfo[articleName].upvotes += 1;
    res.status(200).send(`${articleName} now has ${articlesInfo[articleName].upvotes} upvotes!`);
});

app.post('/api/articles/:name/add-comment', (req, res) => {
    const { username, text } = req.body;
    const articleName = req.params.name;

    articlesInfo[articleName].comments.push({ username, text });

    res.status(200).send(articlesInfo[articleName]);
});

app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname+'/build/index.html'));
  });

// app.listen(8000, () => console.log('Listening on port 8000'));

const server = app.listen(process.env.PORT || 8000, ()=>{
    console.log(`Listening on port ${server.address().port}`);
});