export default {
    items: [
      {
        name: 'Quản lý người dùng',
        url: '/admin/allusers',
        icon: 'icon-user',
      },
      {
        name: 'Quản lý thể loại',
        url: '/admin/category',
        icon: 'icon-list',
        children: [
          {
            name: 'Loại bài viết',
            url: '/admin/category/post',
            icon: 'icon-pencil',
          },
          {
            name: 'Loại địa điểm',
            url: '/admin/category/location',
            icon: 'icon-puzzle',
          }
        ]
      },
      {
        name: 'Quản lý địa điểm',
        url: '/admin/location',
        icon: 'icon-location-pin'
      },
      {
        name: 'Quản lý báo cáo',
        url: '/admin/report',
        icon: 'icon-list'
      },
    ]
}