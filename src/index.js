import React from 'react';
import ReactDOM from 'react-dom';
import './styles/main.scss';
import App from './app';
import { LocalStorage, Themes } from './constants';


const theme = window.localStorage.getItem(LocalStorage.theme) || Themes.light;
document.documentElement.className = theme;


ReactDOM.render(<App />, document.getElementById('root'));
