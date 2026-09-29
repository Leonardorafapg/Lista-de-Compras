import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ShoppingListsPage } from '@/pages/ShoppingListsPage'
import { ShoppingListDetailPage } from '@/pages/ShoppingListDetailPage'
import { CalendarPage } from '@/pages/CalendarPage'
import { RecipesPage } from '@/pages/RecipesPage'
import { RecipeDetailPage } from '@/pages/RecipeDetailPage'
import { ProductsPage } from '@/pages/ProductsPage'
import { CategoriesPage } from '@/pages/CategoriesPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<ShoppingListsPage />} />
          <Route path="listas/:id" element={<ShoppingListDetailPage />} />
          <Route path="calendario" element={<CalendarPage />} />
          <Route path="receitas" element={<RecipesPage />} />
          <Route path="receitas/:id" element={<RecipeDetailPage />} />
          <Route path="produtos" element={<ProductsPage />} />
          <Route path="categorias" element={<CategoriesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
