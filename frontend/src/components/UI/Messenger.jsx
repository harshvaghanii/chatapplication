import React, { useEffect, useRef, useState } from "react";
import { FaEllipsisH, FaSistrix, FaSignOutAlt } from "react-icons/fa";
// import ActiveFriend from "./ActiveFriend";
import Friends from "./Friends";
import RightSide from "./RightSide";
import {
    getFriends,
    messageSend,
    getMessage,
    imageMessageSend,
    seenMessage,
    updateMessage,
    setTheme,
    getTheme,
} from "../../store/actions/messengerActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import {
    SOCKET_MESSAGE_SUCCESS,
    UPDATE_FRIEND_MESSAGE,
    MESSAGE_SEND_SUCCESS_CLEAR,
    SEEN_MESSAGE,
    DELIVERED_MESSAGE,
    SEEN_ALL,
    NEW_USER_ADD,
    NEW_USER_ADD_CLEAR,
} from "../../store/types/messengerTypes";
import toast, { Toaster } from "react-hot-toast";
import useSound from "use-sound";
import notificationSound from "../../audio/notifications.mp3";
import { MESSAGE_GET_SUCCESS_CLEAR, UPDATE } from "../../store/types/authTypes";
import { userLogout } from "../../store/actions/auth";
// import messageSound from "../../audio/sendmessage.mp3";
// End of imports

// To-Do
// 1. Trim the sendMessage sound

