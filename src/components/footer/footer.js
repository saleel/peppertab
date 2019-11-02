import React from 'react';
import PropTypes from 'prop-types';
import Sync from '../sync';
import ThemeSwitcher from '../theme-switcher';
import './footer.scss';


function Footer(props) {
  const { onWidgetsClick } = props;


  const toggles = (
    <>
      <button
        type="button"
        className="footer__btn mx-1"
        onClick={onWidgetsClick}
      >
          Widgets
      </button>
    </>
  );


  return (
    <div className="footer">
      <div className="footer__left" />

      <div className="footer__toggles">
        {toggles}
      </div>

      <div className="footer__right">
        <Sync />
        <ThemeSwitcher />
      </div>
    </div>
  );
}


Footer.propTypes = {
  onWidgetsClick: PropTypes.func.isRequired,
};


export default Footer;
