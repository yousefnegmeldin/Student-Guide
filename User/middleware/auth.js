const jwt = require("jsonwebtoken");
const userModel = require("../model/user");
const config = process.env;
module.exports.verifyToken = (req, res, next) => {
  const authcookie = req.cookies.authcookie;
  if (!authcookie) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(authcookie, config.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    console.log(decoded);
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};
module.exports.verifyRole = (req, res, next) => {
  const authcookie = req.cookies.authcookie;
  if (!authcookie) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(authcookie, config.ACCESS_TOKEN_SECRET);
    const user_id = decoded.user_id;
    userModel.findOne({ _id: user_id }).then((user) => {
      if (user.isAdmin) {
        console.log("yeah ya admin  \n\n\n\n\n\n");
        return next();
      } else {
        return res.status(401).send("Invalid Token you are not admin");
      }
    });
  } catch (err) {
    return res.status(401).send("Invalid Token"); 
  }
};
module.exports.testVerifyToken = (req, res, next) => {
  console.log(" you made it to the protected route");
  res.send("You made it to the route.");
  next();
}

module.exports.testVerifyRole = (req, res, next) => {
  console.log(" you made it to the admin route");
  res.send("You made it to the route.");
  next();
};