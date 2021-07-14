import { useParams, useHistory } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';

import { database } from '../services/firebase';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode'; 
import { useRoom } from '../hooks/useRoom';

import '../styles/room.scss';

type RoomParams = {
	id: string;
}

export function AdminRoom() {
	const history = useHistory();
	
	// const { user } = useAuth();
	
	const params = useParams<RoomParams>();
	const roomId = params.id;

	// O hook useRoom retorna os dados da sala
	const { questions, title } = useRoom(roomId);

	// Função de encerrar sala
	async function handleEndRoom() {
		// Adicionando a data de encerramento
		await database.ref(`rooms/${roomId}`).update({
			endedAt: new Date(),
		});

		// Redirecionando para o início
		history.push('/');
	}

	// Função para deletar questões
	async function handleDeleteQuestion(questionId: string) {
		// Confirm invoca aquela janela do JavaScript que pergunta SIM ou NÃO
		if(window.confirm("Tem certeza que deseja excluir essa pergunta")) {
			await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
		}
	}
	
	return (
		<div id="page-room">
			<header>
				<div className="content">
					<img src={logoImg} alt="Letmeask" />
					<div>
						<RoomCode code={roomId} />
						{/*
							Como a propriedade isOutlined é um booleano, não é necessário dizer que é true, só colocar e pronto
						*/}
						<Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
					</div>
				</div>
			</header>

			<main>
				<div className="room-title">
					<h1>Sala {title}</h1>
					{ questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
				</div>

				<div className="question-list">
					{questions.map(question => {
					return (
						// Necessário passar o valor de key pois se trata de uma lista de perguntas
						<Question
							key={question.id}
							content={question.content}
							author={question.author}
						>
							<button
								type="button"
								onClick={() => handleDeleteQuestion(question.id)}
							>
								<img src={deleteImg} alt="Remover pergunta" />
							</button>
						</Question>
					);
					})}	
				</div>
			</main>
		</div>
	);
}