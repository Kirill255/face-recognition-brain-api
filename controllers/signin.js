const handleSignin = (pgDB, bcrypt) => (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json("Incorrect form submission");
  }

  pgDB
    .select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return pgDB
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => res.json(user[0]))
          .catch(() => res.status(400).json("Unable to get user"));
      } else {
        res.status(400).json("Wrong credentials");
      }
    })
    .catch(() => res.status(400).json("Wrong credentials"));
};

module.exports = {
  handleSignin
};
