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
  if (!isAuth) {
    return (
      <div>
        <div
          style={{
            width: "300px",
            height: "300px",
            gap: "10px",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgba(255, 255, 255, 0)",
            border: "1px solid #ebe0de",
            padding: "20px 0px 20px 0px",
            borderRadius: "10px",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h1
              style={{
                color: "#e54d2e",
                filter: "drop-shadow(2px 2px 10px #ce1e1e)",
                height: "min-content",
                margin: "0",
              }}
            >
              FireChat
            </h1>
          </div>

          <div>{children}</div>
          {isAuth && (
            <div>
              <button onClick={signUserOut}>Sign Out</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "80vw",
        height: "auto",
        gap: "10px",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        padding: "10px",
        borderRadius: "10px",
        filter: "drop-shadow(2px 4px 37px white)"
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
      {isAuth && (
        <div>
          <button onClick={signUserOut} style={{
            position: "absolute",
            left: "0px",
            top: "0px",
          }}>Sign Out</button>
        </div>
      )}
    </div>
  );
};
