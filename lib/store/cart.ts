import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  variantId: string
  productId: string
  productName: string
  grade: 'classic' | 'premium'
  roast: 'medium' | 'dark'
  sizeGrams: number
  grind: 'whole_bean' | 'ground'
  price: number  // in cents
  quantity: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean

  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (variantId: string, grind: string) => void
  updateQuantity: (variantId: string, grind: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void

  total: () => number
  itemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        set((state) => {
          const key = `${newItem.variantId}-${newItem.grind}`
          const existing = state.items.find(
            (i) => `${i.variantId}-${i.grind}` === key
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                `${i.variantId}-${i.grind}` === key
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            }
          }
          return { items: [...state.items, { ...newItem, quantity: 1 }] }
        })
      },

      removeItem: (variantId, grind) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.variantId === variantId && i.grind === grind)
          ),
        }))
      },

      updateQuantity: (variantId, grind, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId, grind)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.variantId === variantId && i.grind === grind
              ? { ...i, quantity }
              : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),
      openCart:  () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      total: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
      itemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    {
      name: '65d-cart-v1',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
