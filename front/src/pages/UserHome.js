import React, {useState, useContext} from "react"
import styles from "../css/signin.module.css"
import { MultiSelect } from "react-multi-select-component";
import * as ROUTES from '../constant/routes'
import {Context} from '../context/userContext'
import { useNavigate  } from 'react-router-dom'

const options = [
    { label: "Growth Investing", value: "Growth Investing" },
    { label: "Index Investing", value: "Index Investing" },
    { label: "Quality Investing", value: "Quality Investing"},
    {label: "Value Investing", value: "Value Investing"},
  ];


function UserHome() {

    const [selected, setSelected] = useState([]);
    const [invest, setInvest] = useState('');
    const {user} = useContext(Context)
    const navigate = useNavigate()
    const isInvalid = selected.length < 1 || selected.length > 2 || invest === ''

    async function getPortfolio(event) {
        event.preventDefault()

        const strategyies = []
        selected.forEach(item => 
            {
                if (item.label === "Growth Investing") {
                    strategyies.push('growth')
                }
                if (item.label === "Index Investing") {
                    strategyies.push('index')
                }
                if (item.label === "Quality Investing") {
                    strategyies.push('quality')
                }
                if (item.label === "Value Investing") {
                    strategyies.push('value')
                }
            })
            console.log(invest)
            console.log(strategyies)
            console.log(user)
        try {
            
        
            let res = await fetch(`${ROUTES.db}portfolio`, {
                method: 'post',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "x-access-token" : user,
                },
                body: JSON.stringify({
                    strategy : strategyies,
                    money : invest
                })
            })
    
           
            let result = await res.json();
            console.log(result)
            if (result && result.message === "Created new portfolio") {
                navigate(ROUTES.PROFILE)
            }
        } catch(e){
            console.log(e);
        }
        
        
    }

    return(
       <div className = "UserHome">

           <form className = "InvestForm" onSubmit= {getPortfolio}>
                <div className = "InvestAmount" style={{display:"flex",flexDirection:"column"}}>
                <label htmlFor = "invest" style={{marginRight:"20px"}}>Invest Amount</label>

                <input id = "invest"type ="number" min = "5000" style={{width : "410px", height: "40px", border: "1px solid rgb(206, 206, 206)", borderRadius: "5px"}}onChange={({ target }) => setInvest(target.value)}></input>

                </div>

                <div  style={{width:"420px", marginBottom: "300px"}}>

                    <label htmlFor = "Selector" >Selector</label>
                    <MultiSelect
                        id = "Selector"
                        options={options}
                        value={selected}
                        onChange={setSelected}
                        labelledBy="Select"
                />
                </div>

                <button type = "submit" disabled = {isInvalid} className ={styles.button} >Submit</button>
            </form>
           
       </div>

    )
}

export default UserHome