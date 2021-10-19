import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { useTheme } from '@chakra-ui/react'
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
    font-weight: 400;
    font-size: 0.8rem;
    fill: ${ ({ theme }) => theme.colors.gray[400] };
  }
  .recharts-default-tooltip {
    color: ${ ({ theme }) => theme.colors.gray[400] };
    border-color: ${({ theme }) => theme.colors.gray[100] };
    border-radius: ${({ theme }) => theme.radii.md };
    overflow: hidden;

    .recharts-tooltip-item-name {
      font-size: 1.7rem;
      font-weight: 700;
      color: ${ ({ theme }) => theme.colors.black[400] };
    }
  }
`

const Chart = ({ data, dataSet, period }) => {
  const [chartData, setChartData] = useState([])
  const theme = useTheme()

  useEffect(() => {
    setChartData(data.slice(data.length - period))

  }, [period])
  return (
    <ChartWrapper>
      <ResponsiveContainer>
        <AreaChart
          data={chartData}
          type="monotone"
          margin={{
            top: 40,
            right: 10,
            left: 10,
            bottom: 20
          }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={theme.colors.blue[800]} stopOpacity={0.15} />
              <stop offset="95%" stopColor={theme.colors.blue[600]} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            stroke={theme.colors.gray[200]}
          />
          <XAxis
            dataKey="updated"
            tickFormatter={date => period === 30 ? format(date, 'MMMM, do') : format(date, 'MMMM, do, yyyy')}
            tickMargin={15}
            tickLine={false}
            axisLine={false}
            tickCount={5}
            interval={period === 30 ? 3 : 100}
          />
          <YAxis
            dataKey={dataSet}
            tickFormatter={val => abbrNumber(val)}
            tickMargin={15}
            tickLine={false}
            axisLine={false}
            domain={['dataMin', 'auto']}
          />
          <Tooltip
            wrapperStyle={{
              boxShadow: theme.shadows.md,
              borderColor: theme.colors.gray[100],
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
              stroke: theme.colors.blue[400]
            }}
          />
          <Area
            type="monotone"
            dataKey={dataSet}
            strokeWidth="2"
            stroke={theme.colors.blue[400]}
            fill="url(#colorUv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}

export default Chart
