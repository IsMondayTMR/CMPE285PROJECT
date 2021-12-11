import react, { useContext, useEffect, useState } from 'react'
import * as ROUTES from '../constant/routes'
import {Context} from '../context/userContext'
import styles from "../css/signin.module.css"
import TrendsCharts from '../Charts/trendsChart'
// import Portfolio from './Portfolio'
function Profile () {
    const {data, number} = useContext(Context)
    // const [data, setData] = useState([])
    // const [number,setNumber] = useState([])

    useEffect(() => {
        // getPortfolio()
        // try{
        //     fetch(`${ROUTES.db}portfolio`, {
        //         method: 'GET',
        //         headers: {
        //             "Accept": "application/json",
        //             "Content-Type": "application/json",
        //         },
        //     }).then(res => res.json()).then(result=>{
        //         for (var key in result.portfolios) {
        //             if (result.portfolios.hasOwnProperty(key)) {
                    
        //                 data.push(result.portfolios[key])
        //                 number.push(key)
        //             }
        //         }
             
        //     })
        // } catch(e){
        //     console.log(e);
        // }


    }, [data])
    
    // async function getPortfolio() {

    //     const sessionUser = JSON.parse(sessionStorage.getItem('token'))
        
    //     let res = await fetch(`${ROUTES.db}portfolio`, {
    //         method: 'GET',
    //         headers: {
    //             "Accept": "application/json",
    //             "Content-Type": "application/json",
    //             "x-access-token" : sessionUser,
    //         }
    //     })
    //     let result = await res.json()

    //     for (var key in result.portfolios) {
    //         if (result.portfolios.hasOwnProperty(key)) {
    //             console.log(result.portfolios[key]);
            
    //             data.push(result.portfolios[key])
    //             number.push(key)
    //         }
    //     }
    // }
    
    function Strategy(strategy, name) {

 
        var stocks = []
        var keys = []
        let i = 0;
        for (var key in strategy) {
            
            if (strategy.hasOwnProperty(key) && i < 3) {
                stocks.push(strategy[key])
                keys.push(key)
                i++
            }
        }
        var blocks = stocks.map((item, index) => {
            return(
                <div className = {styles.ProfileBlock}>
                    <div> {keys[index]}</div>
                    <div> Current price : {item.current_price}</div>
                    <div> Original cost : {item.original_cost}</div>
                    <div> Growth : {item.growth}</div>   
                    <div> Stock count : {item.stock_count}</div>  
                </div>
            )
        })
        return (
            <>
                <div className = {styles.StrategyTitle}>{name}</div>
                
                <div className = {styles.ProfileBlockContainer}>
                    {blocks}
                </div>
                
            </>
        )
    }
 
   
    
    if(data && data.length > 0) {

        var portfolio = data.map((record, index) => {
            if (index == data.length - 1){
                return null
            }
            var length = record.strategies.length
    
            var tempBlock1 = null;
            var tempBlock2 = null;
            if (length == 1) {
                tempBlock1 = Strategy(record[record.strategies[0]], record.strategies[0])
                // console.log(record.strategies[0])
            } else {
                tempBlock1 = Strategy(record[record.strategies[0]], record.strategies[0])
                tempBlock2 = Strategy(record[record.strategies[1]], record.strategies[1])
                // console.log(record.strategies[0])
                // console.log(record.strategies[1])
            }


            return (<>
                <h1> portfolio # {number[index]}</h1>
                    <div>
                        <div>Stategy Summary</div>
                        <div>portfolio cash total: {record.portfolio_cash_total}</div>
                        <div>portfolio stock total: {record.portfolio_stock_total}</div>
                        <div>portfolio value total: {record.portfolio_value_total}</div>
                    </div>
                {tempBlock1}
                {tempBlock2}
                <div style = {{width : "1100px", margin: "0 auto"}}>
                    <TrendsCharts index = {number[index]} style = {{margin: "0 auto"}}/>
                </div>
            </>)
        })
        return (
            <div className = {styles.ProfileContainer} >
                {/* <Portfolio data = {data} number = {number}/> */}
                {portfolio}
    
            </div>
        )
    } else {
        return(
            <div className = {styles.ProfileContainer} >
                <div> somthingwrong with it </div>
       
            </div>
            // <Loading/>
            )
    }
    
}

export default Profile