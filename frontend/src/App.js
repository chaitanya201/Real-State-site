import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import AddProperty from "./components/AddProperty";
import Home from "./components/Home";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import Registration from "./components/Registration";
import ShowAllProperties from "./components/ShowAllProperties";
import UserHome from "./components/UserHome";
import { updateLoginStatus } from "./ReactStore/loginStatus";
import { updateToken } from "./ReactStore/loginToken";
import { updateUser } from "./ReactStore/userSlice";

function App() {
  const [cookie] = useCookies()
  const user = useSelector((state) => state.userObject.userObject);
  const isLoggedIn = useSelector((state) => state.loginStatus.isLoggedIn);
  const dispatch = useDispatch()
  // Object.entries(user).length === 0 && user.constructor === Object
  // this above part is used to check if object is empty or not in JavaScript.
  console.log("condition is", Object.entries(user).length === 0 && user.constructor === Object && !isLoggedIn && cookie && cookie.user && cookie.token )//&& cookie && cookie.user && cookie.token);
  if(Object.entries(user).length === 0 && user.constructor === Object && !isLoggedIn && cookie && cookie.user && cookie.token) {
    dispatch(updateUser(cookie.user))
    dispatch(updateLoginStatus(true))
    dispatch(updateToken(cookie.token))
    console.log("in if.");
  }
  console.log("login status", isLoggedIn);
  console.log("user is ", user);
  console.log("cookie is ", cookie.user);
  console.log("cookie token is ", cookie.token);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="register" element={<Registration />} />
        <Route path="login" element={<Login />}></Route>

        <Route
          path="/profile"
          element={(user && isLoggedIn) || (cookie.user && cookie.user._id)  ? <Profile /> : <Login />}
        ></Route>

        <Route path="login" element={<Login />}></Route>
        <Route path="home" element={user && isLoggedIn ? <UserHome /> : <Login />}></Route>
        <Route path="property/">
          <Route
            path="add"
            element={user && isLoggedIn ? <AddProperty /> : <Login />}
          ></Route>

          <Route
            path="show-all-properties"
            element={user && isLoggedIn ? <ShowAllProperties /> : <Login />}
          ></Route>
        </Route>

        <Route path="login" element={<Login />}></Route>

        <Route path="*" element={<div>Page Not Found</div>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
