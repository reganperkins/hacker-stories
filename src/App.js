import './App.css';
import { useEffect, useReducer } from 'react';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';
const rememberedContent = JSON.parse(localStorage.getItem('remember-search'));

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
        data: state.data.filter(story => action.payload.objectID !== story.objectID)
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

const searchReducer = (state, action) => {
  switch(action.type) {
    case 'UPDATE_SEARCH_INPUT':
      return {
        ...state,
        searchInput: action.payload,
      };
    case 'SUBMIT_SEARCH':
      return {
        ...state,
        searchInput: '',
        currentSearchTerm: action.payload,
      };
    case 'UPDATE_REMEMBER_SEARCH':
      return {
        ...state,
        rememberSearchTerm: action.payload,
      };
    default:
      throw new Error();
  }
};

function App() {
  const [search, searchDispatch] = useReducer(searchReducer, {
    rememberSearchTerm: !!rememberedContent,
    currentSearchTerm: rememberedContent || '',
    searchInput: rememberedContent || '',
  });

  const [stories, dispatchStories] = useReducer(storyReducer, {
    data: [],
    isLoading: false,
    isError: false
  });

  useEffect(() => {
    const fetchStories = async () => {
      dispatchStories({type: 'STORIES_FETCH_INIT'});
      try {
        const request = await fetch(`${API_ENDPOINT}${search.currentSearchTerm}`);
        const response = await request.json();
        dispatchStories({type: 'STORIES_FETCH_SUCCESS', payload: response.hits});
      } catch {
        dispatchStories({type: 'FETCH_STORIES_FAILURE'});
      }
    }
    fetchStories();
  }, [search.currentSearchTerm]);

  useEffect(() => {
    localStorage.setItem('remember-search', JSON.stringify(search.rememberSearchTerm ? search.currentSearchTerm : false));
  }, [search.currentSearchTerm, search.rememberSearchTerm]);

  const handleSearchInput = (e) =>
  searchDispatch({ type: 'UPDATE_SEARCH_INPUT', payload: e.target.value });

  const handleCheckbox = (e) => {
    searchDispatch({ type: 'UPDATE_REMEMBER_SEARCH', payload: e.target.checked });
  }

  const handelSearchSubmit = () =>
    searchDispatch({ type: 'SUBMIT_SEARCH', payload: search.searchInput});

  const handleItemClick = (item) =>
    dispatchStories({ type: 'REMOVE_STORY', payload: item});

  return (
    <main>
      <h1>Hacker News stories</h1>

      <header className="space-between">
        <div>
          <InputWithLabel
            name="search"
            value={search.searchInput}
            onChange={handleSearchInput}
          >
            Search: &nbsp;
          </InputWithLabel>

          <button
            type="submit"
            onClick={handelSearchSubmit}
          >
            Submit
          </button>
        </div>

        <InputWithLabel
          name="remember"
          type="checkbox"
          checked={search.rememberSearchTerm}
          onChange={handleCheckbox}
        >
          Remember my last search
        </InputWithLabel>
      </header>

      <hr />

      <section>
        { search.currentSearchTerm &&
          <h2>{ `Results for ${search.currentSearchTerm}` }</h2>
        }

        { stories.isLoading
          ? <div>...LOADING</div>
          : <List list={stories.data} onClick={ handleItemClick }/>
        }
      </section>
    </main>
  );
}

function List({ list, onClick }) {
  return (
    <ul>
      {list.map((item) =>
        <ListItem {...item} key={item.objectID} onClick={ () => onClick(item) }/>
      )}
    </ul>
  );
}

function ListItem({ title, url, author, onClick }) {
  return (
    <li className="list-item space-between">
      <span>
        <a href={ url }>{ title }</a> by { author }
      </span>
      <button type="button" onClick={ onClick }>Remove</button>
    </li>
  );
}

function InputWithLabel({ name, children, ...rest }) {
  return (
    <div className="labeled-input">
      <label htmlFor={name}>{children}</label>
      <input name={name} {...rest} />
    </div>
  );
}

export default App;
