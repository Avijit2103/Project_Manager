import React from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts'
import CustomLegends from './CustomLegends'
const CustomBarChart = ({ data }) => {
    const getBarColor = (entry) => {
        switch (entry?.priority) {
            case 'High':
                return '#E15759'; // Red
            case 'Medium':
                return '#F1CE63'; // Yellow
            case 'Low':
                return '#59A14F'; // Green
            default:
                return '#D3D3D3'; // Gray for unknown/undefined priorities
        }
    };
    const CustomToolTip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return <div className='bg-white shadow-md rounded-lg p-2 border boder-gray-300'>
                <p className='text-xs font-semi-bold text-gray-800 mb-1'>{payload[0].payload.priority}</p>
                <p className='text-sm text-gray-600'>
                    count:{" "}<span className='text-sm font-medium text-gray-900'>{payload[0].payload.count}</span>
                </p>
            </div>
        }
        return null
    }
    return (
        <div className='bg-white mt-6'>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} >
                <CartesianAxis stroke="none" />
                <XAxis
                    dataKey="priority"
                    tick={{ fill: '#555', fontSize: 12 }}
                    stroke='none' />
                <YAxis
                    tick={{ fill: '#555', fontSize: 12 }}
                    stroke='none'
                />
                <Tooltip content={CustomToolTip} cursor={{ fill: "transparent" }} />
                <Bar
                    dataKey="count"
                    nameKey="priority"
                    fill='#FF8042'
                    radius={[10, 10, 0, 0]}
                    activeDot={{ r: 8, fill: "yellow" }}
                    axtiveStyle={{ fill: "green" }}
                >
                    {data.map((entry, index) => (
                        <Cell key={index} fill={getBarColor(entry)} />
                    ))}
                </Bar>
            </BarChart>

        </ResponsiveContainer>
        </div>
    )
}

export default CustomBarChart