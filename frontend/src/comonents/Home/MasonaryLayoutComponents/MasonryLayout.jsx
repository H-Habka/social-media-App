import React, { useEffect, useState, useRef, useCallback } from 'react'
import Masonry from 'react-masonry-css'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import api from '../../../api'
import { fetchPinsOnScrollInitiator } from '../../../redux/Pins/PinsActions'
import { currentPage, isLoading, pinsOptions, to } from '../../../redux/Pins/PinsSelector'
import { Pin } from '../../index'
import { Spinner } from '../../index'
import { Popup } from '../../index'
import toast, { Toaster } from 'react-hot-toast';


const breakpointObj = {
  defalut: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1
}

const MasonryLayout = ({ pinsOptions, pins, to, currentPage, isLoading, user, fetchPinsOnScrollInitiator }) => {
  const [popupVisibility, setPopupVisibility] = useState(false)
  const [pinToDelete, setPinToDelete] = useState('')
  const [masonaryPins, setMasonaryPins] = useState([])

  useEffect(() => {
    setMasonaryPins(pins)
  }, [pins])
  // pins = pins.sort((a, b) => {
  //   return new Date(a.createdAt) - new Date(b.createdAt)
  //   // return Math.random() - Math.random()
  // })

  const observer = useRef()
  const triggerFetch = useCallback(node => {
    if (isLoading) return
    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        if (currentPage != to)
          fetchPinsOnScrollInitiator({ ...pinsOptions, pageNum: currentPage + 1 })
      }
    })
    if (node) observer.current.observe(node)
  })

  const deletePost = (pinId) => {
    toast.promise(
      api.categories.deletePost(pinId),
       {
         loading: 'deleting...',
         success: () => {
          setTimeout(() => {
                setMasonaryPins(masonaryPins.filter(pin => pin._id !==pinToDelete))
              },1000)
           return <b> Post Deleted </b>
        },
         error: <b> Something Went Wrong </b>,
       }
     );
  }

  const handleCancleClick = () => {
    setPopupVisibility(false)
  }
  const handleConfirmClick = () => {
    deletePost(pinToDelete)
    setPopupVisibility(false)
    


  }

  const handlePinDelete = (pinId) => {
    setPinToDelete(pinId)
  }



  return (
    <>
      <Toaster />
      <Popup
        setPopupVisibility={setPopupVisibility}
        popupVisibility={popupVisibility}
        handleCancleClick={handleCancleClick}
        handleConfirmClick={handleConfirmClick}
        message = "Are You Sure You Want To Delete This Pin ??"
      />
      <Masonry className='flex animate-slide-fwd' breakpointCols={breakpointObj}>
        {

          masonaryPins?.map(pin => (
            <Pin setPopupVisibility={setPopupVisibility} key={pin._id} pin={pin} className='w-max' user={user} handlePinDelete={handlePinDelete} />
          ))

        }

      </Masonry>
      {
        isLoading && <Spinner message='we are adding new ideas to your feed!' />
      }
      <div ref={triggerFetch} />
    </>
  )
}

const mapStateToProps = createStructuredSelector({
  currentPage: currentPage,
  isLoading: isLoading,
  to: to,
  pinsOptions: pinsOptions
})

const mapDispatchToProps = dispatch => ({
  fetchPinsOnScrollInitiator: (options) => dispatch(fetchPinsOnScrollInitiator(options))
})

export default connect(mapStateToProps, mapDispatchToProps)(MasonryLayout) 