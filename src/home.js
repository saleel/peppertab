import React from 'react';
import Time from './components/time';
import AuthContext from './contexts/auth-context';
import Weather from './components/weather';
import Tips from './components/tips';
import Footer from './components/footer';
import StoreContext from './contexts/store-context';
import './home.scss';
import useStore from './hooks/use-store';
import Welcome from './components/welcome';

const Notes = React.lazy(() => import('./components/notes/notes'));
const TodoList = React.lazy(() => import('./components/todo-list'));


const SkeletonBox = (
  <div className="skeleton-box" style={{ height: '35rem', width: '100%', opacity: 0 }} />
);


function Home() {
  const { login, isLoggedIn } = React.useContext(AuthContext);
  const { generalStore } = React.useContext(StoreContext);

  const [profile, { isFetching, reFetch }] = useStore(() => generalStore.getProfile(), null);

  if (isFetching) return null;


  return (
    <div className="home fade-in">

      <div className="home__time fade-in">
        <Time />
        <Weather />
      </div>

      <div className="home__welcome fade-in">
        <Welcome onChange={reFetch} profile={profile} />
      </div>

      <div className="home__widgets">
        <React.Suspense fallback={SkeletonBox}>
          <div className="home__notes-widget p-2">
            {profile && <Notes />}
          </div>

          <div className="home__todo-widget p-2">
            {profile && <TodoList />}
          </div>
        </React.Suspense>
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
