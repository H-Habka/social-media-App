import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { MasonryLayout, Spinner } from '../../../index'
import { connect } from 'react-redux'
import { fetchPinsInitiator } from '../../../../redux/Pins/PinsActions'
import { createStructuredSelector } from 'reselect'
import {pins,isLoading} from '../../../../redux/Pins/PinsSelector'

const Feed = ({ user,fetchPinsInitiator ,pins,isLoading}) => {
  const { categoryId } = useParams()

  useEffect(() => {
    fetchPinsInitiator({categoryId})
  }, [categoryId])

  if (!pins?.length && !isLoading) return (
    <h1 className='text-center text-2xl font-bold mt-5'>
      This Category is Empty
    </h1>
    )

  return (
    <div>
      {pins && <MasonryLayout pins={pins} user={user} />}
    </div>
  )
}

const mapStateToProps = createStructuredSelector({
  pins :pins,
  isLoading: isLoading,
})

const mapDispatchToProps = dispatch => ({
  fetchPinsInitiator : (options) => dispatch(fetchPinsInitiator(options)),
})


export default connect(mapStateToProps,mapDispatchToProps)(Feed)