import React, {useState,useEffect, useContext} from 'react'
import styles from "../css/signin.module.css"
import Signin from './signin'
import Signup from './Signup'
import {Context} from '../context/userContext'
import * as ROUTES from '../constant/routes'
function Header() {

    const [show, setShow] = useState(false)
    const [registerShow, setRegisterShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleRegisterClose = () => setRegisterShow(false)
    const {isAuthorized, logout} = useContext(Context)

    const buttons = isAuthorized == false ? <div>
                <button className="btn" onClick = {() => setShow(!show)}>Sign In</button>
                <button className = "NewUser" onClick = {() => setRegisterShow(!registerShow)}>New User?</button>
            </div> : <div>
                <a href = {ROUTES.HOME} style = {{margin : " 10px"}}>Home</a>
                <a href = {ROUTES.PROFILE} style = {{margin : "0 20px 0 0"}}>PROFILE</a>
                <button className="btn" onClick = {() => logout()}>log out</button>
                </div>
    console.log(isAuthorized)
    return(
       <div className="Header" >
            <div className = "Title" >stock suggestion engine </div>
            {buttons}
            <Signin show = {show} handleClose = {handleClose}/>
            <Signup show = {registerShow} handleClose = {handleRegisterClose} handleSignInShow = {() => setShow(true)}/>
       </div>

    )
}

export default Header