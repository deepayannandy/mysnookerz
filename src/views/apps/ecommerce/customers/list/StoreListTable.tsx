'use client'

// React Imports
import { useCallback, useEffect, useMemo, useState } from 'react'

// Next Imports

// MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'

// Third-party Imports
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import { rankItem } from '@tanstack/match-sorter-utils'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import axios from 'axios'
import classnames from 'classnames'
import { toast } from 'react-toastify'

// Type Imports
import type { StoreType } from '@/types/apps/ecommerceTypes'
import type { ThemeColor } from '@core/types'

// Style Imports
import OptionMenu from '@/@core/components/option-menu/index'
import RenewSubscription from '@/components/dialogs/renew-membership/index'

import DeleteConfirmation from '@/components/dialogs/delete-confirmation'
import NewStoreInfo from '@/components/dialogs/new-store-registration'
import UpgradePlan from '@/components/dialogs/upgrade-plan'
import SearchInput from '@/components/Search'
import tableStyles from '@core/styles/table.module.css'
import { DateTime } from 'luxon'
import { useParams, usePathname, useRouter } from 'next/navigation'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type PayementStatusType = {
  text: string
  color: ThemeColor
}

type StatusChipColorType = {
  color: ThemeColor
}

export const paymentStatus: { [key: number]: PayementStatusType } = {
  1: { text: 'Paid', color: 'success' },
  2: { text: 'Pending', color: 'warning' },
  3: { text: 'Cancelled', color: 'secondary' },
  4: { text: 'Failed', color: 'error' }
}

export const statusChipColor: { [key: string]: StatusChipColorType } = {
  Delivered: { color: 'success' },
  'Out for Delivery': { color: 'primary' },
  'Ready to Pickup': { color: 'info' },
  Dispatched: { color: 'warning' }
}

type StoreTypeWithAction = StoreType & {
  action?: string
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

// const DebouncedInput = ({
//   value: initialValue,
//   onChange,
//   debounce = 500,
//   ...props
// }: {
//   value: string | number
//   onChange: (value: string | number) => void
//   debounce?: number
// } & Omit<TextFieldProps, 'onChange'>) => {
//   // States
//   const [value, setValue] = useState(initialValue)

//   useEffect(() => {
//     setValue(initialValue)
//   }, [initialValue])

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       onChange(value)
//     }, debounce)

//     return () => clearTimeout(timeout)
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [value])

//   return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
// }

// Column Definitions
const columnHelper = createColumnHelper<StoreTypeWithAction>()

