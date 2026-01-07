export type TAccount = {
  id: string
  userId: string
  name: string
  type: string
  name_bank: string,
  urlImage: string,
  active: boolean
  color: string | null
  initial_balance: number | null
  createdAt: Date
  updatedAt: Date
}