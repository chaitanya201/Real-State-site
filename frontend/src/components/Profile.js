import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../ReactStore/userSlice";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import FormData from "form-data";
export default function Profile() {
  const dispatch = useDispatch();
  const [cookie, setCookies] = useCookies(['user']);
  // console.log("cookie", cookie.user);
  // console.log("cookie ", cookie.token);
  const user = useSelector((state) => state.userObject.userObject);
  const token = useSelector((state) => state.loginToken.token);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [pic, setPic] = useState(user.pic);
  // console.log(token);

  const [errMsg, setErrMsg] = useState(null);
  const [validName, setValidName] = useState(true);
  // console.log("user is ", user);
  const formSubmit = async (e) => {
    e.preventDefault();
    // console.log("valid name status ", validName);
    if (!validName) {
      setErrMsg("Enter Valid name");
      return;
    } else {
      setErrMsg(null);
    }
    // console.log("email is ", email);
    // console.log("initial email", user.email);
    // console.log("name is ", name);
    // console.log("pic is ", pic);

    // object

    const userInfo = new FormData();
    userInfo.append("name", name);
    userInfo.append("email", email);
    userInfo.append("pic", pic);
    userInfo.append("initialEmail", user.email);
    const dummyData = {
      name,
      email,
      pic,
      initialEmail: user.email,
    };
    // const data = new FormData();
    // data.append("pic", pic);
    // data.append("name", name.trim());
    // data.append("email", email.trim());

    const headers = {
      authorization: "Bearer " + token,
    };
    try {
      // const response = await axios.post(
      //   "http://localhost:5000/user/registration",
      //   userInfo,
      //   {
      //     headers,
      //   }
      // );
      // console.log("res is ", res);
      const response = await axios.post(
        "http://localhost:5000/user/edit-user",
        userInfo,
        {
          headers,
        }
      );
      if (response.data.status === "success") {
        dispatch(updateUser(response.data.user));
        setErrMsg(response.data.msg);
        const expires = new Date(Date.now() + (60*24*3600000))
        setCookies('user', response.data.user , {path:'/', expires, maxAge: 2 * 60 * 60 * 1000})
      } else {
        setErrMsg(response.data.msg);
      }
    } catch (error) {
      console.log("error msg is ***********************************");
      console.log(error);
      // console.log( error);
      console.log("***********************************************");
      setErrMsg("error while sending the request");
    }
  };
  return (
    <div>
      <div>Edit Profile</div>
      <div>
        <Link to={"/property/add"}>Add Property</Link>
      </div>
      <div>
        <Link to={"/property/show-all-properties"}>Show all Properties</Link>
      </div>
      {errMsg ? (
        <div>
          <p>{errMsg}</p>
        </div>
      ) : (
        <div></div>
      )}
      <div>
        <div>
          <img
            src={"http://localhost:5000/profile-pic/" + user.pic}
            alt="loading"
          />
        </div>
        <form method="post" onSubmit={formSubmit}>
          <div>
            <div>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                value={name}
                required
                onChange={(e) => {
                  setName(e.target.value);
                  console.log("name is ", name.trim());
                  if (name.trim().length < 4) {
                    setValidName(false);
                  } else {
                    setValidName(true);
                  }
                }}
              />
              {!validName ? <p>Enter a valid name</p> : <div></div>}
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                value={email}
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div>
              <label htmlFor="photo">Change Profile picture</label>
              <input
                type="file"
                onChange={(e) => {
                  setPic(e.target.files[0]);
                }}
              />
            </div>
            <div>
              <input type="submit" value={"Save Changes"} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
