import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { fetchRepositoryStats } from "../store/githubRepoStatsSlice";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const ActivityChart = ({ owner, repo }) => {
    const dispatch = useDispatch();
    const [selectedSeries, setSelectedSeries] = useState("commits");
    const { stats, loading, error } = useSelector(
        (state) => state.repositoryStats
    );

    useEffect(() => {
        dispatch(fetchRepositoryStats({ owner, repo }));
    }, [dispatch, owner, repo]);

    const formatChartData = () => {
        if (stats.length == 0) {
            return {
                weeks: [],
                commits: [],
                weeks1: [],
                additions: [],
                deletions: [],
            };
        }

        const chartData = {
            weeks: [],
            commits: [],
            weeks1: [],
            additions: [],
            deletions: [],
        };

        if (stats.commitActivity) {
            stats.commitActivity.map((weekData) => {
                const weekDate = new Date(weekData.week * 1000);
                const formattedDate = `${
                    weekDate.getMonth() + 1
                }/${weekDate.getDate()}/${weekDate.getFullYear()}`;
                chartData.weeks.push(formattedDate);
                chartData.commits.push(weekData.total);
            });
        }

        if (stats.codeFrequency) {
            stats.codeFrequency.forEach((weekData) => {
                const weekDate = new Date(weekData[0] * 1000);
                const formattedDate = `${
                    weekDate.getMonth() + 1
                }/${weekDate.getDate()}/${weekDate.getFullYear()}`;
                chartData.weeks1.push(formattedDate);
                chartData.additions.push(weekData[1]);
                chartData.deletions.push(-weekData[2]);
            });
        }
        return chartData;
    };

    // Activity chart options
    const options = {
        chart: {
            type: "line",
        },
        title: {
            text: "Total Changes",
        },
        series: [
            {
                name: "Commits",
                visible: selectedSeries.includes("commits"),
                data: formatChartData().commits,
            },
            {
                name: "Additions",
                visible: selectedSeries.includes("additions"),
                data: formatChartData().additions,
            },
            {
                name: "Deletions",
                visible: selectedSeries.includes("deletions"),
                data: formatChartData().deletions,
            },
        ],
    };

    const handleSeriesToggle = (event) => {
        const value = event.target.value;
        setSelectedSeries(value);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "right" }}>
                <Select value={selectedSeries} onChange={handleSeriesToggle}>
                    <MenuItem value="commits">Commits</MenuItem>
                    <MenuItem value="additions">Additions</MenuItem>
                    <MenuItem value="deletions">Deletions</MenuItem>
                </Select>
            </div>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};

export default ActivityChart;

ActivityChart.propTypes = {
    owner: PropTypes.string,
    repo: PropTypes.string,
};
