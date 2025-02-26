import { useState, useEffect } from 'react';
import './App.css';
import Search from  './components/Search';
import heroImage from './assets/hero-img.png';
import heroBg from  './assets/hero-bg.png';

const apiUrl = "https://api.themoviedb.org/3";
const apiKey = import.meta.env.VITE_TMDB_API_KEY;
const apiOption = {
  method: 'GET',
  headers: {
    'accept': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  }
};


const  App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [moviesList, setMoviesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const  fetchMovies = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const endpoint = `${apiUrl}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, apiOption);
      if(!response.ok){
        throw new Error(response.statusText);
      }
      const data = await response.json();
      if(data.response ==  "false"){
        setErrorMessage(data.error ||"Faled to fetch movies");
        setMoviesList([]);
      }
      setMoviesList(data.results || []);
      console.log(data);
    } 
      catch (error) {
        console.error(`The error message is ${error}`);
        setErrorMessage("Error Fetching movies");
      }
      finally{
        setLoading(false);
      }
  }
  useEffect(()=>{
    fetchMovies();
  },[])

  return  (
    <main>
      <div className='pattern' />
      <div className='wrapper'>
        <header>
          <img src={heroImage} alt='Herro Image'/>
          <h1>Find <span className='text-gradient'>Movies</span> you Enjoy</h1>
        </header>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      <h2>All Movies</h2>
      {
        loading ? (
          <p>Loading..</p>
        ): errorMessage ? (
          <p className='text-red-500'>{errorMessage}</p>
        ): (
          <ul>
            {moviesList.map((movie) => (
              <p className='text-white'>{movie.title}</p>
            ))}
          </ul>
        )
      }

    </main>
  );
}

export default App
