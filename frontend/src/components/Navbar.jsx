import { Tags } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");
  let user = localStorage.getItem("user");
  if (user) {
    user = JSON.parse(user);
  }
  const navigate = useNavigate();



  // New: State for theme, initialized from localStorage or defaults to 'light'
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme || "autumn"; // Default to 'light' if no theme is stored
  });

  // New: useEffect to apply the theme to the html element and persist it
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme); // Apply data-theme attribute
    localStorage.setItem("theme", theme); // Save theme to localStorage
  }, [theme]); // Re-run effect whenever 'theme' state changes

  // New: Function to toggle the theme between 'light' and 'dark'
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "autumn" ? "dim" : "autumn"));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    
    <div className="navbar bg-base-200">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Tags className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-lg font-bold">Ticket AI</h1>
        </Link>

        {/* Conditionally render badge if user role exists */}
              {user?.role && (
                <span className="badge badge-outline badge-primary text-xs uppercase">
                  {user.role} {/* Display the user's role */}
                </span>
              )}
      </div>


      <div className="flex gap-2">
        {!token ? (
          <>
            <Link to="/signup" className="btn btn-sm">
              Signup
            </Link>
            <Link to="/login" className="btn btn-sm">
              Login
            </Link>
          </>
        ) : (
          <>
            <p>Hi, {user?.email}</p>
            {user && user?.role === "admin" ? (
              <Link to="/admin" className="btn btn-sm">
                Admin Panel
              </Link>
            ) : null}
            <button onClick={logout} className="btn btn-sm">
              Logout
            </button>
          </>
        )}


        {/* New: DaisyUI Theme Toggle Switch with Sun and Moon SVG icons */}
        {/* Added ml-4 for spacing from other navbar items */}
        <label className="flex cursor-pointer gap-2 ml-4">
          {/* Sun icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
          {/* DaisyUI toggle input. 'checked' state controls the visual position. 'onChange' calls toggleTheme. */}
          <input type="checkbox" value="synthwave" className="toggle theme-controller" checked={theme === "dark"} onChange={toggleTheme} />
          {/* Moon icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </label>
        {/* --- END EDIT --- */}


      </div>
    </div>
    
  );
}

export default Navbar