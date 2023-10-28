import { auth, provider } from "../firebase-config";
import { signInWithPopup } from "firebase/auth";
import Cookies from "universal-cookie";

const cookies = new Cookies(); // armazena os cookies do usuário autenticado

interface AuthProps {
  setIsAuth: (isAuth: boolean) => void;
}

// função que recebe o estado de autenticação do usuário e retorna um componente
export const Auth = ({ setIsAuth }: AuthProps) => {
  // função que realiza a autenticação do usuário com o google
  const singInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      // armazena o token de autenticação do usuário
      cookies.set("auth-token", result.user.refreshToken);
      // altera o estado de autenticação do usuário
      setIsAuth(true);
    } catch (error) {
      // caso ocorra algum erro, exibe no console
      console.log(error);
    }
  };
  return (
    <div>
      <p>Sing In With Google To Continue</p>
      <button onClick={singInWithGoogle} style={{
        backgroundColor: "#f0f0f0",
        color: "#e54d2e",
      }}>
        Sing In With Google{" "}
      </button>
    </div>
  );
};
