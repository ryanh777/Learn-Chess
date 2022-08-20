import React, { FormEvent, useContext, useReducer } from "react";
import {
  BoldLink,
  BoxContainer,
  FormContainer,
  Input,
  MutedText,
  SubmitButton,
  ErrorMsg
} from "./common";
import { Marginer } from "../marginer";
import { AccountContext } from "./accountContext";
import { LoginActionType } from "../../@types";
import { loginInitialState, User } from "../../@constants";
import { loginReducer } from "../../@reducers/login";

//console.log(JSON.stringify(user))
interface Props {
  // username: string,
  // password: string,
  // error: string,
  // isLoading: boolean,
  // dispatch: React.Dispatch<LoginActionType>
  setUser: React.Dispatch<React.SetStateAction<User>>
}

export function LoginForm(props: Props) {
  const { switchToSignup } = useContext(AccountContext);
  const [state, dispatch] = useReducer(loginReducer, loginInitialState);
	const { username, password, error } = state;

  const onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		dispatch({ type: 'login' });
    const user = {
			username: username,
			password: password
		}
		try {
      console.log(JSON.stringify(user))
			const response = await fetch('/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
			  body: JSON.stringify(user),
			})

			if (!response.ok) throw new Error(await response.text())

      const token: string | null = response.headers.get('auth-token')

      if (!token) throw new Error("token returned null")

      localStorage.setItem('token', token)
      const filteredResponse = await response.json()
      props.setUser({
          username: username,
          whiteRootID: filteredResponse.whiteRootID,
          blackRootID: filteredResponse.blackRootID
      })
			dispatch({ type: 'success'})
		} catch (err: any) {
			console.log(err)
			dispatch({ type: 'error', payload: "Username or password is not correct."})
		}
	};

  return (
    <BoxContainer>
      {error && <ErrorMsg>{error}</ErrorMsg> }
      <FormContainer>
        <Input 
          type="text" 
          placeholder="Username" 
          onChange={(e) => 
            dispatch({
              type: 'field',
              fieldName: 'username',
              payload: e.currentTarget.value
            })
          }
        />
        <Input 
          type="password" 
          placeholder="Password" 
          onChange={(e) => 
            dispatch({
              type: 'field',
              fieldName: 'password',
              payload: e.currentTarget.value
            })
          }
        />
      </FormContainer>
      <Marginer direction="vertical" margin={10} />
      {/* <MutedLink href="#">Forget your password?</MutedLink> */}
      <Marginer direction="vertical" margin="1.6em" />
      <SubmitButton onClick={onSubmit}>Signin</SubmitButton>
      <Marginer direction="vertical" margin="1em" />
      <MutedText>
        Don't have an account?{" "}
        <BoldLink href="#" onClick={switchToSignup}>
          Signup
        </BoldLink>
      </MutedText>
    </BoxContainer>
  );
}