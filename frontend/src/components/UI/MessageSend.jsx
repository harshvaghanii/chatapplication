import React from "react";
import {
    FaPlusCircle,
    FaFileImage,
    FaGift,
    FaPaperPlane,
} from "react-icons/fa";

const MessageSend = ({
    newMessage,
    inputHandler,
    sendMessage,
    emojiSend,
    imageSend,
}) => {
    const emojis = [
        "😀",
        "😃",
        "😄",
        "😁",
        "😆",
        "😅",
        "😂",
        "🤣",
        "😊",
        "😇",
        "🙂",
        "🙃",
        "😉",
        "😌",
        "😍",
        "😝",
        "😜",
        "🧐",
        "🤓",
        "😎",
        "😕",
        "🤑",
        "🥴",
        "😱",
    ];

    return (
        <div className="message-send-section">
            <input type="checkbox" id="emoji" />
            <div className="file hover-attachment">
                <div className="add-attachment">Add Attachment</div>
                <FaPlusCircle />
            </div>

            <div className="file hover-image">
                <div className="add-image">Add Image</div>
                <input
                    type="file"
                    name=""
                    id="pic"
                    className="form-control"
                    onChange={imageSend}
                />
                <label htmlFor="pic">
                    <FaFileImage />
                </label>
            </div>

            <div className="file hover-gift">
                <div className="add-gift">Add gift</div>
                <FaGift />
            </div>

            <div className="message-type">
                <input
                    type="text"
                    name="message"
                    id="message"
                    placeholder="Aa"
                    className="form-control"
                    autoFocus
                    value={newMessage}
                    onChange={inputHandler}
                />

                <div className="file hover-gift">
                    <label htmlFor="emoji">
                        <FaPaperPlane />
                    </label>
                </div>
            </div>

            <div type="submit" className="file" onClick={sendMessage}>
                ❤
            </div>

            <div className="emoji-section">
                <div className="emoji">
                    {emojis.map((e) => (
                        <span
                            key={Math.random() * 100}
                            onClick={() => emojiSend(e)}
                        >
                            {e}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MessageSend;
