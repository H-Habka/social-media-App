import React , {useState}from 'react'
import {Link , Routes, Route} from 'react-router-dom'
import {Navbar, Feed, PinDetail, Search, CreatePin} from '../../index'

const Pins = ({user}) => {
  const [searchTerm, setSearchTerm] = useState('')
  return (
    <div className='px-2 md:px-5'>
      <div className="bg-gray-50">
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user}/>
      </div>
      <div className='h-full'>
        <Routes>
          <Route path="/" element={<Feed user={user}/>} />
          <Route path="/category/:categoryId" element={<Feed user={user}/>} />
          <Route path="/pin-details/:pinId" element={<PinDetail user={user} />} />
          <Route path="/create-pin" element={<CreatePin user={user}/>} />
          <Route path="/search" element={<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user}/>} />
        </Routes>
      </div>
    </div>
  )
}

export default Pins