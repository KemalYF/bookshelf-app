const bookshelf = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "Bookshelf_APP";

function isStorageExist() {
    if(typeof(Storage) === undefined){
        alert("Browser kamu tidak mendukung local storage");
        return false
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener("DOMContentLoaded", function () {
 
    const submitForm = document.getElementById("form");
 
    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBookshelf();
    });

    if(isStorageExist()){
        loadDataFromStorage();
    }
});

function addBookshelf() {
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const year = document.getElementById("year").value;
    const isComplete = document.getElementById('inputBookIsComplete').checked;
  
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, title, author, year, isComplete, false);
    bookshelf.push(bookObject);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
}
 
 
function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookList = document.getElementById("uncompleteBookshelfList");
    uncompletedBookList.innerHTML = "";
   
    const completedBookList = document.getElementById("completeBookshelfList");
    completedBookList.innerHTML = "";
   
    for(bookItem of bookshelf){
        const bookElement = makeBook(bookItem);
     
        if(bookItem.isComplete == false)
            uncompletedBookList.append(bookElement);
        else
            completedBookList.append(bookElement);
    }
});

function makeBook(bookObject) {
 
    const textTitle = document.createElement("h3");
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement("p");
    textAuthor.innerText = bookObject.author;
  
    const textTimestamp = document.createElement("p");
    textTimestamp.innerText = bookObject.year;
  
    const textContainer = document.createElement("div");
    textContainer.classList.add("inner")
    textContainer.append(textTitle, textAuthor, textTimestamp);
  
    const container = document.createElement("div");
    container.classList.add("item", "shadow")
    container.append(textContainer);
    container.setAttribute("id", `todo-${bookObject.id}`);
  
    if(bookObject.isComplete){
 
        const undoButton = document.createElement("button");
        undoButton.classList.add("undo-button");
        undoButton.addEventListener("click", function () {
            undoTaskFromCompleted(bookObject.id);
        });
   
        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-button");
        trashButton.addEventListener("click", function () {
            var hapus = confirm("Apa anda yakin ingin menghapus buku ini??"); 
            if (hapus == true){
                alert ('Anda berhasil menghapus buku !')
                removeTaskFromCompleted(bookObject.id);
            } else {
                alert ('Buku tidak terhapus')
            }
        });
   
        container.append(undoButton, trashButton);
    } else {
   
        const checkButton = document.createElement("button");
        checkButton.classList.add("check-button");
        checkButton.addEventListener("click", function () {
            addTaskToCompleted(bookObject.id);
        });
   
        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-button");
        trashButton.addEventListener("click", function () {
            var hapus = confirm("Apa anda yakin ingin menghapus buku ini??"); 
            if (hapus == true){
                alert ('Anda berhasil menghapus buku !')
                removeTaskFromCompleted(bookObject.id);
            } else {
                alert ('Buku tidak terhapus')
            }
        });
        container.append(checkButton, trashButton);
    }

    return container;
}

function addTaskToCompleted(bookId) {
 
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;
  
    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId){
    for(bookItem of bookshelf){
        if(bookItem.id === bookId){
            return bookItem
        }
    }
    return null
}

function removeTaskFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);
    if(bookTarget === -1) return;
    bookshelf.splice(bookTarget, 1);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}
   
   
function undoTaskFromCompleted(bookId){
   
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;
   
   
    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId) {
    for(index in bookshelf){
        if(bookshelf[index].id === bookId){
            return index
        }
    }
    return -1
}

function saveData() {
    if(isStorageExist()){
        const parsed = JSON.stringify(bookshelf);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
   
    let data = JSON.parse(serializedData);
   
    if(data !== null){
        for(todo of data){
            bookshelf.push(todo);
        }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
}

const cariBuku = document.getElementById("searchBookTitle");
cariBuku.addEventListener('keyup', (event) => {
    event.preventDefault();
    const cariBuku = event.target.value.toLowerCase();
    const itemBuku = document.querySelectorAll(".inner");

    itemBuku.forEach((buku) => {
        const isiItem = buku.firstElementChild.textContent.toLowerCase();

        if (isiItem.indexOf(cariBuku) != -1) {
            buku.parentElement.style.display ="flex";
            console.log(isiItem);
        } else {
            buku.parentElement.style.display = "none";
        }
    });
});