import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('login', 'routes/login.tsx'),
  route('accounts', 'routes/accounts.tsx'),
  route('products', 'routes/products.tsx'),
] satisfies RouteConfig
