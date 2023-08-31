"use client";
import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";

const PromptCardList = ({data,handleTagClick}) =>{
  return(
    <div className="mt-16 prompt_layout">
      {
        data.map((post) => (
          <PromptCard 
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
          />
        ))
      }
    </div>
  )
}
const Feed = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState("");
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() =>{
    const fetchPosts = async () =>{
      const response = await fetch('/api/prompt');
      const data = await response.json();
  
      setAllPosts(data);
    }
    fetchPosts();
  },[]);

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i"); // 'i' flag for case-insensitive search
    return allPosts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const handleSearchChange = (e) =>{
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(()=>{
        const searchedResults = filterPrompts(e.target.value);
        setFilteredPosts(searchedResults)
      },500)
    )
  }

  const handleTagClick = (tagName) => {
    setSearchText(tagName);

    const searchResult = filterPrompts(tagName);
    setFilteredPosts(searchResult);
  };

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input type="text" 
        placeholder="Search for a tag or a username"
        value={searchText}
        onChange={handleSearchChange}
        required
        className="search_input peer"
        />
      </form>
      {
        searchText ?
        <PromptCardList 
        data={filteredPosts}
        handleTagClick={handleTagClick}
       />
       :
       <PromptCardList 
       data={allPosts}
       handleTagClick={handleTagClick}
      />
      }
    </section>
  )
}

export default Feed;