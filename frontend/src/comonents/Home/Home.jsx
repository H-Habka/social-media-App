import React, { useState, useEffect, useRef } from 'react'
import { HiMenu } from 'react-icons/hi'
import { AiFillCloseCircle } from 'react-icons/ai'
import { Link, Routes, Route, useNavigate } from 'react-router-dom'
import { UserProfile, Sidebar, Pins } from '../index'
import logo from '../../assets/logo.png'
import { connect } from 'react-redux'
import { setCategoriesNames } from '../../redux/categories/categoriesActions'
import api from '../../api'

const Home = ({ user, setCategories }) => {
  const scrollRef = useRef(null)
  const [toggleSidebar, setToggleSidebar] = useState(false)
  const navigate = useNavigate()

  setTimeout(() =>{
    if(!user){
      navigate('/login')
      window.location.reload(false);
    }
  },3000)
  useEffect(() => {
    scrollRef.current.scrollTo(0, 0)
    api.categories.getCategoriesNames().then(res => setCategories(res.data.data))
  }, [])

  return (
    <div className='flex bg-gray-50 md:flex-row flex-col h-screen transaction-height duration-75 ease-out'>
      <div className='hidden md:flex h-screen flex-initial'>
        <Sidebar user={user && user}/>
      </div>
      <div className='flex md:hidden flex-row'>
        <div className='p-2 w-full flex flex-row justify-between items-center shadow-md'>
          <HiMenu fontSize={40} className='cursor-pointer' onClick={() => setToggleSidebar(true)} />
          <Link to='/'>
            <img src={logo} alt='logo' className='w-28' />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.imageUrl} alt='logo' className='w-16 rounded-full' />
          </Link>
        </div>


        {toggleSidebar && (
          <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
            <div className='absolute w-full flex justify-end items-center p-2'>
              <AiFillCloseCircle fontSize={30} className='cursor-pointer' onClick={() => setToggleSidebar(false)} />
            </div>
            <Sidebar user={user && user} closeToggle={setToggleSidebar}/>
          </div>
        )}
      </div>
      <div className='pb-2 flex-1 h-screen overflow-y-scroll' ref={scrollRef}>
        <Routes>
          <Route path='/user-profile/:userId' element={<UserProfile user={user}/>} />
          <Route path='/*' element={<Pins user={user}/>} />
        </Routes>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user.user
})

const mapDispatchToProps = dispatch => ({
  setCategories : (categories) => dispatch(setCategoriesNames(categories))
})

export default connect(mapStateToProps,mapDispatchToProps)(Home)

