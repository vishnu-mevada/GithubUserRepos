import { useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useSelector, useDispatch } from "react-redux";
import { fetchRepositoryContributors } from "../store/githubRepoContributorsSlice";
import PropTypes from "prop-types";

const ContributorChangesChart = ({ owner, repo }) => {
    const dispatch = useDispatch();
    const { contributors, loading, error } = useSelector(
        (state) => state.repositoryContributors
    );

    useEffect(() => {
        dispatch(fetchRepositoryContributors({ owner: owner, repo: repo }));
    }, [dispatch, owner, repo]);

    // Set highchart data contributors
    const formatChartData = () => {
        if (contributors === undefined || contributors.length === 0) {
            return {
                weeks: [],
                contributors: [],
            };
        }

        const chartData = {
            weeks: [],
            contributors: [],
        };

        contributors.forEach((contributor) => {
            contributor.weeks.forEach((week) => {
                const weekDate = new Date(week.w * 1000);
                const formattedDate = `${
                    weekDate.getMonth() + 1
                }/${weekDate.getDate()}/${weekDate.getFullYear()}`;
                if (!chartData.weeks.includes(formattedDate)) {
                    chartData.weeks.push(formattedDate);
                }
            });

            const contributorData = contributor.weeks.map(
                (week) => week.a + week.d + week.c
            );

            chartData.contributors.push({
                name: contributor.author.login,
                data: contributorData,
            });
        });

        return chartData;
    };

    // Contributor chart options
    const options = {
        chart: {
            type: "line",
            height: 350,
        },
        title: {
            text: "Contributor Changes",
        },
        series: formatChartData().contributors,
    };

    if (loading) {
        return (
            <h2 className="text-center my-2">Loading Contributors Data...</h2>
        );
    }

    if (error) {
        return <h2 className="text-center my-2">Error: {error}</h2>;
    }

    return (
        <div>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};

export default ContributorChangesChart;

ContributorChangesChart.propTypes = {
    owner: PropTypes.string,
    repo: PropTypes.string,
};
