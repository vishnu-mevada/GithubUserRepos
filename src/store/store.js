import { configureStore } from "@reduxjs/toolkit";
import githubRepoReducer from "./githubRepoSlice";
import repositoryStatsReducer from "./githubRepoStatsSlice";
import contributorChangesReducer from "./githubRepoContributorsSlice";

const store = configureStore({
    reducer: {
        githubRepos: githubRepoReducer,
        repositoryStats: repositoryStatsReducer,
        repositoryContributors: contributorChangesReducer,
    },
});

export default store;
