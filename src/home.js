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
  const [isWidgetsVisible, setIsWidgetVisible] = React.useState(true);


  if (isFetching) return null;


  return (
    <div className="home">

      <Background />

      <div className="home__time">
        <Time />
        <Weather />
      </div>

      <div className="home__content">

        <div className="home__welcome">
          <Welcome onChange={reFetch} profile={profile} />
          <Quotes />
        </div>

        {profile && (
          <div className={`home__widgets ${!isWidgetsVisible ? 'home__widgets--removed' : ''}`}>
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
        <Footer onWidgetsClick={() => setIsWidgetVisible((a) => !a)} />
      </div>

    </div>
  );
}


export default Home;
