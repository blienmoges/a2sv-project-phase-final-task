import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'https://akil-backend.onrender.com';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string[];
  opType: string;
  categories: string[];
  logoUrl: string;
  orgName: string;
  datePosted: string;

}

interface JobsState {
  jobs: Job[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: JobsState = {
  jobs: [],
  status: 'idle',
  error: null,
};

export const getJobs = createAsyncThunk('jobs/fetchJobs', async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/opportunities/search`);
  
    return response.data.data || [];
  } catch (error) {
    throw error;
  }
});

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getJobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.jobs = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch jobs';
      });
  },
});

export default jobsSlice.reducer;