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

// когда мы пишем вот так app.post("/signin", signin.handleSignin(pgDB, bcrypt));
// то в модуле мы пишем вот так const handleSignin = (pgDB, bcrypt) => (req, res) => {}
// откуда тогда берутся req и res? они автоматически передаются в функцию при вызове app.post("/signin", signin.handleSignin(pgDB, bcrypt)(req, res)); и передавать их явно не нужно, да! это немного сбивает с толку, можете использовать прошлую запись
// app.post("/signin", (req, res) => signin.handleSignin(req, res, pgDB, bcrypt));
// и в модуле const handleSignin = (req, res, pgDB, bcrypt) => {}

app.post("/signin", signin.handleSignin(pgDB, bcrypt));

app.post("/register", register.handleRegister(pgDB, bcrypt));

app.get("/profile/:id", profile.handleProfileGet(pgDB));

app.put("/image", image.handleImage(pgDB));

app.post("/imageurl", image.handleApiCall);

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
