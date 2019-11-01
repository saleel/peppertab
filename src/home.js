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
          {!isFetching && <Welcome onChange={reFetch} profile={profile} />}
        </div>

        {profile && (
          <>
            <div className="home__quotes">
              <Quotes />
            </div>

            <div className="home__widgets">
              <div className="home__notes p-2">
                <Notes />
              </div>

              <div className="home__todo p-2">
                <TodoList />
              </div>
            </div>
          </>
        )}

      </div>

      <Footer />

    </div>
  );
}


export default Home;
