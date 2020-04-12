import React, { useState, useEffect } from 'react'
import {
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts'
import isEmpty from 'lodash/isEmpty'

const Area = ({ data }) => {
  const [newData, setNewData] = useState([])

  useEffect(() => {
    setNewData(data.map(ret => ret.node))
  }, [data])

  if (isEmpty(newData)) return null

  return (
    <ResponsiveContainer width="700px" height="420px">
      <AreaChart data={newData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="updated" />
        <XAxis
          interval={0}
          dataKey="updated"
          scale="time"
          type="number"
          tickSize={0}
          axisLine={{
            strokeWidth: '0.2px',
            stroke: "#a0aec0"
          }}
          domain={['dataMin', 'dataMax']}
          padding={{left: 0, right: 30}}
        />
        <YAxis
          dataKey="cases"
          axisLine={false}
          tickSize={0}
          tickMargin={15}
        />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area data={newData} type="monotone" dataKey="cases" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default Area