const StoreListTable = () => {
  // States
  //const [customerUserOpen, setCustomerUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([] as StoreType[])
  const [storeData, setStoreData] = useState({} as StoreType)
  const [globalFilter, setGlobalFilter] = useState('')
  const [newRegistrationDialogOpen, setNewRegistrationDialogOpen] = useState(false)
  const [renewSubscriptionDialogOpen, setRenewSubscriptionDialogOpen] = useState(false)
  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false)
  const [upgradePlanDialogOpen, setUpgradePlanDialogOpen] = useState(false)

  // Hooks
  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const getStoreData = useCallback(async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${apiBaseUrl}/store/`, { headers: { 'auth-token': token } })
      if (response && response.data) {
        setData(response.data)
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
        return router.replace(redirectUrl)
      }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }, [locale, pathname, router])

  useEffect(() => {
    getStoreData()
  }, [getStoreData])

  const deleteStore = async () => {
    const storeId = storeData._id
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.delete(`${apiBaseUrl}/store/${storeId}`, { headers: { 'auth-token': token } })
      if (response && response.data) {
        getStoreData()
        setDeleteConfirmationDialogOpen(false)
        toast.success('Store deleted successfully')
      }
    } catch (error: any) {
      // if (error?.response?.status === 400) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  const openDeleteConfirmation = (store: StoreType) => {
    setStoreData(store)
    setDeleteConfirmationDialogOpen(true)
  }

  const openUpgradePlan = (store: StoreType) => {
    setStoreData(store)
    setUpgradePlanDialogOpen(true)
  }

  const columns = useMemo<ColumnDef<StoreTypeWithAction, any>[]>(
    () => [
      columnHelper.accessor('onboarding', {
        header: 'Registration Date',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.onboarding ? DateTime.fromISO(row.original.onboarding).toFormat('dd LLL yyyy') : ''}
          </Typography>
        )
      }),
      columnHelper.accessor('_id', {
        header: 'Store Id',
        cell: ({ row }) => <Typography color='text.primary'>{row.original._id}</Typography>
      }),
      columnHelper.accessor('storeName', {
        header: 'Store Name',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.storeName}</Typography>
      }),
      columnHelper.accessor('contact', {
        header: 'Contact',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.contact}</Typography>
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.email}</Typography>
      }),
      // columnHelper.accessor('subscription', {
      //   header: 'Subscription',
      //   cell: ({ row }) => <Typography color='text.primary'>{row.original.subscription}</Typography>
      // }),
      // columnHelper.accessor('plan', {
      //   header: 'Plan',
      //   cell: ({ row }) => <Typography color='text.primary'>{row.original.plan}</Typography>
      // }),
      columnHelper.accessor('address', {
        header: 'Address',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.address}</Typography>
      }),
      columnHelper.accessor('validTill', {
        header: 'Expiring On',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.validTill ? DateTime.fromISO(row.original.validTill).toFormat('dd LLL yyyy') : ''}
          </Typography>
        )
      }),

      // columnHelper.accessor('status', {
      //   header: 'Status',
      //   cell: ({ row }) => (
      //     <div className='flex items-center gap-3'>
      //       <Chip
      //         label={customerStatusObj[row.original.isActive ? 'Active' : 'Inactive'].title}
      //         variant='tonal'
      //         color={customerStatusObj[row.original.isActive ? 'Active' : 'Inactive'].color}
      //         size='small'
      //       />
      //     </div>
      //   )
      // }),
      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            {/* <IconButton size='small'>
              <i className='ri-edit-box-line text-[22px] text-textSecondary' />
            </IconButton> */}
            <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary text-[22px]'
              options={[
                // { text: 'Download', icon: 'ri-download-line', menuItemProps: { className: 'gap-2' } },
                {
                  text: 'Delete',
                  icon: 'ri-delete-bin-7-line',
                  menuItemProps: {
                    className: 'gap-2',
                    onClick: () => openDeleteConfirmation(row.original)
                  }
                },
                {
                  text: 'Renew Subscription',
                  icon: 'ri-stack-line',
                  menuItemProps: {
                    className: 'gap-2',
                    onClick: () => openUpgradePlan(row.original)
                  }
                }
              ]}
            />
          </div>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const table = useReactTable({
    data: data as StoreType[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  // const getAvatar = (params: Pick<Customer, 'avatar' | 'customer'>) => {
  //   const { avatar, customer } = params

  //   if (avatar) {
  //     return <CustomAvatar src={avatar} skin='light' size={34} />
  //   } else {
  //     return (
  //       <CustomAvatar skin='light' size={34}>
  //         {getInitials(customer as string)}
  //       </CustomAvatar>
  //     )
  //   }
  // }

  return (
    <>
      <Card>
        <CardContent className='flex justify-between flex-col items-start sm:flex-row sm:items-end gap-y-2'>
          <SearchInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search'
          />
          <div className='flex gap-x-4'>
            {/* <Button variant='outlined' color='secondary' startIcon={<i className='ri-upload-2-line' />}>
              Export
            </Button> */}
            <Button
              variant='contained'
              color='primary'
              startIcon={<i className='ri-add-line' />}
              onClick={() => setNewRegistrationDialogOpen(!newRegistrationDialogOpen)}
            >
              Add Store
            </Button>
            <Button
              variant='contained'
              color='primary'
              onClick={() => setRenewSubscriptionDialogOpen(!renewSubscriptionDialogOpen)}
            >
              Renew Subscription
            </Button>
          </div>
        </CardContent>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={classnames({
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='ri-arrow-up-s-line text-xl' />,
                              desc: <i className='ri-arrow-down-s-line text-xl' />
                            }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                          </div>
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No data available
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map(row => {
                    return (
                      <tr
                        key={row.id}
                        className={classnames('hover:bg-[var(--mui-palette-action-hover)]', {
                          selected: row.getIsSelected()
                        })}
                      >
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    )
                  })}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component='div'
          className='border-bs'
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          SelectProps={{
            inputProps: { 'aria-label': 'rows per page' }
          }}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
          onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
        />
      </Card>
      <NewStoreInfo
        open={newRegistrationDialogOpen}
        setOpen={setNewRegistrationDialogOpen}
        getStoreData={getStoreData}
      />
      <RenewSubscription open={renewSubscriptionDialogOpen} setOpen={setRenewSubscriptionDialogOpen} />
      <DeleteConfirmation
        open={deleteConfirmationDialogOpen}
        name={`store (${storeData.storeName})`}
        setOpen={setDeleteConfirmationDialogOpen}
        deleteApiCall={deleteStore}
      />
      <UpgradePlan
        open={upgradePlanDialogOpen}
        setOpen={setUpgradePlanDialogOpen}
        getStoreData={getStoreData}
        storeData={storeData}
        renewPlan={false}
      />
      {/* <AddCustomerDrawer
        open={customerUserOpen}
        handleClose={() => setCustomerUserOpen(!customerUserOpen)}
        setData={setData}
        storeData={data}
      /> */}
    </>
  )
}

export default StoreListTable
