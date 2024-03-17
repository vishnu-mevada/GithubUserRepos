import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { fetchGithubReposActivity } from "../store/githubRepoActivitySlice";

const Graph = ({ name, activity, owner, repo }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (activity) {
            dispatch(fetchGithubReposActivity({ owner, repo, activity }));
        }
    }, [activity, owner, repo]);

    const chartComponentRef = useRef(null);
    return (
        <>
            <HighchartsReact
                highcharts={Highcharts}
                options={{
                    title: {
                        text: name,
                    },
                    series: [
                        {
                            type: "line",
                            data: [1, 2.2, 3, 4, 0],
                        },
                        {
                            type: "line",
                            data: [5, 6.2, 7],
                        },
                    ],
                }}
                ref={chartComponentRef}
            />
        </>
    );
};

export default Graph;
Graph.propTypes = {
    name: PropTypes.string,
    activity: PropTypes.string,
    owner: PropTypes.string,
    repo: PropTypes.string,
};
