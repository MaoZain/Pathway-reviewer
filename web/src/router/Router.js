import React, { Component } from 'react';
import { 
  Route, 
  BrowserRouter,
} from 'react-router-dom'; 
import Main from '../main';

//React的路由，不同规则的path对应不同的组件
const ReactRouter = () => (
  <BrowserRouter>
  	<div>
      <Route exact path = "/" component = { Main }/>
    </div>
  </BrowserRouter>
);

export default ReactRouter;
