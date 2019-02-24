const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const database = {
  users: [
    {
      id: "123",
      name: "John",
      email: "john@gmail.com",
      password: "password",
      entries: 0,
      joined: new Date()
    },
    {
      id: "124",
      name: "Sally",
      email: "sally@gmail.com",
      password: "password",
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
    return req.body.email === user.email && req.body.password === user.password;
  });

  if (isUser) {
    res.json("signed in");
  } else {
    res.status(400).json("access denied");
  }
});

app.post("/register", (req, res) => {
  database.users.push({
    id: "125",
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    entries: 0,
    joined: new Date()
  });
  res.json(database.users[database.users.length - 1]);
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
