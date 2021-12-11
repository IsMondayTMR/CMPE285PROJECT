import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import * as ROUTES from '../constant/routes'
import * as Utils from '../utils/functions'
import jwt_decode from 'jwt-decode'
const Context = React.createContext()
function UserContext({children}){

    const navigate = useNavigate()
    const [user, setUser] = useState();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [data, setData] = useState([])
    const [number,setNumber] = useState([])
    useEffect (() => {
        
        const current = JSON.parse(localStorage.getItem('token'))
        const sessionUser = JSON.parse(sessionStorage.getItem('token'))
        if ((current === undefined || current === null) && (sessionUser === undefined || sessionUser === null)) {
            setIsAuthorized(false)
            return 
        }

        if (sessionUser !== null || sessionUser !== undefined) {
            setUser(sessionUser)
            setIsAuthorized(true)
            getPortfolio()
            return 
        }

        // var decoded = jwt_decode(user);
        // var exp = decoded.exp
        
        // if (Date.now() < exp * 1000) {
        //     setUser(current)
        //     setIsAuthorized(true)
        //     return 
        // }
        // localStorage.removeItem("token")
        // sessionStorage.removeItem("token")
        // setIsAuthorized(false)
        return
    }, [user])
    function logout(){
        localStorage.removeItem("token")
        sessionStorage.removeItem("token")
        setUser(null);
        setIsAuthorized(false)
        navigate(ROUTES.DEFAULT);
        Utils.refresh()
    }

    async function getPortfolio() {

        const sessionUser = JSON.parse(sessionStorage.getItem('token'))
        
        let res = await fetch(`${ROUTES.db}portfolio`, {
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "x-access-token" : sessionUser,
            }
        })
        let result = await res.json()

        for (var key in result.portfolios) {
            if (result.portfolios.hasOwnProperty(key)) {
                console.log(result.portfolios[key]);
            
                data.push(result.portfolios[key])
                number.push(key)
            }
        }
    }
    return(
        <Context.Provider value = {{user, data, number,setUser, logout, isAuthorized}}>
            {children}
        </Context.Provider>
    )
}

export {UserContext, Context};