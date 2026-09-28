import { useState } from "react";
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";
import PresenceList from "./components/PresenceList";
import './App.css'
function App() {
  const [refresh, setRefresh] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);

  const handleUserCreated = () => {
    setRefresh(!refresh);
    setShowUserForm(false);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setActiveTab("presences");
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">📋</span>
            <h1>Gestion de Présence Bruno</h1>
          </div>
          <div className="header-stats">
            <span className="stat-badge">v1.0</span>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="nav-tabs">
        <button
          className={`tab ${activeTab === "users" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("users");
            setSelectedUser(null);
            setShowUserForm(false);
          }}
        >
          <span className="tab-icon">👥</span>
          Utilisateurs
          <span className="tab-badge">Gestion</span>
        </button>
        <button
          className={`tab ${activeTab === "presences" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("presences");
            setShowUserForm(false);
          }}
        >
          <span className="tab-icon">✅</span>
          Présences
          <span className="tab-badge">Suivi</span>
        </button>
      </div>

      {/* Main Content */}
      <main className="app-main">
        {activeTab === "users" && (
          <div className="users-section">
            <div className="section-header">
              <div className="section-title">
                <h2>👤 Gestion des utilisateurs</h2>
                <p>Créez et gérez les utilisateurs de votre système</p>
              </div>
              <button
                className="btn-primary"
                onClick={() => setShowUserForm(!showUserForm)}
              >
                {showUserForm ? "✕ Fermer" : "+ Nouvel utilisateur"}
              </button>
            </div>

            {showUserForm && (
              <div className="form-wrapper">
                <UserForm onUserCreated={handleUserCreated} />
              </div>
            )}

            <div className="list-wrapper">
              <div className="list-header-actions">
                <h3>📋 Liste des utilisateurs</h3>
                <button 
                  className="btn-refresh"
                  onClick={() => setRefresh(!refresh)}
                  title="Actualiser"
                >
                  🔄 Actualiser
                </button>
              </div>
              <UserList 
                refresh={refresh} 
                onUserSelect={handleUserSelect}
              />
            </div>
          </div>
        )}

        {activeTab === "presences" && (
          <div className="presences-section">
            <div className="section-header">
              <div className="section-title">
                <h2>✅ Gestion des présences</h2>
                <p>Suivez et modifiez les présences des utilisateurs</p>
              </div>
            </div>

            {selectedUser && (
              <div className="selected-user-info">
                <span className="info-label">Filtré par :</span>
                <span className="user-badge">
                  👤 {selectedUser.name} - {selectedUser.email}
                </span>
                <button 
                  className="clear-filter"
                  onClick={() => setSelectedUser(null)}
                >
                  ✕ Effacer
                </button>
              </div>
            )}

            <div className="list-wrapper">
              <PresenceList selectedUser={selectedUser} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>© 2024 - Système de Gestion de Présence</p>
        <div className="footer-links">
          <button onClick={() => setRefresh(!refresh)}>🔄 Synchroniser</button>
        </div>
      </footer>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .app-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* Header */
        .app-header {
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          font-size: 2rem;
        }

        .logo h1 {
          margin: 0;
          color: #1a1a2e;
          font-size: 1.5rem;
        }

        .header-stats {
          display: flex;
          gap: 8px;
        }

        .stat-badge {
          background: #e2e8f0;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          color: #4a5568;
        }

        /* Navigation Tabs */
        .nav-tabs {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          gap: 8px;
        }

        .tab {
          padding: 12px 24px;
          background: rgba(255,255,255,0.9);
          border: none;
          border-radius: 12px 12px 0 0;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #4a5568;
        }

        .tab:hover {
          background: white;
          transform: translateY(-2px);
        }

        .tab.active {
          background: white;
          color: #667eea;
          box-shadow: 0 -2px 8px rgba(0,0,0,0.05);
        }

        .tab-icon {
          font-size: 1.2rem;
        }

        .tab-badge {
          font-size: 0.7rem;
          background: #e2e8f0;
          padding: 2px 6px;
          border-radius: 12px;
          margin-left: 4px;
        }

        /* Main Content */
        .app-main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 24px 20px;
        }

        .users-section,
        .presences-section {
          animation: fadeIn 0.3s ease-out;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
          background: white;
          padding: 20px;
          border-radius: 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .section-title h2 {
          margin: 0 0 8px 0;
          color: #1a1a2e;
        }

        .section-title p {
          margin: 0;
          color: #718096;
          font-size: 0.9rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-refresh {
          background: #4a5568;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
        }

        .form-wrapper {
          margin-bottom: 32px;
          animation: slideDown 0.3s ease-out;
        }

        .list-wrapper {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .list-header-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 2px solid #e2e8f0;
        }

        .list-header-actions h3 {
          margin: 0;
          color: #4a5568;
        }

        .selected-user-info {
          background: #ebf8ff;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .info-label {
          font-weight: 600;
          color: #2c5282;
        }

        .user-badge {
          background: #bee3f8;
          padding: 4px 12px;
          border-radius: 20px;
          color: #2c5282;
          font-size: 0.9rem;
        }

        .clear-filter {
          background: none;
          border: none;
          color: #e53e3e;
          cursor: pointer;
          font-size: 0.85rem;
          padding: 4px 8px;
          border-radius: 6px;
        }

        .clear-filter:hover {
          background: #fed7d7;
        }

        /* Footer */
        .app-footer {
          background: white;
          margin-top: 40px;
          padding: 20px;
          text-align: center;
          color: #718096;
          border-top: 1px solid #e2e8f0;
        }

        .footer-links {
          margin-top: 8px;
        }

        .footer-links button {
          background: none;
          border: none;
          color: #667eea;
          cursor: pointer;
          font-size: 0.85rem;
        }

        /* Animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }

          .nav-tabs {
            padding: 0 12px;
          }

          .tab {
            flex: 1;
            justify-content: center;
            padding: 10px 16px;
            font-size: 0.85rem;
          }

          .tab-badge {
            display: none;
          }

          .app-main {
            padding: 16px 12px;
          }

          .section-header {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
          }

          .btn-primary {
            width: 100%;
          }

          .list-wrapper {
            padding: 16px;
          }

          .selected-user-info {
            flex-direction: column;
            align-items: stretch;
          }
        }

        @media (max-width: 480px) {
          .logo h1 {
            font-size: 1.2rem;
          }

          .tab {
            padding: 8px 12px;
            font-size: 0.75rem;
          }

          .tab-icon {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default App;