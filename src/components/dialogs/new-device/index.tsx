'use client'

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
// React Imports

// MUI Imports
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

type NewDeviceDataType = {
  deviceId: string
}

type NewDeviceProps = {
  open: boolean
  setOpen: (open: boolean) => void
  getDeviceData: () => void
}

const NewDevice = ({ open, setOpen, getDeviceData }: NewDeviceProps) => {
  const [stores, setStores] = useState([] as { id: string; storeName: string }[])
  const [storeId, setStoreId] = useState('')
  // States

  // const { lang: locale } = useParams()
  // const pathname = usePathname()
  // const router = useRouter()

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<NewDeviceDataType>({
    defaultValues: {
      deviceId: ''
    }
  })

  const handleClose = () => {
    resetForm()
    setOpen(false)
  }

  const getAllStore = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${apiBaseUrl}/store/`, { headers: { 'auth-token': token } })
      if (response && response.data) {
        const stores: { id: string; storeName: string }[] = response.data.map((data: any) => {
          return {
            id: data._id,
            storeName: data.storeName
          }
        })
        setStores(stores)
        setStoreId(stores?.[0]?.id)
      }
    } catch (error: any) {
      // if (error?.response?.status === 400) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  useEffect(() => {
    getAllStore()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const onSubmit = async (data: NewDeviceDataType) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    const deviceType = '8node'
    try {
      const response = await axios.post(
        `${apiBaseUrl}/devices`,
        { ...data, storeId, deviceType },
        { headers: { 'auth-token': token } }
      )

      if (response && response.data) {
        getDeviceData()
        resetForm()
        setOpen(false)
        toast.success('Device added successfully')
      }
    } catch (error: any) {
      // if (error?.response?.status === 409) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   console.log(redirectUrl)
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
        <Typography variant='h5'>New Customer Registration</Typography>
        <IconButton size='small' onClick={handleClose}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit(data => onSubmit(data))}>
          <div className='flex flex-col gap-5'>
            {/* <Controller
              name='storeName'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  label='Store Name'
                  value={value}
                  onChange={onChange}
                  {...(errors.storeName && {
                    error: true,
                    helperText: errors.storeName.message ?? 'This field is required'
                  })}
                />
              )}
            /> */}

            <FormControl fullWidth>
              <InputLabel>Store Name</InputLabel>
              <Select label='Store Name' value={storeId} onChange={e => setStoreId(e.target.value)}>
                {stores.map(store => (
                  <MenuItem key={store.storeName} value={store.id}>
                    {store.storeName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Controller
              name='deviceId'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  label='Device ID'
                  value={value}
                  onChange={onChange}
                  {...(errors.deviceId && {
                    error: true,
                    helperText: errors.deviceId.message ?? 'This field is required'
                  })}
                />
              )}
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

export default NewDevice
