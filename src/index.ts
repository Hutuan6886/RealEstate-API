import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1); //* Check PORT
}

const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());



app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});


app.use('/',)