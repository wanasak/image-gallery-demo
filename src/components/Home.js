import React from 'react';
import { AuthContext } from '../App';
import Card from './Card';

const initialState = {
  songs: [],
  isFetching: false,
  hasError: false
};
const reducer = (state, action) => {
  switch (action.typำ) {
    case 'FETCH_SONGS_REQUEST':
      return {
        ...state,
        isFetching: true,
        hasError: false
      };
    case 'FETCH_SONGS_REQUEST_SUCCESS':
      return {
        ...state,
        isFetching: false,
        songs: action.payload
      };
    case 'FETCH_SONGS_REQUEST_FAILURE':
      return {
        ...state,
        isFetching: false,
        hasError: true
      };
    default:
      return state;
  }
};
export const Home = () => {
  const { state: authState } = React.useContext(AuthContext);
  const [state, dispatch] = React.useReducer(reducer, initialState);
  React.useEffect(() => {
    dispatch({
      type: 'FETCH_SONGS_REQUEST'
    });
    fetch('https://hookedbe.herokuapp.com/api/songs', {
      headers: {
        Authorization: `Bearer ${authState.token}`
      }
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then(resJson =>
        dispatch({
          type: 'FETCH_SONGS_SUCCESS',
          payload: resJson
        })
      )
      .catch(err =>
        dispatch({
          type: 'FETCH_SONGS_FAILURE'
        })
      );
  }, [authState.token]);
  return (
    <div className="home">
      {state.isFetching ? (
        <spam className="loader">LOADING...</spam>
      ) : state.hasError ? (
        <span className="error">AN ERROR HAS OCURED</span>
      ) : (
        <>
          {state.songs.length > 0 &&
            state.songs.map(song => (
              <Card key="{song.id.toString()}" song={song} />
            ))}
        </>
      )}
    </div>
  );
};

export default Home;
