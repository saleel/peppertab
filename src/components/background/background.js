// @ts-check

import React from 'react';
import PropTypes from 'prop-types';
import CameraIcon from '@iconscout/react-unicons/icons/uil-camera';
import FocusIcon from '@iconscout/react-unicons/icons/uil-focus';
import StoreContext from '../../contexts/store-context';
import { Themes, CacheKeys } from '../../constants';
import ThemeContext from '../../contexts/theme-context';
import usePromise from '../../hooks/use-promise';
import './background.scss';


function Background(props) {
  const { children } = props;

  const { generalStore } = React.useContext(StoreContext);
  const { theme, changeTheme } = React.useContext(ThemeContext);

  /** @type React.MutableRefObject<HTMLDivElement> */
  const backgroundRef = React.useRef(null);

  const [background] = usePromise(
    () => generalStore.getBackground(),
    {
      cacheKey: CacheKeys.background,
      updateWithRevalidated: false,
      cachePeriodInSecs: 60 * 10,
    },
  );

  const showImage = theme === Themes.inspire && !!background;


  function onScroll() {
    if (!backgroundRef.current) return;

    const windowOffset = window.pageYOffset;
    const contentOffset = window.innerHeight * 0.6;
    const opacity = Math.min(1, windowOffset / contentOffset);
    backgroundRef.current.style.setProperty('--bg-opacity', (1 - opacity).toString());
  }


  React.useEffect(() => {
    if (showImage) {
      window.removeEventListener('scroll', onScroll);
      window.addEventListener('scroll', onScroll);
    }

    onScroll();

    return () => { window.removeEventListener('scroll', onScroll); };
  }, [showImage]);


  // React.useEffect(() => {
  //   // Scroll to top on load
  //   window.scrollTo(0, 1300);
  // }, []);


  return (
    <div ref={backgroundRef} className="background">

      {showImage && (
        <>
          <div
            className="background__image"
            style={{ backgroundImage: `url('${background.base64 || background.imageUrl}')` }}
          />

          <div className="background__info">
            <div className="background__info-details">
              <div className="background__info-location">
                {background.location}
              </div>
              <div className="background__info-user">
                <span>Photo by </span>
                <a target="_blank" rel="noopener noreferrer" href={background.userUrl}>{background.user}</a>
                <span> on </span>
                <a target="_blank" rel="noopener noreferrer" href={background.sourceUrl}>{background.source}</a>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="background__content">
        {children}
      </div>

      <div className="background__footer-icons">

        <div className="background__theme-switcher">
          {(theme === Themes.inspire) && (
            <button type="button" onClick={() => changeTheme(Themes.focus)}>
              <FocusIcon color="#fff" size="20" />
            </button>
          )}
          {(theme === Themes.focus) && (
            <button type="button" onClick={() => changeTheme(Themes.inspire)}>
              <CameraIcon size="20" />
            </button>
          )}
        </div>

        {theme === Themes.inspire && (
          <div className="background__scroll">
            <button
              type="button"
              onClick={() => {
                const todosDiv = document.getElementsByClassName('home__todos')[0];
                todosDiv.scrollIntoView();
              }}
            >
              <span />
            </button>
          </div>
        )}

      </div>


    </div>
  );
}


Background.propTypes = {
  children: PropTypes.node.isRequired,
};


export default Background;
