const userModel = require("../Database/user");
const jwt = require("jsonwebtoken");
const secretKey = require("../SecretKey/secretKey").apply();

const userAuth = async (req, res, next) => {
  console.log("In user Auth");
  const { authorization } = req.headers;
  console.log("auth ", authorization);
  console.log("req.file ", req.file);
  console.log("name ", req.body.name);
  if (authorization && authorization.startsWith("Bearer ")) {
    console.log("check ", authorization.startsWith("Bearer "));
    const token = authorization.split(" ")[1];
    console.log(token, "token");
    // console.log("jwt verification .... ",jwt.verify(token, secretKey))
    const { userId } = jwt.verify(token, secretKey);
    console.log("user id ", userId);
    const user = await userModel.findOne({ _id: userId }).select("-password");
    if (user) {
      console.log("auth is successful");
      req.user = { ...user };
      next();
    } else {
      console.log("user id is invalid ", userId);
      res.send({ status: "failed", msg: "token is invalid" });
    }
  } else {
    console.log("something is wrong with bearer token");
    res.send({ status: "failed", msg: "Something is wrong with Bearer token" });
  }
};

module.exports = userAuth;
