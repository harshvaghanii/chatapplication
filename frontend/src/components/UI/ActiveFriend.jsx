import React from "react";

const ActiveFriend = ({ user, setCurrentFriend }) => {
    return user.userInfo !== "" ? (
        <div
            className="active-friend"
            onClick={() => {
                setCurrentFriend({
                    _id: user.userId,
                    email: user.userInfo.email,
                    image: user.userInfo.image,
                    username: user.userInfo.username,
                });
            }}
        >
            <div className="image-active-icon">
                <div className="image">
                    <img src={`/images/${user.userInfo.image}`} alt="Display" />
                    {/* <div className="active-icon"></div> */}
                </div>
            </div>
        </div>
    ) : (
        <></>
    );
};

export default ActiveFriend;
