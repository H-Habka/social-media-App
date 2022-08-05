import React,{useEffect,useState} from 'react'
import { NavLink, Link } from 'react-router-dom'
import {RiHomeFill} from 'react-icons/ri'
import {IoIosArrowForward} from 'react-icons/io'
import api from '../../../api'

import logo from '../../../assets/logo.png'
import { connect } from 'react-redux'

const isNotActiveStyle = 'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize' 
const isActiveStyle = 'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-100 ease-out capitalize' 


const Sidebar = ({user, closeToggle,categories}) => {
  const handleCloseSidebar = () =>{
    if(closeToggle) closeToggle(false)
  }


  return (
    <div className='flex flex-col justify-between bg-white h-full over-y-scroll min-w-210 hide-scrollbar'>
      <div className='flex flex-col'>
        <Link to='/' className='flex px-2 gap-2 my-6 pt-1 w-190 item-center' onClick={handleCloseSidebar}>
          <img src={logo} alt='logo' className='w-full'/>
        </Link>
        <div className='flex flex-col gap-5 max-h-74 overflow-y-scroll hide-scrollbar'>
          <NavLink to='/' className={(props) => props.isActive ? isActiveStyle : isNotActiveStyle} onClick={handleCloseSidebar}>
            <RiHomeFill />
            Home
          </NavLink>
          <h3 className='mt-2 px-5 text-base 2xl:text-xl'>Discover categories</h3>

          {
            categories ? categories.map(category => (
                <NavLink to={`/category/${category.category_name}`} className={(props) => props.isActive ? isActiveStyle : isNotActiveStyle} onClick={handleCloseSidebar} key={category.category_name}>
                  <img src={category.image} className="w-8 h-8 rounded-full shadow-sm" alt='category' />
                  {category.category_name}
                </NavLink>
            )) : ('')
          }
        </div>
      </div>
      {user && (
        <Link to={`user-profile/${user._id}`}
        className='flex my-1 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3' onClick={handleCloseSidebar}>
          <img src={user.imageUrl} className='w-10 h-10 rounded-full' alt='user-profile'/>
          <p>{user.name}</p>
        </Link>
      )}
    </div>
  )
}

const mapStateToProps = state => ({
  categories : state.categories.categories
})

export default connect(mapStateToProps)(Sidebar)