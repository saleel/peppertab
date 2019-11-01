import React from 'react';
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


function Home() {
  const { generalStore } = React.useContext(StoreContext);

  const [profile, { isFetching, reFetch }] = useStore(() => generalStore.getProfile(), null);
  const visibility = generalStore.getVisibility();
  const [isWidgetsVisible, setIsWidgetVisible] = React.useState(visibility.widgets);


  function onWidgetsClick() {
    setIsWidgetVisible((visible) => {
      generalStore.setVisibility({ widgets: !visible });
      return !visible;
    });
  }


  let welcomeClass = 'home__welcome';
  let widgetsClass = 'home__widgets';

  if (!isWidgetsVisible) {
    welcomeClass += ' home__welcome--big';
    widgetsClass += ' home__widgets--minimized';
  }


  if (isFetching) return null;


  return (
    <Background>
      <div className="home">

        <div className="home__time">
          <Time />
          <Weather />
        </div>

        <div className="home__content">

          <div className={welcomeClass}>
            <Welcome onChange={reFetch} profile={profile} />
            <Quotes />
          </div>

          {profile && (
            <div className={widgetsClass}>
              <div className="home__notes p-2">
                <Notes />
              </div>

              <div className="home__todo p-2">
                <TodoList />
              </div>
            </div>
          )}

        </div>

        <div className="home__footer">
          <Footer onWidgetsClick={onWidgetsClick} />
        </div>

      </div>
    </Background>
  );
}


export default Home;
