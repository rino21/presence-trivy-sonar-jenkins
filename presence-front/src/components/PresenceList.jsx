import { useEffect, useState } from "react";
import api from "../api/api";

export default function PresenceList() {
  const [presences, setPresences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/presences");
      setPresences(res.data);
    } catch (err) {
      setError("Erreur lors du chargement des présences");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const togglePresence = async (id, currentStatus) => {
    setTogglingId(id);
    setError(null);
    try {
      await api.put(`/presences/${id}`, {
        status: !currentStatus,
      });
      await load(); // Recharge après mise à jour
    } catch (err) {
      setError("Erreur lors du changement de statut");
      console.error(err);
    } finally {
      setTogglingId(null);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading && presences.length === 0) {
    return (
      <div className="presence-loading">
        <div className="spinner"></div>
        <p>Chargement des présences...</p>
      </div>
    );
  }

  return (
    <div className="presence-container">
      <div className="presence-header">
        <h2>📋 Liste des présences</h2>
        <button onClick={load} className="refresh-btn" disabled={loading}>
          🔄 Actualiser
        </button>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {presences.length === 0 && !loading ? (
        <div className="empty-state">
          <p>Aucune présence enregistrée</p>
        </div>
      ) : (
        <div className="presence-grid">
          {presences.map((p) => (
            <div key={p.id} className={`presence-card ${p.status ? "present" : "absent"}`}>
              <div className="presence-info">
                <div className="user-avatar">
                  {p.user?.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="user-details">
                  <div className="user-name">{p.user?.name || "Utilisateur inconnu"}</div>
                  <div className={`status-badge ${p.status ? "present" : "absent"}`}>
                    {p.status ? "✅ Présent" : "❌ Absent"}
                  </div>
                </div>
              </div>
              <button
                onClick={() => togglePresence(p.id, p.status)}
                disabled={togglingId === p.id}
                className={`toggle-btn ${p.status ? "set-absent" : "set-present"}`}
              >
                {togglingId === p.id ? (
                  <span className="btn-spinner"></span>
                ) : (
                  p.status ? "Marquer absent" : "Marquer présent"
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .presence-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .presence-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .presence-header h2 {
          margin: 0;
          color: #1a1a2e;
          font-size: 1.8rem;
        }

        .refresh-btn {
          padding: 8px 16px;
          background: #4a5568;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .refresh-btn:hover:not(:disabled) {
          background: #2d3748;
          transform: translateY(-1px);
        }

        .refresh-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          background: #fed7d7;
          color: #c53030;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          border-left: 4px solid #c53030;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #718096;
          background: #f7fafc;
          border-radius: 12px;
        }

        .presence-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 16px;
        }

        .presence-card {
          background: white;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          border-left: 4px solid;
        }

        .presence-card.present {
          border-left-color: #48bb78;
        }

        .presence-card.absent {
          border-left-color: #f56565;
        }

        .presence-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .presence-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .user-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 20px;
        }

        .user-details {
          flex: 1;
        }

        .user-name {
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 4px;
        }

        .status-badge {
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 20px;
          display: inline-block;
          font-weight: 500;
        }

        .status-badge.present {
          background: #c6f6d5;
          color: #22543d;
        }

        .status-badge.absent {
          background: #fed7d7;
          color: #742a2a;
        }

        .toggle-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .toggle-btn.set-present {
          background: #48bb78;
          color: white;
        }

        .toggle-btn.set-present:hover:not(:disabled) {
          background: #38a169;
          transform: scale(1.02);
        }

        .toggle-btn.set-absent {
          background: #f56565;
          color: white;
        }

        .toggle-btn.set-absent:hover:not(:disabled) {
          background: #e53e3e;
          transform: scale(1.02);
        }

        .toggle-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .presence-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 400px;
          gap: 16px;
        }

        .spinner, .btn-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(0,0,0,0.1);
          border-radius: 50%;
          border-top-color: #667eea;
          animation: spin 0.8s linear infinite;
        }

        .btn-spinner {
          width: 16px;
          height: 16px;
          border-top-color: white;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 640px) {
          .presence-container {
            padding: 12px;
          }
          
          .presence-grid {
            grid-template-columns: 1fr;
          }
          
          .presence-card {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }
          
          .presence-info {
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  );
}