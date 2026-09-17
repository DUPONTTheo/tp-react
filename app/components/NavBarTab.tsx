import classNames from 'classnames'
import { useNavigate } from 'react-router'
import type { Tab } from '~/types/tabs'

type NavbarTabProps = { tab: Tab; activeTab: string }

const NavbarTab: React.FC<NavbarTabProps> = ({ tab, activeTab }) => {
  const navigate = useNavigate()

  const handleClick = (path: string) => {
    navigate(path)
  }

  return (
    <button
      key={tab.name}
      onClick={() => handleClick(tab.path)}
      className={classNames(
        'cursor-pointer text-vp-rock-900 border-b border-transparent text-sm transition-colors',
        activeTab === tab.name && 'border-vp-rock-900',
        activeTab !== tab.name && 'hover:text-vp-primary',
      )}
    >
      {tab.name}
    </button>
  )
}

export default NavbarTab
