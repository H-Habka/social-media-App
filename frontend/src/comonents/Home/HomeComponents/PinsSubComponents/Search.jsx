import React, { useState, useEffect } from 'react'
import { MasonryLayout, Spinner } from '../../../index'
import axios from 'axios'
import { createStructuredSelector } from 'reselect'
import { isLoading, pins } from '../../../../redux/Pins/PinsSelector'
import { fetchPinsInitiator, fetchPinsOnScrollInitiator } from '../../../../redux/Pins/PinsActions'
import { connect } from 'react-redux'


const Search = ({ searchTerm,setSearchTerm, pins, isLoading, user, fetchPinsInitiator }) => {

  useEffect(() => {
    const source = axios.CancelToken.source();
    const cancelToken = source.token;
    if (searchTerm) {
      fetchPinsInitiator({ searchTerm, cancelToken })
    }
    return () => source.cancel()
  }, [searchTerm])

  useEffect(() => {
    return () => {
      setSearchTerm('')
    }
  }, [])

  return (
    <div>
      {isLoading && pins?.length === 0 && <Spinner message='searching for pins' />}
      {pins?.length !== 0 && searchTerm && <MasonryLayout pins={pins} user={user} />}
      {pins?.length === 0 && searchTerm !== '' && !isLoading && (
        <div className='mt-10 text-center text-2xl text-black'>
          No Pins Found!
        </div>
      )}
    </div>
  )
}

const mapStateToProps = createStructuredSelector({
  pins: pins,
  isLoading: isLoading,
})

const mapDispatchToProps = dispatch => ({
  fetchPinsInitiator: (options) => dispatch(fetchPinsInitiator(options)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Search) 