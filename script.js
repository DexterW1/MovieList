//Global variables 
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
const searchButton = document.getElementById('search-button');
const filterOption = document.getElementById('filter');
let searchText;
let filterResult;
let searchArray = [];
let movieIdOfSearchArray=[];
let movieIdActorName = [];

//Event Listner for button click to search
searchButton.addEventListener('click',()=>{
    searchText=searchbar.value;
    searchTMDB();
});
//Event listner for pressing 'Enter' to search
searchbar.addEventListener('keydown',(event)=>{
    if(event.key==='Enter'){
        searchText = event.target.value;
        searchTMDB();
    }
})
//Event Listner for 'change' of filter option
filterOption.addEventListener('change',()=>{
    filterResult=filterOption.value;
    console.log(filterResult);
    sortByFilter();
    displayData();
})


//Function to query and grab data, assign to searchResults array and then display the data
async function searchTMDB(){
    const searchMovieUrl = `https://api.themoviedb.org/3/search/movie?query=${searchText}`;
    try {
        const response = await fetch (searchMovieUrl,options);
        const data = await response.json();
        searchArray=data.results;
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
//Function that grabs all Movie Id of the searchArray
function grabMovieIDs(){
    searchArray.forEach((movie)=>{
        movieIdOfSearchArray.push(movie.id);
    })
}
//Display the data
function displayData(){
    const imageUrl = `https://api.themoviedb.org/3/movie/movie_id/images`;
    let totalResults = searchArray.length;
    movieIdOfSearchArray=[];
    console.log(searchArray);
    while (movieBoxContainer.firstChild) {
        movieBoxContainer.removeChild(movieBoxContainer.firstChild);
    }
    
    searchArray.forEach((result)=>{
        const img = document.createElement('img');
        if(result.poster_path!=null){
            setAttributes(img,{
                src: `https://image.tmdb.org/t/p/w500/${result.poster_path}`,
                title: result.title,
            });
            movieBoxContainer.appendChild(img);
        }
    });
    grabMovieIDs();
    movieLoop();
    //console.log(movieIdActorName);
}
//Function to get movie details
async function movieDetails(movieID){
        const movieDetailsUrl= `https://api.themoviedb.org/3/movie/${movieID}/casts?api_key=eb07c8266b1d22421b1d9d0e0a788e51`;
        try {
            const response = await fetch (movieDetailsUrl,options);
            const data = await response.json();
            console.log(data);
            //movieIdActorName.push(data.cast[0].name);
        } catch (error) {
            console.log(error);
        }
}
//Function to loop through movieDetails
function movieLoop(){
    for(const movieId of movieIdOfSearchArray){
        movieDetails(movieId);
    }
}
//Function to sort the results of searchArray
function sortByFilter(){
    if(filterResult==="Popularity"){
        searchArray= searchArray.sort((a,b)=>b.popularity-a.popularity);
    }
    else if(filterResult==="Release Date"){
        searchArray = searchArray.sort((a,b)=>{
            const dateA= new Date(a.release_date);
            const dateB= new Date(b.release_date);
            return dateB-dateA;
        })
    }
}

//On load