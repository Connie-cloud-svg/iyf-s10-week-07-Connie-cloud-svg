// ===========================
//   MIND DUMP — notes.js
// ===========================

// --- Grab elements from the DOM ---
const titleInput = document.getElementById("note-title");
const bodyInput = document.getElementById("note-content");
const addNoteBtn = document.getElementById("add-note");
const noteContainer = document.getElementById("note-container");

// --- Load notes from localStorage when page opens ---
let notes = JSON.parse(localStorage.getItem("mindDumpNotes")) || [];

// --- Render all notes on page load ---
renderNotes();

// ===========================
//   ADD A NOTE
// ===========================
function addNote() {
  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  // Don't add empty notes
  if (!title && !body) {
    alert("Please write something before adding a note! 📝");
    return;
  }

  // Create a new note object
  const newNote = {
    id: Date.now(),         // unique ID using timestamp
    title: title || "Untitled",
    body: body || "",
  };

  // Add to our notes array
  notes.push(newNote);

  // Save to localStorage
  saveNotes();

  // Re-render the notes

  renderNotes();

  // Clear the input fields
  titleInput.value = "";
  bodyInput.value = "";
  titleInput.focus();
}

// ===========================
//   DELETE A NOTE
// ===========================
function deleteNote(id) {
  // Filter out the note with the matching id
  notes = notes.filter(note => note.id !== id);

  // Save updated list to localStorage
  saveNotes();

  // Re-render
  renderNotes();
}

// ===========================
//   RENDER ALL NOTES
// ===========================
function renderNotes() {
  // Clear the container first
  noteContainer.innerHTML = "";

  // Show empty state if no notes
  if (notes.length === 0) {
    noteContainer.innerHTML = `
      <p class="empty-state">No notes yet. Anything in mind for today? 🧠</p>
    `;
    return;
  }

  // Loop through notes and create a card for each
  notes.forEach(note => {
    const card = document.createElement("div");
    card.classList.add("note-card");

    card.innerHTML = `
      <h3>${escapeHTML(note.title)}</h3>
      <p>${escapeHTML(note.body)}</p>
      <button class="delete-btn" onclick="deleteNote(${note.id})">🗑 Delete</button>
    `;
    card.addEventListener("click", () => openNote(note.id));

    noteContainer.appendChild(card);
  });
}



// ===========================
//   SAVE NOTES TO LOCALSTORAGE
// ===========================
function saveNotes() {
  localStorage.setItem("mindDumpNotes", JSON.stringify(notes));
}

// ===========================
//   SECURITY: Prevent XSS
//   (Escapes special characters)
// ===========================
function escapeHTML(str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ===========================
//   BONUS: Press Enter to add
// ===========================
titleInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    addNote();
  }
});

// ===========================
//   OPEN NOTE MODAL
// ===========================
function openNote(id) {
  const note = notes.find(note => note.id === id);
  if (!note) return;

  document.getElementById("modal-title").textContent = note.title;
  document.getElementById("modal-body").textContent = note.body;
  document.getElementById("modal-overlay").classList.add("active");
}

// ===========================
//   CLOSE NOTE MODAL
// ===========================
function closeNote() {
  document.getElementById("modal-overlay").classList.remove("active");
}

