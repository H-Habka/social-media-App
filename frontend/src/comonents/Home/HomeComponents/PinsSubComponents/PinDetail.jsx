import React, { useState, useEffect, useRef, createRef } from 'react'
import { FcComments } from 'react-icons/fc'
import { MdDownloadForOffline } from 'react-icons/md'
import { Link, useParams } from 'react-router-dom'
import api from '../../../../api'
import { useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import { AiTwotoneDelete, AiOutlineEdit, AiFillLike, AiFillDislike } from 'react-icons/ai'


import { MasonryLayout, Spinner, Popup } from '../../../index'
import { BsSuitHeartFill } from 'react-icons/bs'
import openSocket from 'socket.io-client';
import { connect } from 'react-redux'
import { isLoading, pins, to, currentPage } from '../../../../redux/Pins/PinsSelector'
import { fetchPinsInitiator } from '../../../../redux/Pins/PinsActions'
import { createStructuredSelector } from 'reselect'
import toast, { Toaster } from 'react-hot-toast';
const socket = openSocket('http://localhost:4000');

const PinDetail = ({ user, isLoading, pins, to, currentPage, fetchPinsInitiator }) => {
  const [pinDetails, setPinDetails] = useState(null)
  const [editCommentData, setEditCommentData] = useState({ status: false, _id: '' })
  const [popupVisibility, setPopupVisibility] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState('')
  const { pinId } = useParams()

  const { register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful }
  } = useForm({ defaultValues: { comment: "" } })

  const fetchRelatedPins = () => {
    if (pinDetails?.categoryId) {
      fetchPinsInitiator({ categoryId: pinDetails?.categoryId })
    }
  }

  const fetchPinDetails = () => {
    api.categories.getOnePin(pinId, user.token).then(res => {
      setPinDetails(res.data.data)
    }).catch(err => {
      console.log(err)
    })
  }

  const pinDetailsComponent = useRef()

  useEffect(() => {
    pinDetailsComponent?.current?.scrollIntoView({behavior: "smooth"});
    fetchPinDetails()
  }, [pinId])

  useEffect(() => {
    fetchRelatedPins()
  }, [pinDetails?.categoryId])

  const addComment = ({ comment }) => {
    if (comment) {
      const commentData = {
        _id: uuidv4(),
        comment,
        postedBy: {
          _id: user._id,
          name: user.name,
          imageUrl: user.imageUrl
        }
      }
      api.categories.addCommentToPin(pinDetails._id, { commentData }, user.token).then(res => {
        setPinDetails({
          ...pinDetails,
          comments: [
            ...pinDetails.comments,
            { commentData }
          ]
        })
        reset({ comment: '' });
      }).catch(err => {
        console.log(err)
      })

    }
  }

  const deleteComment = (commentId) => {

    toast.promise(
      api.categories.deleteComment(pinDetails._id, commentId),
      {
        loading: 'deleting...',
        success: () => {
          setTimeout(() => {
            setPinDetails({
              ...pinDetails,
              comments: pinDetails.comments.filter(comment => comment.commentData._id !== commentId)
            })
          }, 1000)
          return <b> comment Deleted </b>
        },
        error: <b> Something Went Wrong </b>,
      }
    );


    // api.categories.deleteComment(pinDetails._id, commentId).then(res => {
    //   setPinDetails({
    //     ...pinDetails,
    //     comments: pinDetails.comments.filter(comment => comment.commentData._id !== commentId)
    //   })
    // }).catch(err => {
    //   console.log(err)
    // })
  }

  const editComment = (_id) => {
    if (_id != editCommentData._id) {
      let comment = pinDetails.comments.filter(comment => comment.commentData._id === _id)
      reset({ comment: comment[0].commentData.comment })
      setEditCommentData({ _id, status: true })
    } else {
      if (!editCommentData.status) {
        let comment = pinDetails.comments.filter(comment => comment.commentData._id === _id)
        reset({ comment: comment[0].commentData.comment })
        setEditCommentData({ _id, status: !editCommentData.status })
      } else {
        reset({ comment: '' })
        setEditCommentData({ _id, status: !editCommentData.status })
      }
    }
    // let comment = pinDetails.comments.filter(comment => comment.commentData._id === _id)
    // reset({ comment: comment[0].commentData.comment })                          
  }

  const editCommentOnDatabase = ({ commentId, newComment }) => {
    api.categories.editComment(pinDetails._id, commentId, newComment).then(res => {
      reset({ comment: '' })
      setEditCommentData({ _id: commentId, status: false })
      setPinDetails({
        ...pinDetails,
        comments: pinDetails.comments.map(comment => {
          if (comment.commentData._id === commentId) {
            return { commentData: { ...comment.commentData, comment: newComment } }
          }
          return comment
        }),
      })
    }).catch(err => {
      console.log(err)
    })
  }

  const handleCancleClick = () => {
    setPopupVisibility(false)
  }

  const handleConfirmClick = () => {
    deleteComment(commentToDelete)
    setPopupVisibility(false)
  }

  if (!pinDetails) return <Spinner message="loading Pin ..." />

  return (
    <>
      <Toaster />
      <Popup
        setPopupVisibility={setPopupVisibility}
        popupVisibility={popupVisibility}
        handleCancleClick={handleCancleClick}
        handleConfirmClick={handleConfirmClick}
        message = "Are You Sure You Want To Delete This Comment ?"
      />
      <div ref={pinDetailsComponent} className='flex xl-flex-row flex-col m-auto bg-white' style={{ maxWidth: "1500px", borderRadius: '32px' }}>
        <div className='flex justify-center items-center md:items-start flex-initial'>
          <img
            src={pinDetails.pinImage}
            className="rounded-t-3xl rounded-b-lg"
            alt="user-post"
          />
        </div>
        <div className='w-full p-5 flex-1 xl:min-w-620'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2 mr-4'>
              <a
                href={`${pinDetails.pinImage}`}
                download="image"
                onClick={(e) => e.stopPropagation()}
                className='bg-white w-14 h-14 rounded-full flex justify-center items-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
              >
                <MdDownloadForOffline className='bg-white w-14 h-14' />
              </a>
            </div>
            <a
              href={pinDetails.destination}
              target="_blank"
              rel="noreferrer"
            >
              {pinDetails.destination}
            </a>
          </div>
          <div>
            <h1 className='text-4xl font-bold break-words mt-3'>
              {pinDetails.title}
            </h1>
            <p className='mt-3'>
              {pinDetails.about}
            </p>
          </div>
          <Link to={`/user-profile/${pinDetails.createdBy._id}`} className='flex gap-2 mt-5 items-center bg-white rounded-lg'>
            <img
              src={pinDetails.createdBy.imageUrl}
              alt='user-profile'
              className='w-8 h-8 rounded-full object-cover'
            />
            <p className='font-semibold capitalize'>{pinDetails.createdBy.name}</p>
          </Link>
          <h2 className='mt-5 text-2xl'> comments </h2>
          <div className='max-h-370 overflow-y-auto'>
            {
              pinDetails.comments.map(({ commentData: { postedBy, comment, _id } }, idx) => (
                <div className='flex justify-between'>
                  <div className='flex gap-2 mt-5 items-center bg-white rounded-lg' key={idx}>
                    <img
                      src={postedBy.imageUrl}
                      alt="user-profile"
                      className='w-10 h-10 rounded-full cursor-pointer'
                    />
                    {
                      editCommentData.status && editCommentData._id === _id ? (
                        <form onSubmit={handleSubmit(({ comment }) => editCommentOnDatabase({ commentId: _id, newComment: comment }))} className='flex gap-2'>
                          <input
                            type="text"
                            className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
                            placeholder='Add a Comment'
                            {...register("comment")}
                          />
                          <button
                            className='bg-black text-white rounded-2xl px-4 py-1 font-semibold text-base outline-none'
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className='bg-red-500 text-white rounded-2xl px-4 py-1 font-semibold text-base outline-none'
                            onClick={() => { editComment(_id) }}
                          >
                            cancel
                          </button>
                        </form>
                      ) : (
                        <div className='flex flex-col'>
                          <p className='font-bold'>
                            {postedBy.name}
                          </p>
                          <p>
                            {comment}
                          </p>
                        </div>
                      )
                    }
                  </div>
                  {postedBy._id === user._id && (
                    <div className='flex flex-col mt-4'>
                      <div
                        className='bg-white w-8 h-8 rounded-full flex justify-center items-center text-dark opacity-75 hover:opacity-100 hover:shadow-md outline-none'
                      ><AiTwotoneDelete className='cursor-pointer' onClick={() => { setCommentToDelete(_id); setPopupVisibility(true) }} /></div>
                      <div
                        className='bg-white w-8 h-8 rounded-full flex justify-center items-center text-dark opacity-75 hover:opacity-100 hover:shadow-md outline-none'
                      ><AiOutlineEdit className='cursor-pointer' onClick={() => { editComment(_id) }} /></div>
                    </div>
                  )}
                </div>
              ))}
          </div>



          {
            !editCommentData.status && (
              <form onSubmit={handleSubmit(addComment)} className='flex flex-wrap mt-6 gap-3'>
                <Link to={`/user-profile/${user._id}`} >
                  <img
                    src={user.imageUrl}
                    alt='user-profile'
                    className='w-8 h-8 rounded-full cursor-pointer mt-2'
                  />
                </Link>
                <input
                  type="text"
                  className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
                  placeholder='Add a Comment'
                  {...register("comment")}
                />
                <button
                  className='bg-black text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
                >
                  Post
                </button>
              </form>
            )
          }

        </div>
      </div>
      {pins?.length > 0 ? (
        <>
          <h2 className='text-center font-bold text-2xl mt-8 mb-4'>
            More Like This
          </h2>
          <MasonryLayout user={user} pins={pins?.filter(pin => pin._id !== pinDetails._id)} />
        </>
      ) : (
        <Spinner message='loading more pins ...' />
      )
      }
    </>

  )
}

const mapStateToProps = createStructuredSelector({
  pins: pins,
  currentPage: currentPage,
  isLoading: isLoading,
  to: to
})

const mapDispatchToProps = dispatch => ({
  fetchPinsInitiator: (options) => dispatch(fetchPinsInitiator(options))
})


export default connect(mapStateToProps, mapDispatchToProps)(PinDetail)