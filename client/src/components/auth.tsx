import React, { FormEvent } from "react";
import { User } from "../@constants";
import { useNavigate } from "react-router-dom"
import { postMove } from "../helperFuncs";
import { LoginActionType } from "../@types";

interface Props {
    username: string,
    password: string,
    error: string,
    isLoading: boolean,
    dispatch: React.Dispatch<LoginActionType>
    setUser: React.Dispatch<React.SetStateAction<User>>
}

export const Login = (props: Props): JSX.Element => {
    const navigate = useNavigate()
	
	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		props.dispatch({ type: 'login' });
		const user = {
			username: props.username,
			password: props.password
		}
		try {
			const response = await fetch('/user/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(user),
			})
			if (!response.ok) {
				throw new Error(await response.text())
			} 
            const token: string | null = response.headers.get('auth-token')
            if (!token) {
                throw new Error("token returned null")
            }
            localStorage.setItem('token', token)
            const filteredResponse = await response.json()
            props.setUser({
                username: props.username,
                whiteRootID: filteredResponse.whiteRootID,
                blackRootID: filteredResponse.blackRootID
            })
			props.dispatch({ type: 'success'})
		} catch (err: any) {
			console.log(err)
			props.dispatch({ type: 'error' })
		}
	};

    return (
        <>
            <form onSubmit={onSubmit}>
                {props.error && <p className='error'>{props.error}</p>}
                <h2>Login</h2>
                <div className="form-element">
                    <input 
                        type="text" 
                        placeholder="username" 
                        id="username" 
                        value={props.username} 
                        autoComplete="off"
                        onChange={(e) => 
                            props.dispatch({
                                type: 'field',
                                fieldName: 'username',
                                payload: e.currentTarget.value
                            })
                        }
                    />
                </div>
                <div className="form-element">
                    <input 
                        type="text" 
                        placeholder="password" 
                        id="password" 
                        value={props.password} 
                        autoComplete="off"
                        onChange={(e) => 
                            props.dispatch({
                                type: 'field',
                                fieldName: 'password',
                                payload: e.currentTarget.value
                            })
                        }
                    />
                </div>
                <input type="submit" value="Login" disabled={props.isLoading}/>
            </form>
            <button onClick={() => navigate("/register")}>Register</button>
        </>
    )
}

export const Register = (props: Props): JSX.Element => {
    const onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		props.dispatch({ type: 'login' });
		const whiteRoot = {
            move: `${props.username}-white-root`,
            parentID: "none"
        }
        const blackRoot = {
            move: `${props.username}-black-root`,
            parentID: "none"
        }
        const user = {
            username: props.username,
            password: props.password,
            whiteRootID: await postMove(whiteRoot),
            blackRootID: await postMove(blackRoot)
        }
		try {
			const response = await fetch('/user/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(user),
			})
            console.log("status:", response.status)
			if (!response.ok) {
				throw new Error(await response.text())
			} 
            props.setUser({
                username: props.username,
                whiteRootID: user.whiteRootID,
                blackRootID: user.blackRootID
            })
			props.dispatch({ type: 'success'})
		} catch (err: any) {
			console.log(err)
			props.dispatch({ type: 'error' })
		}
	};

    return (
        <>
            <form onSubmit={onSubmit}>
                {props.error && <p className='error'>{props.error}</p>}
                <h2>Register</h2>
                <div className="form-element">
                    <input 
                        type="text" 
                        placeholder="username" 
                        id="username" 
                        value={props.username} 
                        autoComplete="off"
                        onChange={(e) => 
                            props.dispatch({
                                type: 'field',
                                fieldName: 'username',
                                payload: e.currentTarget.value
                            })
                        }
                    />
                </div>
                <div className="form-element">
                    <input 
                        type="text" 
                        placeholder="password" 
                        id="password" 
                        value={props.password} 
                        autoComplete="off"
                        onChange={(e) => 
                            props.dispatch({
                                type: 'field',
                                fieldName: 'password',
                                payload: e.currentTarget.value
                            })
                        }
                    />
                </div>
                <input type="submit" value="Register" disabled={props.isLoading}/>
            </form>
            {/* <button onClick={() => navigate("/register")}>Register</button> */}
        </>
    )
}