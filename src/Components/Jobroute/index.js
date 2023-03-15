import {Component} from 'react'

import Loader from 'react-loader-spinner'

import {BsSearch} from 'react-icons/bs'

import Cookies from 'js-cookie'

import Header from '../Header'

import JobItem from '../JobItems'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    profileData: [],
    isProfileSuccess: false,
    isLoadingp: true,
    jobsData: [],
    isJobsSuccess: false,
    isLoadingJ: true,
    searchInput: '',
    search: '',
    checkboxInputs: [],
    salary: '',
  }

  componentDidMount() {
    this.getProfile()
    this.getAllJobs()
  }

  getProfile = async () => {
    const pUrl = 'https://apis.ccbp.in/profile'
    const accessToken = Cookies.get('jwt_token')
    const option = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: 'GET',
    }

    const responsep = await fetch(pUrl, option)
    if (responsep.ok === true) {
      const data = [await responsep.json()]
      const updatedDataProfile = data.map(eachItem => ({
        name: eachItem.profile_details.name,
        profileImageUrl: eachItem.profile_details.profile_image_url,
        shortBio: eachItem.profile_details.short_bio,
      }))

      this.setState({
        profileData: updatedDataProfile,
        isProfileSuccess: true,
        isLoadingp: false,
      })
    } else {
      this.setState({isProfileSuccess: false, isLoadingp: false})
    }
  }

  onClickProfile = () => {
    console.log('retry')
    this.getProfile()
  }

  renderProfileContainer = () => {
    const {profileData, isProfileSuccess} = this.state

    const renderSuccessProfile = () => {
      const {name, profileImageUrl, shortBio} = profileData[0]

      return (
        <div className="profile-container">
          <img src={profileImageUrl} alt="profile" className="profile-img" />
          <h1 className="profile-name-heading">{name}</h1>
          <p className="short-bio">{shortBio}</p>
        </div>
      )
    }

    const renderPFailureView = () => (
      <div className="p-failure-container">
        <button
          type="button"
          className="retry-btn"
          onClick={this.onClickProfile}
        >
          Retry
        </button>
      </div>
    )

    return (
      <>{isProfileSuccess ? renderSuccessProfile() : renderPFailureView()}</>
    )
  }

  getAllJobs = async () => {
    this.setState({isLoadingJ: true})
    const {search, checkboxInputs, salary} = this.state
    const url = `https://apis.ccbp.in/jobs?employment_type=${checkboxInputs}&minimum_package=${salary}&search=${search}`

    const accessToken = Cookies.get('jwt_token')
    const option = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: 'GET',
    }

    const responseJobs = await fetch(url, option)

    if (responseJobs.ok === true) {
      const fetchedDdata = await responseJobs.json()

      const updatedJobs = fetchedDdata.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        rating: eachJob.rating,
        title: eachJob.title,
        packagePerAnnum: eachJob.package_per_annum,
      }))
      this.setState({
        jobsData: updatedJobs,
        isJobsSuccess: true,
        isLoadingJ: false,
      })
    } else {
      this.setState({
        isJobsSuccess: false,
        isLoadingJ: false,
      })
    }
  }

  onClickRetryBtnJobs = () => {
    this.getAllJobs()
  }

  renderJobItems = () => {
    const {jobsData} = this.state
    const isNojobs = jobsData.length > 0

    return (
      <>
        {isNojobs ? (
          <ul className="jobs-item-container">
            {jobsData.map(eachItem => (
              <JobItem eachItem={eachItem} key={eachItem.id} />
            ))}
          </ul>
        ) : (
          this.renderNoJobsView()
        )}
      </>
    )
  }

  renderFailureJobs = () => (
    <div className="job-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs-failure-view-img"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button
        type="button"
        className="failure-retry-btn"
        onClick={this.onClickRetryBtnJobs}
      >
        Retry
      </button>
    </div>
  )

  renderNoJobsView = () => (
    <div className="no-job-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="jobs-no-view-img"
      />
      <h1 className="no-job-heading">No Jobs Found</h1>
      <p className="no-job-para">
        We could not find any jobs. Try other filters
      </p>
    </div>
  )

  renderJobRoute = () => {
    const {isJobsSuccess} = this.state
    return (
      <>{isJobsSuccess ? this.renderJobItems() : this.renderFailureJobs()}</>
    )
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearchBtn = () => {
    const {searchInput} = this.state
    this.setState({search: searchInput}, this.getAllJobs)
  }

  onSalarySelection = event => {
    this.setState({salary: event.target.id}, this.getAllJobs)
  }

  onGetInputOption = event => {
    const {checkboxInputs} = this.state
    const inputNotInList = checkboxInputs.filter(
      eachItem => eachItem === event.target.id,
    )
    if (inputNotInList.length === 0) {
      this.setState(
        prevState => ({
          checkboxInputs: [...prevState.checkboxInputs, event.target.id],
        }),
        this.getAllJobs,
      )
    } else {
      const filteredData = checkboxInputs.filter(
        eachItem => eachItem !== event.target.id,
      )
      this.setState({checkboxInputs: filteredData}, this.getAllJobs)
    }
  }

  render() {
    const {isLoadingp, isLoadingJ, searchInput} = this.state
    return (
      <div className="job-page">
        <Header />
        <div className="jobs-container">
          <div className="container-1-j">
            {isLoadingp ? this.renderLoader() : this.renderProfileContainer()}
            <hr className="hr-line" />
            <h1 className="heading-typeE">Type of Employment</h1>
            <ul className="check-box-container">
              {employmentTypesList.map(eachType => (
                <li className="check-box-item" key={eachType.employmentTypeId}>
                  <input
                    type="checkbox"
                    className="check-box-ele"
                    id={eachType.employmentTypeId}
                    onChange={this.onGetInputOption}
                  />
                  <label htmlFor={eachType.employmentTypeId}>
                    {eachType.label}
                  </label>
                </li>
              ))}
            </ul>

            <hr className="hr-line" />
            <h1 className="heading-typeSR">Salary Range</h1>
            <ul className="radio-type-container">
              {salaryRangesList.map(eachList => (
                <li className="radio-item" key={eachList.salaryRangeId}>
                  <input
                    type="radio"
                    className="radio-box-ele"
                    id={eachList.salaryRangeId}
                    name="salary"
                    onChange={this.onSalarySelection}
                  />
                  <label htmlFor={eachList.salaryRangeId}>
                    {eachList.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="container-2-j">
            <div className="search-container">
              <input
                type="search"
                className="search-jobs-ele"
                placeholder="Search"
                value={searchInput}
                onChange={this.onChangeSearchInput}
              />
              <button
                type="button"
                className="search-icon-btn"
                data-testid="searchButton"
                onClick={this.onClickSearchBtn}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {isLoadingJ ? this.renderLoader() : this.renderJobRoute()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
