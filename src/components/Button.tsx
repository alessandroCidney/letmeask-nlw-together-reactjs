import { ButtonHTMLAttributes } from "react"

import '../styles/button.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function Button(props: ButtonProps) {

	return (
		<button className="button" {...props} />
	);
}

// Função que retornava um botão com os conteúdos enviados mediante props

/*type ButtonProps = {
	text?: string;
	children?: string;
	// text?: Array<string>;
	// text?: number;
	// text?: string[];
}*/

/*
export function Button(props: ButtonProps) {
	return (
		<button>{props.text || "Default"}{props.children}</button>
	);
}*/