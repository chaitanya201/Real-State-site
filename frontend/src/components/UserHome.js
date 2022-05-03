import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import AllProperties from './AllProperties';

export default function UserHome() {
    const [allRealStateProperties, setAllRealStateProperties] = useState(null);
    const token = useSelector((state) => state.loginToken.token);
    const [alertMsg, setAlertMsg] = useState(null);
    const headers = {
        authorization: "Bearer " + token,
      };
    useEffect(() => {
        const getProperties = async () => {
            try {
            const response = await axios.get('http://localhost:5000/property/get-all-properties', {headers})
            console.log("res ", response.data);
            if(response.data.status === "success") {
                setAllRealStateProperties(response.data.allProperties)
            } else {
                setAlertMsg(response.data.msg)
            }
            } catch (error) {
                setAlertMsg(error)
            }            
        }
        getProperties()
        
        
    }, []);

    console.log("all", allRealStateProperties);
  return (
    <div>
    
        <div>
            {
                allRealStateProperties ? allRealStateProperties.map(property => {
                    return <AllProperties property={property} key={property._id} />
                }) : <span></span>
            }
        </div>
    </div>
  )
}
