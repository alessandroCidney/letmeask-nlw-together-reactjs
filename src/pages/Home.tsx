import { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import { database } from '../services/firebase';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import { Button } from '../components/Button';

import '../styles/auth.scss';

export function Home() {
	const history = useHistory();
	const { user, signInWithGoogle } = useAuth();
	const [roomCode, setRoomCode] = useState('');

	async function handleCreateRoom() {
		if(!user) {
			await signInWithGoogle();
		}

		history.push('/rooms/new');
	}

	async function handleJoinRoom(event: FormEvent) {
		event.preventDefault();

		if(roomCode.trim() === '') {
			return;
		}

		// Verificando se a sala realmente existe
		// O Get busca todos os dados sobre a sala
		// roomCode contém o código da sala
		const roomRef = await database.ref(`rooms/${roomCode}`).get();

		// Se a sala não existe, não será permitido entrar
		if(!roomRef.exists()) {
			alert('Room does not exists');
			return;
		}

		// Se a sala já foi encerrada (ou seja, se o item endedAt existe em roomRef), não será permitido entrar
		if(roomRef.val().endedAt) {
			alert("Room already closed");
			return;
		}

		history.push(`/rooms/${roomCode}`);
	}

	return (
		<div id="page-auth">
			<aside>
				<img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
				<strong>Crie salas de Q&amp;A ao-vivo</strong>
				<p>
					Tire as dúvidas da sua audiência em tempo-real
				</p>
			</aside>

			<main>
				<div className="main-content">
					<img src={logoImg} alt="letmeask" />
					<button className="create-room" onClick={handleCreateRoom}>
						<img src={googleIconImg} alt="Logo do Google" />
						Crie sua sala com o Google
					</button>
					<div className="separator">
						Ou entre em uma sala
					</div>
					<form onSubmit={handleJoinRoom}>
						{/*
							onChange altera o valor de newRoom conforme algo é digitado
							Após a alteração, o input recebe o valor de roomCode (alterado sempre que digitamos algo)
							Ao submeter, a função handleJoinRoom utiliza o valor de roomCode, sem precisar pegar do input
						*/}
						<input 
							type="text"
							placeholder="Digite o código da sala"
							onChange={event => setRoomCode(event.target.value)}
							value={roomCode}
						/>
						<Button type="submit">
							Entrar na sala
						</Button>
					</form>
				</div>
			</main>
		</div>
	);
}