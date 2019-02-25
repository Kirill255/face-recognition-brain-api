const handleRegister = (pgDB, bcrypt) => (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json("Incorrect form submission");
  }

  bcrypt.hash(password, null, null, (err, hash) => {
    if (err) return console.log(err);
    // console.log(hash);

    // вставляем email и hash в таблицу login, возвращаем email, дальше вставляем name, email, joined в таблицу users, на клиент отправляем возвращающийся объект юзера, дальше завершаем транзакцию .then(trx.commit) и .catch(trx.rollback)
    pgDB
      .transaction((trx) => {
        trx
          .insert({
            email: email,
            hash: hash
          })
          .into("login")
          .returning("email")
          .then((loginEmail) => {
            return trx("users")
              .returning("*")
              .insert({
                name: name,
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
};

module.exports = {
  handleRegister
};
