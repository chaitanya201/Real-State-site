import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <div>Navbar
    <Link to={'/home'}>Home</Link>
    <Link to={'/profile'}>Edit Profile</Link>
    <Link to={'/property/show-all-properties'}>Show All Properties</Link>
    </div>
  )
}
