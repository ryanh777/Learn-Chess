import React, { FormEvent, useEffect, useReducer, useState } from 'react';
import { Link, Routes, Route, BrowserRouter } from 'react-router-dom';
import { loginReducer } from './@reducers';
import './App.css';
import Chessboard from './components/chessboard/chessboard';
import { Login, Register } from './components/auth';
import { initialState, User } from './@constants';

function App() {
	const [state, dispatch] = useReducer(loginReducer, initialState);
	const { username, password, isLoading, error, isLoggedIn } = state;
	const [user, setUser] = useState<User | null>()

	useEffect(() => {
		const token = localStorage.getItem('token')
		console.log("token:", token)
		if (token) {
			fetch('/user', {
				method: 'GET',
				headers: {
					'auth-token': `${token}`
				}
			})
			.then(res => res.json())
			.then(user => setUser(user))
			dispatch({ type: 'success'})
		}
	}, [])

	return (
		<div className="app">
			{isLoggedIn ? (
                <>
                    <h1>Welcome {user?.username}!</h1>
					<h3>white: {user?.whiteRootID}</h3>
					<h3>black: {user?.blackRootID}</h3>
                    <button onClick={() => dispatch({ type: 'logout' })}>
                        Log Out
                    </button>
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
