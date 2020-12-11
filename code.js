let infoCount = 0;
let allInfo = new Array();
let indexOfInfos = new Map();
let updateIndex = -1;
let searchWord = "";

let name = document.getElementById("NAME");
let address = document.getElementById("ADDRESS");
let rating = document.getElementById("RATING");
let type = document.getElementById("TYPE");
let upPic = document.getElementById("UP-PIC");
let picture = document.getElementById("PICTURE");


document.querySelector("#SUBMIT").addEventListener("click", saveData);
document.querySelector("#RESET").addEventListener("click", reset);

document.querySelector("#NEW-PLACE-BT").addEventListener("click", function() {
    document.getElementById("title").innerHTML = "Add a new Tourist Place";
    updateIndex = -1;
    togglePage("block", "none");
    reset();
});

document.querySelector(".up").addEventListener("click", function() {
    sortByName(-1, 1);
});

document.querySelector(".down").addEventListener("click", function() {
    sortByName(1, -1);
});

document.querySelector("#BACK").addEventListener("click", function() {
    togglePage("none", "block");
});

document.querySelector("#PICTURE").addEventListener("change", function() {
    let picture = document.querySelector("#PICTURE");
    upPic.style.display = "block";
    upPic.src = URL.createObjectURL(picture.files[0]);
});

document.querySelector("#SEARCH-NAME").addEventListener("keydown", function(e) {
    if (e.key === "Backspace") {
        searchWord = searchWord.slice(0, -1);
        searchName();
    }
    if (searchWord === "") {
        populateListPage();
    }
});

document.querySelector("#SEARCH-NAME").addEventListener("keypress", function(e) {
    searchWord += e.key;
    searchName();
});


function togglePage(inputForm, listPage) {
    let req = document.getElementsByClassName("req");

    for (let i = 0; i < req.length; i++) {
        req[i].style.display = "none";
    }

    document.querySelector("#INPUT-FORM").style.display = inputForm;
    document.querySelector(".list-page").style.display = listPage;
}

function saveData() {
    if (checkInValidity()) {
        return;
    }

    if (updateIndex != -1) {
        let info = allInfo[updateIndex];
        info.name = name.value;
        info.address = address.value;
        info.rating = rating.value;
        info.type = type.value;
        info.picture = upPic.src;
        updateIndex = -1;
    }
    else {
        infoCount++;
        let information = {
            name: name.value,
            address: address.value,
            rating: rating.value,
            type: type.value,
            picture: upPic.src,
            infoClass: "i" + infoCount,
        };
    
        allInfo.push(information);
    }

    populateListPage();

    togglePage("none", "block");
}


function checkInValidity() {
    let flag = false;

        if (name.value === "") {
            document.getElementsByClassName("r-name")[0].innerHTML = "this field is required";
            document.getElementsByClassName("r-name")[0].style.display = "inline";
            flag = true;
        }
        else {
            for (let i = 0; i < allInfo.length; i++) {
                if(updateIndex != -1 && allInfo[updateIndex].name === name.value) {
                    continue;
                }
                if (allInfo[i].name === name.value) {
                    document.getElementsByClassName("r-name")[0].innerHTML = "this name already exist";
                    document.getElementsByClassName("r-name")[0].style.display = "inline";
                    flag = true;
                }
            }
            if (!flag) {
                document.getElementsByClassName("r-name")[0].style.display = "none";
            }
        }
        if (address.value === "") {
            document.getElementsByClassName("r-address")[0].style.display = "inline";
            flag = true;
        }
        else {
            document.getElementsByClassName("r-address")[0].style.display = "none";
        }
        if (rating.value === "") {
            document.getElementsByClassName("r-rating")[0].style.display = "inline";
            flag = true;
        }
        else {
            document.getElementsByClassName("r-rating")[0].style.display = "none";
        }
        if (type.value === "") {
            document.getElementsByClassName("r-type")[0].style.display = "inline";
            flag = true;
        }
        else {
            document.getElementsByClassName("r-type")[0].style.display = "none";
        }
        console.log(upPic.src);
        if (!upPic.src) {
            document.getElementsByClassName("r-picture")[0].style.display = "inline";
            flag = true;
        }
        else {
            document.getElementsByClassName("r-picture")[0].style.display = "none";
        }
       return flag;
}


