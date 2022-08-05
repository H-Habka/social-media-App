import React from 'react'
import GoogleLogin from 'react-google-login'
import { useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import shareVideo from '../../assets/share.mp4'
import logo from '../../assets/logowhite.png'
import { userLogin } from '../../redux/User/UserActions'
import { connect } from 'react-redux'
import api from '../../api'

const Login = ({ userLogin }) => {
  const navigate = useNavigate()

  const responseGoogle = (response) => {
    const { name, googleId, imageUrl, email } = response.profileObj
    const doc = {
      _id: googleId,
      name,
      imageUrl,
      email,
    }
    api.users.create(doc).then(response =>{
      if(response.data.token){
        userLogin({...doc, token : response.data.token})
        navigate('/')
      }
    }).catch(err => {
      console.log(err)
    })

    
  }


  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className='relative w-full h-full'>
        <video
          src={shareVideo}
          type='video/mp4'
          loop
          controls={false}
          muted
          autoPlay
          className='w-full h-full object-cover'
        />
        <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
          <div className='p-5'>
            <img src={logo} width='130px' alt='logo' />
          </div>

          <div className='shadow-2xl'>
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
              render={(renderProps) => (
                <button
                  type='button'
                  className='bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none'
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}><FcGoogle className='mr-4' /> Sign in With Google </button>
              )}
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy='single_host_origin'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const mapDispatchToProps = dispatch => ({
  userLogin: (user) => dispatch(userLogin(user))
})

export default connect(null, mapDispatchToProps)(Login)