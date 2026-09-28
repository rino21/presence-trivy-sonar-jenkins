import { useState } from "react";
import api from "../api/api";

export default function UserForm({ onUserCreated }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = "Le nom est requis";
    } else if (name.length < 2) {
      newErrors.name = "Le nom doit contenir au moins 2 caractères";
    } else if (name.length > 50) {
      newErrors.name = "Le nom ne doit pas dépasser 50 caractères";
    }
    
    if (!email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Veuillez entrer un email valide";
    } else if (email.length > 100) {
      newErrors.email = "L'email ne doit pas dépasser 100 caractères";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createUser = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});
    setSuccess("");
    
    try {
      await api.post("/users", { 
        name: name.trim(), 
        email: email.trim().toLowerCase() 
      });
      
      setSuccess("✅ Utilisateur créé avec succès !");
      setName("");
      setEmail("");
      
      // Notification optionnelle avec setTimeout
      setTimeout(() => setSuccess(""), 3000);
      
      if (onUserCreated) {
        onUserCreated();
      }
    } catch (err) {
      console.error("Erreur création utilisateur:", err);
      
      if (err.response?.status === 409) {
        setErrors({ general: "Cet email est déjà utilisé" });
      } else if (err.response?.status === 400) {
        setErrors({ general: "Données invalides. Vérifiez les champs" });
      } else {
        setErrors({ general: "Erreur lors de la création. Réessayez plus tard" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      createUser();
    }
  };

  return (
    <div className="user-form-container">
      <div className="form-header">
        <h2>👤 Créer un utilisateur</h2>
        <p className="form-subtitle">Ajoutez un nouvel utilisateur à votre système</p>
      </div>

      {errors.general && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <span>{errors.general}</span>
          <button className="alert-close" onClick={() => setErrors({})}>×</button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span className="alert-icon">✅</span>
          <span>{success}</span>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="name">
          Nom complet <span className="required">*</span>
        </label>
        <div className="input-wrapper">
          <span className="input-icon">👤</span>
          <input
            id="name"
            type="text"
            placeholder="Jean Dupont"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className={errors.name ? "error" : ""}
            autoComplete="name"
          />
        </div>
        {errors.name && <span className="error-message">{errors.name}</span>}
        <span className="field-hint">Minimum 2 caractères</span>
      </div>

      <div className="form-group">
        <label htmlFor="email">
          Adresse email <span className="required">*</span>
        </label>
        <div className="input-wrapper">
          <span className="input-icon">📧</span>
          <input
            id="email"
            type="email"
            placeholder="jean@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className={errors.email ? "error" : ""}
            autoComplete="email"
          />
        </div>
        {errors.email && <span className="error-message">{errors.email}</span>}
        <span className="field-hint">Format email valide requis</span>
      </div>

      <button 
        onClick={createUser} 
        disabled={loading}
        className="submit-btn"
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            Création en cours...
          </>
        ) : (
          <>
            <span>➕</span>
            Ajouter l'utilisateur
          </>
        )}
      </button>

      <style jsx>{`
        .user-form-container {
          max-width: 500px;
          margin: 0 auto;
          padding: 24px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .form-header {
          margin-bottom: 24px;
          text-align: center;
        }

        .form-header h2 {
          margin: 0 0 8px 0;
          color: #1a1a2e;
          font-size: 1.8rem;
        }

        .form-subtitle {
          margin: 0;
          color: #718096;
          font-size: 0.9rem;
        }

        .alert {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          animation: slideIn 0.3s ease-out;
        }

        .alert-error {
          background: #fed7d7;
          color: #c53030;
          border-left: 4px solid #c53030;
        }

        .alert-success {
          background: #c6f6d5;
          color: #22543d;
          border-left: 4px solid #48bb78;
        }

        .alert-icon {
          font-size: 1.2rem;
        }

        .alert-close {
          margin-left: auto;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: inherit;
          opacity: 0.6;
          padding: 0 4px;
        }

        .alert-close:hover {
          opacity: 1;
        }

        .form-group {
          margin-bottom: 24px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #2d3748;
          font-size: 0.9rem;
        }

        .required {
          color: #f56565;
          margin-left: 4px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          font-size: 1.2rem;
          pointer-events: none;
        }

        input {
          width: 100%;
          padding: 12px 12px 12px 40px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s;
          font-family: inherit;
        }

        input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        input.error {
          border-color: #f56565;
        }

        input:disabled {
          background: #f7fafc;
          cursor: not-allowed;
        }

        .error-message {
          display: block;
          margin-top: 6px;
          color: #f56565;
          font-size: 0.8rem;
        }

        .field-hint {
          display: block;
          margin-top: 6px;
          color: #a0aec0;
          font-size: 0.75rem;
        }

        .submit-btn {
          width: 100%;
          padding: 12px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 640px) {
          .user-form-container {
            margin: 16px;
            padding: 20px;
          }
          
          .form-header h2 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}