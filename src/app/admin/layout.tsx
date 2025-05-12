import { MenuLink } from '@/components/share/navigate/Menu'

export default function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="drawer lg:drawer-open">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <div className="navbar">
          <div className="navbar-start lg:hidden">
            <label
              htmlFor="admin-drawer"
              className="btn btn-ghost drawer-button lg:hidden"
            >
              <i className="ri-menu-2-line"></i>
            </label>
          </div>
        </div>
        {children}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="admin-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          {/* Sidebar content here */}
          <MenuLink href={'/admin'}>
            <i className="ri-home-3-line"></i>
            Home
          </MenuLink>
          <MenuLink href={'/admin/card'}>
            <i className="ri-git-repository-line"></i>
            Card Skill
          </MenuLink>
        </ul>
      </div>
    </div>
  )
}
