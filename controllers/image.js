const handleImage = (req, res, pgDB) => {
  pgDB("users")
    .where("id", "=", req.body.id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => res.json(entries[0]))
    .catch(() => res.status(400).json("Unable to get entries."));
};

module.exports = {
  handleImage
};
