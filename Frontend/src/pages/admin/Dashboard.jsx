import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  addressValidation,
  nameValidation,
  passwordValidation,
  sortRows,
} from "../../utils/validators";

const API_URL = "http://localhost:5000/api/admin";

const emptyUserForm = {
  name: "",
  email: "",
  password: "",
  address: "",
  role: "user",
};

const emptyStoreForm = {
  name: "",
  address: "",
  owner_id: "",
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [userForm, setUserForm] = useState(emptyUserForm);
  const [storeForm, setStoreForm] = useState(emptyStoreForm);
  const [userSearch, setUserSearch] = useState("");
  const [storeSearch, setStoreSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [userSort, setUserSort] = useState({ key: "name", direction: "asc" });
  const [storeSort, setStoreSort] = useState({ key: "name", direction: "asc" });
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const loadDashboard = async () => {
    const res = await axios.get(`${API_URL}/dashboard`, {
      headers: getAuthHeaders(),
    });
    setStats(res.data);
  };

  const loadUsers = async (search = userSearch, role = roleFilter) => {
    const res = await axios.get(`${API_URL}/users`, {
      headers: getAuthHeaders(),
      params: {
        search,
        role,
      },
    });
    setUsers(res.data);
  };

  const loadStores = async (search = storeSearch) => {
    const res = await axios.get(`${API_URL}/stores`, {
      headers: getAuthHeaders(),
      params: {
        search,
      },
    });
    setStores(res.data);
  };

  const loadAll = async () => {
    try {
      setError("");
      await Promise.all([loadDashboard(), loadUsers(), loadStores()]);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load admin data");
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!localStorage.getItem("token") || user.role !== "admin") {
      navigate("/login");
      return;
    }

    loadAll();
  }, [navigate]);

  const updateUserForm = (e) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  };

  const updateStoreForm = (e) => {
    setStoreForm({ ...storeForm, [e.target.name]: e.target.value });
  };

  const createUser = async (e) => {
    e.preventDefault();

    try {
      setMessage("");
      setError("");
      await axios.post(`${API_URL}/users`, userForm, {
        headers: getAuthHeaders(),
      });
      setUserForm(emptyUserForm);
      setMessage("User created successfully");
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create user");
    }
  };

  const createStore = async (e) => {
    e.preventDefault();

    try {
      setMessage("");
      setError("");
      await axios.post(
        `${API_URL}/create-store`,
        {
          ...storeForm,
          owner_id: storeForm.owner_id || null,
        },
        {
          headers: getAuthHeaders(),
        }
      );
      setStoreForm(emptyStoreForm);
      setMessage("Store created successfully");
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create store");
    }
  };

  const searchUsers = (e) => {
    e.preventDefault();
    loadUsers(userSearch, roleFilter);
  };

  const searchStores = (e) => {
    e.preventDefault();
    loadStores(storeSearch);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const changeUserSort = (key) => {
    setUserSort((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const changeStoreSort = (key) => {
    setStoreSort((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const ownerUsers = users.filter((user) => user.role === "store_owner");
  const sortedUsers = sortRows(users, userSort);
  const sortedStores = sortRows(stores, storeSort);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Administration</p>
          <h1>System Administrator</h1>
        </div>

        <button type="button" onClick={logout}>
          Logout
        </button>
      </header>

      <section className="workspace stats-grid">
        <article className="stat-card">
          <span>Total Users</span>
          <strong>{stats.totalUsers}</strong>
        </article>
        <article className="stat-card">
          <span>Total Stores</span>
          <strong>{stats.totalStores}</strong>
        </article>
        <article className="stat-card">
          <span>Total Ratings</span>
          <strong>{stats.totalRatings}</strong>
        </article>
      </section>

      {message && <p>{message}</p>}
      {error && <small>{error}</small>}

      <section className="content-grid two-columns">
        <form className="panel" onSubmit={createUser}>
          <h2>Add User</h2>
          <label>
            Name
            <input
              name="name"
              required
              {...nameValidation}
              value={userForm.name}
              onChange={updateUserForm}
            />
          </label>
          <label>
            Email
            <input
              name="email"
              required
              type="email"
              value={userForm.email}
              onChange={updateUserForm}
            />
          </label>
          <label>
            Password
            <input
              name="password"
              required
              type="password"
              {...passwordValidation}
              value={userForm.password}
              onChange={updateUserForm}
            />
          </label>
          <label>
            Address
            <input
              name="address"
              required
              {...addressValidation}
              value={userForm.address}
              onChange={updateUserForm}
            />
          </label>
          <label>
            Role
            <select name="role" value={userForm.role} onChange={updateUserForm}>
              <option value="user">Normal User</option>
              <option value="admin">Admin</option>
              <option value="store_owner">Store Owner</option>
            </select>
          </label>
          <button className="primary-button" type="submit">
            Add User
          </button>
        </form>

        <form className="panel" onSubmit={createStore}>
          <h2>Add Store</h2>
          <label>
            Store Name
            <input
              name="name"
              required
              value={storeForm.name}
              onChange={updateStoreForm}
            />
          </label>
          <label>
            Address
            <input
              name="address"
              required
              {...addressValidation}
              value={storeForm.address}
              onChange={updateStoreForm}
            />
          </label>
          <label>
            Owner
            <select
              name="owner_id"
              value={storeForm.owner_id}
              onChange={updateStoreForm}
            >
              <option value="">No owner</option>
              {ownerUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.email}
                </option>
              ))}
            </select>
          </label>
          <button className="primary-button" type="submit">
            Add Store
          </button>
        </form>
      </section>

      <section className="content-grid sidebar-layout">
        <div className="panel">
          <h2>User Details</h2>
          {selectedUser ? (
            <div className="user-details">
              <p>
                <strong>Name:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Address:</strong> {selectedUser.address}
              </p>
              <p>
                <strong>Role:</strong> {selectedUser.role}
              </p>
              {selectedUser.role === "store_owner" && (
                <p>
                  <strong>Rating:</strong>{" "}
                  {selectedUser.owner_rating
                    ? Number(selectedUser.owner_rating).toFixed(1)
                    : "No ratings yet"}
                </p>
              )}
            </div>
          ) : (
            <p>Select a user to view details.</p>
          )}
        </div>

        <div className="panel wide-panel">
          <form className="toolbar" onSubmit={searchUsers}>
            <h2>Users</h2>
            <input
              placeholder="Filter by name, email, address, or role"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="user">Normal User</option>
              <option value="admin">Admin</option>
              <option value="store_owner">Store Owner</option>
            </select>
            <button type="submit">Apply</button>
          </form>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>
                    <button type="button" onClick={() => changeUserSort("name")}>
                      Name
                    </button>
                  </th>
                  <th>
                    <button type="button" onClick={() => changeUserSort("email")}>
                      Email
                    </button>
                  </th>
                  <th>
                    <button type="button" onClick={() => changeUserSort("address")}>
                      Address
                    </button>
                  </th>
                  <th>
                    <button type="button" onClick={() => changeUserSort("role")}>
                      Role
                    </button>
                  </th>
                  <th>
                    <button
                      type="button"
                      onClick={() => changeUserSort("owner_rating")}
                    >
                      Owner Rating
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((user) => (
                  <tr key={user.id} onClick={() => setSelectedUser(user)}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.address}</td>
                    <td>{user.role}</td>
                    <td>
                      {user.role === "store_owner" && user.owner_rating
                        ? Number(user.owner_rating).toFixed(1)
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="panel">
        <form className="toolbar" onSubmit={searchStores}>
          <h2>Stores</h2>
          <input
            placeholder="Filter by store name, owner email, or address"
            value={storeSearch}
            onChange={(e) => setStoreSearch(e.target.value)}
          />
          <button type="submit">Apply</button>
        </form>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>
                  <button type="button" onClick={() => changeStoreSort("name")}>
                    Name
                  </button>
                </th>
                <th>
                  <button type="button" onClick={() => changeStoreSort("email")}>
                    Email
                  </button>
                </th>
                <th>
                  <button type="button" onClick={() => changeStoreSort("address")}>
                    Address
                  </button>
                </th>
                <th>
                  <button
                    type="button"
                    onClick={() => changeStoreSort("average_rating")}
                  >
                    Rating
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedStores.map((store) => (
                <tr key={store.id}>
                  <td>{store.name}</td>
                  <td>{store.email || "-"}</td>
                  <td>{store.address}</td>
                  <td>
                    {store.average_rating
                      ? Number(store.average_rating).toFixed(1)
                      : "No ratings yet"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default AdminDashboard;
