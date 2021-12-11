import React, {useState, useContext} from "react"
import styles from "../css/signin.module.css"
import { useNavigate  } from 'react-router-dom'
import * as ROUTES from '../constant/routes'
import {Context} from '../context/userContext'

function Signin(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {setUser} = useContext(Context)

    const isInValid = email === '' || password === ''
    const navigate  = useNavigate()

    async function handleSignIn(event) {
        event.preventDefault()
        if (isInValid) {
  
            return;
        }
    
        try{
           
            var base64Credentials = btoa(unescape(encodeURIComponent(email + ':' + password)));
            let res = await fetch(`${ROUTES.db}signin`, {
                method: 'post',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization" : "Basic " + base64Credentials,
                }
            });

            let result = await res.json()
            console.log(res)
            console.log(result)
            if(result && result.token){
                console.log(result.token)
                if(result && (result.token !=undefined || result.token != null)){
                    console.log(result.token)
                    localStorage.setItem('token', JSON.stringify(result.token))
                    sessionStorage.setItem('token', JSON.stringify(result.token))
                    setUser(JSON.parse(localStorage.getItem('token')))
                    props.handleClose()
                    navigate(ROUTES.HOME)
                }
                
            }else {
                alert(result.message);
            }
            
        }catch(e){
            console.log(JSON.parse(JSON.stringify(e)));
        }
    }


    return(

        <div style = {{display: props.show ? 'block' :'none'}} className = {styles.signinContainer} onSubmit = {()=>props.handleClose()}>
            <a  className= {styles.close} onClick = {()=>props.handleClose()}/>
            <div className = {styles.title}>
                stock suggestion engine 
            </div>
            <div className = {styles.line}></div>
            <form className = {styles.signinForm} onSubmit = {handleSignIn}>
                <div className = {styles.inputGroup}>
                    <div className = {styles.labelGroup}>
                        <label htmlFor = "email" className = {styles.inputLabel}> Email</label>
                    </div>
                    <input id = "email" type = "email"  placeholder = "Email" className = {styles.inputBox} onChange = {({ target }) => setEmail(target.value)}></input>
                </div>  
                
                <div className = {styles.inputGroup}>
                    <div className = {styles.labelGroup}>
                        <label htmlFor = "password" className = {styles.inputLabel}> Password</label>
                    </div>
                    <input id = "password" type = "password" placeholder = "Password" className = {styles.inputBox} onChange = {({ target }) => setPassword(target.value)}></input>
                </div>

                <button type = "submit" disabled = {isInValid} className ={styles.button}  >Sign In</button>
      
                <a href="http://justinbieber.com">Forgot your password?</a>
            </form>
        </div>
    )
}

export default Signin