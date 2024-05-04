import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAnecdotes, createAnecdote } from './routing';

const App = () => {
  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1,
  });
  const queryClient = useQueryClient();

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnec) => {
      const anecs = queryClient.getQueryData(['anecdotes']);
      queryClient.setQueryData(['anecdotes'], anecs.concat(newAnec));
    },
  });

  console.log(JSON.parse(JSON.stringify(result)));
  if (result.isLoading) {
    return <div>loading data...</div>;
  }
  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>;
  }

  const anecdotes = result.data;

  const addAnecdote = async (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    if (content.length >= 5) {
      event.target.anecdote.value = '';
      newAnecdoteMutation.mutate({ content });
    } else {
      console.log(
        'validation error: content too short, must be at least 5 characters'
      );
    }
  };
  const handleVote = (anecdote) => {
    console.log('vote');
  };

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm onCreate={addAnecdote} />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
