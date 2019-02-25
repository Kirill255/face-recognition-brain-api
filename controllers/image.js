const handleImage = (pgDB) => (req, res) => {
  const { id } = req.body;

  pgDB("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => res.json(entries[0]))
    .catch(() => res.status(400).json("Unable to get entries."));
};

module.exports = {
  handleImage
};
