import React from 'react';
import Card from './components/card';
import './home.scss';
import Notes from './components/notes';
import TodoList from './components/todo-list';
import Welcome from './components/welcome';
import Calendar from './components/calendar';


function Home() {
  return (

    <div className="home">

      <div className="home__content">

        <div className="flex mb-10">
          <div className="w-full px-5">
            <Welcome />
          </div>
        </div>


        <div className="flex mb-10">
          <div className="w-1/2 px-5">
            <TodoList />
          </div>

          <div className="w-1/2 px-5">
            <Calendar />
          </div>
        </div>


        <div className="flex">
          <div className="w-full px-5">
            <Notes />
          </div>
        </div>


      </div>
    </div>
  );
}


export default Home;
