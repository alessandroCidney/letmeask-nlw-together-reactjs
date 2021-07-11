import { createContext, useState, useEffect, ReactNode } from 'react';

import { firebase, auth } from '../services/firebase';

type User = {
  id: string;
  name: string;
  avatar: string; 
}

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
}

type AuthContextProviderProps = {
	children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {

	const [user, setUser] = useState<User>();

	useEffect(() => {
	    // A função detecta se algum usuário já havia autenticado (Event Listener)
	    // Se sim, ela retorna as informações dele e executa o restante da função
	    const unsubscribe = auth.onAuthStateChanged(user => {
	      if(user) {
	      	const { displayName, photoURL, uid } = user

		      if(!displayName || !photoURL) {
		        throw new Error('Missing information from Google Account')
		      }

		      setUser({
		        id: uid,
		        name: displayName,
		        avatar: photoURL
		      })
	      }
	    })

	    // O Event Listener foi armazenado em uma variável unsubscribe, que serve para desligá-lo

	    // Retorno de uma função para descadastrar o usuário de todos os Event Listener

	    return () => {
	      unsubscribe();
	    }
	  }, [])


	  async function signInWithGoogle() {
	    const provider = new firebase.auth.GoogleAuthProvider()

	    const result = await auth.signInWithPopup(provider)

	    if(result.user) {
	      const { displayName, photoURL, uid } = result.user

	      if(!displayName || !photoURL) {
	        throw new Error('Missing information from Google Account')
	      }

	      setUser({
	        id: uid,
	        name: displayName,
	        avatar: photoURL
	      })
	    }
	}

	return (
		<AuthContext.Provider value={{ user, signInWithGoogle }}>
			{props.children}
		</AuthContext.Provider>  
	);
}