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

import OptionMenu from '@/@core/components/option-menu'
import DeleteConfirmation from '@/components/dialogs/delete-confirmation'
import EditSubscription from '@/components/dialogs/edit-subscription'
import NewSubscription from '@/components/dialogs/new-subscription'
import SearchInput from '@/components/Search'
import { SubscriptionType } from '@/types/apps/subscriptionTypes'
import tableStyles from '@core/styles/table.module.css'
import IconButton from '@mui/material/IconButton'
import { useParams, usePathname, useRouter } from 'next/navigation'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type SubscriptionTypeWithAction = SubscriptionType & {
  actions?: string
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
const columnHelper = createColumnHelper<SubscriptionTypeWithAction>()

const SubscriptionListTable = () => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([] as SubscriptionType[])
  const [subscriptionData, setSubscriptionData] = useState({} as SubscriptionType)
  const [globalFilter, setGlobalFilter] = useState('')
  const [newSubscriptionDialogOpen, setNewSubscriptionDialogOpen] = useState(false)
  const [editSubscriptionInfoDialogOpen, setEditSubscriptionInfoDialogOpen] = useState(false)
  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false)

  // Hooks
  const { lang: locale } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const getSubscriptionData = useCallback(async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${apiBaseUrl}/subscription`, { headers: { 'auth-token': token } })
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
    getSubscriptionData()
  }, [getSubscriptionData])

  const deleteSubscription = async () => {
    const subscriptionId = subscriptionData._id
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('token')

    try {
      const response = await axios.delete(`${apiBaseUrl}/subscription/${subscriptionId}`, {
        headers: { 'auth-token': token }
      })
      if (response && response.data) {
        getSubscriptionData()
        setDeleteConfirmationDialogOpen(false)
        toast.success('Subscription deleted successfully')
      }
    } catch (error: any) {
      // if (error?.response?.status === 400) {
      //   const redirectUrl = `/${locale}/login?redirectTo=${pathname}`
      //   return router.replace(redirectUrl)
      // }
      toast.error(error?.response?.data?.message ?? error?.message, { hideProgressBar: false })
    }
  }

  const openDeleteConfirmation = (subscription: SubscriptionType) => {
    setSubscriptionData(subscription)
    setDeleteConfirmationDialogOpen(true)
  }

  const editSubscriptionData = (rowData: SubscriptionType) => {
    setSubscriptionData(rowData)
    setEditSubscriptionInfoDialogOpen(!editSubscriptionInfoDialogOpen)
  }

  // const getAvatar = (params: Pick<Client, 'profileImage' | 'fullName'>) => {
  //   const { profileImage, fullName } = params

  //   if (profileImage && profileImage !== '-') {
  //     return <CustomAvatar src={profileImage} skin='light' size={34} />
  //   } else {
  //     return (
  //       <CustomAvatar skin='light' size={34}>
  //         {getInitials(fullName as string)}
  //       </CustomAvatar>
  //     )
  //   }
  // }

  const columns = useMemo<ColumnDef<SubscriptionTypeWithAction, any>[]>(
    () => [
      columnHelper.accessor('subscriptionName', {
        header: 'Name',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.subscriptionName}</Typography>
      }),
      columnHelper.accessor('subscriptionDescription', {
        header: 'Description',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.subscriptionDescription}</Typography>
      }),
      columnHelper.accessor('subscriptionPrice', {
        header: 'Price',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.subscriptionPrice}</Typography>
      }),
      columnHelper.accessor('subscriptionValidity', {
        header: 'Validity',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.subscriptionValidity}</Typography>
      }),
      columnHelper.accessor('access', {
        header: 'Access',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.access?.length ? row.original.access.join(', ') : ''}
          </Typography>
        )
      }),
      columnHelper.accessor('billings', {
        header: 'Billings',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.billings?.length ? row.original.billings.join(', ') : ''}
          </Typography>
        )
      }),
      columnHelper.accessor('isYearly', {
        header: 'Is Yearly',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.isYearly ? 'TRUE' : 'FALSE'}</Typography>
      }),
      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton size='small' onClick={() => editSubscriptionData(row.original)}>
              <i className='ri-edit-box-line text-[22px] text-textSecondary' />
            </IconButton>
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
                }

                // { text: 'Duplicate', icon: 'ri-stack-line', menuItemProps: { className: 'gap-2' } }
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
    data: data as SubscriptionType[],
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
            <Button
              variant='contained'
              color='primary'
              startIcon={<i className='ri-add-line' />}
              onClick={() => setNewSubscriptionDialogOpen(!newSubscriptionDialogOpen)}
            >
              Add Subscription
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

      <NewSubscription
        open={newSubscriptionDialogOpen}
        setOpen={setNewSubscriptionDialogOpen}
        getSubscriptionData={getSubscriptionData}
      />
      <EditSubscription
        open={editSubscriptionInfoDialogOpen}
        setOpen={setEditSubscriptionInfoDialogOpen}
        getSubscriptionData={getSubscriptionData}
        subscriptionData={subscriptionData}
      />
      <DeleteConfirmation
        open={deleteConfirmationDialogOpen}
        name={`subscription (${subscriptionData.subscriptionName})`}
        setOpen={setDeleteConfirmationDialogOpen}
        deleteApiCall={deleteSubscription}
      />
    </>
  )
}

export default SubscriptionListTable
