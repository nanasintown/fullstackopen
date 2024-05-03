import { createSlice } from '@reduxjs/toolkit';
import anecdoteService from '../services/anecdoteService';

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAction(state, action) {
      const id = action.payload;
      const anecdote = state.find((anec) => anec.id === id);
      if (anecdote) {
        anecdote.votes++;
      }
      return state.sort((a, b) => b.votes - a.votes);
    },
    createAction(state, action) {
      state.push(action.payload);
      return state;
    },
    initializeAction(state, action) {
      return action.payload;
    },
  },
});

export const { voteAction, createAction, initializeAction } =
  anecdoteSlice.actions;

export const createFirstAnecdote = () => {
  return async (dispatch) => {
    const allAnecdotes = await anecdoteService.getAll();
    dispatch(allAnecdotes);
  };
};

export default anecdoteSlice.reducer;
