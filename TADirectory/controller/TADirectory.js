const { TaModel } = require("../model/TADirectory");
const updateUserPoints = require("../utils/addPoints").updateUserPoints;
const { TaCourseModel } = require("../model/TADirectory");
const Redis = require("redis");
const client = Redis.createClient();
const DEFAULT_EXPIRATION = 600;
const runRedis = async () => {
  await client.connect();
};
runRedis();

exports.getAllTas = async (req, res) => {
  try {
    let tas = await client.get("tas");
    // get when will it expire
    // const ttl = await client.ttl("tas");
    // console.log("ttl", ttl);
    if (!tas || tas.length === 0) {
      console.log("tas not found in cache");
      tas = await TaModel.find();
      client.setEx("tas", DEFAULT_EXPIRATION, JSON.stringify(tas));
    } else tas = JSON.parse(tas);

    return res.status(200).json(tas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
// TODO make url deployed
exports.addTa = async (req, res) => {
  const { name, email, officeLocation } = req.body;
  const uniEmail = email + "@giu-uni.de";
  console.log(uniEmail);
  const found = await TaModel.find({ email: uniEmail });
  if (found !== null && found.length > 0) {
    return res.status(200).json({ message: "TA already exists" });
  }

  try {
    await TaModel.create({
      name,
      email: uniEmail,
      officeLocation,
    });
    // updateUserPoints(userEmail, 10);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
  res.status(200).json({ message: "TA created" });
};
23;

exports.getTaCourses = async (req, res) => {
  try {
    let tas = await client.get("taCourses");
    if (!tas || tas.length === 0) {
      console.log("tas not found in cache");
      tas = await TaCourseModel.find();
      client.setEx("taCourses", DEFAULT_EXPIRATION, JSON.stringify(tas));
    } else tas = JSON.parse(tas);
    res.status(200).json(tas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.assignTa = async (req, res) => {
  // TODO  get all tuts already exist for this course and compare with the new ones
  const { email, tutorials, courseName, officeHours } = req.body;
  console.log(email, tutorials, courseName, officeHours);
  // const userEmail = getCookie(req).email;
  let found = await TaModel.find({ email: email });
  if (found === null || found.length === 0) {
    return res.status(404).json({ message: "TA not found" });
  }
  found = found[0];
  try {
    console.log(found);

    await TaCourseModel.create({
      name: found.name,
      officeLocation: found.officeLocation,
      email,
      tutorials,
      courseName,
      officeHours,
    });
    res.status(200).json({ message: "TA assigned" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.deleteTa = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  try {
    await TaModel.deleteOne({ email });
    res.status(200).json({ message: "TA deleted" });
    await TaCourseModel.deleteMany({
      email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.deleteTaCourse = async (req, res) => {
  const { _id } = req.body;
  try {
    await TaCourseModel.deleteOne({ _id });
    res.status(200).json({ message: "TA course deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
