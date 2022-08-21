import { FC } from 'react'
import { IoBook, IoBrush } from 'react-icons/io5'
import { IoMdCreate } from 'react-icons/io'
import { AppState } from '../@constants'
import AppStateButton from './appStateButton'
import { LoginActionType } from '../@types'
import User from './user'

interface Props {
  dispatchLogout: React.Dispatch<LoginActionType>
}

const Sidebar = (props: Props) => {
  return (
    <div className='flex flex-col w-20 h-screen bg-bgtertiary'>
        <AppStateButton state={AppState.Create} icon={<IoMdCreate size={34} />}/>
        <AppStateButton state={AppState.Learn} icon={<IoBook size={34} />}/>
        <User dispatchLogout={props.dispatchLogout}/>
        {/* <SideBarIcon children={<IoBook size={34} />} /> */}
        {/* <SideBarIcon children={<IoBook size={34} />} /> */}
    </div>
  )
}

const SideBarIcon: FC = ({children}) => (
    <div className='flex items-center justify-center h-16 m-2 transition-all duration-100 ease-linear cursor-pointer rounded-3xl bg-button hover:bg-buttonHover hover:rounded-xl'>
        {children}
    </div>
)

export default Sidebar