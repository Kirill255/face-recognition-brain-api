const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const express = require("express");
const app = express();
const port = 3001;
const knex = require("knex");

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

app.post("/signin", (req, res, next) => {
  pgDB
    .select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then((data) => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return pgDB
          .select("*")
          .from("users")
          .where("email", "=", req.body.email)
          .then((user) => res.json(user[0]))
          .catch(() => res.status(400).json("Unable to get user"));
      } else {
        res.status(400).json("Wrong credentials");
      }
    })
    .catch(() => res.status(400).json("Wrong credentials"));
});

app.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, null, null, (err, hash) => {
    if (err) return console.log(err);
    // console.log(hash);

    // вставляем email и hash в таблицу login, возвращаем email, дальше вставляем name, email, joined в таблицу users, на клиент отправляем возвращающийся объект юзера, дальше завершаем транзакцию .then(trx.commit) и .catch(trx.rollback)
    pgDB
      .transaction((trx) => {
        trx
          .insert({
            email: req.body.email,
            hash: hash
          })
          .into("login")
          .returning("email")
          .then((loginEmail) => {
            return trx("users")
              .returning("*")
              .insert({
                name: req.body.name,
                email: loginEmail[0],
                joined: new Date()
              })
              .then((response) => res.json(response[0]));
          })
          .then(trx.commit)
          .catch(trx.rollback);
      })
      .catch(() => res.status(400).json("Unable to register."));
  });
});

app.get("/profile/:id", (req, res) => {
  /*  pgDB
    .select("*")
    .from("users")
    .where({ id: req.params.id })
    .then((user) => {
      // если юзера нет, то вернётся просто пустой массив и 200, тоесть нет ошибки, мы не сможем поймать это в catch
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("Not found.");
      }
    })
    .catch(() => res.status(400).json("Error getting user.")); */

  // так тоже работает
  pgDB("users")
    .where("id", req.params.id)
    .then((user) => {
      // если юзера нет, то вернётся просто пустой массив и 200, тоесть нет ошибки, мы не сможем поймать это в catch
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("Not found.");
      }
    })
    .catch(() => res.status(400).json("Error getting user."));
});

app.put("/image", (req, res) => {
  pgDB("users")
    .where("id", "=", req.body.id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => res.json(entries[0]))
    .catch(() => res.status(400).json("Unable to get entries."));
});

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
