import classNames from 'classnames';
import { useNavigate } from 'react-router';
import type { Tab } from '~/types/tabs';

type NavbarTabProps = { tab: Tab; activeTab: string; setActiveTab: (tab: string) => void };

const NavbarTab: React.FC<NavbarTabProps> = ({ tab, activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const handleClick = (path: string) => {
    setActiveTab(tab.name);
    navigate(path);
  };

  return (
    <button
      key={tab.name}
      aria-selected={tab.name === activeTab}
      onClick={() => handleClick(tab.path)}
      className={classNames(
        'cursor-pointer text-vp-rock-900 border-b border-transparent text-sm transition-colors',
        activeTab === tab.name && 'border-vp-rock-900',
        activeTab !== tab.name && 'hover:text-vp-primary',
      )}
    >
      {tab.name}
    </button>
  );
};

export default NavbarTab;
