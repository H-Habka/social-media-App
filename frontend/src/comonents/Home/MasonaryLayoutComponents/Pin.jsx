import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill, BsSuitHeartFill } from "react-icons/bs";
import { FaComment, FaLaughBeam, FaSadTear } from "react-icons/fa";
import api from "../../../api";
import { LazyLoadImage } from "react-lazy-load-image-component";
import LazyLoad from "react-lazyload";

import openSocket from "socket.io-client";
const socket = openSocket("http://localhost:4000");

const Pin = ({ user, pin, handlePinDelete, setPopupVisibility }) => {
  const navigate = useNavigate();
  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const [currentFeel, setCurrentFeel] = useState("");
  const [love, setLove] = useState(0);
  const [sad, setSad] = useState(0);
  const [happy, setHappy] = useState(0);
  const [fellingsFieldHoverd, setFellingsFieldHoverd] = useState(false);

  useEffect(() => {
    const savedByCurrentUser = pin.savedBy.find((el) => {
      return el._id === user._id;
    });
    if (savedByCurrentUser) {
      setSavingPost(true);
    } else {
      setSavingPost(false);
    }

    pin.feelingBy.forEach((item) => {
      if (item._id === user._id) {
        setCurrentFeel(item.feel);
      }
    });

    getFellingsCount();
  }, []);

  const notifications = {
    sad: (from, to) => {
      return { feel: "sad", icon: "😢", from, to };
    },
    happy: (from, to) => {
      return { feel: "happy", icon: "😂", from, to };
    },
    love: (from, to) => {
      return { feel: "love", icon: "💖", from, to };
    },
  };

  const savePost = () => {
    if (!savingPost) {
      api.categories
        .savePost(pin._id, user._id, user.token)
        .then((res) => {
          if (res.data.message === "success") setSavingPost(true);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      api.categories
        .unSavePost(pin._id, user._id, user.token)
        .then((res) => {
          if (res.data.message === "success") setSavingPost(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const setFeelings = (feel) => {
    if (feel !== currentFeel) {
      api.categories
        .setFeel(pin._id, user._id, feel, user.token)
        .then((res) => {
          if (res.data.message === "success") setCurrentFeel(feel);
          socket.emit(
            "sendNote",
            notifications[feel](user.name, pin.createdBy._id)
          );
        })
        .catch((err) => console.log(err));
    } else {
      api.categories
        .clearFeel(pin._id, user._id, user.token)
        .then((res) => {
          if (res.data.message === "success") setCurrentFeel("");
        })
        .catch((err) => console.log(err));
    }
  };

  const getFellingsCount = () => {
    let sadCount = 0;
    let loveCount = 0;
    let happyCount = 0;
    pin.feelingBy.forEach((item) => {
      if (item.feel === "sad") return sadCount++;
      if (item.feel === "happy") return happyCount++;
      if (item.feel === "love") return loveCount++;
    });
    setLove(loveCount);
    setSad(sadCount);
    setHappy(happyCount);
  };

  return (
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-details/${pin._id}`)}
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        <LazyLoadImage
          alt="user-post"
          // height="300px"
          src={pin.pinImage}
          // width="300px"
          className="rounded-lg w-full"
          delayMethod="debounce"
          placeholder={<div alt="test" src="" style={{height:"100px",backgroundColor:"gray"}}/>}
        />

        {/* <LazyLoad height={200}>
          <img
            className="rounded-lg w-full"
            alt="user-post"
            src={pin.pinImage}
          />
        </LazyLoad> */}

        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: "100%" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${pin.pinImage}`}
                  download="image"
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white w-9 h-9 rounded-full flex justify-center items-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {pin.createdBy._id === user._id ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {pin?.savedBy?.length
                    ? `${pin?.savedBy?.length} Saved`
                    : "0 Saved"}
                </button>
              ) : savingPost ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    savePost();
                  }}
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  Saved
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    savePost();
                  }}
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  Save
                </button>
              )}
            </div>
            <div className="flex justify-between items-center gap-0.5 w-full">
              {/* {pin?.destination && pin.createdBy._id !== user._id && (
                <a
                  href={pin?.destination}
                  target="_blank"
                  rel="noreferrer"
                  className='bg-white flex text-xs items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md'
                >

                  <BsFillArrowUpRightCircleFill />
                  {pin?.destination}
                </a>
              )} */}
              {pin.createdBy._id === user._id && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPopupVisibility(true);
                    handlePinDelete(pin._id);
                  }}
                  className="bg-white p-2 opacity-70 hover:opacity-100 font-bold text-base rounded-3xl text-dark hover:shadow-md oytline-none"
                >
                  <AiTwotoneDelete />
                </button>
              )}
              {pin.createdBy._id === user._id && (
                <button
                  type="button"
                  // onClick={e => {
                  //   e.stopPropagation()
                  //   handlePinDelete(pin._id)
                  // }}
                  className=" p-2 opacity-40 hover:opacity-80 font-bold text-base rounded-3xl text-dark hover:shadow-md oytline-none"
                >
                  <div
                    onMouseEnter={() => setFellingsFieldHoverd(true)}
                    onMouseLeave={() => setFellingsFieldHoverd(false)}
                    className="flex justify-center items-center gap-1"
                  >
                    <div className="relative flex flex-col">
                      <FaSadTear className="w-6 h-6 text-yellow-500" />
                      {fellingsFieldHoverd && (
                        <span className="absolute font-bold text-yellow-500 rounded-full left-0 right-0 bottom-5">
                          {sad}
                        </span>
                      )}
                    </div>
                    <div className="relative flex flex-col">
                      <BsSuitHeartFill className="w-6 h-6 text-red-500" />
                      {fellingsFieldHoverd && (
                        <span className="absolute font-bold text-red-500 rounded-full left-0 right-0 bottom-5">
                          {love}
                        </span>
                      )}
                    </div>
                    <div className="relative flex flex-col">
                      <FaLaughBeam className="w-6 h-6 text-yellow-500" />
                      {fellingsFieldHoverd && (
                        <span className="absolute font-bold text-yellow-500 rounded-full left-0 right-0 bottom-5">
                          {happy}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              )}

              {pin.createdBy._id === user._id && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="bg-white p-2 opacity-70 hover:opacity-100 font-bold text-base rounded-3xl text-dark hover:shadow-md oytline-none"
                >
                  <div className="flex justify-center items-center gap-2">
                    <span className="text-sm">{pin?.comments?.length}</span>
                    <FaComment />
                  </div>
                </button>
              )}
              {pin.createdBy._id !== user._id && (
                <div className="flex justify-center items-center w-full">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFeelings("sad");
                    }}
                    className="p-2 opacity-90 hover:opacity-100 font-bold text-base rounded-3xl text-dark hover:shadow-md oytline-none"
                  >
                    <FaSadTear
                      className={`${
                        currentFeel === "sad"
                          ? "text-yellow-500"
                          : "text-yellow-100 opacity-50"
                      } w-8 h-8 hover:w-10 hover:h-10 transition-all ease-in-out duration-300`}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFeelings("love");
                    }}
                    className="p-2 opacity-90 hover:opacity-100 font-bold text-base rounded-3xl text-dark hover:shadow-md oytline-none"
                  >
                    <BsSuitHeartFill
                      className={`${
                        currentFeel === "love"
                          ? "text-red-500"
                          : "text-red-100 opacity-50"
                      } w-8 h-8 hover:w-10 hover:h-10 transition-all ease-in-out duration-300`}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFeelings("happy");
                    }}
                    className="p-2 opacity-90 hover:opacity-100 font-bold text-base rounded-3xl text-dark hover:shadow-md oytline-none"
                  >
                    <FaLaughBeam
                      className={`${
                        currentFeel === "happy"
                          ? "text-yellow-500"
                          : "text-yellow-100 opacity-50"
                      } w-8 h-8 hover:w-10 hover:h-10 transition-all ease-in-out duration-300`}
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Link
        to={`/user-profile/${pin?.createdBy?._id}`}
        className="flex items-center gap-2 mt-2"
      >
        <img
          src={pin.createdBy.imageUrl}
          alt="user-profile"
          className="w-8 h-8 rounded-full object-cover"
        />
        <p className="font-semibold capitalize">{pin.createdBy.name}</p>
      </Link>
    </div>
  );
};

export default Pin;
