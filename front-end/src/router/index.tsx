import { createBrowserRouter } from "react-router-dom";
import HomeLayout from "../layouts/home/HomeLayout";
import ShopLayout from "../layouts/shop/ShopLayout";
import HomePage from "../areas/customers/pages/HomePage";
import ShopPage from "../areas/customers/pages/ShopPage";
import ProductLayout from "../layouts/product/ProductLayout";
import ProductPage from "../areas/customers/pages/ProductPage";
import CartPage from "../areas/customers/pages/CartPage";
import AdminLayout from "../layouts/admin/AdminLayout";
import ProductManagement from "../areas/admin/pages/products/ProductManagement";
import CategoryManagement from "../areas/admin/pages/CategoryManagement";
import ProductDetail from "../areas/admin/pages/products/ProductDetail";
import OrderManagement from "../areas/admin/pages/orders/OrderManagement";
import OrderDetails from "../areas/admin/pages/orders/OrderDetails";
import AccountLayout from "../layouts/account/AccountLayout";
import OrdersPage from "../areas/customers/pages/OrdersPage";
import ProfilePage from "../areas/customers/pages/ProfilePage";
import BrandManagement from "../areas/admin/pages/BrandManagement";
import ColorManagement from "../areas/admin/pages/ColorManagement";
import SizeManagement from "../areas/admin/pages/SizeManagement";
import VariantManagement from "../areas/admin/pages/products/VariantManagement";
import CheckoutPage from "../areas/customers/pages/CheckoutPage";
import AddressOrderPage from "../areas/customers/pages/AddressOrderPage";
import ErrorBoundary from "../areas/shared/ErrorBoundary";
import NotFound from "../areas/shared/page/NotFound";
import ResultLayout from "../layouts/result/ResultLayout";
import OrderSuccessPage from "../areas/customers/pages/OrderSuccessPage";
import ForbbidenPage from "../areas/customers/pages/ForbbidenPage";
import AdminRoute from "./AdminRoute";
import VariantDetails from "../areas/admin/pages/products/VariantDetails";
import ChatPage from "../areas/admin/pages/ChatPage";
import MainLayout from "../layouts/MainLayout";
import CreateBlogPage from "../areas/admin/pages/blogs/CreateBlogPage";
import ResetPassword from "../areas/customers/pages/ResetPassword";
import AccountManagement from "../areas/admin/pages/AccountManagement";
import Dashboard from "../areas/admin/pages/Dashboard";
import BlogManagement from "../areas/admin/pages/blogs/BlogManagement";
import BlogPage from "../areas/customers/pages/BlogPage";
import BlogDetailPage from "../areas/customers/pages/BlogDetailPage";
import BlogLayout from "../layouts/blog/BlogLayout";
import EditBlogPage from "../areas/admin/pages/blogs/EditBlogPage";
import SlideShowManagement from "../areas/admin/pages/settings/SlideShowManagement";
import ReviewShowManagement from "../areas/admin/pages/settings/ReviewShowManagement";

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: "",
                element: <HomeLayout />,
                children: [
                    {
                        path: '',
                        element: <HomePage />
                    }
                ],
            },
            {

                path: "/shop",
                element: <ShopLayout />,
                children: [
                    {
                        path: '',
                        element: <ShopPage />
                    }
                ],
            },
            {
                path: "/product/:id",
                element: <ProductLayout />,
                children: [
                    {
                        path: '',
                        element: <ProductPage />
                    }
                ],
            },
            {
                path: "/cart",
                element: <CartPage />,
            },
            {
                path: "/blog",
                element: <BlogLayout />,
                children: [
                    {
                        path: "",
                        element: <BlogPage />,
                    },
                    {
                        path: ":id",
                        element: <BlogDetailPage />,
                    },
                ]
            },

            {
                errorElement: <ErrorBoundary />,
                path: "/checkout",
                element: <CheckoutPage />,
            },
            {
                errorElement: <ErrorBoundary />,
                path: "/account",
                element: <AccountLayout />,
                children: [
                    {
                        path: "orders",
                        element: <OrdersPage />,
                    },
                    {
                        path: "profile",
                        element: <ProfilePage />,
                    },
                    {
                        path: "address-order",
                        element: <AddressOrderPage />,
                    },
                ]
            },
            {
                path: 'reset-password',
                element: <ResetPassword />
            }
        ]
    },
    {
        path: "/admin",
        element: <AdminRoute />,
        children: [
            {
                path: '',
                element: <AdminLayout />,
                children: [
                    {
                        path: 'dashboard',
                        element: <Dashboard />,
                    },
                    {
                        path: 'product',
                        element: <ProductManagement />,
                    },
                    {
                        path: 'account',
                        element: <AccountManagement />,
                    },
                    {
                        path: 'variant',
                        element: <VariantManagement />,
                    },
                    {
                        path: 'variant/:id',
                        element: <VariantDetails />,
                    },
                    {
                        path: 'product/:id',
                        element: <ProductDetail />,
                    },
                    {
                        path: 'category',
                        element: <CategoryManagement />
                    },
                    {
                        path: 'brand',
                        element: <BrandManagement />
                    },
                    {
                        path: 'color',
                        element: <ColorManagement />
                    },
                    {
                        path: 'size',
                        element: <SizeManagement />
                    },
                    {
                        path: 'order',
                        element: <OrderManagement />
                    },
                    {
                        path: 'order/:id',
                        element: <OrderDetails />
                    },
                    {
                        path: 'conservation',
                        element: <ChatPage />
                    },
                    {
                        path: 'blog',
                        element: <BlogManagement />
                    },
                    {
                        path: 'blog/create',
                        element: <CreateBlogPage />
                    },
                    {
                        path: 'blog/edit/:id',
                        element: <EditBlogPage />
                    },
                    {
                        path: 'setting/slide',
                        element: <SlideShowManagement />
                    },
                    {
                        path: 'setting/top-review',
                        element: <ReviewShowManagement />
                    },

                ],
            }
        ]

    },
    {
        path: 'result',
        element: <ResultLayout />,
        children: [
            {
                path: 'order-success',
                element: <OrderSuccessPage />
            }
        ]
    },
    {
        path: '403',
        element: <ForbbidenPage />
    },
    {
        path: '*',
        element: <NotFound />
    }
]);

export default router;