import { NavLink } from 'react-router-dom';

const ToolBar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-primary">
      <div className="container">
        <NavLink to="/" className="navbar-brand mb-0 text-white fs-1">
          Contacts
        </NavLink>

        <div className="ms-auto">
          <NavLink to="/add" className="btn btn-light">
            Add new contact
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default ToolBar;
