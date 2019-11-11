import React from 'react';
import get from 'lodash/get';
import Time from './components/time';
import Weather from './components/weather';
import Quotes from './components/quotes';
import Footer from './components/footer';
import StoreContext from './contexts/store-context';
import useStore from './hooks/use-store';
import Welcome from './components/welcome';
import Notes from './components/notes';
import TodoList from './components/todo-list';
import './home.scss';
import Background from './components/background';
import Sync from './components/sync';
import ThemeSwitcher from './components/theme-switcher';


function Home() {
  const { generalStore } = React.useContext(StoreContext);

  const [profile, { isFetching }] = useStore(() => generalStore.getProfile(), null);
  const [settings, { reFetch }] = useStore(() => generalStore.getSettings(), {});


  // React.useEffect(() => {
  //   document.addEventListener('keyup', (e) => {

  //     if (e.keyCode === 84) {
  //       setIsWidgetVisible((a) => !a);
  //     }

  //     if (e.keyCode === 85) {
  //       document.documentElement.style.setProperty('--bg-color', '#e1e1e3');
  //     }
  //   });
  // }, []);

  const isNotesVisible = get(settings, 'notes.visible', false);
  const isTodosVisible = get(settings, 'todos.visible', false);


  function onNotesClick() {
    generalStore.setSettings('todos.visible', false);
    generalStore.setSettings('notes.visible', !isNotesVisible);
    reFetch();
  }

  function onTodosClick() {
    generalStore.setSettings('notes.visible', false);
    generalStore.setSettings('todos.visible', !isTodosVisible);
    reFetch();
  }


  // let welcomeClass = 'home__welcome';
  // let widgetsClass = 'home__widgets';

  // if (!isWidgetsVisible) {
  //   welcomeClass += ' home__welcome--big';
  //   widgetsClass += ' home__widgets--minimized';
  // }


  if (isFetching) return null;


  return (
    <Background>
      <div className="home">

        <div className="home__content">

          {isNotesVisible && (
            <div className="home__notes p-2">
              <Notes />
            </div>
          )}

          {isTodosVisible && (
            <div className="home__todos p-2">
              <TodoList />
            </div>
          )}


          <div className="home__time">
            {/* <Time /> */}
            {/* <Weather /> */}
          </div>


          {/* {!isWidgetsVisible && (
          <div className={welcomeClass}>
            <Welcome onChange={reFetch} profile={profile} />
            <Quotes />
          </div>
          )} */}


        </div>

        <div className="home__footer">
          {/* <Footer onWidgetsClick={onWidgetsClick} /> */}

          <div className="flex">
            {/* <Sync /> */}
            <ThemeSwitcher />
          </div>


          <div>
            {/* <button
              type="button"
              className="footer__btn mx-1"
            >
              Product Hunt
            </button>

            <button
              type="button"
              className="footer__btn mx-1"
              onClick={onNotesClick}
            >
             Notes
            </button>

            <button
              type="button"
              className="footer__btn mx-1"
              onClick={onTodosClick}
            >
             Todos
            </button> */}
          </div>

          <div>
            <button
            type="button"
            className="footer__btn mx-1"
            onClick={onTodosClick}
          >
             Todos
          </button>
          </div>


        </div>

      </div>
    </Background>
  );
}


export default Home;
