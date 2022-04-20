import { useEffect, useReducer, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { loginReducer } from './@reducers/login';
import './App.css';
import { Login, Register } from './components/auth';
import { loginInitialState, Move, } from './@constants';
import BoardContainer from './components/boardContainer/boardContainer';
import UserComponent from './components/user/user';
import CreateContainer from './components/createContainer';
import { LogicContextProvider } from './LogicContext';
import { User } from './@constants'

function App() {
	const [state, dispatch] = useReducer(loginReducer, loginInitialState);
	const { username, password, isLoading, error, isLoggedIn } = state;
	const [user, setUser] = useState<User>({username: "", whiteRootID: "", blackRootID: ""})
	const [prevMove, setPrevMove] = useState<Move>({move: "", parentID: "", childIDs: [], childMoves: []})

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			const fetchToken = async () => {
				const response = await fetch('/user', {
					method: 'GET',
					headers: {
						'auth-token': `${token}`
					}
				})
				if (response.ok) {
					setUser(await response.json())
				}
			}
			fetchToken()
		}
	}, [])

	useEffect(() => {
		if (user.username.length > 0) {
			const fetchMove = async () => {
				const move = await fetch(`/data/${user.whiteRootID}`)
				.then((res) => res.json())
				setPrevMove(move)
			}
			fetchMove() 
			dispatch({ type: 'success'})
		}
	}, [user])

	return (
		<div className="app">
			{isLoggedIn && prevMove.move.length > 0 ? (
				<>
					<LogicContextProvider user={user} prevMove={prevMove}>
						<UserComponent dispatchLogout={dispatch}/>
						<div className='content-container'>
							<CreateContainer/>
							<BoardContainer/>
						</div>
					</LogicContextProvider>
                </>
            ) : (
				<Routes>
					<Route path='/' element=
						{<Login 
							username={username}
							password={password}
							error={error}
							isLoading={isLoading}
							dispatch={dispatch}
							setUser={setUser}
						/>}>
					</Route>
					<Route path='/register' element=
						{<Register
							username={username}
							password={password}
							error={error}
							isLoading={isLoading}
							dispatch={dispatch}
							setUser={setUser}
						/>}>
					</Route>
				</Routes>
            )}
		</div>
	);
}

export default App;
