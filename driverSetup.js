
var configFile;
var numEditing = 0;

const avail = {
    OFF: 0,
    FLEX: 1,
    ON: 2
}

const week = {
    SUN: 0,
    MON: 1,
    TUES: 2,
    WED: 3,
    THURS: 4,
    FRI: 5,
    SAT: 6,
}

const container = document.getElementById('container');


const fileInput = document.getElementById('input-file');
const scratchBtn = document.getElementById('scratch');
const startButtons = document.getElementById('start-buttons');

//called when user inputs file, converts text from file to JSON
fileInput.onchange = () => {
    const selectedFile = fileInput.files[0];

    let fr = new FileReader();
    fr.onload = () => {
        //convert string into JSON object and store
        configFile = JSON.parse(fr.result);
        
        listInputDrivers();
        addNewDriverBtn();
        createDoneEditBtn();
    }
    fr.readAsText(fileInput.files[0]);

    container.removeChild(startButtons);

    const fileNameTag = document.createElement('div');
    fileNameTag.id = 'file-name';
    fileNameTag.innerHTML = 'Using ' + selectedFile.name;
    container.appendChild(fileNameTag);

}

//start from scratch button, click function
scratchBtn.onclick = () => {
    addHeader();
    
    //blank template
    configFile = {"driver":[]};
    addNewDriverBtn();
    createDoneEditBtn();

    document.getElementById('add-driver-btn').click();

    container.removeChild(startButtons);
}

//lists drivers from user input file
listInputDrivers = () => {
    addHeader();

    for (let i = 0; i < configFile.driver.length; i++) {
        createInitialDriverEntry(i);
    }    
}

//adds a 'Drivers' label to the DOM
addHeader = () => {
    const header = document.createElement('div');
   
    const offWithinHeader = document.createElement('span');
    offWithinHeader.id = 'ow-header';
    offWithinHeader.className = 'header-tab';
    offWithinHeader.innerHTML = 'OW';
   
    const availHeader = document.createElement('span');
    availHeader.id = 'avail-header';
    availHeader.className = 'header-tab';
    availHeader.innerHTML = 'Avail';
    
    header.appendChild(offWithinHeader);
    header.appendChild(availHeader);
    container.appendChild(header);
}

//adds a new blank driver
addNewDriverBtn = () => {
    const addDriverBtn = document.createElement('div');
    addDriverBtn.id = 'add-driver-btn';
    addDriverBtn.innerHTML = 'Add Driver';
    addDriverBtn.onclick = () => {
        numEditing += 1;
        
        let newId = configFile.driver.length;

        const newDriver = document.createElement('div');
        newDriver.id = 'driver-' + newId;
        newDriver.className = 'driver-info';

        newDriver.style.backgroundColor = '#cecece';

        const newDriverObject = {"name":"","avail":"0000000","offWithin":"6","availDay":"5"};
        configFile.driver.push(newDriverObject);

        const name = document.createElement('input');
        name.id = 'name-' + newId;
        name.className = 'name-input';
        name.type = 'text';
        name.placeholder = 'Driver Name';

        const avail = document.createElement('span');
        avail.id = 'avail-' + newId;
        createAvailView(avail, newId);

        const offWithin = document.createElement('select');
        offWithin.id = 'offWithin-' + newId;
        createOffWithinView(offWithin);
        offWithin.value = 6;

        const availDay = document.createElement('select');
        availDay.id = 'availDay-' + newId;
        createAvailDayView(availDay);
        availDay.value = 5;

        const editBtn = document.createElement('button');
        editBtn.id = 'editBtn-' + newId;
        editBtn.innerHTML = 'SAVE';
        editBtn.setAttribute('onclick', 'createSavedDriverEntry(this.id)');

        const deleteBtn = document.createElement('button');
        deleteBtn.id = 'deleteBtn-' + newId;
        deleteBtn.innerHTML = 'X';
        deleteBtn.setAttribute('onclick', 'deleteDriverEntry(this.id)');
        deleteBtn.disabled = true;

        newDriver.appendChild(name);
        newDriver.appendChild(avail);
        newDriver.appendChild(offWithin);
        newDriver.appendChild(availDay);
        newDriver.appendChild(editBtn);
        newDriver.appendChild(deleteBtn);

        container.insertBefore(newDriver, addDriverBtn);

        //after avail view is added to document, enable the inputs for editing
        enableAvailBtns(newId);
    }

    container.appendChild(addDriverBtn);
    
}

