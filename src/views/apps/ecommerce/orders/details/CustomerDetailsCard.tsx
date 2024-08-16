// MUI Imports
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import type { TypographyProps } from '@mui/material/Typography'
import Typography from '@mui/material/Typography'

// Type Imports
import type { OrderType } from '@/types/apps/ecommerceTypes'
import type { ThemeColor } from '@core/types'

// Component Imports
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import NewStoreInfo from '@/components/dialogs/new-store-registration'
import { getInitials } from '@/utils/getInitials'

const getAvatar = (params: Pick<OrderType, 'avatar' | 'customer'>) => {
  const { avatar, customer } = params

  if (avatar) {
    return <Avatar src={avatar} />
  } else {
    return <Avatar>{getInitials(customer as string)}</Avatar>
  }
}

// Vars
const userData = {
  firstName: 'Gabrielle',
  lastName: 'Feyer',
  userName: '@gabriellefeyer',
  billingEmail: 'gfeyer0@nyu.edu',
  status: 'active',
  role: 'Customer',
  taxId: 'Tax-8894',
  contact: '+1 (234) 464-0600',
  language: ['English'],
  country: 'France',
  useAsBillingAddress: true
}

const CustomerDetails = ({ orderData }: { orderData?: OrderType }) => {
  // Vars
  const typographyProps = (children: string, color: ThemeColor, className: string): TypographyProps => ({
    children,
    color,
    className
  })

  return (
    <Card>
      <CardContent className='flex flex-col gap-6'>
        <Typography variant='h5'>Customer details</Typography>
        <div className='flex items-center gap-3'>
          {getAvatar({ avatar: orderData?.avatar ?? '', customer: orderData?.customer ?? '' })}
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {orderData?.customer}
            </Typography>
            <Typography>Customer ID: #47389</Typography>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <CustomAvatar skin='light' color='success' size={40}>
            <i className='ri-shopping-cart-2-line' />
          </CustomAvatar>
          <Typography color='text.primary' className='font-medium'>
            12 Orders
          </Typography>
        </div>
        <div className='flex flex-col gap-1'>
          <div className='flex justify-between items-center'>
            <Typography color='text.primary' className='font-medium'>
              Contact info
            </Typography>
            <OpenDialogOnElementClick
              element={Typography}
              elementProps={typographyProps('Edit', 'primary', 'cursor-pointer font-medium')}
              dialog={NewStoreInfo}
              dialogProps={{ data: userData }}
            />
          </div>
          <Typography>Email: {orderData?.email}</Typography>
          <Typography>Mobile: +1 (609) 972-22-22</Typography>
        </div>
      </CardContent>
    </Card>
  )
}

export default CustomerDetails
