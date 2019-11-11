// @ts-check

import React from 'react';
import './links.scss';


const links = [
  // {
  //   name: 'Apps',
  //   imageUrl: '',
  //   url: 'chrome://apps/',
  // },
  {
    name: 'Facebook',
    imageUrl: '',
    url: 'https://www.facebook.com/login.php',
  },
];


function Links() {
  function onAddClick() {
    const url = window.prompt('Enter the website URL', 'https://');
    links.push();
  }


  function renderImage(link) {
    const { hostname } = new URL(link.url);
    const logoUrl = `//logo.clearbit.com/${hostname}`;

    return (
      <div className="links__item-image">
        <img src={logoUrl} />
      </div>
    );
  }

  return (
    <div className="links">

      {links.map((link) => (
        <div className="px-5">
          <a href={link.url} className="links__item">
            {renderImage(link)}

            <div className="links__item-name">
              {link.name}
            </div>
          </a>
        </div>
      ))}

      <div className="px-5">
        <button type="button" onClick={onAddClick} className="links__item">
          Add
        </button>
      </div>

    </div>
  );
}


export default Links;
