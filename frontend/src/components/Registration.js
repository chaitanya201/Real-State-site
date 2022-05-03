import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Registration() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");
  const [isName, setIsName] = useState(true);
  const [isEmail, setIsEmail] = useState(true);
  const [isPassword, setIsPassword] = useState(true);
  const [isMobile, setIsMobile] = useState(true);
  const [errMsg, setErrMsg] = useState(null);

  console.log("##");
  console.log("pic is ", pic);
  const onFormSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("pic", pic);
    data.append("name", name.trim());
    data.append("email", email.trim());
    data.append("mobile", mobile);
    data.append("password", password.trim());

    const response = await axios.post(
      "http://localhost:5000/user/registration",
      data
    );
    console.log(response.data);
    if (response.data.status === "success") {
      navigate("/login");
    } else {
      setErrMsg(response.data.msg);
    }
  };
  return (
    <div>
      <div>
        <h1>Registration</h1>
      </div>
      {errMsg ? (
        <div>
          <h1>{errMsg}</h1>
        </div>
      ) : (
        <div></div>
      )}
      <div>
        <form method="post" onSubmit={onFormSubmit}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (name.trim().length < 1) {
                  console.log("in name");
                  setIsName(false);
                  return;
                } else {
                  setIsName(true);
                }
              }}
            />

            {!isName ? <p>Name is required</p> : <div></div>}
          </div>
          <div>
            <label htmlFor="Email">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (email.trim().length < 1) {
                  console.log("in email");
                  setIsEmail(false);
                  return;
                } else {
                  setIsEmail(true);
                }
              }}
            />
            {!isEmail ? <p>Email is required</p> : <div></div>}
          </div>
          <div>
            <label htmlFor="Mobile">Mobile</label>
            <input
              type="number"
              required
              value={mobile}
              onChange={(e) => {
                setMobile(e.target.value);
                if (mobile < 1000) {
                  console.log("in mobile");
                  setIsMobile(false);
                  return;
                } else {
                  setIsMobile(true);
                }
              }}
            />
            {!isMobile ? <p>Mobile is required</p> : <div></div>}
          </div>
          <div>
            <label htmlFor="Password">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (password.trim().length < 1) {
                  console.log("in password");
                  setIsPassword(false);
                  return;
                } else {
                  setIsPassword(true);
                }
              }}
            />
            {!isPassword ? <p>Password is required</p> : <div></div>}
          </div>
          <div>
            <label htmlFor="picture">Profile Picture</label>
            <input
              type="file"
              name="pic"
              onChange={(e) => {
                setPic(e.target.files[0]);
              }}
            />
          </div>
          <div>
            <input type="submit" value={"Register"} />
          </div>
        </form>
      </div>
    </div>
  );
}
