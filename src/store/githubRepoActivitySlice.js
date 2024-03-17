/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const baseUrl = "https://api.github.com";

export const STATUSES = Object.freeze({
    COMPLETED: "completed",
    ERROR: "error",
    LOADING: "loading",
});

// Fetch Github Repos Action
export const fetchGithubReposActivity = createAsyncThunk(
    "fetchGithubReposActivity",
    async (args, { rejectWithValue }) => {
        try {
            const res = await fetch(
                `${baseUrl}/repos/${args.owner}/${args.repo}/stats/${args.activity}`
            );
            const data = await res.json();

            console.log("data github repo activity...", data);
            if (data?.items) {
                return data;
            } else {
                return rejectWithValue({
                    message: "there is some server error. please try later",
                });
            }
        } catch (error) {
            return rejectWithValue({
                message: "there is some server error. please try later",
            });
        }
    }
);

const githubRepoActivitySlice = createSlice({
    name: "githubRepos",
    initialState: {
        data: {
            items: [],
        },
        status: STATUSES.IDLE,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGithubReposActivity.pending, (state, action) => {
                state.status = STATUSES.LOADING;
            })
            .addCase(fetchGithubReposActivity.fulfilled, (state, action) => {
                return {
                    data: {
                        items: [...state.data.items, ...action.payload.items],
                    },
                    status: STATUSES?.COMPLETED,
                };
            })
            .addCase(fetchGithubReposActivity.rejected, (state, action) => {
                state.status = STATUSES.ERROR;
            });
    },
});

export default githubRepoActivitySlice.reducer;
