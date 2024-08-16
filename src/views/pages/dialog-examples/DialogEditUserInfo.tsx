// MUI Imports
import type { ButtonProps } from '@mui/material/Button'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// Component Imports
import NewStoreInfo from '@/components/dialogs/new-store-registration'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'

const DialogEditUserInfo = () => {
  // Vars
  const buttonProps: ButtonProps = {
    variant: 'contained',
    children: 'Show'
  }

  return (
    <>
      <Card>
        <CardContent className='flex flex-col items-center text-center gap-4'>
          <i className='ri-user-3-line text-[28px] text-textPrimary' />
          <Typography variant='h5'>Edit User Info</Typography>
          <Typography color='text.primary'>
            Use this modal to modify the existing user&#39;s current information.
          </Typography>
          <OpenDialogOnElementClick element={Button} elementProps={buttonProps} dialog={NewStoreInfo} />
        </CardContent>
      </Card>
    </>
  )
}

export default DialogEditUserInfo
