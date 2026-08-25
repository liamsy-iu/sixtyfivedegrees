import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CoffeeCartItem {
  kind: 'coffee'
  variantId: string
  productId: string
  productName: string
  grade: 'classic' | 'premium'
  roast: 'medium' | 'dark'
  sizeGrams: number
  grind: 'whole_bean' | 'ground'
  price: number  // in cents
  quantity: number
  image: string | null
}

export interface MerchCartItem {
  kind: 'merch'
  productName: string  // e.g. "65 Degrees Hoodie"
  colour: string
  size: string          // clothing size (S/M/L/XL), not grams
  price: number          // in cents
  quantity: number
  image: string | null
}

export type CartItem = CoffeeCartItem | MerchCartItem

// Plain `Omit<Union, K>` does not distribute over a union in TypeScript --
// it flattens to the combined key set across all members, which breaks
// correct discrimination on `kind` for object literals passed to addItem.
// This distributes Omit across each member of the union separately.
type DistributiveOmit<T, K extends PropertyKey> = T extends any ? Omit<T, K> : never

// A stable identity key per item, used for dedup/update/remove -- coffee
// items are identified by variant+grind, merch items by colour+size.
// Anything adding a new item kind in future just needs a case here.
export function itemKey(item: DistributiveOmit<CartItem, 'quantity'> | CartItem): string {
  if (item.kind === 'coffee') return `coffee-${item.variantId}-${item.grind}`
  return `merch-${item.colour}-${item.size}`
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean

  addItem: (item: DistributiveOmit<CartItem, 'quantity'>) => void
  removeItem: (key: string) => void
  updateQuantity: (key: string, quantity: number) => void
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
          const key = itemKey(newItem)
          const existing = state.items.find((i) => itemKey(i) === key)
          if (existing) {
            return {
              items: state.items.map((i) =>
                itemKey(i) === key ? { ...i, quantity: i.quantity + 1 } : i
              ),
            }
          }
          return { items: [...state.items, { ...newItem, quantity: 1 } as CartItem] }
        })
      },

      removeItem: (key) => {
        set((state) => ({
          items: state.items.filter((i) => itemKey(i) !== key),
        }))
      },

      updateQuantity: (key, quantity) => {
        if (quantity <= 0) {
          get().removeItem(key)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            itemKey(i) === key ? { ...i, quantity } : i
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
      // Bumped from v1 -- the item shape changed (added a required `kind`
      // discriminator), so any old persisted cart is safely abandoned
      // rather than loaded in a shape the new code doesn't expect. This
      // clears in-progress carts, not placed orders -- low stakes.
      name: '65d-cart-v2',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
