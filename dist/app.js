"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongodb_1 = require("mongodb");
const body_parser_1 = __importDefault(require("body-parser"));
const app = express_1.default();
app.use(cors_1.default());
app.use(body_parser_1.default.json());
const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;
var client = null;
mongodb_1.MongoClient.connect(uri, { useNewUrlParser: true }, (err, res) => {
    if (err)
        throw Error(err);
    client = res;
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`server is listening on http://localhost:${port}/`);
    });
});
app.get('/cars', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const db = client.db(dbName);
        const carCollection = db.collection('Cars');
        let docs = yield carCollection.find({}).toArray();
        res.status(200).json(docs);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}));
app.put('/cars/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const db = client.db(dbName);
        const carCollection = db.collection('Cars');
        const id = parseInt(req.params.id);
        const { estimadatedDate: estimatedate, personName: person, inMaintenance } = req.body;
        let result = yield carCollection.updateOne({ id }, { $set: { estimatedate, person, inMaintenance } });
        const wasModified = result["result"]["n"] == 0;
        const status = wasModified ? 400 : 200;
        const jsonResponse = wasModified ? { message: "Resgitro no encontrado" } : result;
        console.log(jsonResponse);
        res.status(status).json(jsonResponse);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}));
//# sourceMappingURL=app.js.map