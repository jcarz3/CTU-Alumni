import React, { useState, useEffect } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import axios from "axios";

import "./home.css";

const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const SchoolYearChart = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const result = await axios("http://localhost:8080/api/users/all");

            // Create a map to store the counts for each school year
            const counts = new Map();
            result.data.forEach((user) => {
                if (user.schoolYear && counts.has(user.schoolYear)) {
                    counts.set(
                        user.schoolYear,
                        counts.get(user.schoolYear) + 1
                    );
                } else if (user.schoolYear) {
                    counts.set(user.schoolYear, 1);
                }
            });

            // Convert the map to an array of objects
            const schoolYearData = Array.from(counts.entries()).map(
                ([name, value]) => ({
                    name,
                    value,
                })
            );

            // Sort the data in ascending order by year
            schoolYearData.sort((a, b) => a.name - b.name);

            setData(schoolYearData);
        };

        fetchData();
    }, []);

    return (
        <BarChart
            width={440}
            height={245}
            data={data}
            margin={{ top: 5, right: 2, left: 10, bottom: 5 }}
            className="school-year-bar"
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis
                allowDecimals={false}
                label={{
                    value: "Total Count",
                    angle: -90,
                    position: "start",
                    fontSize: 13,
                }}
                orientation="left"
            />
            <Tooltip />
            <Legend wrapperStyle={{ display: "flex", alignItems: "center" }} />
            <Bar dataKey="value" fill="#16CC62" />
        </BarChart>
    );
};

export default SchoolYearChart;
