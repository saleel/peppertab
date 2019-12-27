import React from 'react';
import packageJson from '../package.json';
import ThemeContext from './contexts/theme-context/theme-context';
import Welcome from './components/welcome';
// import Notes from './components/notes';
import TodoList from './components/todo-list';
import Calendar from './components/calendar';
import Links from './components/links';
// import SyncInfo from './components/sync-info';
// import Background from './components/background';
import Time from './components/time';
import Weather from './components/weather';
import { Themes, CacheKeys } from './constants';
import StoreContext from './contexts/store-context/index';
import usePromise from './hooks/use-promise';
import ThemeSwitcher from './components/theme-switcher';
import './home.scss';


const Notes = React.lazy(() => import('./components/notes'));
// const TodoList = React.lazy(() => import('./components/todo-list'));
// const Calendar = React.lazy(() => import('./components/calendar'));
// const Links = React.lazy(() => import('./components/links'));
const SyncInfo = React.lazy(() => import('./components/sync-info'));


function Home() {
  const { generalStore } = React.useContext(StoreContext);
  const { theme } = React.useContext(ThemeContext);


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


  return (
    <div ref={backgroundRef} className={`home ${theme}`}>

      {showImage && (
        <>
          <div
            className="home__image"
            style={{ backgroundImage: `url('${background.base64 || background.imageUrl}')` }}
          />

          <div className="home__info home__hide-on-scroll fade-in fade-out">
            <div className="home__info-details">
              <div className="home__info-location">
                {background.location}
              </div>
              <div className="home__info-user">
                <span>Photo by </span>
                <a target="_blank" rel="noopener noreferrer" href={background.userUrl}>{background.user}</a>
                <span> on </span>
                <a target="_blank" rel="noopener noreferrer" href={background.sourceUrl}>{background.source}</a>
              </div>
            </div>
          </div>
        </>
      )}


      <div className="home__content">

        <div className="home__time">
          <Time />
          <Weather />
        </div>

        <div className="home__widgets">

          <div className="home__welcome flex">
            <div className="w-full px-5">
              <Welcome />
            </div>
          </div>

          <div className="home__links flex">
            <Links />
          </div>


          {/* {theme === Themes.inspire && (
            <div className="home__scroll fade-in home__hide-on-scroll">
              <button
                type="button"
                onClick={() => {
                  const todosDiv = document.getElementsByClassName('home__scroll')[0];
                  todosDiv.scrollIntoView();
                }}
              >
                <span />
              </button>
            </div>
          )} */}


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

      <div className="home__footer-icons home__hide-on-scroll fade-in fade-out">
        <ThemeSwitcher />
      </div>

    </div>
  );
}


export default Home;