const Messenger = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const scrollRef = useRef();
    const socket = useRef();
    const { authenticate, myInfo } = useSelector((state) => state.auth);
    const {
        friends,
        messages,
        messageSendSuccess,
        message_get_success,
        themeMode,
        new_user_add,
    } = useSelector((state) => state.messenger);
    const [currentFriend, setCurrentFriend] = useState("");
    const friendHandler = (friend) => {
        setCurrentFriend(friend);
    };

    const [newMessage, setNewMessage] = useState("");
    const [socketMessage, setSocketMessage] = useState("");
    const [activeUsers, setActiveUsers] = useState([]);
    const [userTyping, setUserTyping] = useState({});
    const [hide, setHide] = useState(true);
    const [playNotificationSound] = useSound(notificationSound);
    // const [playMessageSound] = useSound(messageSound);
    const inputHandler = (e) => {
        setNewMessage(e.target.value);

        socket.current.emit("typingMessage", {
            senderId: myInfo.id,
            receiverId: currentFriend._id,
            message: e.target.value,
        });
    };

    // Functions for sending messages

    const sendMessage = (e) => {
        e.preventDefault();

        const data = {
            senderName: myInfo.username,
            receiverId: currentFriend._id,
            message: newMessage ? newMessage : "❤",
        };

        socket.current.emit("typingMessage", {
            senderId: myInfo.id,
            receiverId: currentFriend._id,
            message: "",
        });
        // playMessageSound();
        dispatch(messageSend(data));
        setNewMessage("");
    };

    const emojiSend = (e) => {
        setNewMessage((prevMessage) => `${prevMessage}${e}`);
        socket.current.emit("typingMessage", {
            senderId: myInfo.id,
            receiverId: currentFriend._id,
            message: e,
        });
        // playMessageSound();
    };

    const imageSend = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const imageName = e.target.files[0].name;
            const newImageName =
                Date.now() + imageName.trim().replaceAll(/\s/g, "");

            socket.current.emit("sendMessage", {
                senderId: myInfo.id,
                senderName: myInfo.username,
                receiverId: currentFriend._id,
                time: new Date(),
                message: {
                    text: "",
                    image: newImageName,
                },
            });

            const formData = new FormData();
            formData.append("senderName", myInfo.username);
            formData.append("receiverId", currentFriend._id);
            formData.append("image", e.target.files[0]);
            formData.append("imagename", newImageName);
            // playMessageSound();
            dispatch(imageMessageSend(formData));
        }
    };

    // Function to handle search

    const searchHandler = (event) => {
        const getFriendClass = document.getElementsByClassName("hover-friend");
        const friendNameClass = document.getElementsByClassName("Fd_name");

        for (
            let i = 0;
            i < getFriendClass.length && i < friendNameClass.length;
            i++
        ) {
            let text = friendNameClass[i].innerText.toLowerCase();
            if (text.indexOf(event.target.value.toLowerCase()) !== -1) {
                getFriendClass[i].style.display = "";
            } else {
                getFriendClass[i].style.display = "none";
            }
        }
    };

    // Function to handle logout functionality

    const logoutHandler = (e) => {
        dispatch(userLogout());
        socket.current.emit("logout", myInfo.id);
    };

    // Use effect to send the message, store it to data base and then update the status of the message

    useEffect(() => {
        if (messageSendSuccess) {
            socket.current.emit("sendMessage", messages[messages.length - 1]);
            dispatch({
                type: UPDATE_FRIEND_MESSAGE,
                payload: {
                    messageInfo: messages[messages.length - 1],
                },
            });
            dispatch({
                type: MESSAGE_SEND_SUCCESS_CLEAR,
            });
        }
    }, [messageSendSuccess, messages, dispatch]);

    // Use effect to render friend list on left side

    useEffect(() => {
        if (authenticate) dispatch(getFriends());
        dispatch({
            type: NEW_USER_ADD_CLEAR,
        });
    }, [dispatch, authenticate, navigate, new_user_add]);

    // Use effect to auto select the first friend from the left side

    useEffect(() => {
        if (friends && friends.length > 0) {
            setCurrentFriend(friends[0].friendInfo);
        }
    }, [friends]);

    // Use effect to fetch the messages of the logged in User

    useEffect(() => {
        if (currentFriend) dispatch(getMessage(currentFriend._id));

        if (friends.length > 0) {
        }
    }, [currentFriend, currentFriend?._id, dispatch, friends.length]);

    useEffect(() => {
        if (messages.length > 0) {
            if (
                messages[messages.length - 1].senderId !== myInfo.id &&
                messages[messages.length - 1].status !== "seen"
            ) {
                dispatch({
                    type: UPDATE,
                    payload: {
                        id: currentFriend._id,
                    },
                });
                socket.current.emit("seen", {
                    senderId: currentFriend._id,
                    receiverId: myInfo.id,
                });
                dispatch(
                    seenMessage({
                        _id: messages[messages.length - 1]._id,
                    })
                );
            }
        }

        dispatch({
            type: MESSAGE_GET_SUCCESS_CLEAR,
        });
    }, [message_get_success, dispatch, messages, myInfo.id, currentFriend._id]);

    // Use Effect to scroll to the bottom after a new message!

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
            // console.log(scrollRef.current);
        }
    }, [messages]);

    // Use effect to connect to the socket server

    useEffect(() => {
        socket.current = io("ws://localhost:8000");
        socket.current.on("getMessage", (data) => {
            setSocketMessage(data);
        });

        socket.current.on("getTypingMessage", (data) => {
            setUserTyping(data);
        });

        socket.current.on("msgSeenResponse", (msg) => {
            dispatch({
                type: SEEN_MESSAGE,
                payload: {
                    messageInfo: msg,
                },
            });
        });

        socket.current.on("msgDeliveredResponse", (msg) => {
            dispatch({
                type: DELIVERED_MESSAGE,
                payload: {
                    messageInfo: msg,
                },
            });
        });

        socket.current.on("seenSuccess", (data) => {
            dispatch({
                type: SEEN_ALL,
                payload: data,
            });
        });
    }, [dispatch]);

    // Use effect to send data to the socket server

    useEffect(() => {
        socket.current.emit("addUser", myInfo.id, myInfo);
    }, [myInfo]);

    // Use effect to load the messages in real time from socket

    useEffect(() => {
        if (socketMessage) {
            dispatch({
                type: UPDATE_FRIEND_MESSAGE,
                payload: {
                    messageInfo: socketMessage,
                    status: "seen",
                },
            });
            if (currentFriend) {
                if (
                    socketMessage.senderId === currentFriend._id &&
                    socketMessage.receiverId === myInfo.id
                ) {
                    dispatch({
                        type: SOCKET_MESSAGE_SUCCESS,
                        payload: {
                            message: socketMessage,
                        },
                    });
                    dispatch(seenMessage(socketMessage));
                    socket.current.emit("seenMessage", socketMessage);
                }
            }
        }
        setSocketMessage("");
    }, [currentFriend, dispatch, myInfo.id, socketMessage]);

    // Use effect to get the active users data from socket server

    useEffect(() => {
        socket.current.on("getUser", (users) => {
            const filteredUsers = users.filter(
                (user) => user.userId !== myInfo.id
            );
            setActiveUsers(filteredUsers);
        });
        socket.current.on("new_user_add", (data) => {
            dispatch({
                type: NEW_USER_ADD,
                payload: {
                    new_user_add: data,
                },
            });
        });
    }, [myInfo, activeUsers, dispatch]);

    // Use effect to display React Toast Notifications

    useEffect(() => {
        if (
            socketMessage &&
            socketMessage.senderId !== currentFriend._id &&
            socketMessage.receiverId === myInfo.id
        ) {
            playNotificationSound();
            toast.success(`${socketMessage.senderName} sent a Message!`);
            dispatch(updateMessage(socketMessage));
            socket.current.emit("deliveredMessage", socketMessage);
            dispatch({
                type: UPDATE_FRIEND_MESSAGE,
                payload: {
                    messageInfo: socketMessage,
                    status: "delivered",
                },
            });
        }
    }, [
        currentFriend._id,
        myInfo.id,
        socketMessage,
        playNotificationSound,
        dispatch,
    ]);

    // Use effect to set the theme

    useEffect(() => {
        dispatch(getTheme());
    }, [dispatch, themeMode]);

    return (
        <div className={themeMode === "dark" ? "messenger theme" : "messenger"}>
            <Toaster
                position={"top-right"}
                reverseOrder={false}
                toastOptions={{
                    style: {
                        fontSize: "18px",
                    },
                }}
            />

            <div className="row">
                <div className="col-3">
                    <div className="left-side">
                        <div className="top">
                            <div className="image-name">
                                <div className="image">
                                    <img
                                        src={`/images/${myInfo.image}`}
                                        alt="Display"
                                    />
                                </div>
                                <div className="name">
                                    <h3> Hello {myInfo.username} </h3>
                                </div>
                            </div>

                            <div className="icons">
                                <div
                                    className="icon"
                                    onClick={() => {
                                        setHide((prevValue) => !prevValue);
                                    }}
                                >
                                    <FaEllipsisH />
                                </div>
                                {/* <div className="icon">
                                    <FaEdit />
                                </div> */}

                                <div
                                    className={
                                        hide
                                            ? "theme_logout"
                                            : "theme_logout show"
                                    }
                                >
                                    <h3>Dark Mode</h3>
                                    <div className="on">
                                        <label htmlFor="dark">ON</label>
                                        <input
                                            onChange={(e) => {
                                                dispatch(
                                                    setTheme(e.target.value)
                                                );
                                            }}
                                            type="radio"
                                            value="dark"
                                            name="theme"
                                            id="dark"
                                        />
                                    </div>
                                    <div className="of">
                                        <label htmlFor="white">OFF</label>
                                        <input
                                            onChange={(e) => {
                                                dispatch(
                                                    setTheme(e.target.value)
                                                );
                                            }}
                                            type="radio"
                                            value="white"
                                            name="theme"
                                            id="white"
                                        />
                                    </div>

                                    <div
                                        className="logout"
                                        onClick={logoutHandler}
                                    >
                                        <FaSignOutAlt /> Logout
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="friend-search">
                            <div className="search">
                                <button>
                                    <FaSistrix />
                                </button>
                                <input
                                    onChange={searchHandler}
                                    type="text"
                                    placeholder="Search"
                                    className="form-control"
                                />
                            </div>
                        </div>
                        {/* <div className="active-friends">
                            {activeUsers && activeUsers.length > 0
                                ? activeUsers.map((user) => (
                                      <ActiveFriend
                                          user={user}
                                          key={user.userId}
                                          setCurrentFriend={setCurrentFriend}
                                      />
                                  ))
                                : ""}
                        </div> */}

                        <div className="friends">
                            {friends.length > 0 &&
                                friends.map((friend) => {
                                    return (
                                        <div
                                            className={
                                                currentFriend._id ===
                                                friend.friendInfo._id
                                                    ? "hover-friend active"
                                                    : "hover-friend"
                                            }
                                            key={friend.friendInfo.email}
                                            onClick={() => {
                                                friendHandler(
                                                    friend.friendInfo
                                                );
                                            }}
                                        >
                                            <Friends
                                                key={friend.friendInfo._id}
                                                friends={friend}
                                                myInfo={myInfo}
                                                activeUsers={activeUsers}
                                            />
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>

                {currentFriend ? (
                    <RightSide
                        currentFriend={currentFriend}
                        inputHandler={inputHandler}
                        newMessage={newMessage}
                        sendMessage={sendMessage}
                        messages={messages}
                        scrollRef={scrollRef}
                        emojiSend={emojiSend}
                        imageSend={imageSend}
                        activeUsers={activeUsers}
                        userTyping={userTyping}
                    />
                ) : (
                    "Please select a contact"
                )}
            </div>
        </div>
    );
};

export default Messenger;
