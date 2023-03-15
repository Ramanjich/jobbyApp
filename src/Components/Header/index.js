import {Link, withRouter} from 'react-router-dom'

import Cookies from 'js-cookie'

import {MdHome, MdWork} from 'react-icons/md'

import {GrLogout} from 'react-icons/gr'
import './index.css'

const Header = props => {
  const onClickLogoutBtn = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <nav>
      <div className="header-container">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="nav-logo-img"
          />
        </Link>
        <ul className="items-container">
          <Link to="/" className="items">
            <li>Home</li>
          </Link>

          <Link to="/jobs" className="items">
            <li>Jobs</li>
          </Link>
        </ul>
        <button type="button" className="logout-btn" onClick={onClickLogoutBtn}>
          Logout
        </button>
      </div>
      <div className="small-view-container">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="nav-logo-img"
          />
        </Link>
        <ul className="items-container">
          <Link to="/" className="items">
            <li>
              <MdHome className="md-home" />
            </li>
          </Link>

          <Link to="/jobs" className="items">
            <li>
              <MdWork className="md-work" />
            </li>
          </Link>
        </ul>
        <button type="button" className="logout-btn" onClick={onClickLogoutBtn}>
          <GrLogout className="g-logout" />
        </button>
      </div>
    </nav>
  )
}

export default withRouter(Header)
