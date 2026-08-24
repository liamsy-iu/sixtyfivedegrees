import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface MerchCartItem {
  colour: string
  size: string
  quantity: number
}

interface MerchCartStore {
  items: MerchCartItem[]
  isOpen: boolean

  addItem: (colour: string, size: string) => void
  removeItem: (colour: string, size: string) => void
  updateQuantity: (colour: string, size: string, delta: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void

  total: () => number
  itemCount: () => number
}

const UNIT_PRICE_CENTS = 400000 // KES 4,000 — kept in sync with MerchSection's HOODIE_PRICE_CENTS

export const useMerchCartStore = create<MerchCartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (colour, size) => {
        set((state) => {
          const key = `${colour}-${size}`
          const existing = state.items.find((i) => `${i.colour}-${i.size}` === key)
          if (existing) {
            return {
              items: state.items.map((i) =>
                `${i.colour}-${i.size}` === key ? { ...i, quantity: i.quantity + 1 } : i
              ),
            }
          }
          return { items: [...state.items, { colour, size, quantity: 1 }] }
        })
      },

      removeItem: (colour, size) => {
        set((state) => ({
          items: state.items.filter((i) => !(i.colour === colour && i.size === size)),
        }))
      },

      updateQuantity: (colour, size, delta) => {
        set((state) => ({
          items: state.items
            .map((i) => (i.colour === colour && i.size === size ? { ...i, quantity: i.quantity + delta } : i))
            .filter((i) => i.quantity > 0),
        }))
      },

      clearCart: () => set({ items: [] }),
      openCart:  () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      total: () => get().items.reduce((s, i) => s + UNIT_PRICE_CENTS * i.quantity, 0),
      itemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    {
      name: '65d-merch-cart-v1',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
