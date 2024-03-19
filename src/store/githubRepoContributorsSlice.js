import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../config/config";

export const fetchRepositoryContributors = createAsyncThunk(
    "repositoryContributors/fetchContributors",
    async ({ owner, repo }) => {
        try {
            const response = await fetch(
                `${config.githubApiUrl}/repos/${owner}/${repo}/stats/contributors`,
                {
                    headers: {
                        Authorization: `${config.githubToken}`,
                        "X-GitHub-Api-Version": "2022-11-28",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch repository contributors");
            }

            let data = [];

            if (response.status === 202) {
                data = [];
            } else {
                data = await response.json();
            }

            return data;
        } catch (error) {
            console.error("Error fetching repository contributors:", error);
            throw error;
        }
    }
);

const repositoryContributorsSlice = createSlice({
    name: "repositoryContributors",
    initialState: {
        contributors: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRepositoryContributors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRepositoryContributors.fulfilled, (state, action) => {
                state.loading = false;
                state.contributors = action.payload;
                state.error = null;
            })
            .addCase(fetchRepositoryContributors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default repositoryContributorsSlice.reducer;
