import React from 'react'
import {Routes ,Route } from 'react-router-dom';

import * as ROUTES from '../constant/routes'
import HomePage from '../pages/HomePage';
import UserHome from '../pages/UserHome';
import Profile from '../pages/Profile'
function Routers(props) {


    return (
      
            <Routes>
                <Route path = {ROUTES.DEFAULT} element = {<HomePage/> } />
                <Route exact path = {ROUTES.HOME} element = {<UserHome/> } />
                <Route exact path = {ROUTES.PROFILE} element = {<Profile/> } />
            </Routes>
        
    )
}

export default Routers