import express from 'express';
import crypto from 'crypto';

const app = express(); 
const PORT = 3000;

const urlDB: Record<string, string> = {};

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello from my server");
})

app.post('/url', (req, res) => {

    const {url} = req.body;
    if (url) {
        const token = crypto.randomBytes(4).toString('hex');
        urlDB[token] = url;
        res.json({ "Shortened URL" : `http://localhost:3000/${token}` });
    }   
    else{
        res.end("No url submitted, Try again!");
    } 
})

app.get("/:shortId", (req, res)=>{
    const { shortId } = req.params;
    const redirect = urlDB[shortId];
    res.redirect(redirect);
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
