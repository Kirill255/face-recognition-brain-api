// https://clarifai.com/models/face-detection-image-recognition-model-a403429f2ddf4b49b307e318f00e528b-detection
// https://github.com/Clarifai/clarifai-javascript/blob/master/src/index.js

const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: "9446ba7cd5824fa89a6482bbc6f7c80d"
});

const handleApiCall = (req, res) => {
  const { input } = req.body;

  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, input)
    .then((data) => res.json(data))
    .catch(() => res.status(400).json("Unable to work with API"));
};

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
  handleImage,
  handleApiCall
};
