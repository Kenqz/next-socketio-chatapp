import io from 'socket.io-client';
import {useState} from 'react';
import Chat from '../components/Chat/Chat.jsx';
import style from '../styles/Home.module.scss';

const socket = io.connect("http://localhost:3001")

export default function Home() {
  const [username, setUsername] = useState("");
  const [room , setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);


  const joinRoom = () => {
    if(username !== "" && room != "") {
      socket.emit("join_room", room);
      setShowChat(true);

    }
    else {
      alert("Empty input")
    }
  };
 
  return (
    <>
    {!showChat ? (
    <div className={style.maindiv}>
          <h1 className={style.header}>Join to chat</h1>
          <input 
          type="text" 
          placeholder="Username..."
          className={style.input}
          onChange={(event)=> {
            setUsername(event.target.value)
          }}
          />
          <input 
          type="text" 
          placeholder="ID.."
          className={style.input}
          onChange={(event) => {
            setRoom(event.target.value)
          }}
          />
          <div className={style.buttondiv}>
          <button onClick={joinRoom} className={style.button}>Join</button>
          
          </div>
          
    </div>
    ):
    (
      <Chat socket={socket} username={username} room={room} chat={setShowChat}/>
    )}
    </>
  )
}
