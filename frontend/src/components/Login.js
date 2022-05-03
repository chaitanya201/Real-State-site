import axios from 'axios';
import React, { useState } from 'react'
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateLoginStatus } from '../ReactStore/loginStatus';
import { updateToken } from '../ReactStore/loginToken';
import { updateUser } from '../ReactStore/userSlice';

export default function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [cookies, setCookies] = useCookies(['user']);
    const [errMsg, setErrMsg] = useState(null);
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");
    const [validEmail, setValidEmail] = useState(true);
    const [validPassword, setValidPassword] = useState(true);
    const onFormSubmit = async (e) => {
        e.preventDefault()
        const user = {email, password}
        const response = await axios.post('http://localhost:5000/user/login', user)
        console.log("data ", response.data);
        if(response.data.status === "success") {
            dispatch(updateLoginStatus())
            dispatch(updateUser(response.data.user))
            dispatch(updateToken(response.data.token))
            const expires = new Date(Date.now() + (60*24*3600000))
            setCookies('user', response.data.user , {path:'/', expires, maxAge: 2 * 60 * 60 * 1000})
            setCookies('token', response.data.token , {path:'/'})
            navigate('/profile')
        } else {
            setErrMsg(response.data.msg)
        }
    } 
  return (
    <div>
        <div>
            Login
        </div>
        <div>
            {
                errMsg ? <div>
                    <h1>{errMsg}</h1>
                </div> : <div></div>
            }
        </div>
        <div>
            <form method='post' onSubmit={onFormSubmit}>
                <div>
                    <label htmlFor="login">Email</label>
                    <input type="text" required value={email} onChange={(e) => {
                        setEmail(e.target.value)
                        if(email.trim().length > 1) {
                            setValidEmail(true)
                        } else {
                            setValidEmail(false)
                        }
                    }} />
                    {
                        !validEmail ? <div><p>Enter Valid Email</p></div> : <div></div> 
                    }
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" required value={password} onChange={(e) => {
                        setPassword(e.target.value)
                        if(email.trim().length > 1) {
                            setValidPassword(true)
                        } else {
                            setValidPassword(false)
                        }
                    }} />
                    {
                        !validPassword ? <div>Enter Valid Password</div> : <div></div>
                    }
                </div>
                <div>
                    <input type="submit" value={'Login'} />
                </div>
            </form>
        </div>

    </div>
  )
}
