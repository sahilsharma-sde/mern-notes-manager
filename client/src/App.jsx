import { useEffect, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Fetch notes from backend
  const fetchNotes = async () => {
    try {
      const response = await fetch(`${API_URL}/api/notes`);
      const data = await response.json();

      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // Fetch notes when component loads
  useEffect(() => {
    fetchNotes();
  }, []);

  // Create a note
  const addNote = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Please enter both title and content");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error("Failed to create note");
      }

      setTitle("");
      setContent("");

      fetchNotes();
    } catch (error) {
      console.error(error);
      alert("Unable to create note");
    }
  };

  // Delete a note
  const deleteNote = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/notes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      fetchNotes();
    } catch (error) {
      console.error(error);
      alert("Unable to delete note");
    }
  };

  return (
    <div className="app">
      <header>
        <h1>📝 MERN Notes</h1>
        <p>Your simple cloud-based notes application</p>
      </header>

      <main>
        <form onSubmit={addNote} className="note-form">
          <h2>Create a Note</h2>

          <input
            type="text"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Write your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button type="submit">Add Note</button>
        </form>

        <section className="notes-section">
          <h2>My Notes ({notes.length})</h2>

          <div className="notes-grid">
            {notes.map((note) => (
              <article className="note-card" key={note._id}>
                <h3>{note.title}</h3>

                <p>{note.content}</p>

                <button
                  className="delete-btn"
                  onClick={() => deleteNote(note._id)}
                >
                  Delete
                </button>
              </article>
            ))}
          </div>

          {notes.length === 0 && (
            <p className="empty">No notes yet. Create your first note!</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;