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
const modal = document.getElementById('myModal');
const modalTitle = document.getElementById('modal-title');
const modalReleaseDate = document.getElementById('modal-release-date');
const modalOverview = document.getElementById('modal-overview');
const closeBtn = document.querySelector('.close');
let searchText;
let filterResult;
let searchArray = [];
let movieIdOfSearchArray=[];
let movieIdActorName = [];
let selectedMovieId;

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
    //console.log(filterResult);
    sortByFilter();
    displayData();
})
closeBtn.addEventListener('click',()=>{
    modal.style.display='none';
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

//Function to get movie details
async function movieDetails(movieID){
    const movieDetailsUrl= `https://api.themoviedb.org/3/movie/${movieID}/casts?api_key=eb07c8266b1d22421b1d9d0e0a788e51`;
    try {
        const response = await fetch (movieDetailsUrl,options);
        const data = await response.json();
        //console.log(data);
        movieIdActorName.push(data);
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

//Helper function to grab the name of Main Cast of selected movie
function grabSelectedMovieName(){
    let name = '';
    for(movie of movieIdActorName){
        if(movie.id === selectedMovieId){
            return movie.cast[0].name;
        }
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
    //console.log(searchArray);
    movieIdOfSearchArray=[];
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
            img.addEventListener(('click'),()=>{
                selectedMovieId=result.id;
                openModal(result);
            })
            movieBoxContainer.appendChild(img);
        }
    });
    grabMovieIDs();
    movieLoop();
    console.log(searchArray);
}

//Function to loop through movieDetails
function movieLoop(){
    for(const movieId of movieIdOfSearchArray){
        movieDetails(movieId);
    }
}

//Function that filters the selected movie to see if it is in a series if so then we return the array
function redisplaySelectedMovie(){
    let targetName = grabSelectedMovieName();
    const selectedMovieArray=movieIdActorName.filter((movie)=>movie.cast.length>0 && movie.cast[0].name===targetName).map((movie)=>movie.id);
    const matchedArray = searchArray.filter((movie)=>{
        return selectedMovieArray.includes(movie.id);
    });
    return matchedArray;
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

//Function to open the modal and siaply movie details
function openModal(movie){
    let checkSeries = redisplaySelectedMovie();
    //sort checkSeries by releaste date
    checkSeries = checkSeries.sort((a,b)=>{
        const dateA = new Date(a.release_date);
        const dateB = new Date(b.release_date);
        return dateA-dateB;
    })
    //this part of the code creates the modal and display
    modalTitle.textContent=movie.title;
    modalReleaseDate.textContent=`Release Date: ${movie.release_date}`;
    modalOverview.textContent=`Overview: ${movie.overview}`;
    modal.style.display='flex';
    const posterImg = document.createElement('img');
    posterImg.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
    posterImg.alt = movie.title;
    posterImg.id = 'main-poster';
    const modalContent = document.querySelector('.modal-content');
    const existingPosterImg = modalContent.querySelector('img');
    if(existingPosterImg){
        modalContent.removeChild(existingPosterImg);
    }
    modalContent.insertBefore(posterImg,modalContent.firstChild);

    //This part of the code checks to see if it is in a series
     if(checkSeries.length >1){
        modalContent.classList.remove('empty');
        const modalSeries = document.querySelector('.modal-series');
        modalSeries.style.display = 'flex'
        const h3Element = document.createElement('h3');
        h3Element.textContent='Series';
        while(modalSeries.firstChild){
            modalSeries.removeChild(modalSeries.firstChild);
        }
        //foreach
        checkSeries.forEach((movie)=>{
            const seriesPoster = document.createElement('img');
            setAttributes(seriesPoster,{
                src: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
                alt: movie.title,
            });
            modalSeries.appendChild(seriesPoster);
        });
     }else{
        const modalSeries = document.querySelector('.modal-series');
        const existingH3 = modalSeries.querySelector('h3');
        if(existingH3){
            modalSeries.removeChild(existingH3);
        }
        while(modalSeries.firstChild){
            modalSeries.removeChild(modalSeries.firstChild);
        }
        modalContent.classList.add('empty');
     }

}