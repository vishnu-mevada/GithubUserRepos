/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
// import Typography from "@mui/material/Typography";
import ArrowDropForwardIcon from "@mui/icons-material/ArrowForwardIos";
import "./RepoList.css";
// import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { STATUSES, fetchGithubRepos } from "../store/githubRepoSlice";
import Graph from "./Graph";

const ReposList = () => {
    const dispatch = useDispatch();
    const { data: githubRepos, status } = useSelector(
        (state) => state.githubRepos
    );
    const [currentPage, setCurrentPage] = useState(1);
    const statusRef = useRef(null);
    useEffect(() => {
        statusRef.current = status;
    }, [status]);
    useEffect(() => {
        loadMoreData();
    }, []);
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
        setCurrentPage((prev) => prev + 1);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    return (
        <>
            {githubRepos?.items?.map((item, index) => (
                <Accordion key={index}>
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
                        <Details owner={item.owner.login} repo={item.name} />
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

const Details = ({ owner, repo }) => {
    const [value, setValue] = useState("");
    console.log(value);
    return (
        <>
            <div style={{ display: "flex", justifyContent: "right" }}>
                <select
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                    }}
                >
                    <option disabled value="">
                        select
                    </option>
                    <option value="commits">Commit</option>
                    <option value="additions">Additions</option>
                    <option value="deletions">Deletion</option>
                </select>
            </div>
            <Graph
                name={"Total Changes"}
                activity={value}
                owner={owner}
                repo={repo}
            />
            <Graph
                name={"Contributor Changes"}
                activity={value}
                owner={owner}
                repo={repo}
            />
        </>
    );
};
