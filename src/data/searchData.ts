type SearchData = {
  id: string
  name: string
  url: string
  excludeLang?: boolean
  icon: string
  section: string
  shortcut?: string
}

const data: SearchData[] = [
  {
    id: '1',
    name: 'Dashboard',
    url: '/dashboards/dashboard',
    icon: 'ri-pie-chart-2-line',
    section: 'Dashboards'
  },
  {
    id: '2',
    name: 'Analytics',
    url: '/dashboards/analytics',
    icon: 'ri-bar-chart-line',
    section: 'Dashboards'
  },
  {
    id: '3',
    name: 'Client',
    url: '/dashboards/client',
    icon: 'ri-file-user-line',
    section: 'Dashboards'
  },
  {
    id: '4',
    name: 'Store',
    url: '/dashboards/store',
    icon: 'ri-truck-line',
    section: 'Dashboards'
  },
  {
    id: '5',
    name: 'Customer',
    url: '/dashboards/customer',
    icon: 'ri-user-3-line',
    section: 'Dashboards'
  },
  {
    id: '6',
    name: 'Device',
    url: '/dashboards/device',
    icon: 'ri-book-open-line',
    section: 'Dashboards'
  }
]

export default data
