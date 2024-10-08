'use client'

// Next Imports

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'

// Third-party Imports
import type { ApexOptions } from 'apexcharts'
import classnames from 'classnames'

// Type Imports
import type { ThemeColor } from '@core/types'

// Components Imports
import OptionMenu from '@core/components/option-menu'

// Styles Imports
import tableStyles from '@core/styles/table.module.css'

// Styled Component Imports
import AppReactApexCharts from '../../../libs/styles/AppReactApexCharts'

type DataType = {
  title: string
  sales: string
  trend: string
  color: ThemeColor
  trendNumber: string
}

// Vars
const data: DataType[] = [
  {
    sales: '86,471',
    title: 'Direct',
    color: 'success',
    trendNumber: '15%',
    trend: 'down'
  },
  {
    sales: '57,484',
    title: 'Organic',
    color: 'primary',
    trendNumber: '85%',
    trend: 'up'
  },
  {
    sales: '2,534',
    color: 'warning',
    title: 'Referral',
    trendNumber: '48%',
    trend: 'up'
  },
  {
    sales: '977',
    title: 'Mail',
    color: 'error',
    trendNumber: '36%',
    trend: 'down'
  }
]

const WebsiteStatistics = () => {
  // Vars
  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        columnWidth: '35%',
        horizontal: false,
        borderRadius: 2,
        distributed: true
      }
    },
    colors: ['var(--mui-palette-primary-main)'],
    grid: {
      padding: {
        top: -33,
        right: 5,
        bottom: -13,
        left: -12
      },
      show: false
    },
    dataLabels: {
      enabled: false
    },
    tooltip: {
      enabled: false
    },
    legend: {
      show: false
    },
    xaxis: {
      labels: {
        show: false
      },
      axisTicks: {
        show: false
      },
      axisBorder: {
        show: false
      }
    },
    yaxis: {
      labels: {
        show: false
      }
    },
    responsive: [
      {
        breakpoint: 1200,
        options: {
          chart: {
            height: 100
          }
        }
      }
    ]
  }

  return (
    <Card className='bs-full'>
      <CardHeader
        title='Website Statistics'
        action={<OptionMenu iconClassName='text-textPrimary' options={['Last 28 Days', 'Last Month', 'Last Year']} />}
      />
      <CardContent className='!pbe-1'>
        <div className='flex items-end justify-between pbe-5 pbs-5 xl:pbs-[0.6rem]'>
          <div className='flex flex-col gap-2'>
            <Typography variant='h1'>4,590</Typography>
            <Typography variant='body2'>Total Traffic</Typography>
          </div>
          <AppReactApexCharts
            type='bar'
            height={85}
            width={135}
            options={options}
            series={[{ data: [50, 40, 130, 100, 75, 100, 45, 35] }]}
          />
        </div>
        <table className={tableStyles.table}>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td className='flex items-center gap-2 !plb-2.5 !pis-0 !bs-[unset]'>
                  <i className={classnames('ri-circle-fill text-base', `text-${row.color}`)} />
                  <Typography color='text.primary'>{row.title}</Typography>
                </td>
                <td className='text-end !plb-2.5 !bs-[unset]'>
                  <Typography color='text.primary' className='font-medium'>
                    {row.sales}
                  </Typography>
                </td>
                <td className='flex gap-2 justify-end !plb-2.5 !pie-0 !bs-[unset]'>
                  <Typography color='text.primary' className='font-medium'>
                    {row.trendNumber}
                  </Typography>
                  <i
                    className={classnames(
                      row.trend === 'up' ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line',
                      row.trend === 'up' ? 'text-success' : 'text-error'
                    )}
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

export default WebsiteStatistics
