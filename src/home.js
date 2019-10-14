import React from 'react';
import Time from './components/time';
import TodoList from './components/todo-list';
import './home.scss';
import AuthContext from './contexts/auth-context';
import Notes from './components/notes/notes';
import Weather from './components/weather';


function Home() {
  const { login, userSession } = React.useContext(AuthContext);

  if (!userSession.isUserSignedIn() && userSession.isSignInPending()) {
    userSession.handlePendingSignIn()
      .then((userData) => {
        if (!userData.username) {
          throw new Error('This app requires a username.');
        }
      });
  }


  return (
    <div className="home">

      <div className="home__time">
        <Time />
        <Weather />
      </div>

      <div className="home__widgets">
        <div className="p-2 flex-1">
          <Notes />
        </div>

        <div className="p-2">
          <TodoList />
        </div>
      </div>

      <button onClick={login} type="button">Login</button>
    </div>
  );
}


export default Home;
