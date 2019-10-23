import React from 'react';
import Time from './components/time';
import AuthContext from './contexts/auth-context';
import Weather from './components/weather';
import Tips from './components/tips';
import Footer from './components/footer';
import StoreContext from './contexts/store-context';
import useStore from './hooks/use-store';
import Welcome from './components/welcome';
import Notes from './components/notes';
import TodoList from './components/todo-list';
import './home.scss';


function Home() {
  const { login, isLoggedIn } = React.useContext(AuthContext);
  const { generalStore } = React.useContext(StoreContext);

  const [profile, { isFetching, reFetch }] = useStore(() => generalStore.getProfile(), null);

  if (isFetching) return null;


  return (
    <div className="home fade-in">

      <div className="home__time">
        <Time />
        <Weather />
      </div>

      <div className="home__welcome">
        {!isFetching && <Welcome onChange={reFetch} profile={profile} />}
      </div>

      <div className="home__widgets">
        <div className="home__notes-widget p-2">
          <Notes />
        </div>

        <div className="home__todo-widget p-2">
          <TodoList />
        </div>
      </div>

      <div className="home__tips">
        {!isLoggedIn() && (
          <Tips
            message="Login to sync your data securely"
            actionText="Login"
            onAction={login}
          />
        )}
      </div>

      <Footer />

    </div>
  );
}


export default Home;
