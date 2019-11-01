// @ts-check

import React from 'react';
import './background.scss';
import StoreContext from '../../contexts/store-context';
import useStore from '../../hooks/use-store';


function Background() {
  const { generalStore } = React.useContext(StoreContext);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  // @ts-ignore
  const [theme, { reFetch }] = useStore(() => generalStore.getTheme());


  generalStore.on('change-theme', reFetch);
  // const fileName = `assets/${theme}-bg.jpg`;
  // const fileName = 'https://live.staticflickr.com/5159/7178241894_76ca156177_b.jpg';

  // React.useEffect(() => {
  //   const img = new Image();
  //   img.onload = () => {
  //     console.log('image loaded');
  //     setTimeout(() => {
  //       setImageLoaded(true);
  //     }, 1000);
  //   };
  //   img.src = fileName;
  // }, [theme]);


  return (
    <div className="background">
      {/* {imageLoaded && (
        <div
          className="background__image"
          style={{ backgroundImage: `url("${fileName}")` }}
        />
      )} */}
    </div>
  );
}


export default Background;
