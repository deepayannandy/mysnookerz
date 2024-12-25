'use client'

import { SubscriptionType } from '@/types/apps/subscriptionTypes'
import { Checkbox, FormControlLabel, Grid, InputLabel } from '@mui/material'

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

type EditSubscriptionProps = {
  open: boolean
  setOpen: (open: boolean) => void
  subscriptionData: SubscriptionType
  getSubscriptionData: () => void
}

const EditSubscription = ({ open, setOpen, getSubscriptionData, subscriptionData }: EditSubscriptionProps) => {
  const [isMinuteBillingSelected, setIsMinuteBillingSelected] = useState(false)
  const [isSlotBillingSelected, setIsSlotBillingSelected] = useState(false)
  const [isCountdownBillingSelected, setIsCountdownBillingSelected] = useState(false)
  const [isYearly, setIsYearly] = useState(false)
  // States

  // const { lang: locale } = useParams()
  // const pathname = usePathname()
  // const router = useRouter()

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<Omit<SubscriptionType, '_id'>>({
    // resolver: yupResolver(schema),
    defaultValues: {
      subscriptionName: '',
      subscriptionDescription: '',
      subscriptionPrice: '',
      subscriptionValidity: '',
      access: [],
      billings: [],
      isYearly: false
    }
  })

  useEffect(() => {
    resetForm(subscriptionData)
    if (subscriptionData.billings?.includes('Minute Billing')) {
      setIsMinuteBillingSelected(true)
    }
    if (subscriptionData.billings?.includes('Slot Billing')) {
      setIsSlotBillingSelected(true)
    }
    if (subscriptionData.billings?.includes('Countdown Billing')) {
      setIsCountdownBillingSelected(true)
    }

    setIsYearly(!!subscriptionData.isYearly)
  }, [subscriptionData, resetForm])

  const handleClose = () => {
    resetForm(subscriptionData)
    if (subscriptionData.billings?.includes('Minute Billing')) {
      setIsMinuteBillingSelected(true)
    }
    if (subscriptionData.billings?.includes('Slot Billing')) {
      setIsSlotBillingSelected(true)
    }
    if (subscriptionData.billings?.includes('Countdown Billing')) {
      setIsCountdownBillingSelected(true)
    }

    setIsYearly(!!subscriptionData.isYearly)
    setOpen(false)
  }

  const onSubmit = async (data: Omit<SubscriptionType, '_id'>) => {
    data.isYearly = isYearly

    const billings = []
    if (isSlotBillingSelected) {
      billings.push('Slot Billing')
    }
    if (isMinuteBillingSelected) {
      billings.push('Minute Billing')
    }
    if (isCountdownBillingSelected) {
      billings.push('Countdown Billing')
    }
    data.billings = billings

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')

    try {
      const response = await axios.patch(`${apiBaseUrl}/subscription/${subscriptionData._id}`, data, {
        headers: { 'auth-token': token }
      })
      if (response && response.data) {
        getSubscriptionData()
        resetForm()
        setOpen(false)
        toast.success('Subscription info updated successfully')
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
        <Typography variant='h5'>Edit Subscription</Typography>
        <IconButton size='small' onClick={handleClose}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit(data => onSubmit(data))}>
          <div className='flex flex-col gap-5'>
            <Controller
              name='subscriptionName'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  label='Name'
                  value={value || ''}
                  onChange={onChange}
                  {...(errors.subscriptionName && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />

            <Controller
              name='subscriptionDescription'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  label='Description'
                  value={value || ''}
                  onChange={onChange}
                  {...(errors.subscriptionDescription && {
                    error: true,
                    helperText: 'This field is required.'
                  })}
                />
              )}
            />

            <Controller
              name='subscriptionPrice'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  label='Price'
                  value={value || ''}
                  onChange={onChange}
                  {...(errors.subscriptionPrice && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />

            <Controller
              name='subscriptionValidity'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  label='Validity'
                  value={value || ''}
                  onChange={onChange}
                  {...(errors.subscriptionValidity && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />

            <Controller
              name='access'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  label='Can Access'
                  value={value || ''}
                  onChange={onChange}
                  {...(errors.access && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />

            <Grid item xs={12} sm={6} className='border rounded-md p-2'>
              <InputLabel>Billings</InputLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isMinuteBillingSelected}
                    onChange={event => setIsMinuteBillingSelected(event.target.checked)}
                  />
                }
                label='Minute Billing'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isSlotBillingSelected}
                    onChange={event => setIsSlotBillingSelected(event.target.checked)}
                  />
                }
                label='Slot Billing'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isCountdownBillingSelected}
                    onChange={event => setIsCountdownBillingSelected(event.target.checked)}
                  />
                }
                label='Countdown Billing'
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={<Checkbox checked={isYearly} onChange={event => setIsYearly(event.target.checked)} />}
                label='Is Yearly'
              />
            </Grid>

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

export default EditSubscription
