import './App.css';
import { useEffect, useState } from 'react';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

function App() {
  const [rememberSearches, setRememberSearches] = useState( localStorage.getItem('remember-search') || false);
  const [searchTerm, setSearchTerm] = useState(rememberSearches || '');
  const [list, setList] = useState([]);
  const [url, setUrl] = useState(API_ENDPOINT);

  useEffect(() => {
    const fetchStories = async () => {
      const request = await fetch(url);
      const response = await request.json();
      setList(response.hits);
    }
    fetchStories();
  }, [url]);

  useEffect(() => {
    localStorage.setItem('remember-search', rememberSearches ? searchTerm : false);
  }, [rememberSearches]);

  const handleSearchInput = (e) =>
    setSearchTerm(e.target.value);

  const handleCheckbox = (e) => {
    console.log('hi', e, e.target.checked)
    setRememberSearches(e.target.checked);
  }

  const handelSearchSubmit = () =>
    setUrl(`${API_ENDPOINT}${searchTerm}`);

  return (
    <main>
      <InputWithLabel name="remember" type="checkbox" onClick={handleCheckbox}>Remember my last search</InputWithLabel>
      <InputWithLabel name="search" onChange={handleSearchInput}>Search:</InputWithLabel>
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
