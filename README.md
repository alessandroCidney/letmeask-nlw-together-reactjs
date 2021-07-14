# Letmeask :purple_heart:

## O que é?
Letmeask é uma aplicação que permite a criação de salas de perguntas e respostas de maneira dinâmica e interativa, desenvolvida com base em ReactJS, utilizando o Firebase para auxiliar o processo de construção.

## Desenvolvimento do projeto Let Me Ask

### Aula 1
- Para criar o projeto com TypeScript, utilizamos o comando `yarn create react-app nome-do-projeto --template typescript`
- Instalar firebase com `yarn add firebase`

### Aula 2
- Instalação do SASS com o comando `yarn add node-sass@^5.0.0`
- Criação de arquivos scss
- Instalação da biblioteca React Router DOM para fazer o roteamento através do comando `yarn add react-router-dom`
- Instalação dos tipos do React Router DOM através de `yarn add @types/react-router-dom -D` (é necessário instalar quando a dependência não foi desenvolvida utilizando TypeScript)

#### React Router Dom
- Permite o acesso a diferentes rotas da aplicação

#### BrowseRouter
Contém as diferentes rotas que podem ser acessadas

#### Router
Descreve uma rota da aplicação e seu componente associado. Possui alguns atributos:

- **path** - descreve a rota para acesso (sem a URL base)
- **component** - descreve o componente que será acessado
- **exact** - exige que, para acessar a rota, o endereço seja escrito exatamente como definido no path (você pode escrever também exact={true} ou exact={false})

#### Trocar de página com buttons
- Importar o useHistory do React Router Dom
- Criar um hook para o useHistory (const test = useHistory())
- É possível alterar a página através do push (test.push("/caminho")). Isso pode ser definido dentro de uma função que será executada com o onClick

```javascript
const history = useHistory();

function navigateToNewRoom() {
	history.push('/rooms/new')
}

return (
	<button className="create-room" onClick={navigateToNewRoom}>
		<img src={googleIconImg} alt="Logo do Google" />
			Crie sua sala com o Google
	</button>
)
```

#### Trocar de página com âncoras
- Importar o Link
- Usar o component link no lugar da âncora com o endereço descrito através do atributo **to**

```javascript
return (
	<p>Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link></p>
)
```

#### Resumo sobre useEffect
useEffect dispara uma função sempre que determinada condição é realizada, ou, mais especificamente, quando determinado item é alterado.

A função useEffect recebe dois parâmetros. O primeiro é a função a ser executada e o segundo é um array com os itens que estão sendo monitorados

###### Exemplo: Executar função sempre que a variável user mudar

useEffect(() => {}, [user])

###### Exemplo#2: Executar função apenas uma vez, quando o componente é carregado

useEffect(() => {}, [])

#### Novos tipos vistos para o TypeScript
- Para objetos, **object**
- Para funções, **() => (tipo de retorno)**
- Para promises, **Promise<(tipo de retorno da promise - string, void, etc)>**
- Para componentes do React, **ReactNode** (necessário importar do React)

### Aula 3
- Adição da função de criação de salas
- Adição de uma página para as salas
- Utilização do Switch do React Router DOM

#### Switch
O Switch impede que duas rotas sejam chamadas ao mesmo tempo, sendo mais eficiente, em alguns casos, que o atributo **exact**. Se uma condição de endereço de URL é satisfeita, o Switch utiliza apenas ela.

#### Regras para bancos no Firebase
As regras criadas foram as seguintes:

```json
{
  "rules": {
    "rooms": {
      ".read": false,
      ".write": "auth != null",
      "$roomId": {
        ".read": true,
        ".write": "auth != null && (!data.exists() || data.child('authorId').val() == auth.id)",
        "questions": {
          ".read": true,
          ".write": "auth != null && (!data.exists() || data.parent().child('authorId').val() == auth.id)",
          "likes": {
            ".read": true,
            ".write": "auth != null && (!data.exists() || data.child('authorId').val() == auth.id)"
          }
        }
      }
    }
  }
}
```

##### Para todas as salas
- É proibida a leitura dos dados de **todas** as salas ao mesmo tempo
- É permitida a criação de salas se o usuário estiver autenticado

##### Para uma sala específica
- É permitida a leitura dos dados da sala
- Usuários autenticados podem criar salas e alterar/remover os dados das salas que criaram
- Usuários não podem alterar/remover salas criadas por outros usuários

##### Para as questões das salas
- É permitida a leitura dos dados da pergunta
- Usuários autenticados podem criar perguntas
- Depois de criadas, as perguntas só podem ser alteradas/removidas pelo **criador da sala** (o usuário só pode criar a pergunta, apenas)

##### Para os likes das perguntas
- É permitida a leitura dos dados dos likes
- Usuários autenticados podem dar likes
- Os usuários que deram likes podem alterar/remover seus likes, mas não podem alterar/remover likes de outros usuários

#### useParams
- Importar do React Router DOM
- Permite que captemos os parâmetros passados através de uma rota, como o ID de uma página, por exemplo

#### Tipagem para objetos (TypeScript)
- A tipagem para outros elementos assemelha-se ao seguinte trecho de código:

```typescript
type TipoTeste = {
  item1: string;
  item2: number;
  item3?: number;
  item4: string[];
  item5: {
    item51: string;
    item52: number;
  }
  item6: number[];
}
```

- Para objetos cujos valores das chaves variam, usamos `Record`:

```typescript
type TipoTeste2 = Record<string, string>
```

- Se houver mais de um objeto cujas chaves variam dentro de outro:

```typescript
type TipoTeste3 = Record<string, Record<string, number>>
```

#### Salvando dados no Firebase

##### Para salvar dados únicos
- Usa-se o método `set()` na referência (`database.ref('')`)

##### Para salvar dados dentro de uma lista já existente
- Usa-se o método `push()` na referência (`database.ref('')`)

#### Ouvindo eventos no Firebase

##### Para ouvir uma única vez
- Usa-se o método `once` na referência

```javascript
const any = database.ref('...');

any.once('evento', () => {})
```

##### Para ouvir sempre que algo for alterado no banco de dados
- Usa-se o método `on` na referência

```javascript
const any = database.ref('...');

any.on('evento', () => {});
```

##### Observação
**Em caso de dúvidas, checar a documentação oficial do Firebase**.

## Dicas
- Dar uma olhada no pacote React Modal