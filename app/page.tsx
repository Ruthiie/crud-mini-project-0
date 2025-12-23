"use client";

import { useEffect, useState } from "react";

// Type for our item
type Item = {
  id: number;
  name: string;
};

export default function Home() {
  // ITEMS STATE (all items from the API)
  const [items, setItems] = useState<Item[]>([]);

  // NEW ITEM INPUT STATE
  const [newItem, setNewItem] = useState("");

  // SEARCH STATE (for real-time filtering)
  const [search, setSearch] = useState("");

  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // EDITING STATE
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  //FETCH ITEMS FROM API (READ)
  useEffect(() => {
    fetch(`${location.origin}/api/items`)
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  // ADD ITEM (CREATE)
  const addItem = async () => {
    if (!newItem) return;

    const res = await fetch(`${location.origin}/api/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newItem }),
    });

    const item = await res.json();
    setItems([...items, item]);
    setNewItem("");
  };

  // UPDATE ITEM (EDIT)
  const updateItem = async (id: number) => {
    await fetch(`${location.origin}/api/items`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name: editValue }),
    });

    setItems(
      items.map((item) =>
        item.id === id ? { ...item, name: editValue } : item
      )
    );

    setEditingId(null);
    setEditValue("");
  };

  // DELETE ITEM
  const deleteItem = async (id: number) => {
    await fetch(`${location.origin}/api/items`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setItems(items.filter((item) => item.id !== id));
  };

  // FILTER ITEMS (SEARCH)
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // PAGINATE FILTERED ITEMS
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-6">CRUD Mini Project</h1>

      {/* INPUTS */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <input
          className="px-3 py-2 text-black rounded"
          placeholder="Enter item name"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />

        <input
          className="px-3 py-2 text-black rounded"
          placeholder="Search items..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <button
          onClick={addItem}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* ITEM LIST */}
      <ul className="space-y-3">
        {paginatedItems.map((item) => (
          <li
            key={item.id}
            className="bg-gray-800 p-4 rounded flex justify-between items-center"
          >
            {editingId === item.id ? (
              <div className="flex gap-2">
                <input
                  className="px-2 py-1 text-black rounded"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
                <button
                  className="bg-green-600 px-3 py-1 rounded"
                  onClick={() => updateItem(item.id)}
                >
                  Save
                </button>
              </div>
            ) : (
              <span>{item.name}</span>
            )}

            <div className="flex gap-2">
              {editingId !== item.id && (
                <button
                  className="bg-yellow-600 px-3 py-1 rounded text-sm"
                  onClick={() => {
                    setEditingId(item.id);
                    setEditValue(item.name);
                  }}
                >
                  Edit
                </button>
              )}

              <button
                className="bg-red-600 px-3 py-1 rounded text-sm"
                onClick={() => deleteItem(item.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* PAGINATION CONTROLS */}
      <div className="flex gap-4 mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="bg-gray-700 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="self-center">
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="bg-gray-700 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </main>
  );
}
