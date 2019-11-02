import React from 'react';
import { Tooltip } from 'react-tippy';
import MoonIcon from '@iconscout/react-unicons/icons/uil-moon';
import ImageIcon from '@iconscout/react-unicons/icons/uil-image';
import SunIcon from '@iconscout/react-unicons/icons/uil-sun';
import useStore from '../../hooks/use-store';
import StoreContext from '../../contexts/store-context';
import { Themes } from '../../constants';


function ThemeSwitcher() {
  const { generalStore } = React.useContext(StoreContext);


  const [theme, { reFetch }] = useStore(() => generalStore.getTheme(), Themes.image);


  React.useEffect(() => {
    if (theme) {
      document.documentElement.className = theme;
    }
  }, [theme]);


  function onMoonClick() {
    generalStore.setTheme(Themes.dark);
    reFetch();
  }

  function onSunClick() {
    generalStore.setTheme(Themes.light);
    reFetch();
  }

  function onImageClick() {
    generalStore.setTheme(Themes.image);
    reFetch();
  }


  const themeIcon = (() => {
    if (theme === Themes.dark) {
      return (
        <button className="fade-in" type="button" onClick={onImageClick}>
          <ImageIcon color="#f7f7f7" size="20" />
        </button>
      );
    }

    if (theme === Themes.light) {
      return (
        <button className="fade-in" type="button" onClick={onMoonClick}>
          <MoonIcon color="#1E1E1E" size="20" />
        </button>
      );
    }

    return (
      <button className="fade-in" type="button" onClick={onSunClick}>
        <SunIcon color="#f7f7f7" size="20" />
      </button>
    );
  })();


  return (
    <Tooltip
      title="Click to switch between themes"
      position="bottom"
      trigger="mouseenter"
      arrow
      className="theme-switcher"
      style={{ display: 'flex' }}
    >
      {themeIcon}
    </Tooltip>
  );
}


export default ThemeSwitcher;
