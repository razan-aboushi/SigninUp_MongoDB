const express = require("express");
const cors = require("cors");
const PORT =  process.env.PORT || 5000;
const mongoose = require("mongoose");
const userRouts = require('./routes/userRouter');
const notFoundHandler = require('./middleware/404');
const errorHandler=require('./middleware/500');
const app = express();

const dbURI = "mongodb+srv://Razan_Aboushi:Razan$111222@cluster0.dnh3zsi.mongodb.net/mongoTest?retrywrites=true&w=majority"

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.use(userRouts);
app.use('*',notFoundHandler);
app.use(errorHandler);

module.exports = {
  server: app,
  start: () => {
    mongoose
      .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        app.listen(PORT, () => {
          console.log(`Starting server on port ${PORT}`);
        });
      });
  },
};



