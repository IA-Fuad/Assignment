let infoCount = 0;
let allInfo = new Array();
let indexOfInfos = new Map();
let updateIndex = -1;
let searchWord = "";
let listPage, inputForm, name, address, rating, type, 
    country, upPic, picture;

$(document).ready(function() {
    name = $("#NAME");
    address = $("#ADDRESS");
    rating = $("#RATING");
    type = $("#TYPE");
    country = $("#COUNTRY");
    upPic = $("#UP-PIC");
    picture = $("#PICTURE");
    listPage = $("#LIST-PAGE");
    inputForm = $("#INPUT-FORM");


    $("#SUBMIT").click(saveData);
    $("#RESET").click(reset);

    $("#NEW-PLACE-BT").click(function() {
        $("#TITLE").text("Add a new Tourist Place");
        updateIndex = -1;
        togglePage();
        reset();
    }); 
    
    $(".up").click(function() {
        sortByName(-1, 1);
    });

    $(".down").click(function() {
        sortByName(1, -1);
    });

    $("#BACK").click(function() {
        togglePage();
    });
    
    $("#PICTURE").change(function() {
        upPic.show();
        upPic.attr("src", URL.createObjectURL(picture[0].files[0]));
    });

    $("#SEARCH-NAME").keydown(function(e) {
        if (e.key === "Backspace") {
            searchWord = searchWord.slice(0, -1);
            searchName();
        }
        if (searchWord === "") {
            populateListPage();
        }
    });

    $("#SEARCH-NAME").keypress(function(e) {
        searchWord += e.key;
        searchName();
    });
})


function togglePage() {
    $(".req").hide();
    listPage.toggle();
    inputForm.toggle();
}


function saveData() {
    if (checkInValidity()) {
        return;
    }

    if (updateIndex != -1) {
        let info = allInfo[updateIndex];
        info.name = name.val();
        info.address = address.val();
        info.rating = rating.val();
        info.type = type.val();
        info.country = country.val();
        info.picture = upPic.attr("src");
        updateIndex = -1;
    }
    else {
        infoCount++;
        let information = {
            name: name.val(),
            address: address.val(),
            rating: rating.val(),
            type: type.val(),
            country: country.val(),
            picture: upPic.attr("src"),
            infoClass: "i" + infoCount,
        };
    
        allInfo.push(information);
    }

    populateListPage();

    togglePage();
}


function checkInValidity() {
    let flag = false;

        if (name.val() === "") {
            console.log(name.val())
            $(".r-name").text("this field is required");
            $(".r-name").show();
            flag = true;
        }
        else {
            for (let i = 0; i < allInfo.length; i++) {
                if(updateIndex != -1 && allInfo[updateIndex].name === name.val()) {
                    continue;
                }
                if (allInfo[i].name === name.val()) {
                    $(".r-name").text("this name already exist");
                    $(".r-name").show();
                    flag = true;
                }
            }
            if (!flag) {
                $(".r-name").hide();
            }
        }
        if (address.val() === "") {
            $(".r-address").show();
            flag = true;
        }
        else {
            $(".r-address").hide();
        }
        if (rating.val() === "") {
            $(".r-rating").show();
            flag = true;
        }
        else {
            $(".r-rating").hide();
        }
        if (type.val() === "") {
            $(".r-type").show();
            flag = true;
        }
        else {
            $(".r-type").hide();
        }
        if (!upPic.attr("src")) {
            $(".r-picture").show();
            flag = true;
        }
        else {
            $(".r-picture").hide();
        }
       return flag;
}



function populateListPage() {
    let container = $(".container-grid");
    deleteAllChild(container);
    indexOfInfos.clear();

    for (let i = 0; i < allInfo.length; i++) {
        indexOfInfos.set(allInfo[i].infoClass, i);
        createInfoElements(container, allInfo[i]);
    }
}

function createInfoElements(container, information) {
    container.append($(`<div> <p> ${information.name} </p> </div>`).attr("class", `flex-container ${information.infoClass}`));
    container.append($(`<div> <p> ${information.address} </p> </div>`).attr("class", `flex-container ${information.infoClass}`));
    container.append($(`<div> <p> ${information.type} </p> </div>`).attr("class", `flex-container ${information.infoClass}`));
    container.append($(`<div> <p> ${information.country} </p> </div>`).attr("class", `flex-container ${information.infoClass}`));
    container.append($(`<div> <p> ${information.rating} </p> </div>`).attr("class", `flex-container ${information.infoClass}`));
    
    let pic = $("<img>").attr("src", information.picture);
    container.append($(`<div></div>`).attr("class", `flex-container ${information.infoClass}`).append(pic));

    let update = $("<button>").text("Update").attr("class", `update ${information.infoClass}`).bind("click", updateInfo);
    let dlt = $("<button>").text("Delete").attr("class", `delete ${information.infoClass}`).bind("click", deleteInfo);
    container.append($("<div>").append(update, dlt).attr("class", `flex-container ${information.infoClass}`));
}


function updateInfo() {
    reset();
    let infoClass = this.className.split(' ')[1];
    let index = indexOfInfos.get(infoClass);
    updateIndex = index;

    let info = allInfo[index];
    name.val(info.name);
    address.val(info.address);
    rating.val(info.rating);

    for (let i = 0; i < type[0].options.length; i++) {
        if (type[0].options[i].value === info.type) {
            type.prop("selectedIndex", i);
            break;
        }
    }

    for (let i = 0; i < country[0].options.length; i++) {
        if (country[0].options[i].value === info.country) {
            country.prop("selectedIndex", i);
            break;
        }
    }

    upPic.attr("src", info.picture);

    $("#TITLE").text("Edit Tourist Place Info");
    togglePage();
}

function deleteInfo() {
    let infoClass = this.className.split(' ')[1];
    let index = indexOfInfos.get(infoClass);
    allInfo.splice(index, 1);

    populateListPage();
}

function reset() {
    name.val("");
    address.val("");
    rating.val("");
    type.prop("selectedIndex", 0);
    country.prop("selectedIndex", 0);
    upPic.removeAttr('src');
    picture.val("");
}


function searchName() {
    let container = $(".container-grid");
    deleteAllChild(container);

    for (let i = 0; i < allInfo.length; i++) {
        if (allInfo[i].name.startsWith(searchWord)) {
            createInfoElements(container, allInfo[i]);
        }
    }
}

function sortByName(x, y) {
    allInfo.sort((a, b) => (a.name > b.name) ? x : y);
    populateListPage();
}

function deleteAllChild(element) {
    element.children().filter(":not(.hd)").remove();
}