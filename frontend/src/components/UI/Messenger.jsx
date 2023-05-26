import React, { useEffect, useRef, useState } from "react";
import { FaEllipsisH, FaEdit, FaSistrix } from "react-icons/fa";
import ActiveFriend from "./ActiveFriend";
import Friends from "./Friends";
import RightSide from "./RightSide";
import {
    getFriends,
    messageSend,
    getMessage,
    imageMessageSend,
    seenMessage,
} from "../../store/actions/messengerActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import {
    SOCKET_MESSAGE_SUCCESS,
    UPDATE_FRIEND_MESSAGE,
    MESSAGE_SEND_SUCCESS_CLEAR,
} from "../../store/types/messengerTypes";
import toast, { Toaster } from "react-hot-toast";
import useSound from "use-sound";
import notificationSound from "../../audio/notifications.mp3";
// import messageSound from "../../audio/sendmessage.mp3";
// End of imports

// To-Do
// 1. Trim the sendMessage sound

const Messenger = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const scrollRef = useRef();
    const socket = useRef();
    const { authenticate } = useSelector((state) => state.auth);
    const { friends, messages, messageSendSuccess } = useSelector(
        (state) => state.messenger
    );
    const { myInfo } = useSelector((state) => state.auth);

    const [currentFriend, setCurrentFriend] = useState("");
    const friendHandler = (friend) => {
        setCurrentFriend(friend);
    };

    const [newMessage, setNewMessage] = useState("");
    const [socketMessage, setSocketMessage] = useState("");
    const [activeUsers, setActiveUsers] = useState([]);
    const [userTyping, setUserTyping] = useState({});
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
        if (!authenticate) {
            navigate("/messenger/login");
        }
        if (authenticate) dispatch(getFriends());
    }, [dispatch, authenticate, navigate]);

    // Use effect to auto select the first friend from the left side

    useEffect(() => {
        if (friends && friends.length > 0) {
            setCurrentFriend(friends[0].friendInfo);
        }
    }, [friends]);

    // Use effect to fetch the messages of the logged in User

    useEffect(() => {
        if (currentFriend) dispatch(getMessage(currentFriend._id));
    }, [currentFriend, currentFriend?._id, dispatch]);

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
    }, []);

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
                },
            });
            dispatch(seenMessage(socketMessage));
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
    }, [myInfo, activeUsers]);

    // Use effect to display React Toast Notifications

    useEffect(() => {
        if (
            socketMessage &&
            socketMessage.senderId !== currentFriend._id &&
            socketMessage.receiverId === myInfo.id
        ) {
            playNotificationSound();
            toast.success(`${socketMessage.senderName} sent a Message!`);
        }
    }, [currentFriend._id, myInfo.id, socketMessage, playNotificationSound]);

    return (
        <div className="messenger">
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
                                <div className="icon">
                                    <FaEllipsisH />
                                </div>
                                <div className="icon">
                                    <FaEdit />
                                </div>
                            </div>
                        </div>

                        <div className="friend-search">
                            <div className="search">
                                <button>
                                    <FaSistrix />
                                </button>
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="form-control"
                                />
                            </div>
                        </div>
                        <div className="active-friends">
                            {activeUsers && activeUsers.length > 0
                                ? activeUsers.map((user) => (
                                      <ActiveFriend
                                          user={user}
                                          key={user.userId}
                                          setCurrentFriend={setCurrentFriend}
                                      />
                                  ))
                                : ""}
                        </div>

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
