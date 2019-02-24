const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const express = require("express");
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const database = {
  users: [
    {
      id: "123",
      name: "John",
      email: "john@gmail.com",
      hash: "$2a$10$l.e5HD/7m0OKfrZz8KC0g.I0yczdD.prl5mMsGEKM8F5BWEHrxGIS", // "password"
      entries: 0,
      joined: new Date()
    },
    {
      id: "124",
      name: "Sally",
      email: "sally@gmail.com",
      hash: "$2a$10$si2Ha9zDthrgOLotYR7VQeGb1kMgDsLbBqu6ZmOG.I2brvfm4zT0O", // "password1"
      entries: 0,
      joined: new Date()
    }
  ]
};

app.get("/", (req, res, next) => {
  res.json(database.users);
});

app.post("/signin", (req, res, next) => {
  const isUser = database.users.some((user) => {
    return req.body.email === user.email && bcrypt.compareSync(req.body.password, user.hash);
  });

  if (isUser) {
    res.json("signed in");
  } else {
    res.status(400).json("access denied");
  }
});

app.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, null, null, (err, hash) => {
    if (err) return console.log(err);
    // console.log(hash);

    database.users.push({
      id: "125",
      name: req.body.name,
      email: req.body.email,
      hash: hash,
      entries: 0,
      joined: new Date()
    });
    res.json(database.users[database.users.length - 1]);
  });
});

app.get("/profile/:id", (req, res) => {
  let found = false;
  database.users.forEach((user) => {
    if (req.params.id === user.id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(400).json("no such user");
  }
});

app.put("/image", (req, res) => {
  let found = false;
  database.users.forEach((user) => {
    if (req.body.id === user.id) {
      found = true;
      user.entries++;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(400).json("no such user");
  }
});

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
