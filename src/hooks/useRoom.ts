import { useEffect, useState } from 'react';

import { database } from '../services/firebase';

import { useAuth } from './useAuth';

// Tipagem para as questões retornadas pelo firebase
// As questions são um OBJETO cuja CHAVE é uma STRING e cujo VALOR é um outro OBJETO

// Para declarar a tipagem de um objeto, no TypeScript, usamos o Record

// Exemplo: Record<Tipo da Chave, Tipo do Valor>

// Utilizamos o Record, principalmente, quando não sabemos quais os campos do objeto

type FirebaseQuestions = Record<string, {
	author: {
		name: string;
		avatar: string;
	}
	content: string;
	isAnswered: boolean;
	isHighLighted: boolean;
	likes: Record<string, {
		authorId: string;
	}>;
}>;

type QuestionType = {
	id: string;
	author: {
		name: string;
		avatar: string;
	}
	content: string;
	isAnswered: boolean;
	isHighLighted: boolean;
	likeCount: number;
	likeId: string | undefined;
}

// Se não soubéssemos os campos novamente, utilizariamos Record dentro de Record novamente
// Exemplo: Record<Tipo da chave, Record<Tipo da outra chave, Tipo do outro valor>>;

export function useRoom(roomId: string) {
	const [questions, setQuestions] = useState<QuestionType[]>([]); // Item<Algo> é um "Generic"
	const [title, setTitle] = useState();
	const { user } = useAuth();

	useEffect(() => {
		// Criando referência para a sala específica acessada pelo usuário
		const roomRef = database.ref(`rooms/${roomId}`);

		// Buscando dados das perguntas   para essa sala

		// Basicamente, estamos colocando o JavaScript para "ouvir" eventos (nesse caso, o evento value)
		// Como utilizamos "once", ele "escuta" apenas uma vez
		// Para ouvir mais de uma vez, utilizar "on"  

		// .val() é uma API do Firebase para buscar os dados da referência

		// Como usamos ON, para qualquer item alterado dentro do banco de dados
		// O código será re-executado

		// Utilizamos o roomId no array do useEffect para que, se o usuário mudar de sala (através de um Link, por exemplo)
		// o código considerado também seja renovado/alterado

		roomRef.on('value', room => {
			const databaseRoom = room.val();
			const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {}; // ?? faz com que, se não existirem perguntas, ele considere um objeto vazio
			// const firebaseQuestions = databaseRoom as FirebaseQuestions

			// As perguntas são retornadas no formato de objeto

			// O método SOME percorre o array e retorna true se algum dos itens satisfazer a condição
			// Já o FIND retorna o item que satisfaz a condição

			// O símbolo ?.[0] representa a seguinte condição:
				// Se o item da frente for true ou existir, ele acessa a posição zero dele e retorna
				// Se não, retorna undefined

			const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
				return {
					id: key,
					content: value.content,
					author: value.author,
					isHighLighted: value.isHighLighted,
					isAnswered: value.isAnswered,
					likeCount: Object.values(value.likes ?? {}).length,
					likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
				}
			}); 

			setTitle(databaseRoom.title); // Nome da sala
			setQuestions(parsedQuestions);
		});

		// Função que desinscreve o usuário dos Event Listeners
		return () => {
			roomRef.off('value');
		}

	}, [roomId, user?.id]);

	// Quando o useEffect depende de uma variável externa (como o user?.id), é recomendável passar ela no array dele

	return { questions, title }
}