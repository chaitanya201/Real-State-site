import axios from "axios";
import React, { useState } from "react";
import CustomAlert from "./CustomAlert";
import { useSelector, useDispatch } from "react-redux";
import GoogleMaps from "./GoogleMaps";
import { Link, useLocation } from "react-router-dom";

export default function AddProperty() {
  // const dispatch = useDispatch()
  const token = useSelector((state) => state.loginToken.token);
  const location = useLocation();
  const  property  = location.state ? location.state.property : null;
  console.log("property name is ", property);
  

  const [keywords, setKeywords] = useState( property && property.keywords ?property.keywords  : "");
  console.log("keywords initial  ", keywords);
  const center = property ? property.location : { lat: 17.8955, lng: 75.0253 };
  const [markerPosition, setMarkerPosition] = useState(
    property ? property.location : null
  );
  const user = useSelector((state) => state.userObject.userObject);
  const [propertyName, setPropertyName] = useState(
    property ? property.name : ""
  );
  const [propertyPrice, setPropertyPrice] = useState(
    property ? property.price : ""
  );
  const [additionalInfo, setAdditionalInfo] = useState(
    property ? property.info : ""
  );
  const [propertyImages, setPropertyImages] = useState(
    property ? property.images : ""
  );
  const [propertyStatus, setPropertyStatus] = useState(
    property ? property.forSale : false
  );
  const [alertMsg, setAlertMsg] = useState(null);
  console.log("marker position is #######", markerPosition);
  console.log("property images", typeof propertyImages);
  console.log("status");

  // console.log('images is ', JSON.parse(images));
  const onFormSubmit = async (e) => {
    e.preventDefault();
    console.log("in from");
    // *********************
    // ********** https://stackoverflow.com/questions/68940766/react-sending-array-of-objects-as-form-data
    // ********** visit this site for JSON.Stringify()
    if (markerPosition && propertyName.trim().length > 0) {
      const propertyData = new FormData();
      // handling images
      [...propertyImages].map((image) => {
        propertyData.append("propertyImages", image);
      });
      let a = [];
      let b = keywords.split("#");
      let check = false;
      let condition = "!@$%^&*()_+=-`~<>?/.,;:\r\n";
      for (let i = 0; i < b.length; i++) {
        if (condition.includes(b[i])) {
          continue;
        } else {
          for (let c = 0; c < b[i].trim().length; c++) {
            console.log("condition ", condition.includes(b[i][c]), " c is ", c);
            if (condition.includes(b[i][c])) {
              check = true;
              break;
            }
          }
          if (!check) {
            a.push(b[i].trim())
            
          } else {
            check = false;
          }
        }
      }
      // a.map(keyword => {
      //   propertyData.append('keywords', keyword)
      // })
      console.log("b is ", b);
      console.log("A is ", a);
      // propertyData.append('keywords', a)

      propertyData.append("name", propertyName.trim());
      propertyData.append("price", propertyPrice);
      propertyData.append("additionalInfo", additionalInfo.trim());
      propertyData.append("userId", user._id);
      propertyData.append("lat", markerPosition.lat);
      propertyData.append("lng", markerPosition.lng);
      propertyData.append("propertyId", property ? property._id : null);
      propertyData.append("forSale", propertyStatus);
      propertyData.append("keywords",a)
      const headers = {
        authorization: "Bearer " + token,
      };
      console.log("req sent");
      try {
        const response = await axios.post(
          "http://localhost:5000/property/add",
          propertyData,
          { headers }
        );
        console.log("res", response.data);
        if (response.data.status === "success") {
          setAlertMsg("property added successfully");
        } else {
          setAlertMsg("Unable to add/update property");
        }
      } catch (error) {
        setAlertMsg("something went wrong while adding the property");
      }
    } else {
      alertMsg("Add Information correctly");
    }
  };

  return (
    <div>
      <div>
        <Link to={"/profile"}>Profile</Link>
      </div>
      {alertMsg ? (
        <CustomAlert msg={alertMsg} alertColor={"red"} />
      ) : (
        <span></span>
      )}
      <div className="flex bg-slate-300 ">
        <div className="px-2 py-3 rounded bg-slate-50 ">
          <form method="post" onSubmit={onFormSubmit}>
            <div className="px-3 py-3">
              <div>
                <input
                  value={propertyName}
                  className="border-2 rounded-lg focus:outline-none focus:border-blue-600 focus:rounded px-4 "
                  type="text"
                  placeholder="name"
                  required
                  onChange={(e) => {
                    setPropertyName(e.target.value);
                  }}
                />
              </div>
              <div className="py-3">
                <input
                  value={propertyPrice}
                  className="border-2 rounded-lg focus:outline-none focus:border-blue-600 focus:rounded px-4 "
                  type="number"
                  placeholder="Price"
                  required
                  onChange={(e) => {
                    setPropertyPrice(e.target.value);
                  }}
                />
              </div>
              <div>
                {property && property.forSale ? (
                  <select
                    value={propertyStatus}
                    onChange={(e) => {
                      console.log("options..", e.target.value);
                      setPropertyStatus(e.target.value);
                    }}
                  >
                    <option value={true}>Sale</option>
                    <option value={false}>Rent</option>
                  </select>
                ) : (
                  <select
                    value={propertyStatus}
                    onChange={(e) => {
                      console.log("options**", e.target.value);
                      setPropertyStatus(e.target.value);
                    }}
                  >
                    <option value={false}>Rent</option>
                    <option value={true}>Sale</option>
                  </select>
                )}
              </div>
              <div>
                <textarea
                  value={additionalInfo}
                  cols={30}
                  rows={6}
                  className="border-2 rounded-lg focus:outline-none focus:border-blue-600 focus:rounded px-4 "
                  type="text"
                  placeholder="Additional Info"
                  required
                  onChange={(e) => {
                    setAdditionalInfo(e.target.value);
                  }}
                />
              </div>
              <div>
                <textarea
                  value={keywords}
                  cols={30}
                  rows={6}
                  className="border-2 rounded-lg focus:outline-none focus:border-blue-600 focus:rounded px-4 "
                  type="text"
                  placeholder="Add keywords"
                  required
                  onChange={(e) => {
                    setKeywords(e.target.value);
                  }}
                />
              </div>
              <div className="py-3">
                <label htmlFor="name">Select Images for property</label>
                <input
                  type="file"
                  multiple
                  max={2}
                  maxLength={2}
                  onChange={(e) => {
                    console.log("files", e.target.files);
                    setPropertyImages(e.target.files);
                  }}
                />
              </div>

              <div>
                <input
                  className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                  type="submit"
                  value="Add Property"
                />
              </div>
            </div>
          </form>
        </div>
        <div>
          <GoogleMaps center={center} setMarkerPosition={setMarkerPosition} />
        </div>
      </div>
    </div>
  );
}
