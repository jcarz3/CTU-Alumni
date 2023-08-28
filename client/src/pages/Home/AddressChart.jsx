import React from "react";
import "./home.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const AddressChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Fetch user data and update state
        axios
            .get("http://localhost:8080/api/users/all")
            .then((response) => {
                const filteredUsers = response.data.filter(
                    (user) => user.address !== ""
                );

                // Count occurrences of each address
                const addresses = filteredUsers.map((user) => user.address);
                const addressCount = addresses.reduce((counts, address) => {
                    counts[address] = (counts[address] || 0) + 1;
                    return counts;
                }, {});

                // Convert object to array of data for the chart
                const data = Object.entries(addressCount).map(
                    ([address, count]) => {
                        return { address, count };
                    }
                );

                setData(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <BarChart
            width={700}
            height={300}
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
                dataKey="address"
                fontSize={11}
                tickFormatter={(address) =>
                    typeof address === "string"
                        ? address.slice(0, address.indexOf(","))
                        : address
                }
            />
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
            <Tooltip
                content={({ payload }) => {
                    if (payload && payload.length) {
                        return (
                            <div>
                                <p>{payload[0].payload.address}</p>
                            </div>
                        );
                    }
                    return null;
                }}
            />
            <Bar dataKey="count" fill="#44AF69" />
        </BarChart>
    );
};

export default AddressChart;
