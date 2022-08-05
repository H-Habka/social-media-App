import Rodal from 'rodal'
import './rodal.css'

const Popup = ({popupVisibility,
                setPopupVisibility,
                handleCancleClick,
                handleConfirmClick,
                message
            }) => {
    return (
        <Rodal
            visible={popupVisibility}
            onClose={() => setPopupVisibility(false)}
            closeOnEsc={true}
            animation='rotate'
            duration={400}
            showCloseButton={false}
            
        >
            <div className='rodal-popup-container'>
                <p className='rodal-popup-content'>{message ? message: 'are you sure??'}</p>
                <div className='rodal-popup-buttons-container'>
                    <button className='rodal-confirm-button'onClick={handleConfirmClick}>confirm</button>
                    <button className='rodal-cancel-button'onClick={handleCancleClick}>cancel</button>
                </div>
            </div>
        </Rodal>
    )
}

export default Popup