import './App.css';
import { useEffect, useState } from 'react';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';
const initialRememberSearch = JSON.parse(localStorage.getItem('remember-search'));

function App() {
  const [rememberSearches, setRememberSearches] = useState( !!initialRememberSearch);
  const [currentSearchTerm, setCurrentSearchTerm] = useState(initialRememberSearch || '');
  const [searchInput, setSearchInput] = useState(rememberSearches ? initialRememberSearch : '');
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchStories = async () => {
      const request = await fetch(`${API_ENDPOINT}${currentSearchTerm}`);
      const response = await request.json();
      setList(response.hits);
    }
    fetchStories();
  }, [currentSearchTerm]);

  useEffect(() => {
    localStorage.setItem('remember-search', JSON.stringify(rememberSearches ? currentSearchTerm : false));
  }, [currentSearchTerm, rememberSearches]);

  const handleSearchInput = (e) =>
  setSearchInput(e.target.value);

  const handleCheckbox = (e) => {
    setRememberSearches(e.target.checked);
  }

  const handelSearchSubmit = () =>
    setCurrentSearchTerm(searchInput);

  return (
    <main>
      <InputWithLabel name="remember" type="checkbox" checked={rememberSearches} onChange={handleCheckbox}>Remember my last search</InputWithLabel>
      <InputWithLabel name="search" value={searchInput} onChange={handleSearchInput}>Search:</InputWithLabel>
      <button type="submit" onClick={handelSearchSubmit}>Submit</button>
      <List list={list} />
    </main>
  );
}

function List({list}) {
  return (
    <ul>
      {list.map((item) =>
        <ListItem {...item} key={item.objectID} />
      )}
    </ul>
  );
}

function ListItem({title, url, author}) {
  return (
    <li>
      <a href={url}>{title}</a> {author}
    </li>
  );
}

function InputWithLabel({name, type = 'text', placeholder = '', value, children, ...rest}) {
  return (
    <div>
      <label htmlFor={name}>{children}</label>
      <input name={name} type={type} value={value} placeholder={placeholder} {...rest} />
    </div>
  );
}

export default App;
