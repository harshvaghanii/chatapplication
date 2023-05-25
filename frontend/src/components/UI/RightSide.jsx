import React from "react";
import { FaPhoneAlt, FaVideo, FaRocketchat } from "react-icons/fa";
import Message from "./Message";
import MessageSend from "./MessageSend";
import FriendInfo from "./FriendInfo";

const RightSide = ({
    currentFriend,
    newMessage,
    inputHandler,
    sendMessage,
    messages,
    scrollRef,
    emojiSend,
    imageSend,
    activeUsers,
    userTyping,
}) => {
    return (
        <div className="col-9">
            <div className="right-side">
                <input type="checkbox" id="dot" />
                <div className="row">
                    <div className="col-8">
                        <div className="message-send-show">
                            <div className="header">
                                <div className="image-name">
                                    <div className="image">
                                        <img
                                            src={`./images/${currentFriend.image}`}
                                            alt=""
                                        />

                                        {activeUsers &&
                                        activeUsers.length > 0 &&
                                        activeUsers.some(
                                            (user) =>
                                                user.userId ===
                                                currentFriend._id
                                        ) ? (
                                            <div className="active-icon"></div>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                    <div className="name">
                                        <h3>{currentFriend.username}</h3>
                                    </div>
                                </div>

                                <div className="icons">
                                    <div className="icon">
                                        <FaPhoneAlt />
                                    </div>

                                    <div className="icon">
                                        <FaVideo />
                                    </div>

                                    <div className="icon">
                                        <label htmlFor="dot">
                                            <FaRocketchat />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <Message
                                messages={messages}
                                currentFriend={currentFriend}
                                scrollRef={scrollRef}
                                userTyping={userTyping}
                            />
                            <MessageSend
                                newMessage={newMessage}
                                inputHandler={inputHandler}
                                sendMessage={sendMessage}
                                emojiSend={emojiSend}
                                imageSend={imageSend}
                            />
                        </div>
                    </div>
                    <div className="col-4">
                        <FriendInfo
                            currentFriend={currentFriend}
                            activeUsers={activeUsers}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RightSide;
