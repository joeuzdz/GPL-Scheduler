let schedule = new Schedule();
let downloadConfig;
let optConfig;
let secConfig;

//creates the schedule button
createScheduleBtn = () => {
    const createScheduleBtn = document.createElement('div');
    createScheduleBtn.id = 'create-sched-btn';
    createScheduleBtn.innerHTML = 'Create Schedule';
    createScheduleBtn.onclick = () => {
        //remove button from DOM
        const createScheduleBtn = document.getElementById('create-sched-btn');
        container.removeChild(createScheduleBtn);

        objectifyConfigFile();
        schedule.createEmployeeSchedules();
        createDownloadBtn();
        createScheduleToggleBtns();
        createScheduleTable();
        
    }
    container.appendChild(createScheduleBtn);
}

//take drivers from configFile, convert them to a Driver object, put them in schedule object drivers array
objectifyConfigFile = () => {
    for (let driver of configFile.driver) {
        let splitName = driver.name.split(' ');
        let first = splitName[0];
        let last = splitName[1];
        let objectifiedDriver = new Driver(first, last, driver.avail, driver.offWithin, driver.availDay);
        schedule.drivers.push(objectifiedDriver);
    }
}

createScheduleToggleBtns = () => {
    const schedBtnsContainer = document.createElement('div');
    schedBtnsContainer.id = 'sched-btn-container';
    
    const optScheduleBtn = document.createElement('div');
    optScheduleBtn.id = 'opt-schedule-btn';
    optScheduleBtn.innerHTML = 'Optimal Schedule';
    optScheduleBtn.disabled = true;
    optScheduleBtn.style.backgroundColor = 'lightgray';
    optScheduleBtn.style.cursor = 'default';

    optScheduleBtn.onclick = () => {
        populateTable('opt');
        const secScheduleBtn = document.getElementById('sec-schedule-btn');
        secScheduleBtn.disabled = false;
        secScheduleBtn.style.backgroundColor = '#E2E2E2';
        secScheduleBtn.style.cursor = 'pointer';

        const optScheduleBtn = document.getElementById('opt-schedule-btn');
        optScheduleBtn.disabled = true;
        optScheduleBtn.style.backgroundColor = 'lightgray';
        optScheduleBtn.style.cursor = 'default';

        const tableTitle = document.getElementById('table-title');
        tableTitle.innerHTML = 'Optimal Schedule';

        const dlBtn = document.getElementById('dlBtn');
        dlBtn.value = 'opt';
        dlBtn.innerHTML = 'Download Optimal Config File';
    }

    const secScheduleBtn = document.createElement('div');
    secScheduleBtn.id = 'sec-schedule-btn';
    secScheduleBtn.innerHTML = 'Secondary Schedule';

    secScheduleBtn.onclick = () => {
        populateTable('sec');
        const optScheduleBtn = document.getElementById('opt-schedule-btn');
        optScheduleBtn.disabled = false;
        optScheduleBtn.style.backgroundColor = '#E2E2E2';
        optScheduleBtn.style.cursor = 'pointer';

        const secScheduleBtn = document.getElementById('sec-schedule-btn');
        secScheduleBtn.disabled = true;
        secScheduleBtn.style.backgroundColor = 'lightgray';
        secScheduleBtn.style.cursor = 'default';


        const tableTitle = document.getElementById('table-title');
        tableTitle.innerHTML = 'Secondary Schedule';

        const dlBtn = document.getElementById('dlBtn');
        dlBtn.value = 'sec';
        dlBtn.innerHTML = 'Download Secondary Config File';
    }

    const dlBtn =  document.getElementById('dlBtn');

    schedBtnsContainer.appendChild(optScheduleBtn);
    schedBtnsContainer.appendChild(secScheduleBtn);

    container.insertBefore(schedBtnsContainer, dlBtn);
}

