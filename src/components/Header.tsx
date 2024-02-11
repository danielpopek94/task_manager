import { toast } from 'react-toastify';

interface Props {
  handleActiveSession: (value: boolean) => void;
}

export const Header = ({ handleActiveSession }: Props) => {
  const handleLogOut = () => {
    localStorage.clear();
    handleActiveSession(false);
    toast.success('Logged out successfully');
  };

  return (
    <header className="header">
      <button
        className="header__logout"
        onClick={handleLogOut}
      >
        Logout
      </button>
    </header>

  );
};
