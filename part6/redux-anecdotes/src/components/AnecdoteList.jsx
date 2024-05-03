import { useSelector, useDispatch } from 'react-redux';
import { voteAnecdote } from '../reducers/anecdoteReducer';
import { setNoti } from '../reducers/notiReducer';

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

  const vote = (anecdote) => {
    console.log('voted', anecdote.id);
    dispatch(voteAnecdote(anecdote));
    dispatch(setNoti(`You voted: ${anecdote.content}`, 5));
  };

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id} style={{ marginBottom: 18 }}>
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
