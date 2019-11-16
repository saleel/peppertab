// @ts-check

import React from 'react';
import PropTypes from 'prop-types';
import CameraIcon from '@iconscout/react-unicons/icons/uil-camera';
import StoreContext from '../../contexts/store-context';
import { Themes } from '../../constants';
import ThemeContext from '../../contexts/theme-context';
import usePromise from '../../hooks/use-promise';
import './background.scss';


function Background(props) {
  const { children } = props;

  const { generalStore } = React.useContext(StoreContext);
  const { theme } = React.useContext(ThemeContext);

  /** @type React.MutableRefObject<HTMLDivElement> */
  const backgroundRef = React.useRef(null);

  const [background] = usePromise(
    () => generalStore.getBackground(),
    { cacheKey: 'BACKGROUND', updateWithRevalidated: false },
  );

  const showBackground = theme === Themes.inspire && !!background;


  function onScroll() {
    if (!backgroundRef.current) return;

    const windowOffset = window.pageYOffset;
    const contentOffset = window.innerHeight * 0.6;
    const opacity = Math.min(1, windowOffset / contentOffset);
    backgroundRef.current.style.setProperty('--bg-opacity', (1 - opacity).toString());
  }


  React.useEffect(() => {
    if (showBackground) {
      window.removeEventListener('scroll', onScroll);
      window.addEventListener('scroll', onScroll);
    }

    onScroll();

    return () => { window.removeEventListener('scroll', onScroll); };
  }, [showBackground]);


  React.useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);
  }, []);


  return (
    <div ref={backgroundRef} className="background">

      {showBackground && (
        <>
          <div
            className="background__image"
            style={{ backgroundImage: `url('${background.base64}')` }}
          />

          <a className="background__info" target="_blank" rel="noopener noreferrer" href={background.link}>
            <div className="background__info-details">
              <div className="background__info-location">
                <div>{background.location}</div>
              </div>
              <div className="background__info-user">
                <div>
                  Photo by
                  {' '}
                  {background.user}
                </div>
              </div>
            </div>
            <div className="background__info-icon">
              <CameraIcon size="18" />
            </div>
          </a>
        </>
      )}

      <div className="background__content">
        {children}
      </div>

    </div>
  );
}


Background.propTypes = {
  children: PropTypes.node.isRequired,
};


export default Background;
