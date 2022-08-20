import { useEffect, useReducer, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { loginReducer } from './@reducers/login';
// import './App.css';
import { Login, Register } from './components/auth';
import { loginInitialState, Move, } from './@constants';
import UserComponent from './components/user';
import CreateContainer from './components/createContainer';
import { LogicContextProvider } from './LogicContext';
import { User } from './@constants'
import ChessboardContainer from './components/chessboard';
import FlipColorButton from './components/flipColorButton';
import LearnStateButton from './components/appStateButton';
import SaveButton from './components/save';
import Sidebar from './components/sidebar';
import MainContent from './components/mainContent';
import styled from 'styled-components'
import { AccountBox } from './components/accountBox';

function App() {
	const [state, dispatch] = useReducer(loginReducer, loginInitialState);
	const { username, password, isLoading, error, isLoggedIn } = state;
	const [user, setUser] = useState<User>({username: "", whiteRootID: "", blackRootID: ""})
	const [prevMove, setPrevMove] = useState<Move>({move: "", parentID: "", piece: "", childData: []})

	// useEffect(() => {
	// 	const token = localStorage.getItem('token')
	// 	if (!token) return
	// 	const fetchToken = async () => {
	// 		const response = await fetch('/user', {
	// 			method: 'GET',
	// 			head1234ers: {
	// 				'auth-token': `${token}`
	// 			}
	// 		})
	// 		if (response.ok) {
	// 			setUser(await response.json())
	// 		}
	// 	}
	// 	fetchToken()
	// }, [])

	useEffect(() => {
		console.log("user:"+ user.username)
	})

	useEffect(() => {
		if (user.username.length === 0) return
		const fetchMove = async () => {
			const move = await fetch(`/data/${user.whiteRootID}`)
			.then((res) => res.json())
			setPrevMove(move)
		}
		fetchMove() 
		dispatch({ type: 'success'})
		
	}, [user])

	const AppContainer = styled.div`
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #312e2b
	`;
	return (
		// <AppContainer>
		// 	<AccountBox setUser={setUser}/>
		// </AppContainer>
		// <div className='min-h-screen bg-bgprimary text-textprimary'>
		<div>
		{/* <AppContainer> */}

		
			{/* {isLoggedIn && prevMove.move.length > 0 ? ( */}
			{isLoggedIn ? (
				<div className='flex items-center min-h-screen bg-bgprimary text-textprimary'>
					<LogicContextProvider user={user} prevMove={prevMove}>
						<MainContent/>
						<Sidebar dispatchLogout={dispatch}/>
					</LogicContextProvider>
                </div>
            ) : (
			// <div className='flex flex-col items-center justify-center h-screen'>
			// 	<Routes>
			// 		<Route path='/' element=
			// 			{<Login 
			// 				username={username}
			// 				password={password}
			// 				error={error}
			// 				isLoading={isLoading}
			// 				dispatch={dispatch}
			// 				setUser={setUser}
			// 			/>}>
			// 		</Route>
			// 		<Route path='/register' element=
			// 			{<Register
			// 				username={username}
			// 				password={password}
			// 				error={error}
			// 				isLoading={isLoading}
			// 				dispatch={dispatch}
			// 				setUser={setUser}
			// 			/>}>
			// 		</Route>
			// 	</Routes>
			// </div>
			<AppContainer>
				<AccountBox setUser={setUser}/>
			</AppContainer>
            )}
		{/* </AppContainer> */}
		</div>
	);
}

export default App;
