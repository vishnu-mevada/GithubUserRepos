import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { STATUSES, fetchGithubRepos } from "../store/githubRepoSlice";
import { ActivityChart, ContributorChangesChart } from "./index";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Grid,
    Avatar,
    Typography,
    Button,
} from "@mui/material";
import {
    ArrowForwardIos as ArrowDropForwardIcon,
    StarBorder,
    BugReport,
} from "@mui/icons-material";
import "./RepoList.css";

const ReposList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [expanded, setExpanded] = useState(null);
    const dispatch = useDispatch();
    const statusRef = useRef(null);

    const { data: githubRepos, status } = useSelector(
        (state) => state.githubRepos
    );

    useEffect(() => {
        statusRef.current = status;
    }, [status]);

    useEffect(() => {
        loadMoreData();
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [currentPage]);

    const handleScroll = () => {
        if (
            window.innerHeight + window.scrollY >= document.body.offsetHeight &&
            statusRef.current === STATUSES?.COMPLETED
        ) {
            loadMoreData();
        }
    };

    const loadMoreData = async () => {
        dispatch(fetchGithubRepos(currentPage));
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handleChange = (index) => (event, isExpanded) => {
        setExpanded(isExpanded ? index : null);
    };

    return (
        <>
            {githubRepos?.items?.map((item, index) => (
                <Accordion
                    key={index}
                    expanded={expanded === index}
                    onChange={handleChange(index)}
                >
                    <AccordionSummary
                        expandIcon={<ArrowDropForwardIcon />}
                        aria-controls={`panel-${item.id}-content`}
                        id={`panel-${item.id}-header`}
                    >
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                                <Avatar
                                    alt={item.owner.login}
                                    src={item.owner.avatar_url}
                                />
                            </Grid>
                            <Grid item xs={12} sm container>
                                <Grid
                                    item
                                    xs
                                    container
                                    direction="column"
                                    spacing={1}
                                >
                                    <Grid item>
                                        <Typography variant="h6">
                                            {item.name}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body1">
                                            {item.description}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        container
                                        spacing={1}
                                        alignItems="baseline"
                                    >
                                        <Grid item>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<StarBorder />}
                                            >
                                                {item.stargazers_count}
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<BugReport />}
                                            >
                                                {item.open_issues_count}
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="body2">
                                                Last pushed{" "}
                                                {new Date(
                                                    item.pushed_at
                                                ).toLocaleString()}{" "}
                                                by {item.owner.login}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                        {expanded === index && (
                            <ActivityChart
                                owner={item.owner.login}
                                repo={item.name}
                            />
                        )}

                        {expanded === index && (
                            <ContributorChangesChart
                                owner={item.owner.login}
                                repo={item.name}
                            />
                        )}
                    </AccordionDetails>
                </Accordion>
            ))}
            {status === STATUSES?.LOADING && (
                <h2 className="text-center my-2">Loading...</h2>
            )}
            {status === STATUSES?.ERROR && (
                <h2 className="text-center my-2">
                    There is some internal server Error please try later
                </h2>
            )}
        </>
    );
};

export default ReposList;
