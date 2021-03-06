import { FormEvent, useState } from 'react';
import { database } from '../services/firebase';

import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';

import '../styles/auth.scss';

export function NewRoom() {
	const { user } = useAuth();
	const history = useHistory();

	const [newRoom, setNewRoom] = useState('');

	async function handleCreateRoom(event: FormEvent) {
		event.preventDefault();

		if(newRoom.trim() === '') {
			return;
		}

		// Criação de referência para o firebase
		// Dentro do banco de dados, existirá uma categoria rooms
		const roomRef = database.ref('rooms');

		// Jogando informação para dentro de rooms
		const firebaseRoom = await roomRef.push({
			title: newRoom,
			authorId: user?.id,
		});

		// Redireciona para a sala através da passagem do ID dela na rota
		history.push(`/rooms/${firebaseRoom.key}`);
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
					<h2>Criar uma nova sala</h2>
					<form onSubmit={handleCreateRoom}>
						<input 
							type="text"
							placeholder="Nome da sala"
							onChange={event => setNewRoom(event.target.value)}
							value={newRoom}
						/>
						<Button type="submit">
							Criar sala
						</Button>
					</form>
					<p>Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link></p>
				</div>
			</main>
		</div>
	);
}