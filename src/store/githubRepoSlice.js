/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const baseUrl = "https://api.github.com";

export const STATUSES = Object.freeze({
    COMPLETED: "completed",
    ERROR: "error",
    LOADING: "loading",
});

// Get last month date
function getLastMonthDate() {
    let currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 1);
    let formattedDate = currentDate.toISOString().slice(0, 10);
    return formattedDate;
}

const lastMonthDate = getLastMonthDate();

// Fetch Github Repos Action
export const fetchGithubRepos = createAsyncThunk(
    "fetchGithubRepos",
    async (page = 1, { rejectWithValue }) => {
        try {
            const res = await fetch(
                `${baseUrl}/search/repositories?q=created:>2017-10-22&sort=stars&order=desc&page=${page}&per_page=5`
            );
            const data = await res.json();
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

const githubRepoSlice = createSlice({
    name: "githubRepos",
    initialState: {
        data: {
            total_count: 0,
            items: [],
        },
        status: STATUSES.IDLE,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGithubRepos.pending, (state, action) => {
                state.status = STATUSES.LOADING;
            })
            .addCase(fetchGithubRepos.fulfilled, (state, action) => {
                return {
                    data: {
                        items: [...state.data.items, ...action.payload.items],
                    },
                    status: STATUSES?.COMPLETED,
                };
            })
            .addCase(fetchGithubRepos.rejected, (state, action) => {
                state.status = STATUSES.ERROR;
            });
    },
});

export default githubRepoSlice.reducer;