function populateListPage() {
    let listPage = document.querySelector(".container-grid");
    deleteAllChild(listPage);
    indexOfInfos.clear();

    for (let i = 0; i < allInfo.length; i++) {
        indexOfInfos.set(allInfo[i].infoClass, i);
        createInfoElements(listPage, allInfo[i]);
    }
}

function createInfoElements(listPage, information) {
    let nameDiv = document.createElement("div");
    nameDiv.setAttribute("class", `flex-container ${information.infoClass}`);
    let name = document.createElement("p");
    name.innerHTML = information.name;
    nameDiv.appendChild(name);
    listPage.appendChild(nameDiv);

    let addDiv = document.createElement("div");
    addDiv.setAttribute("class", `flex-container ${information.infoClass}`);
    let add = document.createElement("p");
    add.innerHTML = information.address;
    addDiv.appendChild(add);
    listPage.appendChild(addDiv);

    let typeDiv = document.createElement("div");
    typeDiv.setAttribute("class", `flex-container ${information.infoClass}`);
    let type = document.createElement("p");
    type.innerHTML = information.type;
    typeDiv.appendChild(type);
    listPage.appendChild(typeDiv);

    let ratDiv = document.createElement("div");
    ratDiv.setAttribute("class", `flex-container ${information.infoClass}`);
    let rat = document.createElement("p");
    rat.innerHTML = information.rating;
    ratDiv.appendChild(rat);
    listPage.appendChild(ratDiv);

    let picDiv = document.createElement("div");
    picDiv.setAttribute("class", `flex-container ${information.infoClass}`);
    let pic = document.createElement("img");
    pic.src = information.picture;
    picDiv.appendChild(pic);
    listPage.appendChild(picDiv);

    let btDiv = document.createElement("div");
    btDiv.setAttribute("class", `flex-container ${information.infoClass}`);
    let update = document.createElement("button");
    update.innerHTML = "Update";
    update.setAttribute("class", `update ${information.infoClass}`);
    update.addEventListener("click", updateInfo);
    let dlt = document.createElement("button");
    dlt.innerHTML = "Delete"; 
    dlt.setAttribute("class", `delete ${information.infoClass}`);
    dlt.addEventListener("click", deleteInfo);
    btDiv.appendChild(update);
    btDiv.appendChild(dlt);
    listPage.appendChild(btDiv);
}


function updateInfo() {
    reset();
    let infoClass = this.className.split(' ')[1];
    let index = indexOfInfos.get(infoClass);
    updateIndex = index;

    let info = allInfo[index];
    name.value = info.name;
    address.value = info.address;
    rating.value = info.rating;

    for (let i = 0; i < type.options.length; i++) {
        if (type.options[i].value === info.type) {
            type.selectedIndex = i;
            break;
        }
    }
    upPic.src = info.picture;

    document.getElementById("title").innerHTML = "Edit Tourist Place Info";
    togglePage("block", "none");
}

function deleteInfo() {
    let infoClass = this.className.split(' ')[1];
    let index = indexOfInfos.get(infoClass);
    allInfo.splice(index, 1);

    populateListPage();
}

function reset() {
    name.value = "";
    address.value = "";
    rating.value = "";
    type.selectedIndex = 0;
    upPic.removeAttribute('src');
    picture.value = "";
}


function searchName() {
    let listPage = document.querySelector(".container-grid");
    deleteAllChild(listPage);

    for (let i = 0; i < allInfo.length; i++) {
        if (allInfo[i].name.startsWith(searchWord)) {
            createInfoElements(listPage, allInfo[i]);
        }
    }
}

function sortByName(x, y) {
    allInfo.sort((a, b) => (a.name > b.name) ? x : y);
    populateListPage();
}

function deleteAllChild(element) {
    let child = element.lastElementChild;
    x = child.className.split(' ');
    if (x.length > 1 && x[1] == "hd") {
        return;
    }
    while (child) {
        element.removeChild(child);
        child = element.lastElementChild;
        let x = child.className.split(' ');
        if (x.length > 1 && x[1] == "hd") {
            break;
        }
    }
}