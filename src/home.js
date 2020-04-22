/* eslint-disable max-len */
import React from 'react';
import RefreshIcon from '@iconscout/react-unicons/icons/uil-sync';
import SettingsIcon from '@iconscout/react-unicons/icons/uil-cog';
import Tooltip from 'rc-tooltip';
import packageJson from '../package.json';
import Welcome from './components/welcome';
import Settings from './components/settings';
import TodoList from './components/todo-list';
import Calendar from './components/calendar';
import Links from './components/links';
import Time from './components/time';
import Weather from './components/weather';
import {
  Themes, CacheKeys, SettingKeys, defaultBg,
} from './constants';
import StoreContext from './contexts/store-context/index';
import usePromise from './hooks/use-promise';
import ThemeSwitcher from './components/theme-switcher';
import useSettings from './hooks/use-settings';
import Link from './model/link';
import './home.scss';


const Notes = React.lazy(() => import('./components/notes'));
const SyncInfo = React.lazy(() => import('./components/sync-info'));


function Home() {
  const { generalStore, linkStore } = React.useContext(StoreContext);

  const [theme] = useSettings(SettingKeys.theme, Themes.inspire);
  const [isInitialized, setIsInitialized] = useSettings(SettingKeys.isInitialized, false);
  const [isLinksEnabled] = useSettings(SettingKeys.isLinksEnabled, true);


  const [isScrolled, setIsScrolled] = React.useState(window.pageYOffset > 10);
  const [showContent, setShowContent] = React.useState(true);
  const [isSettingsVisible, setIsSettingsVisible] = React.useState(false);
  const [colorMode] = useSettings(SettingKeys.colorMode, 'dark');


  /** @type React.MutableRefObject<HTMLDivElement> */
  const backgroundRef = React.useRef(null);


  if (!isInitialized) {
    window.localStorage.setItem(`cache.${CacheKeys.background}`, JSON.stringify({
      data: defaultBg,
      storedAt: new Date(),
    }));
  }

  const [background, { reFetch, isFetching }] = usePromise(
    () => generalStore.getBackground(),
    {
      cacheKey: CacheKeys.background,
      cachePeriodInSecs: theme === Themes.inspire ? (60 * 10) : (24 * 60 * 60),
      conditions: [isInitialized],
    },
  );

  const showImage = theme === Themes.inspire && !!background;


  // First time
  React.useEffect(() => {
    if (isInitialized) {
      return;
    }

    const defaultLinks = [
      new Link({
        _id: 'gmail',
        siteName: 'Gmail',
        hostname: 'gmail.com',
        url: 'https://www.gmail.com/',
        logoUrl: 'https://logo.clearbit.com/gmail.com',
        logoBase64: 'data:image/png;base64,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',
      }),
      new Link({
        _id: 'producthunt',
        siteName: 'Product Hunt',
        hostname: 'producthunt.com',
        url: 'https://www.producthunt.com/widget/browser/',
        logoUrl: 'https://logo.clearbit.com/producthunt.com',
        logoBase64: 'data:image/jpeg;base64,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',
      }),
    ];

    // Create default links
    Promise.all(defaultLinks.map((l) => linkStore.updateLink(l.id, l)))
      .then(() => { setIsInitialized(true); });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized]);


  React.useEffect(() => {
    if (!backgroundRef.current) return;

    function onScroll() {
      const windowOffset = window.pageYOffset;
      const contentOffset = window.innerHeight * 0.5;
      const opacity = Math.min(colorMode === 'dark' ? 0.97 : 1, windowOffset / contentOffset);

      backgroundRef.current.style.setProperty('--bg-opacity', (1 - opacity).toString());

      if (windowOffset > 10 && isSettingsVisible) {
        setIsSettingsVisible(false);
      }

      if (windowOffset > 100 && !isScrolled) {
        setIsScrolled(true);
      }

      if (windowOffset <= 100 && isScrolled) {
        setIsScrolled(false);
      }
    }


    if (showImage) {
      window.removeEventListener('scroll', onScroll);
      window.addEventListener('scroll', onScroll);

      onScroll();
    }

    // eslint-disable-next-line consistent-return
    return () => { window.removeEventListener('scroll', onScroll); };
  }, [isScrolled, showImage, isSettingsVisible, colorMode]);


  function onRefreshClick() {
    if (!isFetching) {
      reFetch();
    }
  }


  let classNames = `home home--${theme} home--${colorMode} ${isScrolled ? 'home--scrolled' : ''}`;
  if (!showContent) {
    classNames += ' home--content-hidden';
  }
  if (isSettingsVisible) {
    classNames += ' home--settings-visible';
  }


  return (
    <div ref={backgroundRef} className={classNames}>

      {showImage && (
        <>
          <div
            className="home__bg-image"
            style={{ backgroundImage: `url('${background.base64 || background.imageUrl}')` }}
          />

          {!isScrolled && (
            <div className="home__bg-buttons">

              <Tooltip
                placement="left"
                overlay={<div>Change background image</div>}
                arrowContent={<div className="rc-tooltip-arrow-inner" />}
                overlayClassName="home__bg-change-tooltip fade-in"
                mouseEnterDelay={0.5}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...isFetching && { popupVisible: false }}
              >
                <button
                  type="button"
                  onClick={onRefreshClick}
                  className="home__bg-change fade-in"
                >
                  <RefreshIcon className={isFetching ? 'home__bg-change--loading' : ''} size="18" />
                </button>
              </Tooltip>

              <div className="home__bg-info" onMouseEnter={() => setShowContent(false)} onMouseLeave={() => setShowContent(true)}>
                <div className="home__bg-info-details">
                  <div className="home__bg-info-location">
                    {background.location}
                  </div>
                  <div className="home__bg-info-user">
                    <span>Photo by </span>
                    <a target="_blank" rel="noopener noreferrer" href={background.userUrl}>{background.user}</a>
                    <span> on </span>
                    <a target="_blank" rel="noopener noreferrer" href={background.sourceUrl}>{background.source}</a>
                  </div>
                </div>
              </div>

            </div>
          )}
        </>
      )}


      <div className="home__content">

        <div className="home__time">
          <Time />
          <Weather />
        </div>

        <div className="home__widgets">

          <div
            className="home__welcome"
            style={{
              ...!isLinksEnabled && (theme === Themes.inspire) && { minHeight: 'calc(100vh - 4rem)' },
            }}
          >
            <div className="w-full px-5">
              <Welcome />
            </div>
          </div>

          <div
            className="home__links"
            style={{
              ...!isLinksEnabled && (theme === Themes.inspire) && { minHeight: 0 },
            }}
          >
            {isInitialized && isLinksEnabled && (
              <Links />
            )}
          </div>

          <div className="home__scroll fade-in">
            {(theme === Themes.inspire) && !isScrolled && (
              <button
                type="button"
                onClick={() => {
                  const scrollEl = document.getElementsByClassName('home__scroll')[0];
                  scrollEl.scrollIntoView();
                }}
              >
                <span />
              </button>
            )}
          </div>

          <div className="home__todos flex mb-10 mt-10">
            <div className="w-1/2 px-5">
              <TodoList />
            </div>

            <div className="w-1/2 px-5">
              <Calendar />
            </div>
          </div>

          <React.Suspense fallback="home__spacer">
            <>
              <div className="home__notes flex mb-10">
                <div className="w-full px-5">
                  <Notes />
                </div>
              </div>

              <div className="home__sync flex mb-10">
                <div className="w-full px-5">
                  <SyncInfo />
                </div>
              </div>

              <div className="home__attributions mp-20 pb-10">
                <div className="px-3 mb-1">{`PepperTab v${packageJson.version}`}</div>

                <div>
                  <a target="_blank" rel="noopener noreferrer" href="https://clearbit.com">
                    Logos provided by Clearbit
                  </a>
                  <span>  |  </span>
                  <a target="_blank" rel="noopener noreferrer" href="https://openweathermap.org">
                    Weather by OpenWeatherMap
                  </a>
                </div>

              </div>
            </>
          </React.Suspense>
        </div>

      </div>

      {!isScrolled && (
        <div className="home__theme-switcher fade-in">
          <ThemeSwitcher />
        </div>
      )}

      {!isScrolled && (
        <div className="home__settings">
          <Tooltip
            id="settings"
            placement="top"
            overlay={<Settings />}
            overlayClassName="home__settings-tooltip"
            trigger="click"
            onVisibleChange={setIsSettingsVisible}
            visible={isSettingsVisible}
          >
            <SettingsIcon
              aria-describedby="settings"
              size="20"
            />
          </Tooltip>
        </div>
      )}

    </div>
  );
}


export default Home;
