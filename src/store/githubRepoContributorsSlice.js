import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchRepositoryContributors = createAsyncThunk(
    "repositoryContributors/fetchContributors",
    async ({ owner, repo }) => {
        console.log(owner, repo, "owner and repos");
        try {
            const response = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/stats/contributors`,
                {
                    headers: {
                        Authorization: `token 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`,
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