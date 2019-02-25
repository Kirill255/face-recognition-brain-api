const handleProfileGet = (req, res, pgDB) => {
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
};

module.exports = {
  handleProfileGet
};
