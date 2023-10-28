import "./styles/App.css";
import { Auth } from "./components/auth";
import { AppWrapper } from "./components/AppWrapper";
import Cookies from "universal-cookie";
import { useState, useEffect } from "react";
import { Chat } from "./components/chat";
import {
  collection, // função que cria uma coleção no banco de dados
  addDoc, // função que adiciona um documento a uma coleção
  where, // função que filtra os documentos de uma coleção
  serverTimestamp, // função que retorna a data e hora do servidor
  onSnapshot, // função que retorna os dados de uma coleção
  query, // função que retorna os dados de uma coleção de acordo com o filtro passado como parâmetro
  orderBy,
  QueryDocumentSnapshot,
  DocumentData, // função que ordena os dados de uma coleção de acordo com o filtro passado como parâmetro
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase-config";

const cookies = new Cookies(); // armazena os cookies do usuário autenticado
// recupera o token de autenticação do usuário

function App() {
  const [isAuth, setIsAuth] = useState<boolean>(cookies.get("auth-token")); // estado que armazena se o usuário está autenticado ou não
  const [isInChat, setIsInChat] = useState<boolean | null>(null); // estado que armazena se o usuário está no chat ou não
  const [room, setRoom] = useState(""); // estado que armazena o nome da sala que o usuário está
  console.log("está logado", isAuth);
  const messagesRef = collection(db, "messages");

  const [rooms, setRooms] = useState<string[]>([]);
  console.log("room", rooms);

  console.log(rooms);
  useEffect(() => {
    const roomQuery = async () => {
      const querySnapshot = await getDocs(messagesRef);
      let rooms: string[] = [];
      querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        rooms.push(doc.data().room);
      });
      setRooms(rooms);
    };
    roomQuery();
  }, []);

  if (!isAuth) {
    // se o usuário não estiver autenticado, exibe o componente de autenticação
    return (
      <AppWrapper
        isAuth={isAuth}
        setIsAuth={setIsAuth}
        setIsInChat={setIsInChat}
      >
        <Auth setIsAuth={setIsAuth} />
      </AppWrapper>
    );
  }
  return (
    <div
      style={{
        width: "100%",
        position: "relative",
      }}
    >
      <AppWrapper
        isAuth={isAuth}
        setIsAuth={setIsAuth}
        setIsInChat={setIsInChat}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            // flexDirection: "column",
            marginBottom: "50px",
            alignItems: "start",
            height: "62vh"
          }}
        >
          <div
            style={{
              width: "40%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                marginBottom: "10px",
              }}
            >
              <label style={{ marginBottom: "3px" }}> Type room name </label>
              <input
                style={{
                  marginBottom: "10px",
                  borderRadius: "4px",
                  borderStyle: "none",
                  height: "30px",
                }}
                onChange={(e) => setRoom(e.target.value)}
              />
              <button
                onClick={() => {
                  setIsInChat(true);
                }}
                style={{
                  width: "max-content",
                }}
              >
                Enter Chat
              </button>
            </div>
            <div style={{
              display: "flex",
              flexDirection: "column",
              height: "50vh",
              overflowY: "scroll",
              overflowX: "hidden",
              scrollbarWidth: "thin"
            }}>
            {rooms.map((room) => {
              if (room !== "") {
                return (
                  <button
                    style={{
                      width: "100%",
                      marginBottom: "0px",
                      backgroundColor: "gray",
                      border: "2px solid black",
                      borderRight: "none",
                      borderLeft: "none",
                      borderBottom: "none",
                      borderRadius: "0px",
                    }}
                    onClick={() => {
                      setRoom(room);
                      setIsInChat(true);
                    }}
                  >
                    {room}
                  </button>
                );
              }
            })}
            </div>
          </div>
          {!isInChat ? ( // se o usuário não estiver no chat, exibe o componente de salas
            <div>
              <h1>Choose a room</h1>
            </div>
          ) : (
            <Chat room={room} />
          )}
        </div>
      </AppWrapper>
    </div>
  );
}

export default App;
