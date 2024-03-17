import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchRepositoryStats = createAsyncThunk(
    "repositoryStats/fetchStats",
    async ({ owner, repo }) => {
        try {
            const commitActivityResponse = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`
            );
            const codeFrequencyResponse = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/stats/code_frequency`
            );

            if (!commitActivityResponse.ok || !codeFrequencyResponse.ok) {
                throw new Error("Failed to fetch repository stats");
            }

            const commitActivityData = await commitActivityResponse.json();
            const codeFrequencyData = await codeFrequencyResponse.json();

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
        stats: null,
        loading: false,
        error: null,
    },
    reducers: {},
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
