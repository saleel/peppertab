// @ts-check

import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tippy';
import InfoIcon from '@iconscout/react-unicons/icons/uil-info-circle';
import StoreContext from '../../contexts/store-context';
import { Themes } from '../../constants';
import useStore from '../../hooks/use-store';
import './background.scss';


function Background(props) {
  const { children } = props;

  const { generalStore } = React.useContext(StoreContext);

  const [theme, { reFetch }] = useStore(() => generalStore.getTheme());
  const [background] = useStore(
    () => generalStore.getBackground(),
    null,
    [theme],
  );

  generalStore.on('theme-updated', reFetch);


  const showBackground = !!background;


  const themeInfo = background && (
    <a target="_blank" rel="noopener noreferrer" href={background.link}>
      <div>{background.location}</div>
      <div>{background.user}</div>
    </a>
  );


  return (
    <div className="background">

      {showBackground && (
        <>
          <div
            className="background__image"
            style={{ backgroundImage: `url('${background.base64}')` }}
          />

          {/* <Tooltip
            html={themeInfo}
            position="bottom"
            trigger="mouseenter"
            arrow
            className="background__theme-info"
          >
            <InfoIcon color="#f7f7f7" size="20" />
          </Tooltip> */}

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
