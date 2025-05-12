export default function AdminNavbar() {
  return (
    <div className="navbar">
      <div className="navbar-start lg:hidden">
        <label
          htmlFor="admin-drawer-layout"
          className="btn btn-ghost drawer-button lg:hidden"
        >
          <i className="bx bx-menu"></i>
        </label>
      </div>
      <div className="navbar-center lg:navbar-start">
        <a className="btn btn-ghost text-xl">Sisaket Idle Admin</a>
      </div>
      <div className="navbar-end">
        <button className="btn btn-square btn-ghost">
          <i className="bx bx-dots-vertical-rounded"></i>
        </button>
      </div>
    </div>
  )
}
