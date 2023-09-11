const searchbar = document.getElementById('search-bar');
let searchText;
function grabSearchText (callback){
    searchbar.addEventListener("change",()=>{
        searchText = searchbar.value;
    })
    
}


//On Load
grabSearchText();
console.log(searchText);