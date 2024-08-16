const mongoose = require("mongoose");

const connectWithMongo = () => {
  mongoose.connect(process.env.MONGO_URL).then((data) => {
    console.log("server connect with mongoDb", data.connection.host);
  });
};

module.exports = connectWithMongo;
