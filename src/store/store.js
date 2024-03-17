import { configureStore } from "@reduxjs/toolkit";
import githubRepoReducer from "./githubRepoSlice";
import githubRepoActivityReducer from "./githubRepoActivitySlice";
import repositoryStatsReducer from "./githubRepoStatsSlice";

const store = configureStore({
    reducer: {
        githubRepos: githubRepoReducer,
        githubRepoActivity: githubRepoActivityReducer,
        repositoryStats: repositoryStatsReducer,
    },
});

export default store;
