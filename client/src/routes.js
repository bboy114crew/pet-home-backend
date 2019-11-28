import React from 'react';
import Loadable from 'react-loadable'
import ProductList from './components/product/ProductList';
import ProductCategory from './components/product/ProductCategory';
import EditProduct from './components/product/EditProduct';
import ChangePassword from './components/auth/ChangePassword';
import UserList from './components/admin-dashboard/manage-users/UserList';
import LocationDetail from './components/location/LocationDetail';
import ReportList from './components/admin-dashboard/manage-reports/ReportList';
import PostCategory from './components/admin-dashboard/manage-category/PostCategory';
import LocationCategory from './components/admin-dashboard/manage-category/LocationCategory';
import LocationAdmin from './components/admin-dashboard/manage-location/LocationAdmin';
import AddLocation from './components/admin-dashboard/manage-location/AddLocation';
import EditLocation from './components/admin-dashboard/manage-location/EditLocation';
import ChangePasswordAdmin from './components/admin-dashboard/ChangePasswordAdmin';

function Loading() {
  return <div>Loading...</div>;
}
const AddProduct = Loadable({
    loader: () => import('./components/product/AddProduct'),
    loading: Loading,
  });
  
const routes = [
    { path: '/', exact: true, name: 'Trang Chủ', component: ProductList },
    { path: '/product/add', exact: true, name: 'Thêm sản phẩm', component: AddProduct },
    { path: '/product/edit', exact: true, name: 'Sửa sản phẩm', component: EditProduct },
    { path: '/category', exact: true, name: 'Quản lý thể loại', component: ProductCategory },
    { path: '/product', exact: true, name: 'Quản lý sản phẩm', component: ProductList },
    { path: '/chgpwd', exact: true, name: 'Thay đổi mật khẩu', component: ChangePassword },
    { path: '/locationDetail', exact: true, name: 'Thông tin địa điểm', component: LocationDetail },
    { path: '/admin/allusers', exact: true, name: 'Tất cả người dùng', component: UserList },
    { path: '/admin/report', exact: true, name: 'Báo cáo', component: ReportList },
    { path: '/admin/category/location', exact: true, name: 'Thể loại địa điểm', component: LocationCategory },
    { path: '/admin/category/post', exact: true, name: 'Thể loại bài viết', component: PostCategory },
    { path: '/admin/location', exact: true, name: 'Quản lý địa điểm', component: LocationAdmin },
    { path: '/admin/location/add', exact: true, name: 'Thêm địa điểm mới', component: AddLocation },
    { path: '/admin/location/edit', exact: true, name: 'Sửa thông tin địa điểm', component: EditLocation },
    { path: '/admin/chgpwd', exact: true, name: 'Thay đổi mật khẩu', component: ChangePasswordAdmin },
]
export default routes;