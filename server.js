const app = require("./app");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Replace with your Netlify URL
    methods: "GET,POST,PUT,DELETE", // Specify allowed methods
    credentials: true, // If you need to send cookies
  })
);

const server = app.listen(process.env.PORT, () => {
  console.log("Server is listening on http://localhost:" + process.env.PORT);
});

process.on("unhandledRejection", (err) => {
  console.log("Error: " + err.message);
  console.log("Shutting down ther server due to unhandled Promise Rejection");

  server.close(() => {
    process.exit(1);
  });
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
