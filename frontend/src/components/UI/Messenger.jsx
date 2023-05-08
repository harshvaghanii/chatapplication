import React, { useEffect } from "react";
import { FaEllipsisH, FaEdit, FaSistrix } from "react-icons/fa";
import ActiveFriend from "./ActiveFriend";
import Friends from "./Friends";
import RightSide from "./RightSide";
import { getFriends } from "../../store/actions/messengerActions";
import { useDispatch, useSelector } from "react-redux";

const Messenger = () => {
    const dispatch = useDispatch();
    const { authenticate } = useSelector((state) => state.auth);
    useEffect(() => {
        if (authenticate) dispatch(getFriends());
    }, [dispatch]);

    const { friends } = useSelector((state) => state.messenger);
    const { myInfo } = useSelector((state) => state.auth);

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
                                            className="hover-friend"
                                            key={friend.email}
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

                <RightSide />
            </div>
        </div>
    );
};

export default Messenger;
