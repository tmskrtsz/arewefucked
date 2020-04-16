import React, { useEffect } from 'react'
import styled, { useTheme } from 'styled-components'
import ApexChart from 'react-apexcharts'
import { format } from 'date-fns'

import { abbrNumber, formatNumber } from '../../utils'

const ChartWrapper = styled(ApexChart)`
  .apexcharts-tooltip {
    color: ${ ({ theme }) => theme.color.white[1] };
    box-shadow: 0 4px 12px ${ ({ theme }) => theme.color.grey[0] };
    padding: 0.2em;


    &.apexcharts-theme-light {
      background: ${ ({ theme }) => theme.color.grey[0] };
      border: 1px solid ${ ({ theme }) => theme.color.grey[0] };

      .apexcharts-tooltip-title {
        background: ${ ({ theme }) => theme.color.grey[0] };
        border-bottom: 0;
        display: flex;
        justify-content: center;
      }

      .apexcharts-tooltip-y-group {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      span.apexcharts-tooltip-text-value {
        font-size: 1.7rem;
        color: ${ ({ theme }) => theme.color.white[0] };
        margin-top: 0.35em;
      }
    }
  }

  .apexcharts-xaxistooltip {
    color: ${ ({ theme }) => theme.color.white[1] };
    font-weight: 700;
    background: ${ ({ theme }) => theme.color.grey[0] };
    border-color: ${ ({ theme }) => theme.color.grey[0] };
    border-radius: 6px;
    box-shadow: 0 4px 12px ${ ({ theme }) => theme.color.grey[0] };

    &-bottom {
      &::before,
      &::after {
        border-bottom-color: ${ ({ theme }) => theme.color.grey[0] };
      }
    }
  }
`

const Chart = ({ data, dataSet }) => {
  const theme = useTheme()

  const settings = {
    options: {
      chart: {
        id: 'line',
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        width: 3,
        dashArray: 0,
        colors: theme.color.blue
      },
      grid: {
        borderColor: theme.color.grey[3],
      },
      xaxis: {
        categories: data.map(entry => format(entry.updated, 'MMMM, do')),
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          offsetY: 5,
          style: {
            fontSize: '14px',
            colors: theme.color.grey[4],
            fontFamily: 'Hind, sans-serif',
            fontWeight: '600'
          },
        },
        crosshairs: {
          stroke: {
            color: theme.color.blue[0],
            width: 1,
            dashArray: 0
          }
        },
      },
      dataLabels: {
        enabled: false
      },
      yaxis: {
        crosshairs: {
          stroke: {
            color: theme.color.grey[1]
          }
        },
        labels: {
          formatter: val => abbrNumber(val),
          style: {
            fontSize: '14px',
            fontFamily: 'Hind, sans-serif',
            fontWeight: 600,
            colors: theme.color.grey[4],
          },
          offsetX: -12
        },
        axisTicks: {
          show: false
        }
      },
      fill: {
        type: 'gradient',
        colors: theme.color.blue,
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.3,
          opacityTo: 0,
          stops: [0, 100]
        }
      },
      tooltip: {
        enabled: true,
        onDatasetHover: {
          highlightDataSeries: true,
        },
        x: {
          show: false,
        },
        y: {
          formatter: val => formatNumber(val)
        }
      }
    },
    series: [
      {
        name: 'Cases',
        data: data.map(entry => entry[dataSet])
      }
    ]
  }

  return (
    <ChartWrapper
      options={settings.options}
      series={settings.series}
      type="area"
      width="100%"
      height="400px"
    />
  )
}

export default Chart
