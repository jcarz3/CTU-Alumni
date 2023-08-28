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

const BarChartExample = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const result = await axios("http://localhost:8080/api/users/all");

            // Create a map to store the counts for each course
            const counts = new Map();
            result.data.forEach((user) => {
                if (user.course && counts.has(user.course)) {
                    counts.set(user.course, counts.get(user.course) + 1);
                } else if (user.course) {
                    counts.set(user.course, 1);
                }
            });

            // Convert the map to an array of objects
            const courseData = Array.from(counts.entries()).map(
                ([name, value]) => ({
                    name,
                    value,
                })
            );

            setData(courseData);
        };

        fetchData();
    }, []);

    return (
        <BarChart
            width={450}
            height={250}
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" fontSize={11} />
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
            {/* <Legend wrapperStyle={{ display: "flex", alignItems: "center" }} /> */}
            <Bar dataKey="value" fill="#16CC62" />
        </BarChart>
    );
};

export default BarChartExample;

// import React, { useState, useEffect } from "react";
// import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
// import { Label } from "recharts";

// import axios from "axios";

// import "./home.css";

// const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

// const BarChartExample = () => {
//     const [data, setData] = useState([]);
//     const total = data.reduce((acc, curr) => acc + curr.value, 0);
//     useEffect(() => {
//         const fetchData = async () => {
//             const result = await axios("http://localhost:8080/api/users/all");

//             // Create a map to store the counts for each course
//             const counts = new Map();
//             result.data.forEach((user) => {
//                 if (user.course && counts.has(user.course)) {
//                     counts.set(user.course, counts.get(user.course) + 1);
//                 } else if (user.course) {
//                     counts.set(user.course, 1);
//                 }
//             });

//             // Convert the map to an array of objects
//             const courseData = Array.from(
//                 counts.entries()
//             ).map(([name, value]) => ({ name, value }));

//             setData(courseData);
//         };

//         fetchData();
//     }, []);

//     return (
//         <PieChart width={357} height={280} className="piechart">
//             <Pie
//                 data={data}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={70}
//                 innerRadius={30}
//                 label={({ value, percent, index }) => (
//                     <text x={0} y={0} fontSize={20} fill="#333">
//                         {`${percent.toFixed(2)}% (${value})`}
//                     </text>
//                 )}
//                 labelLine={{ length: 20, angle: 45 }}
//             >
//                 {data.map((entry, index) => (
//                     <Cell
//                         key={`cell-${index}`}
//                         fill={colors[index % colors.length]}
//                     >
//                         <Label
//                             position="side"
//                             fontSize={20}
//                             fontWeight={700}
//                             fill="#333"
//                             value={entry.value}
//                             formatter={(value, percent) =>
//                                 `${percent.toFixed(2)}% (${value})`
//                             }
//                         />
//                     </Cell>
//                 ))}
//             </Pie>
//             <Tooltip />
//             <Legend wrapperStyle={{ display: "flex", alignItems: "center" }} />
//         </PieChart>
//     );
// };

// export default BarChartExample;