//if user inputs a file, create necesary initialization of elements
createInitialDriverEntry = (id) => {
    const newDriver = document.createElement('div');
    newDriver.id = 'driver-' + id;
    newDriver.className = 'driver-info';

    const name = document.createElement('input');
    name.id = 'name-' + id;
    name.className = 'name-input';
    name.type = 'text';
    name.placeholder = configFile.driver[id].name;
    name.disabled = true;
    
    const avail = document.createElement('span');
    avail.id = 'avail-' + id;
    createAvailView(avail, id);

    const offWithin = document.createElement('select');
    offWithin.id = 'offWithin-' + id;
    offWithin.disabled = true;
    createOffWithinView(offWithin);
    offWithin.value = configFile.driver[id].offWithin;

    const availDay = document.createElement('select');
    availDay.id = 'availDay-' + id;
    availDay.disabled = true;
    createAvailDayView(availDay);
    availDay.value = configFile.driver[id].availDay;
    
    const editBtn = document.createElement('button');
    editBtn.id = 'editBtn-' + id;
    editBtn.innerHTML = 'EDIT';
    editBtn.setAttribute('onclick','createEditDriverEntry(this.id)');
      
    const deleteBtn = document.createElement('button');
    deleteBtn.id = 'deleteBtn-' + id;
    deleteBtn.innerHTML = 'X';
    deleteBtn.setAttribute('onclick', 'deleteDriverEntry(this.id)');

    newDriver.appendChild(name);
    newDriver.appendChild(avail);
    newDriver.appendChild(offWithin);
    newDriver.appendChild(availDay);
    newDriver.appendChild(editBtn);
    newDriver.appendChild(deleteBtn);
    
    

    container.appendChild(newDriver);

    //disable avail buttons after elements are added to DOM
    disableAvailBtns(id);
}

//deletes a driver entry when 'X' is pressed
deleteDriverEntry = (elementId) => {
    //get id number after dash
    id = elementId.split('-')[1];

    container.removeChild(document.getElementById('driver-' + id));
    configFile.driver[id].name = 'null';
    configFile.driver[id].avail = 'null';
    configFile.driver[id].offWithin = 'null';
    configFile.driver[id].availDay = 'null';
}

createAvailBtnElement = (id, day) => {
    const btn = document.createElement('button');
    btn.className = 'availBtn';
    const labelDiv = document.createElement('div');
    const availDiv = document.createElement('div');
    
    switch (day) {
        case week.SUN:
            btn.id = 'sun-' + id;
            availDiv.id = 'sunAvail-' + id;
            labelDiv.innerHTML = 'Sun';
            break;
        case week.MON:
            btn.id = 'mon-' + id;
            availDiv.id = 'monAvail-' + id;
            labelDiv.innerHTML = 'Mon';
            break;
        case week.TUES:
            btn.id = 'tues-' + id;
            availDiv.id = 'tuesAvail-' + id;
            labelDiv.innerHTML = 'Tues';
            break;
        case week.WED:
            btn.id = 'wed-' + id;
            availDiv.id = 'wedAvail-' + id;
            labelDiv.innerHTML = 'Wed';
            break;
        case week.THURS:
            btn.id = 'thurs-' + id;
            availDiv.id = 'thursAvail-' + id;
            labelDiv.innerHTML = 'Thurs';
            break;
        case week.FRI: 
            btn.id = 'fri-' + id;
            availDiv.id = 'friAvail-' + id;
            labelDiv.innerHTML = 'Fri';
            break;
        case week.SAT:
            btn.id = 'sat-' + id;
            availDiv.id = 'satAvail-' + id;
            labelDiv.innerHTML = 'Sat';
            break;
    }

    btn.appendChild(labelDiv);

    if (configFile.driver[id].avail[day] == avail.OFF) {
        btn.value = avail.OFF;
        availDiv.innerHTML = 'OFF';
        btn.style.backgroundColor = '#ffc4c4';
    } else if (configFile.driver[id].avail[day] == avail.FLEX) {
        btn.value = avail.FLEX;
        availDiv.innerHTML = 'FLEX';
        btn.style.backgroundColor = '#ffff9d';
    } else if (configFile.driver[id].avail[day] == avail.ON) {
        btn.value = avail.ON;
        availDiv.innerHTML = 'ON';
        btn.style.backgroundColor = '#b7e4b7';
    }
    btn.appendChild(availDiv);

    btn.setAttribute('onclick', 'availBtnOnClick(this)');

    return btn;
}

availBtnOnClick = (btn) => {
    const splitId = btn.id.split('-');
    const availDiv = document.getElementById(splitId[0] + 'Avail-' + splitId[1]);
    btn.value = (btn.value + 1) % 3;
    if (btn.value == avail.OFF) {
        availDiv.innerHTML = 'OFF';
        btn.style.backgroundColor = '#ffc4c4';
    } else if (btn.value == avail.FLEX) {
        availDiv.innerHTML = 'FLEX';
        btn.style.backgroundColor = '#ffff9d';
    } else if (btn.value == avail.ON) {
        availDiv.innerHTML = 'ON';
        btn.style.backgroundColor = '#b7e4b7';
    }
}

