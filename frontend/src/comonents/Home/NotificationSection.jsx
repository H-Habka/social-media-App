import React, { useState } from 'react'
import openSocket from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';
import { connect } from 'react-redux'


const socket = openSocket('http://localhost:4000', { hous: 'hous' });

const NotificationSection = ({ user }) => {

    socket.on('connect', function () {
        socket.emit('storeClientInfo', { customId: user._id });
    });

    socket.on('getNotification', ({ newNote,icon }) => {
        toast.success(newNote, {
            duration: 4000,
            position: 'bottom-right',
            icon
        })
    })

    return (
        <Toaster />
    )
}



const mapStateToProps = (state) => ({
    user: state.user.user
})

export default connect(mapStateToProps)(NotificationSection)