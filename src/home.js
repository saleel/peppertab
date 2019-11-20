import React from 'react';
import packageJson from '../package.json';
import ThemeContext from './contexts/theme-context/theme-context';
import Notes from './components/notes';
import TodoList from './components/todo-list';
import Welcome from './components/welcome';
import Calendar from './components/calendar';
import Background from './components/background';
import Time from './components/time';
import Weather from './components/weather';
import Links from './components/links';
import SyncInfo from './components/sync-info';
import './home.scss';


function Home() {
  const { theme } = React.useContext(ThemeContext);


  return (
    <Background>

      <div className={`home ${theme}`}>

        <div className="home__time">
          <Time />
          <Weather />
        </div>

        <div className="home__content">

          <div className="home__welcome flex">
            <div className="w-full px-5">
              <Welcome />
            </div>
          </div>

          <div className="home__links flex mb-10">
            <Links />
          </div>

          <div className="home__todos flex mb-10">
            <div className="w-1/2 px-5">
              <TodoList />
            </div>

            <div className="w-1/2 px-5">
              <Calendar />
            </div>
          </div>

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

        </div>
      </div>

    </Background>
  );
}


export default Home;
