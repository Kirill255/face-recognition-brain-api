const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const express = require("express");
const app = express();
const port = 3001;
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const pgDB = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "",
    database: "smart-brain"
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
  pgDB
    .select("*")
    .from("users")
    .then((users) => res.json(users));
});

app.post("/signin", (req, res) => signin.handleSignin(req, res, pgDB, bcrypt));

app.post("/register", (req, res) => register.handleRegister(req, res, pgDB, bcrypt));

app.get("/profile/:id", (req, res) => profile.handleProfileGet(req, res, pgDB));

app.put("/image", (req, res) => image.handleImage(req, res, pgDB));

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