//creates and formats an HTML table to show the schedule
createScheduleTable = () => {
    const table = document.createElement('table');
    table.id = 'table';
    
    const tHeader = document.createElement('thead');
    tHeader.id = 'tHeader';
    table.appendChild(tHeader);
    
    const tableTitleRow = document.createElement('tr');
    const tableTitle = document.createElement('td');
    tableTitleRow.appendChild(tableTitle);
    tableTitle.id = 'table-title';
    tableTitle.innerHTML = 'Optimal Schedule';
    tableTitle.colSpan = 9;
    tHeader.appendChild(tableTitleRow);
    
    const headerRow = document.createElement('tr');
    headerRow.id = 'headerRow';
    table.appendChild(headerRow);
    
    const driverLastCol = document.createElement('th');
    driverLastCol.style.textAlign = 'left';
    driverLastCol.innerHTML = 'Last';
    const driverFirstCol = document.createElement('th');
    driverFirstCol.style.textAlign = 'left';
    driverFirstCol.innerHTML = 'First';
    const sunCol = document.createElement('th');
    sunCol.innerHTML = 'Sun';
    const monCol = document.createElement('th');
    monCol.innerHTML = 'Mon';
    const tuesCol = document.createElement('th');
    tuesCol.innerHTML = 'Tues';
    const wedCol = document.createElement('th');
    wedCol.innerHTML = 'Wed';
    const thursCol = document.createElement('th');
    thursCol.innerHTML = 'Thurs';
    const friCol = document.createElement('th');
    friCol.innerHTML = 'Fri';
    const satCol = document.createElement('th');
    satCol.innerHTML = 'Sat';

    headerRow.appendChild(driverLastCol);
    headerRow.appendChild(driverFirstCol);
    headerRow.appendChild(sunCol);
    headerRow.appendChild(monCol);
    headerRow.appendChild(tuesCol);
    headerRow.appendChild(wedCol);
    headerRow.appendChild(thursCol);
    headerRow.appendChild(friCol);
    headerRow.appendChild(satCol);

    for (let i = 0; i < schedule.drivers.length; i++) {
        const newRow = document.createElement('tr');
        for (let j = 0; j < 9; j++) {
            const newCol = document.createElement('td');
            if (j == 0) {
                newCol.style.backgroundColor = 'whitesmoke';
                newCol.innerHTML = schedule.drivers[i].last
            } else if (j == 1) {
                newCol.style.backgroundColor = 'whitesmoke';
                newCol.innerHTML = schedule.drivers[i].first;
            } else {
                newCol.className = 'box';
                newCol.id = i + '-' + (j-2);
            }
            newRow.appendChild(newCol);
        }
        table.appendChild(newRow);
    }

    // let numRoutes = schedule.calculateNumRoutesPerDay(schedule.optMatrix);
    const newRow = document.createElement('tr');
    for (let i = 0; i < 8; i++) {
        const newCol = document.createElement('td');
        newCol.style.backgroundColor = 'gainsboro';
        if (i == 0) {
            newCol.innerHTML = 'Total Routes';
            newCol.style.textAlign = 'center';
            newCol.colSpan = 2;
        } else  {
            newCol.className = 'box';
            newCol.id = 'totalRoutes-' + (i-1);
        }
        newRow.appendChild(newCol);
    }
    table.appendChild(newRow);

    const dlBtn = document.getElementById('dlBtn');
    container.insertBefore(table, dlBtn);

    populateTable('opt');
}

populateTable = (optOrSec) => {
    let matrix;
    if (optOrSec == 'opt') {
        matrix = schedule.optMatrix;
        
    } else if (optOrSec == 'sec') {
        matrix = schedule.secMatrix;
    }


    for (let i = 0; i < schedule.drivers.length; i++) {
        for (let j = 0; j < 7; j++) {
            const nextBox = document.getElementById(i + '-' + j);
            
            if (matrix[i][j] == 2) {
                nextBox.innerHTML = 'ON';
                nextBox.style.color = 'green';
            } else {
                nextBox.innerHTML = 'OFF';
                nextBox.style.color = 'red';
            }
        }
    }

    let numRoutes = schedule.calculateNumRoutesPerDay(matrix);
    for (let i = 0; i < numRoutes.length; i++) {
        const nextBox = document.getElementById('totalRoutes-' + i);
        nextBox.innerHTML = numRoutes[i];
    }

}

//creates button to let user download the updated configFile
createDownloadBtn = () => {
    const dlBtn = document.createElement('div');
    dlBtn.id = 'dlBtn';
    dlBtn.innerHTML = 'Download Optimal Config File';
    dlBtn.value = 'opt';
    dlBtn.onclick = () => {
            
        let date = new Date();
        let formatDate = ''
        formatDate += date.getFullYear();
        formatDate += '-';
        formatDate += date.getMonth() + 1;
        formatDate += '-';
        formatDate += date.getDate();

        let filename;
        let text;
        const dlBtn = document.getElementById('dlBtn');
        if (dlBtn.value == 'opt') {
            text = JSON.stringify(optConfig);
            filename = formatDate + 'configOpt' + '.txt';
        } else if (dlBtn.value == 'sec') {
            text = JSON.stringify(secConfig);
            filename = formatDate + 'configSec' + '.txt';
        }

        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        //TEMP DISABLING DOWNLOAD
        element.click();

        document.body.removeChild(element);

    }

    container.appendChild(dlBtn);
}