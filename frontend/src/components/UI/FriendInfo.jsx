import React from "react";
import { FaCaretSquareDown } from "react-icons/fa";

const FriendInfo = ({ currentFriend, activeUsers, messages }) => {
    return (
        <div className="friend-info">
            <input type="checkbox" id="gallery" />
            <div className="image-name">
                <div className="image">
                    <img src={`./images/${currentFriend.image}`} alt="" />
                </div>
                {activeUsers &&
                activeUsers.length > 0 &&
                activeUsers.some(
                    (user) => user.userId === currentFriend._id
                ) ? (
                    <div className="active-user">Active</div>
                ) : (
                    <>Away</>
                )}

                <div className="name">
                    <h4>{currentFriend.username}</h4>
                </div>
            </div>

            <div className="others">
                <div className="custom-chat">
                    <h3>Customize Chat </h3>
                    <FaCaretSquareDown />
                </div>

                <div className="privacy">
                    <h3>Privacy and Support </h3>
                    <FaCaretSquareDown />
                </div>

                <div className="media">
                    <h3>Shared Media</h3>
                    <label htmlFor="gallery">
                        <FaCaretSquareDown />
                    </label>
                </div>
            </div>

            <div className="gallery">
                {messages && messages.length > 0
                    ? messages.map(
                          (message, index) =>
                              message.message.image && (
                                  <img
                                      alt="shared media"
                                      key={index}
                                      src={`./images/${message.message.image}`}
                                  />
                              )
                      )
                    : ""}

                {/* <img src="/images/harsh_vaghani.jpg" alt="" />
                <img src="/images/harsh_vaghani.jpg" alt="" />
                <img src="/images/harsh_vaghani.jpg" alt="" />
                <img src="/images/harsh_vaghani.jpg" alt="" /> */}
            </div>
        </div>
    );
};

export default FriendInfo;
