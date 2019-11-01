// @ts-check

import React from 'react';
import PropTypes from 'prop-types';
import StoreContext from '../../contexts/store-context';
import { Themes } from '../../constants';
import useStore from '../../hooks/use-store';
import './background.scss';


function Background(props) {
  const { children } = props;

  const { generalStore } = React.useContext(StoreContext);

  const [theme, { reFetch }] = useStore(() => generalStore.getTheme());
  const [background] = useStore(
    () => (theme === Themes.image) && generalStore.getBackground(),
    null,
    [theme],
  );

  generalStore.on('theme-updated', reFetch);


  const showBackground = (theme === Themes.image) && !!background;


  return (
    <div className="background">

      {showBackground && (
        <div
          className="background__image"
          style={{ backgroundImage: `url('${background.base64}')` }}
        />
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
