import React,{useEffect, useState} from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { MdDelete } from 'react-icons/md'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {Spinner} from '../../../index'
import {useForm} from 'react-hook-form'
import {v4 as uuidv4} from 'uuid'
import api from '../../../../api'
import { process_image } from './imageprocessing'

const CreatePin = ({user,categories}) => {
  const [loading, setLoading] = useState(false)
  const [imageAsset, setImageAsset] = useState(null)
  const [wrongImgType, setWrongImgType] = useState(false)
  const [imageNotSelected, setImageNotSelected] = useState(false)
  const [pinImage, setPinImage] = useState('')
  
  const navigae = useNavigate()

  const {register,
        handleSubmit,
        reset,
        formState : {isSubmitSuccessful}} = useForm({defaultValues : {title : '',about:'',destination: '',category:'others'}})


    
  useEffect(()=>{
    if(isSubmitSuccessful){
      reset({title : '',about:'',destination: '',category:'others'})
    }

  },[isSubmitSuccessful,reset])
  const savePin = (data)=>{
    setImageNotSelected(false)
    setImageAsset(null)
    setWrongImgType(false)
    const {title, category, about,destination} = data
    const postedData = {
      createdAt : new Date(),
      title,
      categoryId:category,
      about,
      destination,
      pinImage,
      savedBy:[],
      createdBy :{
        _id : user._id,
        name : user.name,
        imageUrl: user.imageUrl
      },
      comments : [],
      _id: uuidv4(),
      feelingBy : []
    }

    api.categories.addNewPin(postedData,user.token).then(res =>{
    }).catch(err =>{
      console.log(err)
    })
    navigae('/')
  }

  const convertImage = (file) => {
    process_image(file).then(res => {
      setImageAsset(true)
      setLoading(false)
      setPinImage(res)
    })
  }

  const uploadImage = (e) =>{
      const {type} = e.target.files[0]
      if(type === 'image/png' ||type === 'image/svg' ||type === 'image/jpg' ||type === 'image/jpeg' ||type === 'image/gif' ||type === 'image/tiff'){
        setWrongImgType(false)
        setLoading(true)
        convertImage(e.target.files[0])

      }else{
        setWrongImgType(true)
      }
  }

  const handleButtonClick = () =>{
    if(document.getElementById('fileInput')){
      if(document.getElementById('fileInput').files.length ===0){
        setImageNotSelected(true)
      }
    }
  }
  return (
    <form onSubmit= {handleSubmit(savePin)} className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
      <div className='flex lg:flex-row flex-col justify-center bg-white lg:p-5 p-2 lg:w-4/5 w-full'>
        <div className='bg-secondaryColor p-3 flex flex-0.7 w-full '>
          <div className='flex justify-center items-center flex-col border-2 border-dotted border-gray-300 w-full h-420'>
            {loading && (<Spinner />)}
            {wrongImgType && (<p>Wrong image type</p>)}
            {!imageAsset ? (
              <label>
                <div className='flex flex-col items-center justify-center h-full'>
                  <div className='flex flex-col justify-center items-center '>
                    <p className='font-bold text-2xl'>
                      <AiOutlineCloudUpload />
                    </p>
                    <p className='text-lg'> Click to Upload</p>
                  </div>

                  <div className='mt-32'>
                  {imageNotSelected && (
                    <p className='text-red-500 font-bold text-xl text-center'>Pleas Select An Image</p>
                  ) }
                  <p className='mt-5 text-gray-400 text-center'>
                    use high-quality JPG, PNG, and SVG
                  </p>
                  </div>
                </div>
                <input 
                  type="file"
                  required
                  {...register('uploadImage')}
                  // name='upload-image'
                  onChange={uploadImage}
                  className="w-0 h-0"
                  id='fileInput'
                />
              </label>
            ):(
              <div className='relative h-full '>
                  <img src={pinImage} alt='uploaded-img' className='h-full w-full'/>
                <button 
                  type="button"
                  className='absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer hover:shadow-md outline-none transition-all duration-500 ease-in-out'
                  onClick={() =>{setImageAsset(null)}}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full'>
          <input 
            required
            type='text'
            {...register("title")}
            // value={title}
            // onChange={e=>{setTitle(e.target.value)}}
            placeholder='add title'
            className='outline-none text-xl sm:text-2xl font-bold border-gray-200 border-b-2 p-2'
          />
          {user && (
            <div className='flex gap-2 my-2 items-center bg-white rounded-lg'>
              <img 
                src={user.imageUrl}
                className='w-10 h-10 rounded-full'
                alt='user-profile'
              />
              <p className='font-bold'>{user.name}</p>
            </div>
          )}
          <input 
            type='text'
            required
            {...register("about")}
            // value={about}
            // onChange={e=>{setAbout(e.target.value)}}
            placeholder='what is your pin about'
            className='outline-none text-base sm:text-lg border-gray-200 border-b-2 p-2'
          />
          <input 
            type='text'
            {...register("destination")}
            defaultValue=""
            // value={destination}
            // onChange={e=>{setDestination(e.target.value)}}
            placeholder='add destination link'
            className='outline-none text-base sm:text-lg border-gray-200 border-b-2 p-2'
          />
          <div className='flex flex-col'>
            <div>
              <p className='mb-2 font-semibold text-lg sm:text-xl'>Choose pin Category</p>
              <select
                required
                {...register("category")}
                // onChange={e => setCategory(e.target.value)}
                className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer "
              >
                <option value='others' className='bg-white'>Select Category</option>
                {categories?
                  categories?.map(category =>(
                    <option value={category.category_name} key={category.category_name} className='bg-white text-base border-0 outline-none capitalize text-black'>{category.category_name}</option>
                  )) :(
                    null
                  )
                }
              </select>
            </div>
            <div className='flex justify-end items-end mt-5'>
              <button
                onClick={handleButtonClick}
                className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
              >
                savePin
              </button>

            </div>
          </div>
        </div>
      </div>
    </form>
  )
}


const mapStateToProps = state =>({
  categories : state.categories.categories
})

export default connect(mapStateToProps)(CreatePin) 
