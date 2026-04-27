import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { passwordValidation, sortRows } from "../../utils/validators";

const API_URL = "http://localhost:5000/api/owners";

const OwnerDashboard = () => {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [ratingSort, setRatingSort] = useState({
    key: "user_name",
    direction: "asc",
  });
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchRatings = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${API_URL}/ratings`, {
        headers: getAuthHeaders(),
      });

      setAverageRating(res.data.averageRating);
      setRatings(res.data.ratings || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load ratings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!localStorage.getItem("token") || user.role !== "store_owner") {
      navigate("/login");
      return;
    }

    fetchRatings();
  }, [navigate]);

  const updatePassword = async (e) => {
    e.preventDefault();

    try {
      setMessage("");
      setError("");

      await axios.put(
        `${API_URL}/update-password`,
        {
          newPassword,
        },
        {
          headers: getAuthHeaders(),
        }
      );

      setNewPassword("");
      setMessage("Password updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update password");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const changeSort = (key) => {
    setRatingSort((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedRatings = sortRows(ratings, ratingSort);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Store Owner</p>
          <h1>Owner Dashboard</h1>
        </div>

        <button type="button" onClick={logout}>
          Logout
        </button>
      </header>

      <section className="workspace content-grid two-columns">
        <article className="stat-card">
          <span>Average Store Rating</span>
          <strong>
            {averageRating ? Number(averageRating).toFixed(1) : "No ratings"}
          </strong>
        </article>

        <form className="panel" onSubmit={updatePassword}>
          <h2>Update Password</h2>
          <label>
            New Password
            <input
              placeholder="Enter new password"
              required
              type="password"
              {...passwordValidation}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </label>
          <button className="primary-button" type="submit">
            Update Password
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="toolbar">
          <h2>Users Who Rated Your Store</h2>
          <button type="button" onClick={fetchRatings}>
            Refresh
          </button>
        </div>

        {message && <p>{message}</p>}
        {error && <small>{error}</small>}
        {loading && <p>Loading ratings...</p>}

        {!loading && !error && ratings.length === 0 && (
          <p>No users have submitted ratings yet.</p>
        )}

        {ratings.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>
                    <button type="button" onClick={() => changeSort("store_name")}>
                      Store
                    </button>
                  </th>
                  <th>
                    <button type="button" onClick={() => changeSort("user_name")}>
                      User
                    </button>
                  </th>
                  <th>
                    <button type="button" onClick={() => changeSort("email")}>
                      Email
                    </button>
                  </th>
                  <th>
                    <button type="button" onClick={() => changeSort("address")}>
                      Address
                    </button>
                  </th>
                  <th>
                    <button type="button" onClick={() => changeSort("rating")}>
                      Rating
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedRatings.map((rating, index) => (
                  <tr key={`${rating.store_id}-${rating.email}-${index}`}>
                    <td>{rating.store_name}</td>
                    <td>{rating.user_name}</td>
                    <td>{rating.email}</td>
                    <td>{rating.address}</td>
                    <td>{rating.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
};

export default OwnerDashboard;
