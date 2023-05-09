import React, { useEffect, useState } from "react";
import { FaEllipsisH, FaEdit, FaSistrix } from "react-icons/fa";
import ActiveFriend from "./ActiveFriend";
import Friends from "./Friends";
import RightSide from "./RightSide";
import { getFriends, messageSend } from "../../store/actions/messengerActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Messenger = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { authenticate } = useSelector((state) => state.auth);
    const { friends } = useSelector((state) => state.messenger);
    const { myInfo } = useSelector((state) => state.auth);

    const [currentFriend, setCurrentFriend] = useState("");
    const friendHandler = (friend) => {
        setCurrentFriend(friend);
    };

    const [newMessage, setNewMessage] = useState("");

    const inputHandler = (e) => {
        setNewMessage(e.target.value);
    };

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

    // Use effect to render friend list on left side

    useEffect(() => {
        if (authenticate) dispatch(getFriends());
        if (!authenticate) {
            navigate("/messenger/login");
        }
    }, [dispatch, authenticate, navigate]);

    // Use effect to auto select the first friend from the left side

    useEffect(() => {
        if (friends && friends.length > 0) {
            setCurrentFriend(friends[0]);
        }
    }, [friends]);

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
                            <ActiveFriend />
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
                    />
                ) : (
                    "Please select a contact"
                )}
            </div>
        </div>
    );
};

export default Messenger;
