import React from "react";
import moment from "moment";
const Friends = (props) => {
    const { friendInfo, messageInfo } = props.friends;
    const { username, image } = friendInfo;
    const myInfo = props.myInfo;
    return (
        <div className="friend">
            <div className="friend-image">
                <div className="image">
                    <img src={`/images/${image}`} alt="Display" />
                </div>
            </div>

            <div className="friend-name-seen">
                <div className="friend-name">
                    <h4>{username}</h4>
                    <div className="msg-time">
                        {messageInfo && messageInfo.senderId === myInfo.id ? (
                            <span>You: </span>
                        ) : (
                            <span>{username + ": "}</span>
                        )}
                        {messageInfo && messageInfo.message.text ? (
                            <span>
                                {messageInfo.message.text.slice(0, 10) + "- "}
                            </span>
                        ) : messageInfo && messageInfo.message.image ? (
                            <span>Sent an image - </span>
                        ) : (
                            <></>
                        )}
                        <span>
                            {messageInfo &&
                                moment(messageInfo.createdAt)
                                    .startOf("mini")
                                    .fromNow()}
                        </span>
                    </div>
                </div>
                {myInfo.id === messageInfo?.senderId ? (
                    <div className="seen-unseen-icon">
                        <img src={`/images/${image}`} alt="" />
                    </div>
                ) : (
                    <div className="seen-unseen-icon">
                        <div className="seen-icon"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Friends;
