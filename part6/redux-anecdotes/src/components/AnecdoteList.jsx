import { useSelector, useDispatch } from 'react-redux';
import { voteAction } from '../reducers/anecdoteReducer';
import { setNotification, clearNotification } from '../reducers/notiReducer';

const AnecdoteList = () => {
  const anecdotes = useSelector(({ filter, anecdotes }) => {
    return filter !== ''
      ? anecdotes.filter((anecdote) =>
          anecdote.content.toLowerCase().includes(filter.toLowerCase())
        )
      : anecdotes;
  });
  // const anecdotes = useSelector((state) =>
  //   state.sort((a, b) => b.votes - a.votes)
  // );
  const dispatch = useDispatch();

  const vote = ({ content, id }) => {
    console.log('vote', id);
    dispatch(voteAction(id));
    dispatch(setNotification(`Successfully voted: ${content}`));
    setTimeout(() => {
      dispatch(clearNotification());
    }, 5000);
  };

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes} votes total
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};
export default AnecdoteList;
