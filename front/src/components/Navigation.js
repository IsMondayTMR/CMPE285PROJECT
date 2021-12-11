import React from "react"
import { NavLink } from "react-router-dom"
import styles from "../css/signin.module.css"
import * as ROUTES from "../constant/routes"
const Navigation = () => (
  <nav className = {styles.nav}>
 
        <NavLink to={ROUTES.SIGNIN} className = {styles.link} style={{ marginLeft: "30px"}}>Sign In</NavLink >

        <NavLink to={ROUTES.SIGNUP} className = {styles.link} >New Account</NavLink >
 
  </nav>
)

export default Navigation
