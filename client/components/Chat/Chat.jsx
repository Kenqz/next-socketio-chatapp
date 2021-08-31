import React from 'react';
import style from './chat.module.scss';
import {BsBoxArrowRight} from 'react-icons/bs';
import {HiStatusOnline} from 'react-icons/hi';
import {useState , useEffect} from 'react';
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({socket , username , room , chat}) {
    const [currentMessage , setCurrentMessage] = useState("");
    const [messageList , setMessageList] = useState([]);

    const sendmessages = async () => {
        if(currentMessage !== "") {
            const messagedata = {
                room : room,
                author: username,
                message: currentMessage,
                time: 
                new Date(Date.now()).getHours() 
                + ":" +
                new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send_message", messagedata);
            setMessageList((list) => [...list, messagedata]);
            setCurrentMessage("");
        }
    };
    
    const leaveroom = async () => {
        if(room != "") {
            socket.emit("leave_room", room);
            chat(false);
        }
    }

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list)=> [...list , data]);
        })
    }, [socket])

    return (
        <>
            <div className ={style.maindiv}>
                <div className={style.heading}>
                    <h1>Live chat</h1>
                </div>
                <div className={style.online}>
                    <span>{username}</span><HiStatusOnline className={style.icon}/>
                </div>
                <div className={style.chatbody}>
                <ScrollToBottom className={style.chatbody}>
                    {messageList.map((messageContent)=> {
                          return (
                            <div
                              className={style.message}
                            >
                                <div className={style.messagecontent}>
                                    <p>{messageContent.message}</p>
                                </div>
                                <div className={style.messagefooter}>
                                    <p>{messageContent.author}</p>
                                    <p>Time: {messageContent.time}</p>
                                </div>

                            </div>
                          );
                        })}
                        </ScrollToBottom>
                </div>
                <div className={style.chatfooter}>
                    <input 
                        type="text"
                        value={currentMessage} 
                        placeholder="Send a message..."
                        className={style.sendinput}
                        onChange={(event) => {
                            setCurrentMessage(event.target.value);
                        }}
                        onKeyPress={(event) => {
                            event.key === "Enter" && sendmessages();
                        }}
                    />
                    <button onClick={sendmessages} className={style.send}><span><BsBoxArrowRight size={20}/></span></button>
                </div>
            </div>
            <div className={style.leavediv}>
                <button className={style.leave} onClick={leaveroom}>Leave room</button>
            </div>
        </>
    )
}

export default Chat
