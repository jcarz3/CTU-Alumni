import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, Label } from "recharts";
import axios from "axios";

import "./home.css";

const colors = ["#0088FE", "#f1c3c3", "#FFBB28", "#FF8042", "#8884d8"];

const GenderChart = () => {
    const [data, setData] = useState([]);
    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    useEffect(() => {
        const fetchData = async () => {
            const result = await axios("http://localhost:8080/api/users/all");

            // Create a map to store the counts for each gender
            const counts = new Map();
            result.data.forEach((user) => {
                if (user.gender && counts.has(user.gender)) {
                    counts.set(user.gender, counts.get(user.gender) + 1);
                } else if (user.gender) {
                    counts.set(user.gender, 1);
                }
            });

            // Convert the map to an array of objects
            const genderData = Array.from(counts.entries()).map(
                ([name, value]) => ({
                    name,
                    value,
                })
            );

            setData(genderData);
        };

        fetchData();
    }, []);

    return (
        <PieChart width={260} height={238} className="piechart">
            <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={65}
                innerRadius={30}
            >
                {data.map((entry, index) => (
                    <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                    >
                        <Label
                            position="side"
                            fontSize={20}
                            fontWeight={700}
                            fill="#333"
                            value={entry.value}
                            formatter={(value) =>
                                `${((value / total) * 100).toFixed(2)}%`
                            }
                        />
                    </Cell>
                ))}
            </Pie>
            <Tooltip />
            <Legend wrapperStyle={{ display: "flex", alignItems: "center" }} />
        </PieChart>
    );
};

export default GenderChart;
