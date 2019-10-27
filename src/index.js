import React from 'react';
import ReactDOM from 'react-dom';
import './styles/main.scss';
import App from './app';
import { LocalStorage } from './constants';


const lastTheme = window.localStorage.getItem(LocalStorage.theme);
if (lastTheme) {
  document.documentElement.className = lastTheme;
}


ReactDOM.render(<App />, document.getElementById('root'));
