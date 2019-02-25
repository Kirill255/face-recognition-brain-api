const handleRegister = (pgDB, bcrypt) => (req, res) => {
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
};

module.exports = {
  handleRegister
};
