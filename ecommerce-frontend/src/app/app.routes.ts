import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/home/home')
                .then(m => m.Home)
    },
    {
        path: 'home',
        loadComponent: () =>
            import('./pages/home/home').then(m => m.Home)
    },
    {
        path: 'products',
        loadComponent: () =>
            import('./pages/products/products').then(m => m.Products)
    },
    {
        path: 'products/:id',
        loadComponent: () =>
            import('./pages/product-details/product-details')
                .then(m => m.ProductDetails)
    },
    {
        path: 'cart',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./pages/cart/cart').then(m => m.Cart)
    },
    {
        path: 'checkout',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./pages/checkout/checkout').then(m => m.Checkout)
    },
    {
        path: 'orders',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./pages/orders/orders').then(m => m.Orders)
    },
    {
        path: 'orders/:id',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./pages/order-details/order-details')
                .then(m => m.OrderDetails)
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./pages/login/login').then(m => m.Login)
    },
    {
        path: 'register',
        loadComponent: () =>
            import('./pages/register/register').then(m => m.Register)
    },
    {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./pages/profile/profile')
                .then(m => m.Profile)
    },
    {
        path: 'admin',
        canActivate: [adminGuard],
        loadComponent: () =>
            import('./pages/admin/admin')
                .then(m => m.Admin)
    },
];