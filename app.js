const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(express.json())
app.use(cors())

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

const postsRoute = require("./routes/postsRoutes")
const usersRoute = require("./routes/usersRoutes")
const authRoute = require("./routes/authRoutes")

app.use("/posts", postsRoute)
app.use("/users", usersRoute)
app.use("/auth", authRoute)

app.get("/", (req, res) => {
  res.send({
    message: "This is the test route to make sure server is working",
  });
});

module.exports = app;
