import { useState, useEffect } from "react";
const key = "109e979d";


export function useMovies(query){
    const [movies, setMovies] = useState([]);
      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState("");
    useEffect(() => {
        // callback?.() 
    const controller = new AbortController();

    const fetchMovies = async () => {
      try { 
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${key}&s=${query}`,
          { signal: controller.signal }
        );
        if (!res.ok)
          throw new Error("Something went wrong while fetching the movies");

        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie not Found");
        setMovies(data.Search);
        setError("");
        // console.log(data.Search);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err.message);
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    // handleCloseMovie()
    fetchMovies();
    return function () {
      controller.abort();
    };

  }, [query]);
  return {movies, isLoading, error}
}