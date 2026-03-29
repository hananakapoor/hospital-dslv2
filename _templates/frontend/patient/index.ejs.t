---
to: generated/frontend/src/pages/<%= Name %>Page.jsx
---
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function <%= Name %>Page() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true);
    const res = await axios.get('/api/<%= name.toLowerCase() %>');
    setItems(res.data);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/<%= name.toLowerCase() %>', form);
    setForm({});
    fetchItems();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-800 mb-6"><%= Name %> Management</h1>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Add New <%= Name %></h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
<%_ fields.forEach(field => { _%>
          <div>
            <label className="block text-sm font-medium text-gray-700"><%= field.label %></label>
            <input
              type="<%= field.inputType || 'text' %>"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={form.<%= field.name %> || ''}
              onChange={e => setForm({...form, <%= field.name %>: e.target.value})}
            />
          </div>
<%_ }); _%>
          <div className="col-span-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Save <%= Name %>
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
<%_ fields.forEach(field => { _%>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"><%= field.label %></th>
<%_ }); _%>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="<%= fields.length + 1 %>" className="text-center py-4">Loading...</td></tr>
            ) : items.map(item => (
              <tr key={item._id}>
<%_ fields.forEach(field => { _%>
                <td className="px-6 py-4 text-sm">{item.<%= field.name %>}</td>
<%_ }); _%>
                <td className="px-6 py-4 text-sm">
                  <button className="text-red-500 hover:text-red-700"
                    onClick={async () => { await axios.delete(`/api/<%= name.toLowerCase() %>/${item._id}`); fetchItems(); }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}