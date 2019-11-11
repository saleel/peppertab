import React from 'react';
import ThemeContext from './contexts/theme-context/theme-context';
import Notes from './components/notes';
import TodoList from './components/todo-list';
import Welcome from './components/welcome';
import Calendar from './components/calendar';
import Background from './components/background';
import Links from './components/links';
import { enableSlideInForCards } from './home.utils';
import useInterval from './hooks/use-interval';
import './home.scss';
import { Themes } from './constants';


function Home() {
  const { theme, changeTheme } = React.useContext(ThemeContext);

  React.useEffect(() => enableSlideInForCards(), []);
  // React.useEffect(() => enableBgBlurOnScroll(), []);

  // useInterval(() => {
  //   changeTheme(theme === Themes.focus ? Themes.inspire : Themes.focus);
  // }, 5000);

  return (
    <Background>

      <div className={`home ${theme}`}>
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

        </div>
      </div>

    </Background>
  );
}


export default Home;
