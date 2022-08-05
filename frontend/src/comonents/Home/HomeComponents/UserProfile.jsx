import React, { useState, useEffect } from 'react'
import { AiOutlineLogout } from 'react-icons/ai'
import { useParams, useNavigate } from 'react-router-dom'
import { GoogleLogout } from 'react-google-login'
import { MasonryLayout, Spinner } from '../../index'
import { connect } from 'react-redux'
import { Logout } from '../../../redux/User/UserActions'
import api from '../../../api'
import { currentPage, isLoading, pins, to } from '../../../redux/Pins/PinsSelector'
import { createStructuredSelector } from 'reselect'
import { fetchPinsInitiator } from '../../../redux/Pins/PinsActions'


const randomImg = 'https://source.unsplash.com/1600x900/?nature,photography,technology'

const UserProfile = ({ user, Logout ,currentPage, isLoading, pins, to,fetchPinsInitiator}) => {
  // const [user, setUser] = useState("null")
  // const [pins, setPins] = useState(null)
  const [text, setText] = useState('created')  // or Saved
  const [activeBtn, setActiveBtn] = useState('created')
  const [userPorfileImage, setUserPorfileImage] = useState(null)
  const navigate = useNavigate()
  const { userId } = useParams()

  const activeBtnStyles = "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none"
  const notActiveBtnStyles = "bg-primary-500 text-black mr-4 font-bold p-2 rounded-full w-20 outline-none"

  


  const logout = () => {
    Logout()
    navigate('/login')
  }

  const fetchPins = () => {
    if(activeBtn === 'created'){
      fetchPinsInitiator({createdBy : userId})
    }else if(activeBtn === 'saved'){
      fetchPinsInitiator({savedBy : userId})
    }
  }

  useEffect(()=>{
    fetchPins()
  },[activeBtn])

  useEffect(()=>{
    api.users.getUserProfileImage(userId,user.token).then(res =>{
      setUserPorfileImage(res.data.imageUrl)
    }).catch(err =>{
      console.log(err)
    })
  })

  


  if (!user) return <Spinner message='Loading Profile ...' />

  return (
    <div className='relative pb-2 h-full justify-center items-center'>
      <div className='flex flex-col pb-5'>
        <div className='flex flex-col relative b-7 '>
          <div className='flex flex-col justify-center items-center'>
            <img
              src={randomImg}
              className='w-full h-370 2xl:h-510 shadow-lg object-cover'
              alt="image"
            />
            <img
              className='rounded-full w-30 h-30 -mt-10 shadow-xl object-cover'
              alt="user-profile"
              src={userPorfileImage}
            />
            <h1 className='font-bold text-3xl text-center mt-3'>
              {user.name}
            </h1>
            <div className='absolute top-0 z-1 right-0 p-2'>
              {user._id === userId && (
                <GoogleLogout
                  clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                  render={(renderProps) => (
                    <button
                      type='button'
                      className='bg-white p-2 rounded-full cursor-pointer outlinr-none shadow-md'
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}>
                      <AiOutlineLogout color='red' fontSize={21} />
                    </button>
                  )}
                  onLogoutSuccess={logout}
                  cookiePolicy='single_host_origin'
                />
              )}
            </div>
          </div>
          <div className='text-center mb-7'>
            <button
              type="buttton"
              onClick={e => {
                setText(e.target.textContent)
                setActiveBtn('created')
              }}
              className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}
            >
              Created
            </button>
            <button
              type="buttton"
              onClick={e => {
                setText(e.target.textContent)
                setActiveBtn('saved')
              }}
              className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`}
            >
              Saved
            </button>
          </div>
          {pins?.length ? (
            <div className='px-2'>
              <MasonryLayout user={user} pins={pins} />
            </div>
          ) : (
            <div className='flex justify-center font-bold items-center w-full text-xl mt-2'>
              No Pins Found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const mapDispatchToProps = dispatch => ({
  Logout: () => dispatch(Logout()),
  // fetchPinInit : ({createdBy='',savedBy=''}, token) => dispatch(fetchPinsWithPagenationInitator({createdBy,savedBy},token))
  fetchPinsInitiator : (options) => dispatch(fetchPinsInitiator(options))

})

// const mapStateToProps = (state) => ({
//   pins : pins(state),
//   existedPins : (categoryId) => existedPins(categoryId)(state),
// })

const mapStateToProps = createStructuredSelector({
  pins :pins,
  currentPage : currentPage,
  isLoading: isLoading,
  to: to
})

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile) 