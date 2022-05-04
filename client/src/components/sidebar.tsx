import { FC } from 'react'
import { IoBook, IoBrush } from 'react-icons/io5'
import { IoMdCreate } from 'react-icons/io'
import { AppState } from '../@constants'
import AppStateButton from './appStateButton'

const Sidebar = () => {
  return (
    <div className='flex-shrink-0 w-20 h-screen bg-bgtertiary flex-end'>
        <AppStateButton state={AppState.Create} icon={<IoMdCreate size={34} />}/>
        <AppStateButton state={AppState.Learn} icon={<IoBook size={34} />}/>
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