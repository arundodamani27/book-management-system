const messageEl = document.getElementById('message');
const booksTableBody = document.getElementById('booksTableBody');


async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : await response.text();
  if (!response.ok) {
    const detail = typeof data === 'object' && data?.error ? data.error : `Request failed (${response.status})`;
    throw new Error(detail);
  }
  return data;
}


function showMessage(text, isError = false) {
  messageEl.textContent = text;
  messageEl.className = `message ${isError ? 'error' : 'success'}`;
}
function clearMessage() {
  messageEl.textContent = '';
  messageEl.className = 'message hidden';
}
function renderBooks(books) {
  booksTableBody.innerHTML = '';
  if (!Array.isArray(books) || books.length === 0) {
    booksTableBody.innerHTML = '<tr><td colspan="4">No books found.</td></tr>';
    return;
  }
  books.forEach((book) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${book.id}</td><td>${escapeHtml(book.author)}</td><td>${Number(book.price).toFixed(2)}</td><td><button class="small danger" data-delete-id="${book.id}">Delete</button></td>`;
    booksTableBody.appendChild(row);
  });
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}
async function loadBooks() {
  try {
    const books = await requestJson('/books');
    renderBooks(books);
  } catch (error) {
    booksTableBody.innerHTML = '<tr><td colspan="4">Failed to load books.</td></tr>';
    showMessage(error.message, true);
  }
}


async function getBookById() {
  clearMessage();
  const id = document.getElementById('bookId').value.trim();
  if (!id) return showMessage('Enter a book ID.', true);
  try {
    const book = await requestJson(`/book/${encodeURIComponent(id)}`);
    renderBooks([book]);
    showMessage(`Book ${book.id} found.`);
  } catch (error) {
    showMessage(error.message, true);
  }
}


document.getElementById('addBookForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  clearMessage();
  const author = document.getElementById('author').value.trim();
  const price = document.getElementById('price').value;
  try {
    await requestJson('/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, price })
    });
    event.target.reset();
    showMessage('Book added successfully.');
    await loadBooks();
  } catch (error) {
    showMessage(error.message, true);
  }
});

document.getElementById('getBookBtn').addEventListener('click', getBookById);
document.getElementById('showAllBtn').addEventListener('click', () => { clearMessage(); loadBooks(); });
booksTableBody.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-delete-id]');
  if (!button) return;
  const id = button.dataset.deleteId;
  if (!confirm(`Delete book ${id}?`)) return;
  try {
    await requestJson(`/book/${id}`, { method: 'DELETE' });
    showMessage('Book deleted successfully.');
    await loadBooks();
  } catch (error) {
    showMessage(error.message, true);
  }
});

loadBooks();
