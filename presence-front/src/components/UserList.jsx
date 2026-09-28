import { useEffect, useState, useCallback } from "react";
import api from "../api/api";

export default function UserList({ refresh, onUserSelect }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/users");
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.error("Erreur chargement users:", err);
      setError("Impossible de charger la liste des utilisateurs");
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/users/${id}`);
      await loadUsers();
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error("Erreur suppression:", err);
      setError("Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [refresh, loadUsers]);

  useEffect(() => {
    const filtered = users.filter(user => 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleUserClick = (user) => {
    if (onUserSelect) {
      onUserSelect(user);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="user-list-container">
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-list-container">
      <div className="list-header">
        <div className="header-title">
          <h2>👥 Utilisateurs</h2>
          <span className="user-count">{filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''}</span>
        </div>
        
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>
              ✕
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={loadUsers}>Réessayer</button>
        </div>
      )}

      {filteredUsers.length === 0 && !loading && (
        <div className="empty-state">
          {searchTerm ? (
            <>
              <span className="empty-icon">🔍</span>
              <p>Aucun utilisateur ne correspond à "{searchTerm}"</p>
              <button onClick={() => setSearchTerm("")} className="clear-btn">
                Effacer la recherche
              </button>
            </>
          ) : (
            <>
              <span className="empty-icon">👤</span>
              <p>Aucun utilisateur trouvé</p>
              <p className="empty-hint">Créez votre premier utilisateur</p>
            </>
          )}
        </div>
      )}

      <div className="users-grid">
        {filteredUsers.map((user) => (
          <div 
            key={user.id} 
            className={`user-card ${onUserSelect ? 'clickable' : ''}`}
            onClick={() => handleUserClick(user)}
          >
            <div className="user-avatar">
              {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "?"}
            </div>
            
            <div className="user-info">
              <div className="user-name">{user.name || "Nom non défini"}</div>
              <div className="user-email">{user.email}</div>
              <div className="user-id">ID: {user.id}</div>
            </div>

            <div className="user-actions">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(user.id);
                }}
                className="delete-btn"
                title="Supprimer"
              >
                🗑️
              </button>
            </div>

            {/* Confirmation de suppression */}
            {showDeleteConfirm === user.id && (
              <div className="delete-confirm-overlay" onClick={(e) => e.stopPropagation()}>
                <div className="delete-confirm-dialog">
                  <p>Supprimer "{user.name || user.email}" ?</p>
                  <div className="confirm-buttons">
                    <button 
                      onClick={() => deleteUser(user.id)}
                      disabled={deletingId === user.id}
                      className="confirm-delete"
                    >
                      {deletingId === user.id ? (
                        <span className="spinner-small"></span>
                      ) : (
                        "Supprimer"
                      )}
                    </button>
                    <button 
                      onClick={() => setShowDeleteConfirm(null)}
                      className="cancel-delete"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .user-list-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .list-header {
          margin-bottom: 24px;
        }

        .header-title {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .header-title h2 {
          margin: 0;
          color: #1a1a2e;
          font-size: 1.8rem;
        }

        .user-count {
          background: #e2e8f0;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          color: #4a5568;
          font-weight: 500;
        }

        .search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          font-size: 1rem;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 12px 40px 12px 40px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.2s;
          font-family: inherit;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .clear-search {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
          color: #a0aec0;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .clear-search:hover {
          background: #edf2f7;
          color: #4a5568;
        }

        .error-banner {
          background: #fed7d7;
          color: #c53030;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .error-banner button {
          background: #c53030;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: #f7fafc;
          border-radius: 12px;
          color: #718096;
        }

        .empty-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 16px;
        }

        .empty-hint {
          font-size: 0.85rem;
          margin-top: 8px;
          color: #a0aec0;
        }

        .clear-btn {
          margin-top: 16px;
          padding: 8px 16px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .users-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .user-card {
          background: white;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          position: relative;
        }

        .user-card.clickable {
          cursor: pointer;
        }

        .user-card.clickable:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          background: #f7fafc;
        }

        .user-avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .user-info {
          flex: 1;
        }

        .user-name {
          font-weight: 600;
          color: #2d3748;
          font-size: 1.1rem;
          margin-bottom: 4px;
        }

        .user-email {
          color: #718096;
          font-size: 0.85rem;
          margin-bottom: 4px;
        }

        .user-id {
          color: #a0aec0;
          font-size: 0.7rem;
          font-family: monospace;
        }

        .user-actions {
          flex-shrink: 0;
        }

        .delete-btn {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s;
          opacity: 0.6;
        }

        .delete-btn:hover {
          background: #fed7d7;
          opacity: 1;
          transform: scale(1.1);
        }

        .delete-confirm-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .delete-confirm-dialog {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          min-width: 280px;
        }

        .delete-confirm-dialog p {
          margin: 0 0 20px 0;
          color: #2d3748;
        }

        .confirm-buttons {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .confirm-delete {
          background: #f56565;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
        }

        .confirm-delete:hover:not(:disabled) {
          background: #e53e3e;
        }

        .cancel-delete {
          background: #e2e8f0;
          color: #4a5568;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
        }

        .loading-state {
          text-align: center;
          padding: 60px 20px;
        }

        .spinner-large, .spinner-small {
          display: inline-block;
          border: 3px solid #e2e8f0;
          border-radius: 50%;
          border-top-color: #667eea;
          animation: spin 0.8s linear infinite;
        }

        .spinner-large {
          width: 40px;
          height: 40px;
        }

        .spinner-small {
          width: 16px;
          height: 16px;
          border-width: 2px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 640px) {
          .user-list-container {
            padding: 12px;
          }
          
          .user-card {
            flex-wrap: wrap;
          }
          
          .user-info {
            flex: 1 1 100%;
            order: 2;
          }
          
          .user-actions {
            order: 3;
            margin-left: auto;
          }
          
          .delete-confirm-dialog {
            margin: 16px;
            width: auto;
          }
        }
      `}</style>
    </div>
  );
}