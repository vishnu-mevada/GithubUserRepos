import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../config/config";

export const fetchRepositoryStats = createAsyncThunk(
    "repositoryStats/fetchStats",
    async ({ owner, repo }) => {
        try {
            const commitActivityResponse = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`,
                {
                    headers: {
                        Authorization: `${config.githubToken}`,
                        "X-GitHub-Api-Version": "2022-11-28",
                    },
                }
            );
            const codeFrequencyResponse = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/stats/code_frequency`,
                {
                    headers: {
                        Authorization: `token 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`,
                        "X-GitHub-Api-Version": "2022-11-28",
                    },
                }
            );

            if (!commitActivityResponse.ok || !codeFrequencyResponse.ok) {
                throw new Error("Failed to fetch repository stats");
            }

            let commitActivityData = [];
            let codeFrequencyData = [];

            if (commitActivityResponse.status === 202) {
                commitActivityData = [];
            } else {
                commitActivityData = await commitActivityResponse.json();
            }

            if (codeFrequencyResponse.status === 202) {
                codeFrequencyData = [];
            } else {
                codeFrequencyData = await codeFrequencyResponse.json();
            }

            return {
                commitActivity: commitActivityData,
                codeFrequency: codeFrequencyData,
            };
        } catch (error) {
            console.error("Error fetching repository stats:", error);
            throw error;
        }
    }
);

const repositoryStatsSlice = createSlice({
    name: "repositoryStats",
    initialState: {
        stats: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRepositoryStats.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchRepositoryStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
                state.error = null;
            })
            .addCase(fetchRepositoryStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default repositoryStatsSlice.reducer;
