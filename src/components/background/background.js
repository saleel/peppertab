// @ts-check

import React from 'react';
import PropTypes from 'prop-types';
import CameraIcon from '@iconscout/react-unicons/icons/uil-camera';
import FocusIcon from '@iconscout/react-unicons/icons/uil-focus';
import Tooltip from 'rc-tooltip';
import StoreContext from '../../contexts/store-context';
import { Themes, CacheKeys } from '../../constants';
import ThemeContext from '../../contexts/theme-context';
import usePromise from '../../hooks/use-promise';
import 'rc-tooltip/assets/bootstrap.css';
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
      conditions: [theme === Themes.inspire],
    },
  );


  const showImage = theme === Themes.inspire && !!background;


  function onScroll() {
    if (!backgroundRef.current) return;

    const windowOffset = window.pageYOffset;
    const contentOffset = window.innerHeight * 0.6;
    const opacity = Math.min(1, windowOffset / contentOffset);

    backgroundRef.current.style.setProperty('--bg-opacity', (1 - opacity).toString());
    backgroundRef.current.style.setProperty('--is-scrolled', windowOffset > 10 ? 'none' : 'initial');
  }


  React.useEffect(() => {
    if (showImage) {
      window.removeEventListener('scroll', onScroll);
      window.addEventListener('scroll', onScroll);
    }

    onScroll();

    return () => { window.removeEventListener('scroll', onScroll); };
  }, [showImage]);


  const nextTheme = theme === Themes.inspire ? 'Focus' : 'Inspire';

  return (
    <div ref={backgroundRef} className="background">

      <div className="background__content">
        {children}
      </div>

      {showImage && (
        <>
          <div
            className="background__image"
            style={{ backgroundImage: `url('${background.base64 || background.imageUrl}')` }}
          />

          <div className="background__info background__hide-on-scroll fade-in fade-out">
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

      <div className="background__footer-icons background__hide-on-scroll fade-in fade-out">

        <Tooltip
          placement="left"
          // eslint-disable-next-line react/jsx-one-expression-per-line
          overlay={<div>Switch to {nextTheme} mode</div>}
          arrowContent={<div className="rc-tooltip-arrow-inner" />}
          overlayClassName="background__tooltip"
        >
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
        </Tooltip>

      </div>

    </div>
  );
}


Background.propTypes = {
  children: PropTypes.node.isRequired,
};


export default Background;
