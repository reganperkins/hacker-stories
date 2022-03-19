import './App.css';
import { useEffect, useReducer, useState } from 'react';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';
const initialRememberSearch = JSON.parse(localStorage.getItem('remember-search'));

const storyReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        stories: state.data.filter(story => action.payload.objectID !== story.objectID)
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    default:
      throw new Error();
  }
}

function App() {
  const [rememberSearches, setRememberSearches] = useState( !!initialRememberSearch);
  const [currentSearchTerm, setCurrentSearchTerm] = useState(initialRememberSearch || '');
  const [searchInput, setSearchInput] = useState(rememberSearches ? initialRememberSearch : '');

  const [stories, dispatchStories] = useReducer(storyReducer, { data: [], isLoading: false, isError: false });

  useEffect(() => {
    const fetchStories = async () => {
      dispatchStories({type: 'STORIES_FETCH_INIT'});
      try {
        const request = await fetch(`${API_ENDPOINT}${currentSearchTerm}`);
        const response = await request.json();
        dispatchStories({type: 'STORIES_FETCH_SUCCESS', payload: response.hits});
      } catch {
        dispatchStories({type: 'FETCH_STORIES_FAILURE'});
      }
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
      {stories.isLoading
        ? <div>...LOADING</div>
        : <List list={stories.data} />
      }
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
