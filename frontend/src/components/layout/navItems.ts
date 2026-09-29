import { Calendar, ChefHat, ShoppingCart, Tags, Package } from 'lucide-react'

export const NAV_ITEMS = [
  { to: '/', label: 'Lista de compras', icon: ShoppingCart },
  { to: '/calendario', label: 'Calendário', icon: Calendar },
  { to: '/receitas', label: 'Receitas', icon: ChefHat },
  { to: '/produtos', label: 'Produtos', icon: Package },
  { to: '/categorias', label: 'Categorias', icon: Tags },
] as const
