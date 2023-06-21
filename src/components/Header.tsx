interface Props {
  handleActiveSession: (value: boolean) => void;
}

export const Header = ({ handleActiveSession }: Props) => {
  const handleLogOut = () => {
    localStorage.clear();
    handleActiveSession(false);
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
