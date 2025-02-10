import Search from './components/Search.jsx'
import React, { useEffect, useState } from 'react'
import Spinner from './components/Spinner.jsx'
import MovieCard from './components/MovieCard.jsx';
import { useDebounce } from 'react-use';
import axios from "axios";

const API_URL = "http://localhost:8080/api";
const api = axios.create({ baseURL: API_URL });

const API_BASE_URL = 'https://api.themoviedb.org/3/';
// discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}
const App = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const [errorMessage, setErrorMessage] = useState('');

  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  //Debounce the earch term to prevent making too many API requests by waiting 500ms after the user stops typing.
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

  const [trendingMovies, setTrendingMovies] = useState([]);

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`
        : `${API_BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS)

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();

      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        console.log(query)
        //console.log(data.results[0])
        axios.put(`${API_URL}/updateMovie`, {
          headers: { 'Content-Type': 'application/json' },
          data: {
            query: `${query}`,
            queryResult: data.results[0]
          }
        })
      }
    }
    catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    }
    finally {
      setIsLoading(false);
    }
  }



  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm])


  const loadTrendingMovies = async () => {
    setIsLoading(true);
    //console.log("I am making a call to:"+`${API_URL}/getTrendingMovies`)
    try {
      const result = await axios.get(`${API_URL}/getTrendingMovies`);
      console.log(result)
      const movies = result.data.movies
      setTrendingMovies(movies)
    }
    catch (error) {
      console.log(error)
    }
    finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadTrendingMovies();
  }, []);


  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src='./hero.png' alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies</span> You'll enjoy Without the Hassle</h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>
          {/* Conditional statement, if error do X. */}

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>

      </div>
    </main>
  );
}

export default App;