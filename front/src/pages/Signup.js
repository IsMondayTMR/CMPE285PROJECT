import React, {useState} from "react"
import styles from "../css/signin.module.css"
import * as ROUTES from "../constant/routes"

function Signup(props) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const isInValid = email === '' || password === ''


    async function handleSignUp(event) {
        event.preventDefault()
        if (!email || !password) {
            return;
        }

        try{
            let res = await fetch(`${ROUTES.db}user`, {
    
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({

                    email : email,
                    password: password,
                })

            });
        
            let result = await res.json();
  
            if (result.message === "new user created") {
                props.handleClose()
                props.handleSignInShow()
            } else {
                return
            }
            
        }catch(e){
            console.log(e);
        }
    }
    return(
       
        <div style = {{display: props.show ? 'block' :'none' }} className = {styles.signinContainer} onSubmit = {()=>props.handleClose()}>
            <a  className= {styles.close} onClick = {()=>props.handleClose()}/>
            <div className = {styles.title}>
                stock suggestion engine 
            </div>
            <div className = {styles.line}></div>

            <form className = {styles.signinForm} onSubmit = {handleSignUp}>
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

                <button type = "submit" className ={styles.button} disabled = {isInValid}>Sign up</button>

            </form>
        </div>
    )
}

export default Signup