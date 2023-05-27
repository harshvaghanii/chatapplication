import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
const Message = ({ messages, currentFriend, scrollRef, userTyping }) => {
    const { myInfo } = useSelector((state) => state.auth);
    return (
        <Fragment>
            <div className="message-show">
                {messages.length === 0 && (
                    <div className="friend_connect">
                        <img src={`/images/${currentFriend.image}`} alt="" />
                        <h3>{currentFriend.username} joined!</h3>
                        <span>
                            {moment(currentFriend.createdAt)
                                .startOf("mini")
                                .fromNow()}
                        </span>
                    </div>
                )}

                {messages &&
                    messages.map((message) => {
                        return message.senderId === myInfo.id ? (
                            <div
                                className="my-message"
                                ref={scrollRef}
                                key={message.createdAt}
                            >
                                <div className="image-message">
                                    <div className="my-text">
                                        <p className="message-text">
                                            {message.message.text === "" ? (
                                                <img
                                                    src={`./images/${message.message.image}`}
                                                    alt="Sent"
                                                />
                                            ) : (
                                                message.message.text
                                            )}
                                        </p>
                                    </div>
                                </div>
                                {/* <div className="time">{message.createdAt}</div> */}
                                <div className="time">
                                    {moment(message.createdAt)
                                        .startOf("mini")
                                        .fromNow()}
                                </div>
                            </div>
                        ) : (
                            <div
                                className="fd-message"
                                ref={scrollRef}
                                key={message.createdAt}
                            >
                                <div className="image-message-time">
                                    <img
                                        src={`/images/${currentFriend.image}`}
                                        alt=""
                                    />
                                    <div className="message-time">
                                        <div className="fd-text">
                                            <p className="message-text">
                                                {message.message.text === "" ? (
                                                    <img
                                                        src={`./images/${message.message.image}`}
                                                        alt="Sent"
                                                    />
                                                ) : (
                                                    message.message.text
                                                )}
                                            </p>
                                        </div>
                                        <div className="time">
                                            {moment(message.createdAt)
                                                .startOf("mini")
                                                .fromNow()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>

            {userTyping &&
            userTyping.message !== "" &&
            userTyping.senderId === currentFriend._id ? (
                <div className="typing-message">
                    <div className="fd-message" ref={scrollRef}>
                        <div className="image-message-time">
                            <img
                                src={`/images/${currentFriend.image}`}
                                alt=""
                            />
                            <div className="message-time">
                                <div className="fd-text">
                                    <p className="time">Typing...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                ""
            )}
        </Fragment>
    );
};

export default Message;
