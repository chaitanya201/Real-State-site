import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";

export default function AddToWishList({ property }) {
  const [success, setSuccess] = useState(false);
    const token = useSelector(state => state.loginToken.token)
    const user = useSelector(state => state.userObject.userObject)
    const headers = {
        authorization: "Bearer " + token
    }
  return (
    <div>
      {
          !success ? <button
          className="bg-yellow-300"
        onClick={(e) => {
          try {
            const response = axios.post(
              "http://localhost:5000/user/add-to-wishlist?_id="+user._id,
              {property}, {headers}
            );
            if (response.data.status === "success") {
              setSuccess(true);
            }
          } catch (error) {}
        }}
      >
        Add To Cart
      </button> : <button disabled className="bg-green-500">Added</button>
      }
    </div>
  );
}
