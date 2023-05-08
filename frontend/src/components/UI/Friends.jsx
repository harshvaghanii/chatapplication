import React from "react";

const Friends = ({ username, image }) => {
    return (
        <div className="friend">
            <div className="friend-image">
                <div className="image">
                    <img src={`/images/${image}`} alt="" />
                </div>
            </div>

            <div className="friend-name-seen">
                <div className="friend-name">
                    <h4>{username}</h4>
                </div>
            </div>
        </div>
    );
};

export default Friends;
