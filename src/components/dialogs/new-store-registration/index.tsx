'use client'

// React Imports
import { FormEvent, useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import _ from 'lodash'
import { toast } from 'react-toastify'

type NewStoreInfoData = {
  storeName: string
  email: string
  contact: string
  address: string
  pincode: string
  city: string
  state: string
  validDays: number | null
}

type NewStoreInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: NewStoreInfoData
  getStoreData: () => void
}

// const status = ['Status', 'Active', 'Inactive', 'Suspended']

// const languages = ['English', 'Spanish', 'French', 'German', 'Hindi']

// const countries = ['India']

// const subscriptions = ['Starter', 'Standard', 'Ultimate', 'Enterprise']

const NewStoreInfo = ({ open, setOpen, getStoreData }: NewStoreInfoProps) => {
  // States
  // const [userData, setUserData] = useState<NewStoreInfoProps['data']>({
  //   ...data,
  //   //subscription: subscriptions[0]
  // })
  const [userData, setUserData] = useState({ validDays: 30 } as NewStoreInfoData)

  const handleClose = () => {
    setOpen(false)
    setUserData({} as NewStoreInfoData)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const address = [userData.address, userData.city, userData.state, userData.pincode].join(', ')
    const valid_days = userData.validDays
    const data = _.omit(userData, 'address', 'city', 'state', 'pincode', 'validDays')
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    try {
      const response = await axios.post(`${apiBaseUrl}/store`, { ...data, address, valid_days })

      if (response && response.data) {
        getStoreData()
        setUserData({
          validDays: 30,
          storeName: '',
          email: '',
          contact: '',
          address: '',
          pincode: '',
          city: '',
          state: ''
        } as NewStoreInfoData)
        setOpen(false)
      }
    } catch (error: any) {
      // if (error?.response?.status === 400) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between pli-5 plb-4'>
        <Typography variant='h5'>New Store Registration</Typography>
        <IconButton size='small' onClick={handleClose}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={e => handleSubmit(e)}>
          <div className='flex flex-col gap-5'>
            <TextField
              fullWidth
              label='Store Name'
              placeholder='Enter Store Name'
              value={userData?.storeName}
              onChange={e => setUserData({ ...userData, storeName: e.target.value })}
            />

            <TextField
              fullWidth
              label='Email'
              placeholder='Enter email'
              value={userData?.email}
              onChange={e => setUserData({ ...userData, email: e.target.value })}
            />

            <TextField
              fullWidth
              label='Contact'
              placeholder='Enter contact number'
              value={userData?.contact}
              onChange={e => setUserData({ ...userData, contact: e.target.value })}
            />

            <TextField
              fullWidth
              label='Valid Days'
              inputProps={{ type: 'number', min: 0 }}
              value={userData?.validDays || ''}
              onChange={e =>
                setUserData({ ...userData, validDays: Number(e.target.value) ? Number(e.target.value) : null })
              }
            />

            <TextField
              fullWidth
              label='Address'
              placeholder='Enter Address'
              value={userData?.address}
              onChange={e => setUserData({ ...userData, address: e.target.value })}
            />

            <TextField
              fullWidth
              label='Pincode'
              placeholder='400001'
              value={userData?.pincode}
              onChange={e => setUserData({ ...userData, pincode: e.target.value })}
            />

            <TextField
              fullWidth
              label='City'
              placeholder='Mumbai'
              value={userData?.city}
              onChange={e => setUserData({ ...userData, city: e.target.value })}
            />

            <TextField
              fullWidth
              label='State'
              placeholder='Maharastra'
              value={userData?.state}
              onChange={e => setUserData({ ...userData, state: e.target.value })}
            />

            <div className='flex items-center gap-4'>
              <Button variant='contained' type='submit'>
                Submit
              </Button>
              <Button variant='outlined' color='secondary' type='reset' onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default NewStoreInfo
