import { createSlice } from '@reduxjs/toolkit';
import anecdoteService from '../services/anecdoteService';

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAction(state, action) {
      const id = action.payload.id;
      const anecdote = state.find((anec) => anec.id === id);
      if (anecdote) {
        anecdote.votes++;
      }
      return state.sort((a, b) => b.votes - a.votes);
    },
    appendAnecdote(state, action) {
      state.push(action.payload);
      return state;
    },
    initializeAction(state, action) {
      return action.payload;
    },
  },
});

export const { voteAction, appendAnecdote, initializeAction } =
  anecdoteSlice.actions;

export const createFirstAnecdote = () => {
  return async (dispatch) => {
    const allAnecdotes = await anecdoteService.getAll();
    dispatch(allAnecdotes);
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnec = await anecdoteService.createNew(content);
    dispatch(appendAnecdote(newAnec));
  };
};

export const voteAnecdote = (anecdote) => {
  return async (dispatch) => {
    const updatedAnec = await anecdoteService.vote(anecdote);
    dispatch(voteAction(updatedAnec));
  };
};

export default anecdoteSlice.reducer;