//creates the week view with checkboxes
createAvailView = (avail, id) => {
    const sunBtn = createAvailBtnElement(id, week.SUN);
    const monBtn = createAvailBtnElement(id, week.MON);
    const tuesBtn = createAvailBtnElement(id, week.TUES);
    const wedBtn = createAvailBtnElement(id, week.WED);
    const thursBtn = createAvailBtnElement(id, week.THURS);
    const friBtn = createAvailBtnElement(id, week.FRI);
    const satBtn = createAvailBtnElement(id, week.SAT);
   
    avail.appendChild(sunBtn);
    avail.appendChild(monBtn);
    avail.appendChild(tuesBtn);
    avail.appendChild(wedBtn);
    avail.appendChild(thursBtn);
    avail.appendChild(friBtn);
    avail.appendChild(satBtn);
}



//enables all availability checkboxes
enableAvailBtns = (id) => {
    const sunBtn = document.getElementById('sun-' + id);
    sunBtn.disabled = false;
    const monBtn = document.getElementById('mon-' + id);
    monBtn.disabled = false;
    const tuesBtn = document.getElementById('tues-' + id);
    tuesBtn.disabled = false;
    const wedBtn = document.getElementById('wed-' + id);
    wedBtn.disabled = false;
    const thursBtn = document.getElementById('thurs-' + id);
    thursBtn.disabled = false;
    const friBtn = document.getElementById('fri-' + id);
    friBtn.disabled = false;
    const satBtn = document.getElementById('sat-' + id);
    satBtn.disabled = false;
}

//disables all availability checkboxes
disableAvailBtns = (id) => {
    const sunBtn = document.getElementById('sun-' + id);
    sunBtn.disabled = true;
    const monBtn = document.getElementById('mon-' + id);
    monBtn.disabled = true;
    const tuesBtn = document.getElementById('tues-' + id);
    tuesBtn.disabled = true;
    const wedBtn = document.getElementById('wed-' + id);
    wedBtn.disabled = true;
    const thursBtn = document.getElementById('thurs-' + id);
    thursBtn.disabled = true;
    const friBtn = document.getElementById('fri-' + id);
    friBtn.disabled = true;
    const satBtn = document.getElementById('sat-' + id);
    satBtn.disabled = true;
}

//saves all edits to availability to configFile
saveAvailEdits = (id) => {
    let newAvail = '';
    newAvail += document.getElementById('sun-' + id).value;
    newAvail += document.getElementById('mon-' + id).value;
    newAvail += document.getElementById('tues-' + id).value;
    newAvail += document.getElementById('wed-' + id).value;
    newAvail += document.getElementById('thurs-' + id).value;
    newAvail += document.getElementById('fri-' + id).value;
    newAvail += document.getElementById('sat-' + id).value;

    configFile.driver[id].avail = newAvail;
}

//creates the dropdown selections for choosing the offWithin days
createOffWithinView = (offWithin) => {
    const option1 = document.createElement('option');
    option1.innerHTML = '1';
    option1.value = 1;
    const option2 = document.createElement('option');
    option2.innerHTML = '2';
    option2.value = 2;
    const option3 = document.createElement('option');
    option3.innerHTML = '3';
    option3.value = 3;
    const option4 = document.createElement('option');
    option4.innerHTML = '4';
    option4.value = 4;
    const option5 = document.createElement('option');
    option5.innerHTML = '5';
    option5.value = 5;
    const option6 = document.createElement('option');
    option6.innerHTML = '6';
    option6.value = 6;

    offWithin.appendChild(option1);
    offWithin.appendChild(option2);
    offWithin.appendChild(option3);
    offWithin.appendChild(option4);
    offWithin.appendChild(option5);
    offWithin.appendChild(option6);
}

//creates the dropdown selections for choosing total avail days
createAvailDayView = (availDay) => {
    const option1 = document.createElement('option');
    option1.innerHTML = '1';
    option1.value = 1;
    const option2 = document.createElement('option');
    option2.innerHTML = '2';
    option2.value = 2;
    const option3 = document.createElement('option');
    option3.innerHTML = '3';
    option3.value = 3;
    const option4 = document.createElement('option');
    option4.innerHTML = '4';
    option4.value = 4;
    const option5 = document.createElement('option');
    option5.innerHTML = '5';
    option5.value = 5;

    availDay.appendChild(option1);
    availDay.appendChild(option2);
    availDay.appendChild(option3);
    availDay.appendChild(option4);
    availDay.appendChild(option5);
}

