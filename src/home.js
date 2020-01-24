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
import Spinner from './components/spinner';
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


  const [isScrolled, setIsScrolled] = React.useState(window.pageYOffset > 10);
  const [showContent, setShowContent] = React.useState(true);
  const [isSettingsVisible, setIsSettingsVisible] = React.useState(false);


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
      cachePeriodInSecs: theme === Themes.inspire ? (60 * 1) : (24 * 60 * 60),
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
        siteName: 'Gmail',
        hostname: 'gmail.com',
        url: 'https://www.gmail.com/',
        logoUrl: 'https://logo.clearbit.com/gmail.com',
        logoBase64: 'data:image/jpeg;base64,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',
      }),
      new Link({
        siteName: 'Product Hunt',
        hostname: 'producthunt.com',
        url: 'https://www.producthunt.com/widget/browser/',
        logoUrl: 'https://logo.clearbit.com/producthunt.com',
        logoBase64: 'data:image/jpeg;base64,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',
      }),
    ];

    // Create default links
    Promise.all(defaultLinks.map((l) => linkStore.createLink(l)))
      .then(() => { setIsInitialized(true); });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized]);


  React.useEffect(() => {
    if (!backgroundRef.current) return;

    function onScroll() {
      const windowOffset = window.pageYOffset;
      const contentOffset = window.innerHeight * 0.6;
      const opacity = Math.min(0.97, windowOffset / contentOffset);

      backgroundRef.current.style.setProperty('--bg-opacity', (1 - opacity).toString());

      if (windowOffset > 10 && !isScrolled) {
        setIsScrolled(true);

        if (isSettingsVisible) {
          setIsSettingsVisible(false);
        }
      }

      if (windowOffset < 10 && isScrolled) {
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
  }, [isScrolled, showImage, isSettingsVisible]);


  function onRefreshClick() {
    if (!isFetching) {
      reFetch();
    }
  }


  let classNames = `home home--${theme}`;
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

          <div className="home__welcome">
            <div className="w-full px-5">
              <Welcome />
            </div>
          </div>

          {isInitialized && (
            <div className="home__links">
              <Links />
            </div>
          )}

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

              <div className="home__attributions mt-20 mb-10">
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
              color="#fff"
              size="20"
            />
          </Tooltip>
        </div>
      )}

    </div>
  );
}


export default Home;
