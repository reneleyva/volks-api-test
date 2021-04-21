import express from 'express';
import cors from 'cors';
import {MongoClient} from 'mongodb';
import bodyParser from 'body-parser';

const app = express();

app.use(cors());
app.use(bodyParser.json());

const uri = process.env.MONGO_URI;

const dbName = process.env.DB_NAME;
var client = null;

MongoClient.connect(uri, { useNewUrlParser: true }, (err, res) => {
    if (err) throw Error(err);
    client = res;
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`server is listening on http://localhost:${port}/`);
    });
})


app.get('/cars', async (req, res) => {
    try {
        const db = client.db(dbName);

        const carCollection = db.collection('Cars');
        let docs = await carCollection.find({}).toArray();
        res.status(200).json(docs);

    } catch (error) {
        console.log(error);
        res.status(500).json({error})
    } 
    
});

app.put('/cars/:id', async (req, res) => {
    try {
        const db = client.db(dbName);
        const carCollection = db.collection('Cars');

        const id = parseInt(req.params.id);
        const { estimadatedDate: estimatedate, personName: person, inMaintenance } = req.body;

        let result = await carCollection.updateOne({id}, { $set: {estimatedate, person, inMaintenance }});
        const wasModified = result["result"]["n"] == 0;
        const status = wasModified ? 400 : 200;
        const jsonResponse = wasModified ? {message: "Resgitro no encontrado"} : result;
        console.log(jsonResponse);
        res.status(status).json(jsonResponse);

    } catch (error) {
        console.log(error);
        res.status(500).json({error})
    }
})


