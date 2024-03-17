// import { STATUSES } from "../store/githubRepoSlice";
import Container from "@mui/material/Container";
import RepoList from "../components/ReposList";

const GithubRepos = () => {
    return (
        <Container maxWidth="lg" sx={{ my: 4 }}>
            <RepoList />
        </Container>
    );
};

export default GithubRepos;
