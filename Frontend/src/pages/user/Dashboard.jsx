import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { passwordValidation } from "../../utils/validators";

const API_URL = "http://localhost:5000/api/users";

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchStores = async (searchText = search) => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${API_URL}/stores`, {
        headers: getAuthHeaders(),
        params: {
          search: searchText,
        },
      });

      setStores(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load stores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    fetchStores("");
  }, [navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStores(search);
  };

  const handleRating = async (storeId, rating) => {
    try {
      setMessage("");
      setError("");

      await axios.post(
        `${API_URL}/rate`,
        {
          store_id: storeId,
          rating,
        },
        {
          headers: getAuthHeaders(),
        }
      );

      setMessage("Rating saved");
      fetchStores();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to submit rating");
    }
  };

  const handlePasswordUpdate = async (e) => {
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Stores</p>
          <h1>User Dashboard</h1>
        </div>

        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <section className="workspace content-grid two-columns">
        <form className="panel" onSubmit={handleSearch}>
          <h2>Search Stores</h2>
          <label>
            Name or Address
            <input
              placeholder="Search by store name or address"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <button className="primary-button" type="submit">
            Search
          </button>
        </form>

        <form className="panel" onSubmit={handlePasswordUpdate}>
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
          <h2>Registered Stores</h2>
          <button type="button" onClick={() => fetchStores("")}>
            Refresh
          </button>
        </div>

        {message && <p>{message}</p>}
        {error && <small>{error}</small>}
        {loading && <p>Loading stores...</p>}

        {!loading && !error && stores.length === 0 && <p>No stores found.</p>}

        <div className="store-list">
          {stores.map((store) => (
            <article className="store-row" key={store.id}>
              <div>
                <h2>{store.name}</h2>
                <p>{store.address}</p>
                <span>
                  Overall Rating:{" "}
                  {store.average_rating
                    ? Number(store.average_rating).toFixed(1)
                    : "No ratings yet"}
                </span>
                <span>
                  Your Rating: {store.user_rating || "Not submitted"}
                </span>
              </div>

              <div className="rating-buttons" aria-label="Submit rating">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    className={
                      Number(store.user_rating) === rating ? "selected" : ""
                    }
                    key={rating}
                    onClick={() => handleRating(store.id, rating)}
                    title={`Rate ${rating}`}
                    type="button"
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default UserDashboard;
