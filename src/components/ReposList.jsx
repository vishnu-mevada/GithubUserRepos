/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { STATUSES, fetchGithubRepos } from "../store/githubRepoSlice";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDropForwardIcon from "@mui/icons-material/ArrowForwardIos";
import { ActivityChart, ContributorChangesChart } from "./index";
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
                        <div className="d-flex gap-2">
                            <img
                                className="github-img-thumbnail rounded"
                                src={item.owner.avatar_url}
                                alt=""
                            />{" "}
                            <div>
                                <h2>{item.name}</h2>
                                <p>{item.description}</p>
                                <div className="d-flex gap-3 align-items-baseline">
                                    <span className="info-btn btn btn-primary">
                                        {item.stargazers_count}
                                    </span>
                                    <span className="info-btn btn btn-primary">
                                        {item.open_issues_count}
                                    </span>
                                    <span>
                                        Last pushed{" "}
                                        {new Date(
                                            item.pushed_at
                                        ).toLocaleString()}{" "}
                                        by {item.owner.login}
                                    </span>
                                </div>
                            </div>
                        </div>
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
            {status === STATUSES?.LOADING && <h1>Loading...</h1>}
            {status === STATUSES?.ERROR && (
                <h1>There is some internal server Error please try later</h1>
            )}
        </>
    );
};

export default ReposList;
