const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../model/user");

const saltRounds = 10;
const domain = process.env.DOMAIN;

// Refresh token function
function generateRefreshToken(user, expiresAt, isrefresh) {
  console.log(user);
  const { email, isAdmin } = user;
  return jwt.sign(
    { email, isAdmin },
    isrefresh
      ? process.env.REFRESH_TOKEN_SECRET
      : process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: expiresAt,
    }
  );
}

exports.signupUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await userModel.create({
      userName,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // Create an access token
    const jwtExpirationMinutes = 5 * 60000; // JWT token expiration time in minutes
    const refreshToken = generateRefreshToken(newUser, "1825d", true);
    const token = generateRefreshToken(newUser, jwtExpirationMinutes, false);
    const currentTime = new Date();
    const cookieExpiration = new Date(
      currentTime.getTime() + jwtExpirationMinutes
    );
    res.cookie("authcookie", token, {
      expires: cookieExpiration,
      httpOnly: true,
      sameSite: "none",
      secure: true,
      domain,
      path: "/",
    });
    const refreshTokenExpirationYears = 5; // Refresh token expiration time in years
    const refreshTokenExpiration = new Date(
      currentTime.getTime() +
        refreshTokenExpirationYears * 365 * 24 * 60 * 60 * 1000
    );
    res.cookie("refreshToken", refreshToken, {
      expires: refreshTokenExpiration,
      httpOnly: true,
      sameSite: "none",
      secure: true,
      domain,
      path: "/",
    });

    newUser.token = token;
    console.log("Sign up done");
    res.status(200).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!(email && password)) {
      return res.status(400).json({ message: "All input is required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email does not exist" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    // Calculate the new time after adding 5 hours
    const fiveHoursInMilliseconds = 5 * 60 * 60 * 1000; // 5 hours in milliseconds
    const newTime = new Date(Date.now() + fiveHoursInMilliseconds);

    // const domains = [".ahmed-yehia.me", "localhost"];
    // const domain = ".ahmed-yehia.me";

    // Set cookies for each domain
    const refreshToken = generateRefreshToken(user, "1825d", true);
    const token = generateRefreshToken(user, "1", false);

    res.cookie("authcookie", token, {
      expires: newTime,
      httpOnly: true,
      sameSite: "none",
      secure: true,
      domain: domain,
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      expires: newTime,
      httpOnly: true,
      sameSite: "none",
      secure: true,
      domain: domain,
      path: "/",
    });

    console.log("Logged in");
    return res.status(200).send("Login successful");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUser = async (req, res) => {
  const user_email = req.params.userEmail;
  console.log(req.params);
  const user = await userModel.findOne({ email: user_email });

  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }

  console.log(user);
  res.status(200).json(user);
};

exports.logoutUser = async (req, res) => {
  console.log("Logged out");
  res.clearCookie("authcookie");
  res.clearCookie("refreshToken"); // Clear both the access and refresh tokens
  res.json({ message: "Logout successful" });
};

exports.updateUserPoints = async (req, res) => {
  const { userEmail, points } = req.body;
  userModel.findOneAndUpdate(
    { email: userEmail },
    { contributionPoints: points },
    (err, doc) => {
      if (err) {
        console.log("Something wrong when updating data!");
      }
      console.log(doc);
    }
  );

  res.status(200).json({ message: "User updated" });
};
