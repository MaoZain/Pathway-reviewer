import React from 'react';
import ReactDOM from 'react-dom';
import ReactRouter from './router/Router';

ReactDOM.render(
<ReactRouter />, document.getElementById('root')
);

if (!window.location.host.startsWith("www")){
    window.location = window.location.protocol + "//" + "www." + window.location.host + window.location.pathname;
}