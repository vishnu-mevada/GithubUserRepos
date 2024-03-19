import Container from "@mui/material/Container";
import { ReposList } from "../components/index";

const GithubRepos = () => {
    return (
        <Container maxWidth="lg" sx={{ my: 4 }}>
            <ReposList />
        </Container>
    );
};

export default GithubRepos;
