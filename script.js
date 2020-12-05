/* 
**  Notes App 
*/

let previousHash = "";



function createHash() 
{
    let id = '';
    const characters = 
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    for (let i = 0; i < 8; i++) 
    {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return id;
}



function changeHash() 
{
    if (document.getElementById(previousHash)) 
    {
        document.getElementById(previousHash).style.backgroundColor = "#393331";
        document.getElementById(previousHash).style.color = "#f5f5f5";
    }

    let id = location.hash.substr(1, location.hash.length);

    if (document.getElementById(id)) 
    {
        document.getElementById(id).style.backgroundColor = "indianred";
        document.getElementById(id).style.color = "#f5f5f5";
        editNote(id);
    }

    previousHash = id;
}



function getDate() 
{
    let now     = new Date();

    let hour    = now.getHours();
    let min     = now.getMinutes();
    let sec     = now.getSeconds();
    let year    = now.getFullYear();
    let month   = now.getMonth();
    let dat     = now.getDate();

    let date = new Date(year, month, dat, hour, min, sec);

    return date;
}



function clearNote() 
{
    const title = document.getElementById("note-title");
    const text = document.getElementById("note-text");
    const date = document.getElementById("note-date");

    title.value = "";
    text.value = "";
    date.textContent = "";

    location.hash = "";
}



function editNote(id) 
{
    const note = JSON.parse(localStorage.getItem(id));
    if (note === null) { return; };

    let titleEdit = document.getElementById("note-title");
    let textEdit = document.getElementById("note-text");
    let dateValue = document.getElementById("note-date");

    titleEdit.value = note.title;
    textEdit.value = note.text;
    dateValue.textContent = new Date(note.time).toLocaleString();

    location.hash = id;
}



function updateNote() 
{
    let title = document.getElementById("note-title").value;
    if (title === "") { title = "Untitled"; };

    let text = document.getElementById("note-text").value;

    let hashtitle = title.toString();
    let hash = hashtitle + "-" + createHash();
    let date = getDate().toLocaleString();

    let data = 
    {
        title: title,
        text: text,
        time: getDate(),
        id: hash,
    };
    let noteJSON = JSON.stringify(data);


    let oldDate = document.getElementById("note-date").textContent;
    if (oldDate === "") 
    {
        saveNote(noteJSON, title, text, date, hash);
        clearNote();
    }
    else 
    {
        let key = location.hash.substr(1, location.hash.length);
        let note = document.getElementById(key);

        localStorage.removeItem(key);
        note.remove();

        document.getElementById("note-date").textContent = "";
        updateNote();
    }

}



function saveNote(data, title, text, date, id) 
{
    let notesContainer = document.getElementById("notes-list");
    let newNote = document.createElement("li");

    document.getElementById("note-date").textContent = date;
    
    newNote.className = "note";
    newNote.id = id;
    newNote.innerHTML =
    `
        <div class = "note-title" style="font-size:24px">${title}</div>
        <div class = "note-text">
            <span class = "date">${date + ' | '}</span>
            <span class = "text" style="opacity:0.6">${text.substr(0, 15) + '...'}</span>
        </div>
        <button class = "remove-btn" id = "remove-btn#${id}">Remove</button>
    `;

    newNote.querySelector("button").addEventListener('click', function () { removeNote(id); });
    newNote.addEventListener('click', function () { editNote(id); });

    location.hash = id;
    localStorage.setItem(id, data);

    notesContainer.prepend(newNote);
}



function removeNote(id) 
{
    let note = document.getElementById(id);

    localStorage.removeItem(id);
    note.remove();

    clearNote();
}



function displayNotes() 
{
    const notes = [];

    for (let i = 0; i < localStorage.length; i++) 
    {
        notes.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
    }

    let notesContainer = document.getElementById("notes-list");

    function compareDate(a, b) 
    {
        return new Date(a.time) - new Date(b.time);
    }
    notes.sort(compareDate);


    for (let i = 0; i < notes.length; i++) 
    {
        let noteData = notes[i];
        let newNote = document.createElement("li");

        newNote.className = "note";
        newNote.id = noteData.id;
        newNote.innerHTML = 
        `
            <div class = "note-title" style="font-size:24px">${noteData.title}</div>
            <div class = "note-text">
                <span class = "date">${new Date(noteData.time).toLocaleString() + ' | '}</span>
                <span class = "text" style="opacity:0.6">${noteData.text.substr(0, 15) + '...'}</span>
            </div>
            <button class = "remove-btn" id = "remove-btn#${noteData.id}">Remove</button>
        `;

        newNote.querySelector("button").addEventListener('click', function () { removeNote(noteData.id); });
        newNote.addEventListener('click', function () { editNote(noteData.id); });

        notesContainer.prepend(newNote);
    }


    let hash = location.hash;
    if (hash != "") 
    {
        hash = hash.substr(1, hash.length);
        document.getElementById(hash).style.backgroundColor = "indianred";
        document.getElementById(hash).style.color = "#f5f5f5";

        previousHash = hash;
        editNote(hash);
    }

}



document.getElementById("add-btn").addEventListener("click", clearNote);
document.getElementById("save-btn").addEventListener("click", updateNote);

window.addEventListener('hashchange', changeHash);
window.addEventListener('load', displayNotes());
