import React, { useEffect } from 'react'
import styled, { useTheme } from 'styled-components'
import { rgba } from 'polished'
import { format } from 'date-fns'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

import { abbrNumber, formatNumber } from '../../utils'

const ChartWrapper = styled.div`
  height: 400px;

  .recharts-text {
    font-weight: 600;
    fill: ${ ({ theme }) => theme.color.grey[4] };
  }

  .recharts-default-tooltip {
    color: ${ ({ theme }) => theme.color.white[1] };
    box-shadow: 0 4px 12px ${ ({ theme }) => theme.color.grey[0] };
    padding: 0.2em;
    background-color: ${ ({ theme }) => theme.color.grey[0] } !important;
    border: 1px solid ${ ({ theme }) => theme.color.grey[0] } !important;
    border-radius: ${ ({ theme }) => theme.radii.md };

    .recharts-tooltip-item-name {
      font-size: 1.7rem;
      font-weight: 700;
      color: ${ ({ theme }) => theme.color.white[0] };
    }
  }
`

const Chart = ({ data, dataSet }) => {
  const theme = useTheme()
  const truncated = data.slice(data.length - 30)

  return (
    <ChartWrapper>
      <ResponsiveContainer>
        <AreaChart
          data={truncated}
          type="monotone"
          margin={{
            top: 40,
            right: 10,
            left: 10,
            bottom: 20
          }}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={theme.color.blue[0]} stopOpacity={0.15}/>
              <stop offset="95%" stopColor={theme.color.blue[0]} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            stroke={theme.color.grey[3]}
          />
          <XAxis
            dataKey="updated"
            tickFormatter={date => format(date, 'MMMM, do')}
            tickMargin={15}
            tickLine={false}
            axisLine={false}
            tickCount={3}
            interval={2}
          />
          <YAxis
            dataKey={dataSet}
            tickFormatter={val => abbrNumber(val)}
            tickMargin={15}
            tickLine={false}
            axisLine={false}
            domain={['dataMin', 'auto']} />
          />
          <Tooltip
            wrapperStyle={{
              color: theme.color.white[1],
              boxShadow: `0 4px 12px ${theme.color.grey[0]}`,
              padding: '0.2em',
              backgroundColor: theme.color.grey[0],
              border: `1px solid ${theme.color.grey[0]}`,
              borderRadius: theme.radii.md,
            }}
            formatter={value => ['', formatNumber(value)]}
            labelFormatter={(date) => format(date, 'MMMM, do')}
            labelStyle={{
              textTransform: 'capitalize'
            }}
            separator=""
            cursor={{
              strokeWidth: 1,
              stroke: theme.color.blue[0]
            }}
          />
          <Area type='monotone' dataKey={dataSet} strokeWidth="3" stroke={theme.color.blue[0]} fill="url(#colorUv)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}

export default Chart
