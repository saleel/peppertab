import React from 'react';
import Time from './components/time';
import AuthContext from './contexts/auth-context';
import Weather from './components/weather';
import Tips from './components/tips';
import Footer from './components/footer';
import Prompt from './components/prompt';
import StoreContext from './contexts/store-context';
import './home.scss';
import useStore from './hooks/use-store';

const Notes = React.lazy(() => import('./components/notes/notes'));
const TodoList = React.lazy(() => import('./components/todo-list'));


const SkeletonBox = (
  <div className="skeleton-box" style={{ height: '35rem', width: '100%' }} />
);


function Home() {
  const { login, isLoggedIn } = React.useContext(AuthContext);
  const { generalStore } = React.useContext(StoreContext);

  const [profile, { isFetching, reFetch }] = useStore(() => generalStore.getProfile(), null);


  const hasProfile = !isFetching && !!profile;

  async function onPromptSubmit(name) {
    await generalStore.setProfile({ name });
    reFetch();
  }

  if (isFetching) return null;

  return (
    <div className="home">

      <div className="home__time">
        <Time />
        <Weather />
      </div>

      <div className="home__welcome fade-in">
        {hasProfile && (
          <>
            <span>Hello </span>
            <span>{profile.name}</span>
          </>
        )}
      </div>

      <div className="home__widgets">
        <div className="home__notes-widget p-2">
          <React.Suspense fallback={SkeletonBox}>
            <Notes />
          </React.Suspense>
        </div>

        <div className="home__todo-widget p-2">
          <React.Suspense fallback={SkeletonBox}>
            <TodoList />
          </React.Suspense>
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

      {!hasProfile && (
        <Prompt
          question="What should I call you?"
          isOpen
          onSubmit={onPromptSubmit}
        />
      )}

      <Footer />

    </div>
  );
}


export default Home;
