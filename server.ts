import { app } from "./app";
import connectToDB from "./utils/db";
require("dotenv").config();
const port = process.env.PORT || 5000;

app.listen(process.env.PORT, () => {
  console.log(`Server is connectd at port : ${process.env.PORT}`);
  connectToDB();
});
