// @ts-check

import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tippy';
import InfoIcon from '@iconscout/react-unicons/icons/uil-info-circle';
import StoreContext from '../../contexts/store-context';
import { Themes } from '../../constants';
import useStore from '../../hooks/use-store';
import './background.scss';
import ThemeContext from '../../contexts/theme-context';


function Background(props) {
  const { children } = props;

  const { generalStore } = React.useContext(StoreContext);
  const { theme } = React.useContext(ThemeContext);

  /** @type React.MutableRefObject<HTMLDivElement> */
  const backgroundRef = React.useRef(null);

  const [background, { isFetching }] = useStore(
    () => generalStore.getBackground(),
    null,
    [theme],
  );

  const showBackground = theme === Themes.inspire && !!background;

  function onScroll() {
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

    return () => { window.removeEventListener('scroll', onScroll); };
  }, [showBackground]);


  if (showBackground && isFetching) {
    return null;
  }


  return (
    <div ref={backgroundRef} className="background">

      {showBackground && (
        <>
          <div
            className="background__image"
            style={{ backgroundImage: `url('${background.base64}')` }}
          />

          <a className="background__info" target="_blank" rel="noopener noreferrer" href={background.link}>
            <div className="background__info-icon">
              <InfoIcon size="20" />
            </div>
            <div className="background__info-location">
              <div>{background.location}</div>
              <div>{background.user}</div>
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
