import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import GoogleMaps from "./GoogleMaps";
import Alert from "./CustomAlert";
import { Link } from "react-router-dom";
export default function ShowAllProperties() {
  const [allProperties, setAllProperties] = useState(null);
  const imagesURL = "http://localhost:5000/property-images/";
  const user = useSelector((state) => state.userObject.userObject);
  const [alertMsg, setAlertMsg] = useState(null);
  const propertiesData = async () => {
    const response = await axios.get(
      "http://localhost:5000/property/get-user-properties?_id=" + user._id
    );
    console.log("response is ", response.data);
    if (response.data.status === "success") {
      setAllProperties(response.data.allProperties);
    } else {
      setAlertMsg(response.data.msg);
    }
  };
  useEffect(() => {
    propertiesData();
  }, []);
  return (
    <div>
      <div>
        <div>{alertMsg ? <Alert msg={alertMsg} /> : <span></span>}</div>
        {allProperties ? (
          <div>
            <table>
              <tbody>
                {allProperties.map((property) => {
                  return (
                    <div className="space-y-4 bg-green-400">
                      <div className="space-y-3 py-3">
                        <div>
                          <input type="text" value={property.name} readOnly />
                        </div>
                        <div>
                          <button className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                            <Link to="/property/add" state={{ property }}>
                              Edit
                            </Link>
                          </button>
                        </div>

                        <div className="space-y-4 grid grid-cols-3 bg-pink-500 space-x-5 overflow-x-scroll py-3  ">
                          {property.images ? (
                            property.images.map((image) => {
                              return (
                                <div className="w-60 h-60 bg-blue-500 m-4 ">
                                  <tr>
                                    <img
                                      className="h-52"
                                      src={imagesURL + image}
                                      alt="Property pic is loading"
                                    />
                                  </tr>
                                </div>
                              );
                            })
                          ) : (
                            <span>No images found</span>
                          )}
                        </div>

                        <div>
                          <textarea cols="30" rows="6">
                            {property.info}
                          </textarea>
                        </div>
                        <div className="space-y-4">
                          <GoogleMaps center={property.location}></GoogleMaps>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div>No properties found</div>
        )}
      </div>
    </div>
  );
}
