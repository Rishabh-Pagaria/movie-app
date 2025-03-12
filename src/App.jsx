import { useState, useEffect } from 'react';
import { useDebounce } from 'react-use';
import './App.css';
import Search from  './components/Search';
import Spinner from './components/Spinner';
import Movies from './components/Movie';
import heroImage from './assets/hero-img.png';
import heroBg from  './assets/hero-bg.png';
import {updateSearchCount} from './appwrite';

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
  const [debounceSearchTerm, setdebounceSearchTerm]  = useState('');

  //debounces the search term from making too many requests, by waiting for the user to stop typing for 500ms
  useDebounce(()=> setdebounceSearchTerm(searchTerm), 500, [searchTerm]);
  const  fetchMovies = async (query = "") => {
    setLoading(true);
    setErrorMessage("");
    try {
      const endpoint = query ? `${apiUrl}/search/movie?query=${encodeURIComponent(query)}` :`${apiUrl}/discover/movie?sort_by=popularity.desc`;
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
      if(query && data.results.length > 0){
        await updateSearchCount(query, data.results[0]);
      }
    } 
      catch (error) {
        // console.error(`The error message is ${error}`);
        setErrorMessage("Error Fetching movies");
      }
      finally{
        setLoading(false);
      }
  }
  useEffect(()=>{
    fetchMovies(debounceSearchTerm);
  },[debounceSearchTerm])

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
      <section className='all-movies'>
        <h2>All Movies</h2>
        {
          // until the try and catch block doesn't get complete
          loading ? (
            <Spinner />
            // gives error if there is any error message
          ): errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ): (
            // maps  through the movies list and renders the movie card
            <ul>
              {moviesList.map((movie) => (
                <Movies key={movie.id} movie={movie} />
              ))}
            </ul>
          )
        }
      </section>
    </main>
  );
}

export default App
