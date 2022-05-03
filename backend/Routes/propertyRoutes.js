const router = require("express").Router();
const multer = require("multer");
const propertyModel = require("../Database/property");
const userModel = require("../Database/user");
const userAuth = require("../middleware/userAuth");

const storage = multer.diskStorage({
  destination:(req, file, cb)=> {
    cb(null, 'D:/Node  JS Projects/Real-State site/backend/public/PropertyImages')
  },
  filename:  (req, file, cb)=> {
    cb(null, Date.now()+ '_' +file.originalname)
  }
});

const upload = multer({ storage: storage }).array("propertyImages", 10);

const addProperty = async (req, res) => {
  console.log("In add property");
  console.log("body is ", req.body);
  console.log("location is ", req.body.lat, req.body.lng);
  console.log("file is ", req.files);
  console.log("images", req.body.propertyImages);
  if(req.body.name && req.body.price  && req.body.lat && req.body.lng && req.body.keywords && req.body.keywords.length > 0 ) {
    let user
    try {
      user = await userModel.findById(req.body.userId)
      if(!user) {
        return res.send({status:"failed", msg:"Can not get the user"})
      }
      console.log('user found');

    } catch (error) {
      console.log("error while finding user");
      return res.send({status:"failed", msg:"provided user Id is in invalid format"})
    }


    console.log("property id ",typeof req.body.propertyId);
    console.log("keywords ", typeof req.body.keywords);
    

    // propertyId is string 'null' not null thats why used !== operator
    if(req.body.propertyId !== 'null') {
      let property
      try {
        property = await propertyModel.findById(req.body.propertyId)
        if(!property) {
          console.log("property id is  wrong");      
          return res.send({status:"failed", msg:"Can not get the property"})
        }
        console.log('property found.....', property.images);
        let images = []
        req.files ?  
        (req.files.map(file => {
          images.push(file.filename)
        }) ) : (images)
        console.log("images... ", images);
        const lower = req.body.keywords.split(',').map(keyword => {
          return keyword.toLowerCase()
        })
        console.log("lower is ", lower);
         let updatedProperty = await propertyModel.findOneAndUpdate({_id: req.body.propertyId}, {
          $set: {
            name: req.body.name,
            price: req.body.price,
            info: req.body.additionalInfo,
            "location.lat": req.body.lat,
            "location.lng": req.body.lng,
            images: req.files.length > 0 ? images : property.images,
            forSale : req.body.forSale,
            keywords: lower.length <= 10 ? lower : lower.splice(0,9),

          }
        }, {new:true})
        req.files ? console.log("true", req.files) : console.log("false");
        console.log('property updated');
        return res.send({status:"success", msg:"property updated", property: updatedProperty})
        
      } catch (error) {
        console.log("error...", error);
        res.send({status:"failed", msg:"provided property id is wrong or something went wrong while updating property"})
      }
    } else {
      console.log('in else ############');
      let images = []
      req.files.map(file => {
        images.push(file.filename)
      })
      const lower = req.body.keywords.split(',').map(keyword => {
        return keyword.toLowerCase()
      })
      console.log("lower is ", lower);
      let property = new propertyModel({
        name: req.body.name,
        price: req.body.price,
        info: req.body.additionalInfo,
        "location.lat": req.body.lat,
        "location.lng": req.body.lng,
        owner : req.body.userId,
        images,
        keywords: lower.length <= 10 ? [...lower] : lower.splice(0,9),

        forSale: req.body.forSale === 'false' ? false : true
      })

      property.save((err) => {
        if(err) {
          console.log("error while saving", err);
          res.send({status:"failed", msg:"error has occurred while saving the property"})
        } else {
          console.log("property saved successfully");
          res.send({status:"success", msg:"Property Added Successfully"})
        }
      })
    }
  } else {
    console.log("invalid data");
    res.send({status:"failed", msg:"send valid data"})
  }
};


// get all properties of a user
const getUserAllProperties = async (req, res) => {
  if(req.query._id) {
    let user
    try {
      user = await userModel.findById(req.query._id)
      if(!user) {
        console.log("usr does not exists");
        return res.send({status:"failed", msg:"user with provided ID does not exists"})
      }
    } catch (error) {
      console.log("error in provided userId");
      return res.send({status:"failed", msg:"provided user Id is wrong"})
    }
    console.log("user is ", user);
    let allProperties
    try {
      allProperties = await propertyModel.find({owner: req.query._id})
      if(!allProperties) return res.send({status:"success", msg:"User has no properties associated with it", allProperties:null})
      console.log("properties found successfully", allProperties);
      return res.send({status:"success", msg:"Properties found successfully", allProperties})

    } catch (error) {
      console.log("error is ...........",error);
      res.send({status:"failed", msg:"failed to get user properties"})
    }
  } else {
    console.log("provide _id");
    res.send({status:"failed", msg:"provide user Id"})
  }
}

const getAllProperties = async (req, res) => {
  console.log("in get all ");
  try {
    const data = await propertyModel.find().populate('owner')
    console.log("data is ", data);
    res.send({status:"success", allProperties: data})
  } catch (error) {
    console.log("error ", error);
    res.send({status:"failed", msg:"error while collection properties"})
  }
}

router.post("/add",userAuth, upload, addProperty);
router.get('/get-user-properties', userAuth, getUserAllProperties)
router.get('/get-all-properties',userAuth, getAllProperties)


module.exports = router;
