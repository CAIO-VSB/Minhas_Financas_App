export type TAccount = {
  id: string
  userId: string
  name: string
  type: string
  nameBank: string,
  urlImage: string,
  active: boolean
  color: string | null
  initial_balance: number | null
  createdAt: Date
  updatedAt: Date
}