const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYjA3YzgyNjZiMWQyMjQyMWIxZDlkMGUwYTc4OGU1MSIsInN1YiI6IjY0Zjk1ODAyNGNjYzUwMTg3NTNlNWVkYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xwgzMem5ovxzdVP8TOhltE4pYPLTiScVYeZj8BncAL0';
const movieBoxContainer=document.getElementById('movie-item');
const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    }
  };

const searchbar = document.getElementById('search-bar');
let searchText;
let searchResults = [];

searchbar.addEventListener('keydown',(event)=>{
    if(event.key==='Enter'){
        searchText = event.target.value;
        searchTMDB();
    }
})

async function searchTMDB(){
    const searchMovieUrl = `https://api.themoviedb.org/3/search/movie?query=${searchText}`;
    try {
        const response = await fetch (searchMovieUrl,options);
        const data = await response.json();
        searchResults=data.results;
        displayData();
        
    } catch (error) {
        console.log(error);
    }
}

//Helper function to Set Attributes on DOM Elements
function setAttributes(element,attribute){
    for (const key in attribute){
        element.setAttribute(key,attribute[key]);
    }
}

function displayData(){
    const imageUrl = `https://api.themoviedb.org/3/movie/movie_id/images`;
    let totalResults = searchResults.length;
    console.log(searchResults);
    while (movieBoxContainer.firstChild) {
        movieBoxContainer.removeChild(movieBoxContainer.firstChild);
    }
    searchResults.forEach((result)=>{
        const img = document.createElement('img');
        if(result.poster_path!=null){
            setAttributes(img,{
                src: `https://image.tmdb.org/t/p/w500/${result.poster_path}`,
                title: result.title,
            });
            movieBoxContainer.appendChild(img);
        }
    });
}





//On Load
searchTMDB();