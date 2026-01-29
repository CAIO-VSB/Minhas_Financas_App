export type TAccountApi = {
  id: string
  userId: string
  name_identifier: string
  type: string
  name_bank: string,
  url_image: string,
  active: boolean
  color: string | null
  initial_balance: number | null
  createdAt: Date
  updatedAt: Date
}