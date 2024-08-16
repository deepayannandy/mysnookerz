'use client'

// React Imports
import { FormEvent, useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
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
        setUserData({ validDays: 30 } as NewStoreInfoData)
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
    <Dialog fullWidth open={open} onClose={handleClose} maxWidth='md' scroll='body'>
      <DialogTitle variant='h4' className='flex gap-2 flex-col items-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <div className='max-sm:is-[80%] max-sm:text-center'>New Store Registration</div>
        {/* <Typography component='span' className='flex flex-col text-center'>
          Updating user details will receive a privacy audit.
        </Typography> */}
      </DialogTitle>
      <form onSubmit={e => handleSubmit(e)}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
            <i className='ri-close-line text-textSecondary' />
          </IconButton>
          <Grid container spacing={5}>
            {/* <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Country</InputLabel>
                <Select
                  label='Country'
                  value={userData?.country?.toLowerCase().replace(/\s+/g, '-')}
                  onChange={e => setUserData({ ...userData, country: e.target.value as string })}
                >
                  {countries.map((country, index) => (
                    <MenuItem key={index} value={country.toLowerCase().replace(/\s+/g, '-')}>
                      {country}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid> */}
            {/* <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Subscription</InputLabel>
                <Select
                  label='Subscription'
                  value={userData?.subscription?.toLowerCase().replace(/\s+/g, '-')}
                  onChange={e => setUserData({ ...userData, subscription: e.target.value as string })}
                >
                  {subscriptions.map((subscription, index) => (
                    <MenuItem key={index} value={subscription.toLowerCase().replace(/\s+/g, '-')}>
                      {subscription}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid> */}
            {/* <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Client Name'
                placeholder='John'
                value={userData?.clientName}
                onChange={e => setUserData({ ...userData, clientName: e.target.value })}
              />
            </Grid> */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Store Name'
                placeholder='Enter Store Name'
                value={userData?.storeName}
                onChange={e => setUserData({ ...userData, storeName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Email'
                placeholder='Enter email'
                value={userData?.email}
                onChange={e => setUserData({ ...userData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Contact'
                placeholder='Enter contact number'
                value={userData?.contact}
                onChange={e => setUserData({ ...userData, contact: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Valid Days'
                inputProps={{ type: 'number', min: 0 }}
                value={userData?.validDays}
                onChange={e =>
                  setUserData({ ...userData, validDays: Number(e.target.value) ? Number(e.target.value) : null })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Address'
                placeholder='Enter Address'
                value={userData?.address}
                onChange={e => setUserData({ ...userData, address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Pincode'
                placeholder='400001'
                value={userData?.pincode}
                onChange={e => setUserData({ ...userData, pincode: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='City'
                placeholder='Mumbai'
                value={userData?.city}
                onChange={e => setUserData({ ...userData, city: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='State'
                placeholder='Maharastra'
                value={userData?.state}
                onChange={e => setUserData({ ...userData, state: e.target.value })}
              />
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label='Status'
                  value={userData?.status}
                  onChange={e => setUserData({ ...userData, status: e.target.value as string })}
                >
                  {status.map((status, index) => (
                    <MenuItem key={index} value={status.toLowerCase().replace(/\s+/g, '-')}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Tax ID'
                placeholder='Tax-7490'
                value={userData?.taxId}
                onChange={e => setUserData({ ...userData, taxId: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Contact'
                placeholder='+ 123 456 7890'
                value={userData?.contact}
                onChange={e => setUserData({ ...userData, contact: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  label='Language'
                  multiple
                  value={userData?.language?.map(lang => lang.toLowerCase().replace(/\s+/g, '-')) || []}
                  onChange={e => setUserData({ ...userData, language: e.target.value as string[] })}
                  renderValue={selected => (
                    <div className='flex items-center gap-2 flex-wrap'>
                      {(selected as string[]).map(value => (
                        <Chip key={value} label={value} className='capitalize' size='small' />
                      ))}
                    </div>
                  )}
                >
                  {languages.map((language, index) => (
                    <MenuItem key={index} value={language.toLowerCase().replace(/\s+/g, '-')}>
                      {language}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid> */}
          </Grid>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' type='submit'>
            Submit
          </Button>
          <Button variant='outlined' color='secondary' type='reset' onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default NewStoreInfo