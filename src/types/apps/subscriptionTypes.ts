export type SubscriptionType = {
  _id: string
  subscriptionName: string
  subscriptionDescription: string
  subscriptionPrice: number | string
  subscriptionGlobalPrice: number | string
  subscriptionValidity: number | string
  access: string[]
  billings: string[]
  isYearly: boolean
}
