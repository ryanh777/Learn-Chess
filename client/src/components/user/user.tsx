import { useContext } from "react";
import { LoginActionType } from "../../@types";
import LogicContext from "../../LogicContext";

interface Props {
	dispatchLogout: React.Dispatch<LoginActionType>
}

const User = (props: Props): JSX.Element => {
	const { state, dispatch } = useContext(LogicContext)
	const { user } = state
	return (
		<>
			<h1>{user.username}</h1>
			<button onClick={() => {
				localStorage.removeItem('token')
				dispatch({type: "reset-state"})
				props.dispatchLogout({ type: 'logout' })
			}}>
				Log Out
			</button>
		</>
	)	
}
export default User;