import React from 'react'
import{
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip

} from 'recharts'
import CustomToolTip from './CustomToolTip'
import CustomLegends from './CustomLegends'

const CustomPieChart = ({data,colors}) => {
  return (
    <ResponsiveContainer width="100%" height={325}>
    <PieChart>
    <Pie
      data={data}
      dataKey="count"
      nameKey="status"
      cx="50%"
      cy="50%"
      outerRadius={130}
      innerRadius={100}
      labelLine={false}
      >
      {data.map((entry,index)=>(
        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
      ))}
      </Pie>
      <Tooltip content={CustomToolTip}/>
      <Legend  content={CustomLegends} />
    </PieChart>
    
    </ResponsiveContainer>
  )
}

export default CustomPieChart