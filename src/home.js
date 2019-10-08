import React from 'react';
import Time from './components/time';
import './home.scss';


function Home() {
  console.log()

	return (
		<div className="home">
			<h1>Welcome</h1>

			<div className="home__time">
				<Time />
			</div>
		</div>
	);
}


export default Home;
