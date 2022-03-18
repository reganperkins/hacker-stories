import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
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

  const handleSearchInput = (e) =>
    setSearchTerm(e.target.value);

  const handelSearchSubmit = () =>
    setUrl(`${API_ENDPOINT}${searchTerm}`);

  return (
    <main>
      <InputWithLabel onChange={handleSearchInput}>Search:</InputWithLabel>
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

function ListItem({title, url, ...rest}) {
  console.log(rest)
  return (
    <li><a href={url}>{title}</a></li>
  );
}


function InputWithLabel({type, label, placeholder = '', value, onChange}) {
  return (
    <div>
      <label>{label}</label>
      <input type={type} value={value} placeholder={placeholder} onChange={onChange} />
    </div>
  );
}

export default App;
