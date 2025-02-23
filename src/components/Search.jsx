import React from 'react';
import searchIcon from  "../assets/search-icon.svg";

const Search = ({searchTerm, setSearchTerm}) => {
  return (
    <div className='search'>
      <div>
        <img src={searchIcon} alt='Search icon' />
        <input 
        type="text" 
        placeholder='Search for the movies you are looking for' 
        value={searchTerm}
        onChange={(event)=> setSearchTerm(event.target.value)}/>
      </div>
    </div>
  )
}

export default Search
