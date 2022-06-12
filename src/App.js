import { useEffect, useState } from "react";
import './style/App.css';


function App() {
	const API_KEY = `b892b70efc414f78a2a2f4e4cc28f6ee`;

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cities, setCities] = useState([]);

	const TIME_TO_CITY_DRAW = 40000;
	const TIME_TO_CITY_REFRESHING = 10000;
	const LINK_TO_WEBSITE =  `https://openweathermap.org/city/`;

	const mainCities = ['Lodz', 'Warszawa', 'Berlin', 'New York', 'Londyn'];



  useEffect(() => {
		let randomCities;

		const doRandomCities = () => {
			randomCities = (mainCities.sort(() => Math.random() - Math.random()).slice(0, 3));
		} 

		doRandomCities();

    function fetchCities() {
      const urls = randomCities.map(
        (city) =>
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      Promise.all(urls.map((url) => fetch(url).then((res) => res.json()))).then(
        (results) => {
          setCities(results);
          setIsLoaded(true);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
    }

    fetchCities();


 		const intervalRefreshCity = setInterval(() => {
      setCities([]);
      fetchCities();
    }, TIME_TO_CITY_REFRESHING);

    const intervalChangeCities = setInterval(() => {
      doRandomCities();
    }, TIME_TO_CITY_DRAW);

    return () => {
      clearInterval(intervalRefreshCity);
      clearInterval(intervalChangeCities);
    };

		 
  }, []); 



  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <div className="container">
          {cities?.map((city) => (
          <a  href={`${LINK_TO_WEBSITE}${city.id}`} target="_blank" rel="noreferrer" className="city" key={city?.id}>
            <img
              src={`http://openweathermap.org/img/wn/${city?.weather[0].icon}@2x.png`}
              alt="wheater icon"
							className={city.weather[0].description}
            />
            <div className="temp">{city.main.temp} °C</div>
						<div className="name">{city.name}</div>
            <div className="desc">{city.weather[0].description}</div>
         
          </a>
        ))}
      </div>
    </div>
  );
}

export default App;