document.addEventListener('DOMContentLoaded', function () {

  // Function to generate unique ID (timestamp)
  function generateId() {
    return +new Date();
  }

  // Function to load data from localStorage
  function loadDataFromStorage() {
    const localStorageData = localStorage.getItem('books');
    return localStorageData ? JSON.parse(localStorageData) : [];
  }

  // Function to save data to localStorage
  function saveDataToStorage(data) {
    localStorage.setItem('books', JSON.stringify(data));
  }

  // Function to render books based on their completeness
  function renderBooks() {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');
    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML = '';

    const books = loadDataFromStorage();
    const incompleteBooks = books.filter(book => !book.isComplete);
    const completeBooks = books.filter(book => book.isComplete);

    // Handle incomplete bookshelf list
    if (incompleteBooks.length === 0) {
      const emptyIncompleteMessage = document.createElement('p');
      emptyIncompleteMessage.textContent = 'Belum ada buku.';
      incompleteBookshelfList.appendChild(emptyIncompleteMessage);
      incompleteBookshelfList.classList.add('empty');
    } else {
      incompleteBookshelfList.classList.remove('empty');
      incompleteBookshelfList.classList.add('book_list');
      incompleteBooks.forEach(book => {
        const bookItem = createBookItem(book);
        incompleteBookshelfList.appendChild(bookItem);
      });
    }

    // Handle complete bookshelf list
    if (completeBooks.length === 0) {
      const emptyCompleteMessage = document.createElement('p');
      emptyCompleteMessage.textContent = 'Belum ada buku.';
      completeBookshelfList.appendChild(emptyCompleteMessage);
      completeBookshelfList.classList.add('empty');
    } else {
      completeBookshelfList.classList.add('book_list');
      completeBookshelfList.classList.remove('empty');
      completeBooks.forEach(book => {
        const bookItem = createBookItem(book);
        completeBookshelfList.appendChild(bookItem);
      });
    }
  }


  // Helper function to create book item element
  function createBookItem(book) {
    const bookItem = document.createElement('article');
    bookItem.classList.add('book_item');
    bookItem.setAttribute('data-book-id', book.id);

    const bookTitle = document.createElement('h3');
    bookTitle.textContent = book.title;

    const bookAuthor = document.createElement('p');
    bookAuthor.textContent = `Penulis: ${book.author}`;

    const bookYear = document.createElement('p');
    bookYear.textContent = `Tahun: ${book.year}`;

    const actionContainer = document.createElement('div');
    actionContainer.classList.add('action');

    const finishButton = document.createElement('button');
    if (book.isComplete) {
      finishButton.textContent = 'Belum selesai di Baca';
      finishButton.classList.add('green');
    } else {
      finishButton.textContent = 'Selesai dibaca';
      finishButton.classList.add('green');
    }

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit buku';
    editButton.classList.add('blue');

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Hapus buku';
    deleteButton.classList.add('red');

    actionContainer.appendChild(finishButton);
    actionContainer.appendChild(editButton);
    actionContainer.appendChild(deleteButton);

    bookItem.appendChild(bookTitle);
    bookItem.appendChild(bookAuthor);
    bookItem.appendChild(bookYear);
    bookItem.appendChild(actionContainer);

    // Event listeners for buttons
    finishButton.addEventListener('click', function () {
      toggleBookCompleteStatus(book.id);
    });

    editButton.addEventListener('click', function () {
      showEditForm(book.id);
    });

    deleteButton.addEventListener('click', function () {
      deleteBook(book.id);
    });

    return bookItem;
  }

  // Function to add a new book
  const inputBookForm = document.getElementById('inputBook');
  inputBookForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year =  parseInt(document.getElementById('inputBookYear').value);
    const isComplete = document.getElementById('inputBookIsComplete').checked;

    const newBook = {
      id: generateId(),
      title: title,
      author: author,
      year: year,
      isComplete: isComplete
    };

    const books = loadDataFromStorage();
    books.push(newBook);
    saveDataToStorage(books);
    renderBooks();

    inputBookForm.reset();

    // Display green notification for adding a new book
    displayNotification('Buku berhasil ditambahkan!', 'green');
  });

  // Function to toggle book completeness status
  function toggleBookCompleteStatus(id) {
    const books = loadDataFromStorage();
    const index = books.findIndex(book => book.id == id);
    if (index !== -1) {
      books[index].isComplete = !books[index].isComplete;
      saveDataToStorage(books);
      renderBooks();

      // Display green notification for toggling completeness status
      displayNotification('Status baca buku diperbarui!', 'green');
    }
  }

  // Function to delete a book
  function deleteBook(id) {
    const books = loadDataFromStorage();
    const filteredBooks = books.filter(book => book.id != id);
    saveDataToStorage(filteredBooks);
    renderBooks();

    // Display red notification for deleting a book
    displayNotification('Buku berhasil dihapus!', 'red');
  }

  // Function to show edit form with initial values
  const editBookForm = document.createElement('form');
  editBookForm.id = 'editBookForm';
  editBookForm.innerHTML = `
    <h2>Edit Buku</h2>
    <div class="input">
      <label for="editBookTitle">Judul</label>
      <input id="editBookTitle" type="text" required>
    </div>
    <div class="input">
      <label for="editBookAuthor">Penulis</label>
      <input id="editBookAuthor" type="text" required>
    </div>
    <div class="input">
      <label for="editBookYear">Tahun</label>
      <input id="editBookYear" type="number" required>
    </div>
    <button id="editBookSubmit" type="submit">Simpan Perubahan</button>
    <button id="editBookCancel" type="button" class="red">Batal</button>
  `;
  document.body.appendChild(editBookForm);

  const editBookTitle = document.getElementById('editBookTitle');
  const editBookAuthor = document.getElementById('editBookAuthor');
  const editBookYear = document.getElementById('editBookYear');
  const editBookSubmitButton = document.getElementById('editBookSubmit');
  const editBookCancelButton = document.getElementById('editBookCancel');

  function showEditForm(id) {
    const books = loadDataFromStorage();
    const bookToEdit = books.find(book => book.id == id);
    if (bookToEdit) {
      editBookTitle.value = bookToEdit.title;
      editBookAuthor.value = bookToEdit.author;
      editBookYear.value = bookToEdit.year;

      // Centering the edit form
      editBookForm.style.position = 'fixed';
      editBookForm.style.top = '50%';
      editBookForm.style.left = '50%';
      editBookForm.style.transform = 'translate(-50%, -50%)';
      editBookForm.style.display = 'block';

      editBookSubmitButton.onclick = function (event) {
        event.preventDefault();
        const editedBook = {
          id: bookToEdit.id,
          title: editBookTitle.value,
          author: editBookAuthor.value,
          year: parseInt(editBookYear.value),
          isComplete: bookToEdit.isComplete
        };
        const index = books.findIndex(book => book.id == id);
        if (index !== -1) {
          books[index] = editedBook;
          saveDataToStorage(books);
          editBookForm.style.display = 'none';
          renderBooks();

          // Display blue notification for editing a book
          displayNotification('Perubahan pada buku berhasil disimpan!', 'blue');
        }
      };

      editBookCancelButton.onclick = function () {
        editBookForm.style.display = 'none';
      };
    }
  }

  // Function to handle book search
  const searchBookForm = document.getElementById('searchBook');
  const searchBookInput = document.getElementById('searchBookTitle');

  searchBookForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const searchQuery = searchBookInput.value.toLowerCase();
    const books = loadDataFromStorage();
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchQuery));
    
    // Clear previous search results
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');
    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML = '';

    // Render filtered books
    if (filteredBooks.length === 0) {
        const emptyIncompleteMessage = document.createElement('p');
        emptyIncompleteMessage.textContent = 'Tidak ada hasil untuk pencarian ini.';
        incompleteBookshelfList.appendChild(emptyIncompleteMessage);
        incompleteBookshelfList.classList.add('empty');

        const emptyCompleteMessage = document.createElement('p');
        emptyCompleteMessage.textContent = 'Tidak ada hasil untuk pencarian ini.';
        completeBookshelfList.appendChild(emptyCompleteMessage);
        completeBookshelfList.classList.add('empty');
    } else {
        incompleteBookshelfList.classList.remove('empty');
        completeBookshelfList.classList.remove('empty');
        filteredBooks.forEach(book => {
            const bookItem = createBookItem(book);
            if (book.isComplete) {
                completeBookshelfList.appendChild(bookItem);
            } else {
                incompleteBookshelfList.appendChild(bookItem);
            }
        });
    }
  });

  // Function to display notifications
  function displayNotification(message, type) {
    const notificationContainer = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.classList.add('notification');
    
    // Set notification style based on type
    if (type === 'green') {
      notification.classList.add('notification-green');
    } else if (type === 'red') {
      notification.classList.add('notification-red');
    } else if (type === 'blue') {
      notification.classList.add('notification-blue');
    }
    
    notification.textContent = message;
    notificationContainer.appendChild(notification);

    // Remove notification after 2 seconds with fade-out animation
    setTimeout(() => {
      notification.style.animation = 'fadeOut 2s';
      setTimeout(() => {
        notification.remove();
      }, 2000);
    }, 1000); // Delay 1 second before starting fade-out
  }

  // Initial rendering of books
  renderBooks();

});
