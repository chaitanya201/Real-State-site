const userModel = require("../Database/user");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secretKey = require("../SecretKey/secretKey").apply();
const userAuth = require("../middleware/userAuth");
const multer = require("multer");
const propertyModel = require("../Database/property");

// defining storage location for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("in multer");
    cb(null, "D:/Node  JS Projects/Real-State site/backend/public/UserProfile");
  },
  filename: (req, file, cb) => {
    const date = Date.now();
    cb(null, date + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("pic");

// creating API for users

// user registration
const registration = async (req, res) => {
  console.log("in registration");
  console.log("name ", req.body.name);
  console.log("body ", req.body);
  console.log("file ", req.file);
  if (req.body.name) {
    if (req.body.email) {
      if (req.body.mobile) {
        if (req.body.password && req.body.password.length > 3) {
          const findUser = await userModel.findOne({ email: req.body.email });
          if (!findUser) {
            const findUserForMobile = await userModel.findOne({
              mobile: req.body.mobile,
            });
            if (!findUserForMobile) {
              const salt = await bcrypt.genSalt(20);
              const hashedPassword = await bcrypt.hash(req.body.password, salt);
              const user = new userModel({
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mobile,
                password: hashedPassword,
                pic: req.file ? req.file.filename : "dummy image 4.png",
              });
              user.save((err) => {
                if (err) {
                  console.log("error while saving the user", err);
                  res.send({
                    status: "failed",
                    msg: "failed to save user something went wrong while saving",
                  });
                } else {
                  console.log("user registered successfully");
                  res.send({
                    status: "success",
                    msg: "user registered",
                    user: user,
                  });
                }
              });
            } else {
              console.log("mobile exists");
              res.send({ status: "failed", msg: "Mobile no already exists" });
            }
          } else {
            console.log("email exists");
            res.send({ status: "failed", msg: "Email ID already exists" });
          }
        } else {
          console.log("password is empty or length is < 4");
          res.send({
            status: "failed",
            msg: "password is empty or length is < 4",
          });
        }
      } else {
        console.log("mobile no is not provided");
        res.send({ status: "failed", msg: "Mobile no is not provided" });
      }
    } else {
      console.log("Email ID is not provided");
      res.send({ status: "failed", msg: "Email ID is not provided" });
    }
  } else {
    console.log("Name is not provided");
    res.send({ status: "failed", msg: "Name is not provided" });
  }
};

// user login
const login = async (req, res) => {
  console.log("In login function");
  if (req.body.email) {
    const user = await userModel.findOne({ email: req.body.email });
    if (user) {
      const isValid = await bcrypt.compare(req.body.password, user.password);
      if (isValid) {
        const token = jwt.sign({ userId: user._id }, secretKey, {
          expiresIn: "5d",
        });
        const finalUser = await userModel
          .findOne({ _id: user._id })
          .select("-password");
        if (finalUser) {
          console.log("login successful ", "token is ", token);
          return res.send({
            status: "success",
            msg: "login successful",
            user,
            token,
          });
        } else {
          console.log("failed to get final user");
          return res.send({
            status: "failed",
            msg: "failed to get final user",
          });
        }
      } else {
        console.log("wrong password");
        res.send({ status: "failed", msg: "email or password is wrong" });
      }
    } else {
      console.log("email is wrong");
      res.send({ status: "failed", msg: "email or password is wrong" });
    }
  } else {
    console.log("email is empty");
    res.send({ status: "failed", msg: "email is not provided" });
  }
};

// change password
const changePassword = async (req, res) => {
  console.log("In change password");
  if (req.body.password === req.body.confirmPassword) {
    const salt = await bcrypt.genSalt(20);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = await userModel.findOneAndUpdate(
      { _id: req.user._doc._id },
      {
        $set: {
          password: hashedPassword,
        },
      },
      { new: true }
    );
    if (user) {
      console.log("password changed");
      res.send({ status: "success", msg: "Password Changed Successfully" });
    }
  }
};

// edit user profile
const editUser = async (req, res) => {
  console.log("In edit user function ");
  console.log("req.body ", req.body);
  console.log("req.file ", req.file);
  console.log("name is ", req.body.name);
  console.log("email is ", req.body.email);
  if (req.body && req.body.name && req.body.email && req.body.initialEmail) {
    if (req.body.email !== req.body.initialEmail) {
      const findExistingUser = await userModel.findOne({
        email: req.body.email,
      });
      if (findExistingUser) {
        console.log("provided email already exists");
        return res.send({
          status: "failed",
          msg: "Provided Email already taken, choose another email",
        });
      }
    }
    const updateUser = await userModel.findOneAndUpdate(
      { email: req.body.initialEmail },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          pic: req.file ? req.file.filename : req.user._doc.pic,
        },
      },
      { new: true }
    );
    console.log("user model ", updateUser);
    if (updateUser) {
      console.log("user details updated successfully", updateUser);
      res.send({
        status: "success",
        msg: "user updated successfully",
        user: updateUser,
      });
    } else {
      console.log("failed to update user data");
      res.send({ status: "failed", msg: "failed to update user details" });
    }
  } else {
    console.log("data is incorrect");
    res.send({ status: "failed", msg: "provided data is not correct" });
  }
};

const addToWishList = async (req, res) => {
  console.log("in wishlist function");
  let property;
  try {
    property = await propertyModel.findOne({ _id: req.body.property._id });
  } catch (error) {
    console.log("error while getting property", error);
    return res.send({ status: "failed" });
  }
  if (property) {
    let user;
    try {
      user = await userModel.findOne({ _id: req.query._id });
    } catch (error) {
      console.log("error while getting user ", error);
      return res.send({ status: "failed" });
    }

    if (user) {
      console.log("condition ", req.body.property._id in user.wishlist);
      console.log('property id ',  req.body.property._id);
      console.log("list ", user.wishlist)
      if (req.body.property._id in user.wishlist) {
        console.log("already exists in wishlist");
        return res.send({
          status: "success",
          msg: "Already added to wishlist",
        });
      } else {
        console.log("new property");
        try {
          user = await userModel.findOneAndUpdate(
            { _id: req.query._id },
            {
              $set: {
                wishlist: [...user.wishlist, req.body.property._id],
              },
            },
            { new: true }
          );
          if (user) {
            console.log("success");
            return res.send({ status: "success" });
          } else {
            console.log("failed");
            return res.send({ status: "failed" });
          }
        } catch (error) {
          console.log("error while updating");
          return res.send({ status: "failed" });
        }
      }
    } else {
      console.log("wrong user");
      return res.send({status:"failed"})
    }
  } else {
    console.log("wrong property");
    return res.send({"status":"failed"})
  }
};

// user Routes

// 1. Registration
router.post("/registration", upload, registration);

// 2. Login
router.post("/login", login);

// 3. Change Password
router.post("/change-password", userAuth, upload, changePassword);

// 4. Edit user
router.post("/edit-user", userAuth, upload, editUser);


// 5. Add property to wishlist
router.post('/add-to-wishlist', userAuth, addToWishList)
module.exports = router;
