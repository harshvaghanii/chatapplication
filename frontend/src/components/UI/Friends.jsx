import React from "react";
import moment from "moment";
import { FaRegCheckCircle } from "react-icons/fa";
const Friends = (props) => {
    const { friendInfo, messageInfo } = props.friends;
    const { username, image } = friendInfo;
    const myInfo = props.myInfo;
    const { activeUsers } = props;
    return (
        <div className="friend">
            <div className="friend-image">
                <div className="image">
                    <img src={`/images/${image}`} alt="Display" />
                    {activeUsers &&
                        activeUsers.length > 0 &&
                        activeUsers.some(
                            (user) => user.userId === friendInfo._id
                        ) && <div className="active_icon"></div>}
                </div>
            </div>

            <div className="friend-name-seen">
                <div className="friend-name">
                    <h4
                        className={
                            messageInfo?.senderId !== myInfo.id &&
                            messageInfo?.status !== undefined &&
                            messageInfo?.status !== "seen"
                                ? "unseen_message"
                                : ""
                        }
                    >
                        {username}
                    </h4>

                    <div className="msg-time">
                        {messageInfo && messageInfo.senderId === myInfo.id ? (
                            <span
                                className={
                                    messageInfo?.senderId !== myInfo.id &&
                                    messageInfo?.status !== undefined &&
                                    messageInfo?.status !== "seen"
                                        ? "unseen_message"
                                        : ""
                                }
                            >
                                You:{" "}
                            </span>
                        ) : (
                            <span
                                className={
                                    messageInfo?.senderId !== myInfo.id &&
                                    messageInfo?.status !== undefined &&
                                    messageInfo?.status !== "seen"
                                        ? "unseen_message"
                                        : ""
                                }
                            >
                                {username + ": "}
                            </span>
                        )}
                        {messageInfo && messageInfo.message.text ? (
                            <span
                                className={
                                    messageInfo?.senderId !== myInfo.id &&
                                    messageInfo?.status !== undefined &&
                                    messageInfo?.status !== "seen"
                                        ? "unseen_message"
                                        : ""
                                }
                            >
                                {messageInfo.message.text.slice(0, 10) + "- "}
                            </span>
                        ) : messageInfo && messageInfo.message.image ? (
                            <span
                                className={
                                    messageInfo?.senderId !== myInfo.id &&
                                    messageInfo?.status !== undefined &&
                                    messageInfo?.status !== "seen"
                                        ? "unseen_message"
                                        : ""
                                }
                            >
                                Sent an image -{" "}
                            </span>
                        ) : (
                            <></>
                        )}
                        <span>
                            {messageInfo &&
                                moment(messageInfo.createdAt)
                                    .startOf("mini")
                                    .fromNow()}
                        </span>
                        {!messageInfo && <></>}
                    </div>
                </div>
                {myInfo.id === messageInfo?.senderId ? (
                    <div className="seen-unseen-icon">
                        {messageInfo.status === "seen" ? (
                            <img src={`/images/${image}`} alt="" />
                        ) : messageInfo.status === "delivered" ? (
                            <div className="delivared">
                                <FaRegCheckCircle />
                            </div>
                        ) : (
                            <div className="unseen"></div>
                        )}
                    </div>
                ) : (
                    <div className="seen-unseen-icon">
                        {messageInfo?.status !== undefined &&
                        messageInfo?.status !== "seen" ? (
                            <div className="seen-icon"></div>
                        ) : (
                            <></>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Friends;
