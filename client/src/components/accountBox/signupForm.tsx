import React, { FormEvent, useContext, useReducer } from "react";
import {
  BoldLink,
  BoxContainer,
  ErrorMsg,
  FormContainer,
  Input,
  MutedText,
  SubmitButton,
} from "./common";
import { Marginer } from "../marginer";
import { AccountContext } from "./accountContext";
import { loginInitialState, User } from "../../@constants";
import { loginReducer } from "../../@reducers/login";
import { postMove } from "../../helperFuncs";

interface Props {
  setUser: React.Dispatch<React.SetStateAction<User>>
}

export function SignupForm(props: Props) {
  const { switchToSignin } = useContext(AccountContext);
  const [state, dispatch] = useReducer(loginReducer, loginInitialState);
	const { username, password, confirmpassword, error } = state;

  const onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		dispatch({ type: 'login' });
    if (password !== confirmpassword) {
      dispatch({type: 'error', payload: "Passwords do not match."})
      return
    }
		const whiteRoot = {
      move: `${username}-white-root`,
      parentID: "root",
      piece: "root"
    }
    const blackRoot = {
      move: `${username}-black-root`,
      parentID: "root",
      piece: "root"
    }
    const user = {
      username: username,
      password: password,
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
        console.log("resp:", response)
			if (!response.ok) {
				throw new Error(await response.text())
			} 
      props.setUser({
          username: username,
          whiteRootID: user.whiteRootID,
          blackRootID: user.blackRootID
      })
			dispatch({ type: 'success'})
		} catch (err: any) {
			console.log(err)
			dispatch({ type: 'error', payload: err.message })
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
        <Input 
          type="password" 
          placeholder="Confirm Password" 
          onChange={(e) => 
            dispatch({
              type: 'field',
              fieldName: 'confirmpassword',
              payload: e.currentTarget.value
            })
          }
        />
      </FormContainer>
      <Marginer direction="vertical" margin={10} />
      <SubmitButton onClick={onSubmit}>Signup</SubmitButton>
      <Marginer direction="vertical" margin="1em" />
      <MutedText>
        Already have an account?
        <BoldLink href="#" onClick={switchToSignin}>
          Signin
        </BoldLink>
      </MutedText>
    </BoxContainer>
  );
}