import './App.css';
import React, {useState} from 'react'

import Header from './pages/Header'
import Routers from './routers/Routers';
import {UserContext} from './context/userContext'


function App() {

  


 
  return (

    
    <div className="App">
       <UserContext>
        <Header/>
        <Routers/>
      </UserContext>
    </div>
  );
}

export default App;
