import React from 'react';
import ReactDOM from 'react-dom';
import './styles/main.scss';
import App from './app';


if (document.documentElement.className === '') {
  document.documentElement.className = 'light';
}

document.onkeypress = (e) => {
  if (e.keyCode === 32) {
    if (document.documentElement.className === 'light') {
      document.documentElement.className = 'dark';
    } else {
      document.documentElement.className = 'light';
    }
  }
};


ReactDOM.render(<App />, document.getElementById('root'));
