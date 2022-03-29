import { useEffect, useContext } from "react";
import { AppContextType } from "../../constants";
import { postMove } from "../../helperFuncs";
import AppContext from "../../AppContext";

export default function UserComponent() {
	const { user, saveUser, setCurrentMoveID } = useContext(AppContext) as AppContextType 

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			fetch('/user', {
				method: 'GET',
				headers: {
					'auth-token': `${token}`
				}
			})
			.then(res => res.json())
			.then(user => {
				saveUser(user)
				setCurrentMoveID(user.whiteRootID)
			})
		}
	}, [])

   async function register() {
		const username = (document.getElementById('username') as HTMLInputElement).value;
		const password = (document.getElementById('password') as HTMLInputElement).value;
		if (username && password) {
			const whiteRoot = {
				move: `${username}-white-root`,
				parentID: "none"
			}
			const blackRoot = {
				move: `${username}-black-root`,
				parentID: "none"
			}
			const user = {
				username: username,
				password: password,
				whiteRootID: await postMove(whiteRoot),
				blackRootID: await postMove(blackRoot)
			}
			const status = await fetch('/user/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(user),
			})
			.then(res => res.status)

			if (status === 200) {
				login(username, password)
			}
		} else {
			alert("Need both username and password")
		}
	}

	function loginButton() {
		const username = (document.getElementById('username') as HTMLInputElement).value;
		const password = (document.getElementById('password') as HTMLInputElement).value;
		if (username && password) {
			login(username, password)
		} else {
			alert("Need both username and password")
		}
	}

	async function login(username: string, password: string) {
		const user = {
			username: username,
			password: password
		}
		await fetch('/user/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(user),
		})
			.then(res => res.text())
			.then(token => localStorage.setItem('token', token))
		window.location.reload()
	}

	function logout() {
		localStorage.removeItem('token')
		window.location.reload()
	}
	
	if (user) {
		return (
			<>
				<div>
					<div>{user.username} is logged in.</div>
					<button id="logout" onClick={logout}>logout</button>
				</div>
			</>
		)
	} else {
		return (
			<>
				<input id="username" type="text" placeholder="Username"></input>
				<input id="password" type="text" placeholder="Password"></input>
				<div>
					<button id="register" onClick={register}>Register</button>
					<button id="login" onClick={loginButton}>Login</button>
				</div>
			</>
		)
	}
}