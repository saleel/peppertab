import React from 'react';
import Time from './components/time';
import TodoList from './components/todo-list';
import './home.scss';
import AuthContext from './contexts/auth-context';
import Notes from './components/notes/notes';
import Weather from './components/weather';
import Tips from './components/tips';
import Footer from './components/footer';


function Home() {
  const { login, isLoggedIn } = React.useContext(AuthContext);


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

      <div className="home__tips">
        {!isLoggedIn && (
          <Tips
            message="Login to sync your data securely"
            actionText="Login"
            onAction={login}
          />
        )}
      </div>


      <div className="home__footer">
        <Footer />
      </div>

    </div>
  );
}


export default Home;
