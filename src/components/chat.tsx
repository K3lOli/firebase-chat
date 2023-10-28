import { db, auth } from "../firebase-config";
import { useEffect, useState } from "react";
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

//documento é uma unidade básica de dados no Cloud Firestore.
//Isso significa que o Cloud Firestore armazena dados em documentos,
//que são armazenados em coleções. Os documentos contêm pares de valores-chave
//e podem conter coleções de seus próprios subdocumentos e assim por diante.

interface ChatProps {
  room: string;
}

interface Messages {
  id: string;
  text: string;
  createdAt: Date;
  user: string;
}

export function Chat({ room }: ChatProps) {
  const [messages, setMessages] = useState<Messages[]>([]); // estado que armazena as mensagens da sala
  const [newMessage, setNewMessage] = useState(""); // estado que armazena a nova mensagem a ser enviada
  const messagesRef = collection(db, "messages"); // referência da coleção de mensagens
  
  const [rooms, setRooms] = useState<string[]>(['vazio']);
  console.log('room',rooms)

  console.log(rooms)
  const roomQuery = async() =>{
    const querySnapshot = await getDocs(messagesRef);
    let rooms: string[] = [];
    querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      rooms.push(doc.data().room);
    });
    setRooms(rooms);
  }
  roomQuery();
  

  useEffect(() => {
    

    const queryMessages = query(
      messagesRef,
      where("room", "==", room),
      orderBy("createdAt")
    );
    const unsuscribe = onSnapshot(queryMessages, (querySnapshot) => {
      let messages: Messages[] = [];
      querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        messages.push({
          ...doc.data(),
          id: doc.id,
        } as Messages);
      });
      console.log(messages);
      setMessages(messages);
    });

    return () => unsuscribe(); // retorna a função de cancelamento da inscrição
  }, [room]); // executa a função apenas uma vez


  const handleSubmit = async (e: any) => {
    e.preventDefault(); // previne o comportamento padrão do formulário

    if (newMessage === "") return; // se a mensagem estiver vazia, não faz nada
    await addDoc(messagesRef, {
      // adiciona um documento a coleção de mensagens
      text: newMessage, // texto da mensagem
      createdAt: serverTimestamp(), // data e hora do servidor
      user: auth.currentUser?.displayName, // nome do usuário
      room, // nome da sala
    });

    setNewMessage(""); // limpa o estado de nova mensagem
  };
  return (
    <div style={{}}>
      <div>
        <div>
          <h2>Bem vindo a sala: {room}</h2>
        </div>
        <div>{/* <button>Leave Room</button> */}</div>
      </div>
      <div
        style={{
          // backgroundColor: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "-moz-initial",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "10px",
          height: "55vh",
          width: "50vw",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "center",
            // marginBottom: "50px",
            height: "80vh",
            overflowY: "scroll",
            gap: "10px",
          }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                justifyContent: "start",
                alignItems: "start",
              }}
            >
              <div>
                <h5
                  style={{
                    width: "103px",
                    textAlign: "start",
                  }}
                >
                  {message.user}:
                </h5>
              </div>

              <div
                style={{
                  maxWidth: "220px",
                  backgroundColor: "rgba(186, 39, 127, 0.5)",
                  borderRadius: "10px",
                  height: "min-content",
                  display: "flex",
                  textAlign: "start",
                }}
              >
                <h5
                  style={{
                    padding: "10px",
                    margin: "0px",
                    color: "white",
                    width: "100%",
                    textAlign: "start",
                  }}
                >
                  {message.text}
                </h5>
              </div>
            </div>
          ))}
        </div>
        <div>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              alignItems: "center",
              width: "50vw",
              borderRadius: "10px",
            }}
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={{
                height: "30px",
                width: "50vw",
                borderStyle: "none",
              }}
            />
            <button
              type="submit"
              style={{
                height: "32px",
                display: "flex",
                alignItems: "center",
                borderRadius: "0px",
                borderStyle: "none",
              }}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
