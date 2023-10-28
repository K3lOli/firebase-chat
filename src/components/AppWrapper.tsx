import { auth } from "../firebase-config";
import { signOut } from "firebase/auth";
import Cookies from "universal-cookie";

const cookies = new Cookies();

interface AppWrapperProps {
  isAuth: boolean;
  setIsAuth: (isAuth: boolean) => void;
  setIsInChat: (isInChat: boolean) => void;
  children: React.ReactNode;
}
// função que recebe o estado de autenticação do usuário e retorna um componente
export const AppWrapper = ({
  children,
  isAuth,
  setIsAuth,
  setIsInChat,
}: AppWrapperProps) => {
  const signUserOut = async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    setIsAuth(false);
    setIsInChat(false);
  };

  return (
    <div
      style={{
        width: "80vw",
        height: "auto",
        gap: "10px",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        padding: "10px",
        borderRadius: "10px",
      }}
    >
      <div>
        <h1
          style={{
            color: "#e54d2e",
            textShadow: "2px 2px 10px #ce1e1e",
            height: "min-content",
            margin: "0",
          }}
        >
          FireChat
        </h1>
      </div>

      <div>{children}</div>
      {isAuth && (<div><button onClick={signUserOut}>Sign Out</button></div>)}
    </div>
  );
};
