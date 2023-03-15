import Cookies from 'js-cookie'
import {Redirect, Link} from 'react-router-dom'

import Header from '../Header'

import './index.css'

const Home = () => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }

  return (
    <div className="home-page">
      <Header />
      <h1 className="home-header">Find The Job That Fits Your Life</h1>
      <p className="home-description">
        Millions of people are searching for jobs,salary information,company
        reviews.Find the jobs that fits your ability and potential.
      </p>
      <Link to="/jobs">
        <button type="button" className="find-job-btn">
          Find Jobs
        </button>
      </Link>
    </div>
  )
}
export default Home
