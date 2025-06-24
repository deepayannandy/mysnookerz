'use client'

// React Imports

// MUI Imports
import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as yup from 'yup'

type NewClientRegistrationDataType = {
  fullName: string
  mobile: string | null
  email: string
  profileImage?: string
  password: string
  confirmPassword?: string
}

type NewClientRegistrationProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: NewClientRegistrationDataType
  getClientData: () => void
}

const schema: yup.ObjectSchema<NewClientRegistrationDataType> = yup.object().shape({
  fullName: yup.string().required('This field is required').min(1),
  mobile: yup.string().required('This field is required').min(10).max(10),
  email: yup.string().required('This field is required').email('Please enter a valid email address'),
  profileImage: yup.string(),
  password: yup.string().required('This field is required').min(8, 'Password must be at least 8 characters long'),
  confirmPassword: yup
    .string()
    .required('This field is required')
    .oneOf([yup.ref('password'), ''], 'Passwords must match')
})

const NewClientRegistration = ({ open, setOpen, getClientData }: NewClientRegistrationProps) => {
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
  } = useForm<NewClientRegistrationDataType>({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '',
      mobile: '',
      email: '',
      profileImage: '',
      password: '',
      confirmPassword: ''
    }
  })

  const handleClose = () => {
    resetForm()
    setStoreId('')
    setOpen(false)
  }

  const onSubmit = async (data: NewClientRegistrationDataType) => {
    const profileImage = '-'
    const userDesignation = 'Admin'
    const requestData = _.omit(data, 'confirmPassword')
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.post(
        `${apiBaseUrl}/user/register`,
        { ...requestData, storeId, userDesignation, profileImage },
        { headers: { 'auth-token': token } }
      )

      if (response && response.data) {
        getClientData()
        handleClose()
        toast.success('Client added successfully')
      }
    } catch (error: any) {
      // if (error?.response?.status === 400) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   console.log(redirectUrl)
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
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
        <Typography variant='h5'>New Client Registration</Typography>
        <IconButton size='small' onClick={handleClose}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit(data => onSubmit(data))}>
          <div className='flex flex-col gap-5'>
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
              name='fullName'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  label='Full Name'
                  value={value}
                  onChange={onChange}
                  {...(errors.fullName && { error: true, helperText: errors.fullName.message })}
                />
              )}
            />

            <Controller
              name='mobile'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  label='Mobile'
                  inputProps={{ type: 'number', min: 0 }}
                  value={value}
                  onChange={onChange}
                  {...(errors.mobile && { error: true, helperText: errors.mobile.message })}
                />
              )}
            />

            <Controller
              name='email'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  label='Email'
                  value={value}
                  onChange={onChange}
                  {...(errors.email && { error: true, helperText: errors.email.message })}
                />
              )}
            />

            <Controller
              name='password'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  label='Password'
                  value={value}
                  onChange={onChange}
                  {...(errors.password && { error: true, helperText: errors.password.message })}
                />
              )}
            />

            <Controller
              name='confirmPassword'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  label='Confirm Password'
                  value={value}
                  onChange={onChange}
                  {...(errors.confirmPassword && { error: true, helperText: errors.confirmPassword?.message })}
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

export default NewClientRegistration
