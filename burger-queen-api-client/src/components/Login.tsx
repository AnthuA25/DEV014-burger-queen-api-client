import "../styles/Login.css";
import hamburger from "../assets/hamburger.png";
import { useState } from "react";
import { LoginConection } from "../service/ApiService";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await LoginConection({ email, password });
    console.log("result",result)
    if (result.success) {
      localStorage.setItem("userId", result.data.user._id);
      navigate("/waiter-dashboard");
    } else {
      alert(result.message); 
    }
  };

  return (
    <main className="principal">
      <section className="login-container">
        <div className="right-section">
          <h2>Inicio de Sesión</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
            <input type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}/>
              <label className="lb-name">
                <span className="text-name">Correo Electrónico</span>
              </label>
            </div>
            <div className="form-group">
              <input type="password" required value={password}
                onChange={(e) => setPassword(e.target.value)}/>
              <label className="lb-name">
                <span className="text-name">Contraseña</span>
              </label>
            </div>
            <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
            <button type="submit" className="login-button">
              INGRESAR <span className="arrow">➔</span>
            </button>
          </form>
        </div>
      </section>
      <aside className="image-section">
        <img src={hamburger} alt="Burger" className="burger-image" />
      </aside>
    </main>
  );
};
