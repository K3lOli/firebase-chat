import "./styles/App.css";
import { Auth } from "./components/auth";
import { AppWrapper } from "./components/AppWrapper";
import Cookies from "universal-cookie";
import { useState } from "react";
import { Chat } from "./components/chat";

const cookies = new Cookies(); // armazena os cookies do usuário autenticado
 // recupera o token de autenticação do usuário

function App() {
  const [isAuth, setIsAuth] = useState<boolean>(cookies.get("auth-token"));// estado que armazena se o usuário está autenticado ou não
  const [isInChat, setIsInChat] = useState<boolean | null>(null); // estado que armazena se o usuário está no chat ou não
  const [room, setRoom] = useState(""); // estado que armazena o nome da sala que o usuário está
  console.log("está logado",isAuth);

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
    <div style={{
      width: '100%'
    }}>
      <AppWrapper
        isAuth={isAuth}
        setIsAuth={setIsAuth}
        setIsInChat={setIsInChat}
      >
        {!isInChat ? ( // se o usuário não estiver no chat, exibe o componente de salas
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              marginBottom: "50px",
              alignItems: "center",
            }}
          >
            <label style={{ marginBottom: "10px" }}> Type room name </label>
            <input
              style={{
                marginBottom: "22px",
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
        ) : (
          <Chat room={room} />
        )}
      </AppWrapper>
    </div>
  );
}

export default App;
