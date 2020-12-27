import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';


const articlesInfo = {
    'learn-react': {
        upvotes: 0,
        comments: [],
    },
    'learn-node': {
        upvotes: 0,
        comments: [],
    },
    'my-thoughts-on-resumes': {
        upvotes: 0,
        comments: [],
    },
}

const app = express();

app.use(express.static(path.join(__dirname, '/build')));
app.use(bodyParser.json());


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