//creates an entry that a user can then edit
createEditDriverEntry = (elementId) => {
    numEditing += 1;

    //get id number after dash
    id = elementId.split('-')[1];

    const driverDiv = document.getElementById('driver-' + id);
    driverDiv.style.backgroundColor = '#cecece';

    const name = document.getElementById('name-' + id);
    name.disabled = false;
    
    enableAvailBtns(id);

    const offWithinSelector = document.getElementById('offWithin-' + id);
    offWithinSelector.disabled = false;

    const availDaySelector = document.getElementById('availDay-' + id);
    availDaySelector.disabled = false;

    const editBtn = document.getElementById('editBtn-' + id);
    editBtn.innerHTML = 'SAVE';
    editBtn.setAttribute('onclick', 'createSavedDriverEntry(this.id)');

    const deleteBtn = document.getElementById('deleteBtn-' + id);
    deleteBtn.disabled = true;
}

//create an editable entry that the user can then save
createSavedDriverEntry = (elementId) => {
    
    //get id number after dash in elementId param
    id = elementId.split('-')[1];

    if (getNumOnDays(id) > document.getElementById('availDay-' + id).value) {
        alert('Number of \'ON\' days is greater than days available.');
    } else {

        //save input values to config file
        const nameInput = document.getElementById('name-' + id);
        let lastName = nameInput.value.split(' ')[1];

        if ((nameInput.value != '' && (lastName == null || lastName.length == 0)) || (nameInput.value == '' && nameInput.placeholder == 'Driver Name')) {
            alert('Please enter a first and last name.');
        } else {

            const driverDiv = document.getElementById('driver-' + id);
            driverDiv.style.backgroundColor = '#e2e2e2';

            numEditing -= 1;
            if (nameInput.value != '') {
                configFile.driver[id].name = nameInput.value;
            }
            nameInput.disabled = true;
            saveAvailEdits(id);
            disableAvailBtns(id);

            const offWithinSelector = document.getElementById('offWithin-' + id);
            configFile.driver[id].offWithin = offWithinSelector.value;
            offWithinSelector.disabled = true;

            const availDaySelector = document.getElementById('availDay-' + id);
            configFile.driver[id].availDay = availDaySelector.value;
            availDaySelector.disabled = true;
            
            const editBtn = document.getElementById('editBtn-' + id);
            editBtn.innerHTML = 'EDIT';
            editBtn.setAttribute('onclick','createEditDriverEntry(this.id)');

            const deleteBtn = document.getElementById('deleteBtn-' + id);
            deleteBtn.disabled = false;
        }
    }
}


getNumOnDays = (id) => {
    let numOnDays = 0;
    if (document.getElementById('sun-' + id).value == 2) {
        numOnDays++;
    }
    if (document.getElementById('mon-' + id).value == 2) {
        numOnDays++;
    }
    if (document.getElementById('tues-' + id).value == 2) {
        numOnDays++;
    }
    if (document.getElementById('wed-' + id).value == 2) {
        numOnDays++;
    }
    if (document.getElementById('thurs-' + id).value == 2) {
        numOnDays++;
    }
    if (document.getElementById('fri-' + id).value == 2) {
        numOnDays++;
    }
    if (document.getElementById('sat-' + id).value == 2) {
        numOnDays++;
    }
    return numOnDays;
}


createDoneEditBtn = () => {
    const doneEditBtn = document.createElement('div');
    doneEditBtn.id = 'done-edit-btn';
    doneEditBtn.innerHTML = 'Done Editing';

    doneEditBtn.onclick = () => {
        let proceed;
        numEditing > 0 ? proceed = false : proceed = true;

        if (proceed) {
            removeAddAndEditButtons();
            cleanConfigFile();
            createScheduleBtn();
        } else {
            alert('Make sure all edits are complete.');
        }
    }

    container.appendChild(doneEditBtn);

}

//user is done editing all entries, so remove buttons
removeAddAndEditButtons = () => {
    const addDriverBtn = document.getElementById('add-driver-btn');
    const doneEditBtn = document.getElementById('done-edit-btn');
    container.removeChild(addDriverBtn);
    container.removeChild(doneEditBtn);

    for (let i = 0; i < configFile.driver.length; i++) {
        if (configFile.driver[i].name != 'null') {
            const driverElement = document.getElementById('driver-' + i);
            const editBtn = document.getElementById('editBtn-' + i);
            const deleteBtn = document.getElementById('deleteBtn-' + i);
            editBtn.disabled = true;
            deleteBtn.disabled = true;
        }
    }

}

//remove deleted or empty entries
cleanConfigFile = () => {
    for (let i = 0; i < configFile.driver.length; i++) {
        if (configFile.driver[i].name == 'null' || configFile.driver[i].name == '') {
            configFile.driver.splice(i,1);
            i--;
        }
    }
}

