import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', isSubmit: false, errMsg: ''}

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 2})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({isSubmit: true, errMsg: errorMsg})
  }

  goToLogin = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const url = 'https://apis.ccbp.in/login'
    const userDetails = {
      username,
      password,
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)

    const data = await response.json()

    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  onChangeName = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {isSubmit, errMsg} = this.state
    const Token = Cookies.get('jwt_token')
    if (Token !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="app-container">
        <div className="login-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="web-logo-img"
          />
          <form className="form-container" onSubmit={this.goToLogin}>
            <div className="username-container">
              <label htmlFor="username" className="label-name">
                USERNAME
              </label>
              <input
                type="text"
                placeholder="Username"
                id="username"
                className="input-ele-name"
                onChange={this.onChangeName}
              />
            </div>

            <div className="password-container">
              <label htmlFor="password" className="label-password">
                PASSWORD
              </label>
              <input
                type="password"
                placeholder="Password"
                id="password"
                className="input-ele-password"
                onChange={this.onChangePassword}
              />
            </div>
            <div className="logi-btn-container">
              <button type="submit" className="login-btn">
                Login
              </button>
            </div>
            {isSubmit && <p className="err-msg">*{errMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
