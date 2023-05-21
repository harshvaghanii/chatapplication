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
} from "../../store/actions/messengerActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
const Messenger = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const scrollRef = useRef();
    const socket = useRef();
    const { authenticate } = useSelector((state) => state.auth);
    const { friends, messages } = useSelector((state) => state.messenger);
    const { myInfo } = useSelector((state) => state.auth);

    const [currentFriend, setCurrentFriend] = useState("");
    const friendHandler = (friend) => {
        setCurrentFriend(friend);
    };

    const [newMessage, setNewMessage] = useState("");
    const [activeUsers, setActiveUsers] = useState([]);
    const inputHandler = (e) => {
        setNewMessage(e.target.value);
    };

    // Functions for sending messages

    const sendMessage = (e) => {
        e.preventDefault();

        const data = {
            senderName: myInfo.username,
            receiverId: currentFriend._id,
            message: newMessage ? newMessage : "❤",
        };
        dispatch(messageSend(data));
        setNewMessage("");
    };

    const emojiSend = (e) => {
        setNewMessage((prevMessage) => `${prevMessage}${e}`);
    };

    const imageSend = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const imageName = e.target.files[0].name;
            const newImageName =
                Date.now() + imageName.trim().replaceAll(/\s/g, "");

            const formData = new FormData();
            formData.append("senderName", myInfo.username);
            formData.append("receiverId", currentFriend._id);
            formData.append("image", e.target.files[0]);
            formData.append("imagename", newImageName);

            dispatch(imageMessageSend(formData));
        }
    };

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
            setCurrentFriend(friends[0]);
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
    }, []);

    // Use effect to send data to the socket server

    useEffect(() => {
        socket.current.emit("addUser", myInfo.id, myInfo);
    }, [myInfo]);

    // Use effect to get the active users data from socket server

    useEffect(() => {
        socket.current.on("getUser", (users) => {
            const filteredUsers = users.filter(
                (user) => user.userId !== myInfo.id
            );
            setActiveUsers(filteredUsers);
        });
    }, [myInfo, activeUsers]);

    return (
        <div className="messenger">
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
                                                currentFriend._id === friend._id
                                                    ? "hover-friend active"
                                                    : "hover-friend "
                                            }
                                            key={friend.email}
                                            onClick={() => {
                                                friendHandler(friend);
                                            }}
                                        >
                                            <Friends
                                                key={friend._id}
                                                username={friend.username}
                                                image={friend.image}
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
                    />
                ) : (
                    "Please select a contact"
                )}
            </div>
        </div>
    );
};

export default Messenger;
