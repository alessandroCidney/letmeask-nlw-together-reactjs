import { ButtonHTMLAttributes } from "react"

import '../styles/button.scss'

// O tipo botão possui todos os atributos de um HTML Button comum + algumas propriedades que queremos
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	isOutlined?: boolean;
};

// Utilizando a desestruturação
// Quando isOutlined não está definida, seu valor é false
export function Button({isOutlined = false, ...props}: ButtonProps) {

	return (
		// Se o atributo isOutlined for verdadeiro, a classe outlined será adicionada
		<button className={`button ${isOutlined ? 'outlined': ''}`} {...props} />
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