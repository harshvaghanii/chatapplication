import React from "react";
import { useSelector } from "react-redux";

const Message = ({ messages, currentFriend, scrollRef }) => {
    const { myInfo } = useSelector((state) => state.auth);
    return (
        <div className="message-show">
            {messages &&
                messages.map((message) => {
                    return message.senderId === myInfo.id ? (
                        <div className="my-message" ref={scrollRef}>
                            <div className="image-message">
                                <div className="my-text">
                                    <p className="message-text">
                                        {message.message.text}
                                    </p>
                                </div>
                            </div>
                            <div className="time">{message.createdAt}</div>
                        </div>
                    ) : (
                        <div className="fd-message" ref={scrollRef}>
                            <div className="image-message-time">
                                <img
                                    src={`/images/${currentFriend.image}`}
                                    alt=""
                                />
                                <div className="message-time">
                                    <div className="fd-text">
                                        <p className="message-text">
                                            {message.message.text}
                                        </p>
                                    </div>
                                    <div className="time">
                                        {message.createdAt}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

            {/* <div className="my-message">
                <div className="image-message">
                    <div className="my-text">
                        <p className="message-text"> How Are You? </p>
                    </div>
                </div>
                <div className="time">2 Jan 2022</div>
            </div>

            <div className="fd-message">
                <div className="image-message-time">
                    <img src="/images/harsh_vaghani.jpg" alt="" />
                    <div className="message-time">
                        <div className="fd-text">
                            <p className="message-text">I am Fine </p>
                        </div>
                        <div className="time">3 Jan 2022</div>
                    </div>
                </div>
            </div> */}
        </div>
    );
};

export default Message;
