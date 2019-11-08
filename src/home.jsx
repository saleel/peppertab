import React from 'react';
import Card from './components/card';
import './home.scss';
import Notes from './components/notes';
import TodoList from './components/todo-list';
import Welcome from './components/welcome';
import Calendar from './components/calendar';


function isVisible(el) {
  const partial = true;
  const viewTop = window.document.documentElement.scrollTop;
  const viewBottom = viewTop + window.document.documentElement.offsetHeight;
  const top = el.offsetTop;
  const bottom = top + el.offsetHeight;
  const compareTop = partial === true ? bottom : top;
  const compareBottom = partial === true ? top : bottom;

  return ((compareBottom <= viewBottom) && (compareTop >= viewTop));
}

function Home() {
  React.useEffect(() => {
    const divs = document.querySelectorAll('.card');
    for (let i = 0; i < divs.length; i++) {
      console.log(isVisible(divs[i]));
      if (isVisible(divs[i])) {
        divs[i].classList.add('already-visible');
      }
    }

    window.addEventListener('scroll', (e) => {
      for (let i = 0; i < divs.length; i++) {
        console.log(isVisible(divs[i]));
        if (isVisible(divs[i])) {
          if (!divs[i].classList.contains('already-visible')) {
            divs[i].classList.add('come-in');
          }
        }
      }
    });
  }, []);


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


        <div className="flex mb-10">
          <div className="w-full px-5">
            <Notes />
          </div>
        </div>


      </div>
    </div>
  );
}


export default Home;
