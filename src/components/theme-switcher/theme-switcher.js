// @ts-check

import React from 'react';
import CameraIcon from '@iconscout/react-unicons/icons/uil-camera';
import FocusIcon from '@iconscout/react-unicons/icons/uil-focus';
import Tooltip from 'rc-tooltip';
import { Themes, SettingKeys } from '../../constants';
import useSettings from '../../hooks/use-settings';
import 'rc-tooltip/assets/bootstrap.css';
import './theme-switcher.scss';


function ThemeSwitcher() {
  const [theme, changeTheme] = useSettings(SettingKeys.theme, Themes.inspire);

  const nextTheme = theme === Themes.inspire ? 'Focus' : 'Inspire';


  return (
    <Tooltip
      placement="left"
        // eslint-disable-next-line react/jsx-one-expression-per-line
      overlay={<div>Switch to {nextTheme} mode</div>}
      arrowContent={<div className="rc-tooltip-arrow-inner" />}
      overlayClassName="theme-switcher__tooltip fade-in"
      mouseEnterDelay={0.25}
    >
      <div className="theme-switcher__button">

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
  );
}


export default ThemeSwitcher;
