// @ts-check

import React from 'react';
import './links.scss';


// @ts-ignore
const browser = window.browser || window.chrome;


function Links() {
  const [links, setLinks] = React.useState([]);

  const containerRef = React.useRef(null);


  React.useEffect(() => {
    const numLinks = Math.floor(containerRef.current.offsetWidth / 120); // 100 width + 10 padding

    if (browser && browser.topSites) {
      browser.topSites.get((sites) => {
        setLinks(sites.slice(0, numLinks));
      });
    }
  }, []);


  function renderImage(link) {
    const { hostname, siteName } = link;
    const logoUrl = `https://logo.clearbit.com/${hostname}`;

    return (
      <div className="links__item-image">
        <img
          alt=""
          src={logoUrl}
          onError={function onError(e) {
            delete e.target.onerror;
            delete e.target.onError;

            e.target.className = 'links__item-image not-found';
          }}
        />
        <div className="links__item-image-alphabet">{siteName[0]}</div>
      </div>
    );
  }


  const linksWithSiteName = links.map((link) => {
    const { hostname } = new URL(link.url);
    const hostNamePortions = hostname.split('.');
    const siteName = hostNamePortions[hostNamePortions.length - 2] || link.title;

    return { ...link, hostname, siteName };
  });


  return (
    <div className="links" ref={containerRef}>

      {linksWithSiteName.map((link) => (
        <a key={link.url} title={link.title} href={link.url} className="links__item">
          {renderImage(link)}

          <div className="links__item-name">
            {link.siteName}
          </div>
        </a>
      ))}

    </div>
  );
}


export default Links;


// [
//   {
//     title: 'Homepage of ppeters',
//     url: 'http://localhost:3000',
//   },
//   {
//     title: 'apple',
//     url: 'http://apple.com',
//   },
//   {
//     title: 'Localhost',
//     url: 'http://facebook.com',
//   },
//   {
//     title: 'Google',
//     url: 'http://google.com',
//   },
//   {
//     title: 'PepperTab',
//     url: 'http://peppertab.com',
//   },
// ]
