class Schedule {
    constructor() {
        this.drivers = [];          //array of drivers to schedule
        this.optMatrix = [];        //schedule made with only optimal schedules
        this.secMatrix = [];        //schedule made with all possible schedules, including secondary schedules
    }

    createEmployeeSchedules = () => {
        this.orderDrivers();

        this.calculateOptSchedule();
        // console.log('opt: ', this.calculateDelta(this.optMatrix), this.calculateNumRoutesPerDay(this.optMatrix));

        this.calculateSecSchedule();
        // console.log('sec: ', this.calculateDelta(this.secMatrix), this.calculateNumRoutesPerDay(this.secMatrix));

        schedule.alphabetizeDrivers();
        
        this.updateConfigFiles();
        
        // console.log(optConfig);
        // console.log(secConfig);
    }

    //ordering drivers based on number of optimal schedules they have with bubble sort
    orderDrivers = () => {
        let swapped; 
        do {
            swapped = false;
            for (let i = 0; i < this.drivers.length - 1; i++) {
                if (this.drivers[i].optSchedules.length > this.drivers[i+1].optSchedules.length) {
                    let temp = this.drivers[i];
                    this.drivers[i] = this.drivers[i+1];
                    this.drivers[i+1] = temp;
                    swapped = true;
                }
            }
        } while (swapped);
    }

    alphabetizeDrivers = () => {
        let swapped;
        do {
            swapped = false;
            for (let i = 0; i < this.drivers.length - 1; i++) {
                if (this.drivers[i].last.toLowerCase() > this.drivers[i+1].last.toLowerCase()) {
                    let temp = this.drivers[i];
                    this.drivers[i] = this.drivers[i+1];
                    this.drivers[i+1] = temp;

                    let optTemp = this.optMatrix[i];
                    this.optMatrix[i] = this.optMatrix[i+1];
                    this.optMatrix[i+1] = optTemp;

                    let secTemp = this.secMatrix[i];
                    this.secMatrix[i] = this.secMatrix[i+1];
                    this.secMatrix[i+1] = secTemp;
                    
                    swapped = true;
                }
            }
        } while (swapped);
    }

    calculateOptSchedule = () => {
        //fresh matrix
        this.optMatrix = [];

        //0-init matrix 
        for (let i = 0; i < this.drivers.length; i++) {
            this.optMatrix.push([0,0,0,0,0,0,0]);
        }
        
        for (let i = 0; i < this.drivers.length; i++) {
            //if only one optimal schedule, push it to the matrix
            if (this.drivers[i].optSchedules.length == 1) {
                this.optMatrix[i] = this.drivers[i].optSchedules[0];
            } else { //more than one schedule, check each one for lowest delta, then add it
                
                let minDelta = Infinity;
                let delta;
                let saveMinIdx;

                for (let j = 0; j < this.drivers[i].optSchedules.length; j++) {
                    this.optMatrix[i] = this.drivers[i].optSchedules[j];
                    delta = this.calculateDelta(this.optMatrix);
                    if (delta < minDelta) {
                        minDelta = delta;
                        saveMinIdx = j;
                    }
                }

                this.optMatrix[i] = this.drivers[i].optSchedules[saveMinIdx];
            }
        }

        return this.calculateDelta(this.optMatrix);
    }

    calculateSecSchedule = () => {
        //fresh matrix
        this.secMatrix = [];

        //0-init matrix 
        for (let i = 0; i < this.drivers.length; i++) {
            this.secMatrix.push([0,0,0,0,0,0,0]);
        }
        
        for (let i = 0; i < this.drivers.length; i++) {
            //if only one schedule, push it to the matrix
            if (this.drivers[i].secSchedules.length == 1) {
                this.secMatrix[i] = this.drivers[i].secSchedules[0];
            } else { //more than one schedule, check each one for lowest delta, then add it
                
                let minDelta = Infinity;
                let delta;
                let saveMinIdx;

                for (let j = 0; j < this.drivers[i].secSchedules.length; j++) {
                    this.secMatrix[i] = this.drivers[i].secSchedules[j];
                    delta = this.calculateDelta(this.secMatrix);
                    if (delta < minDelta) {
                        minDelta = delta;
                        saveMinIdx = j;
                    }
                }

                this.secMatrix[i] = this.drivers[i].secSchedules[saveMinIdx];
            }
        }

        return this.calculateDelta(this.secMatrix);
    }
          

    calculateNumRoutesPerDay = (matrix) => {
        let numRoutesArray = [0,0,0,0,0,0,0];
        
        for (let i = 0; i < this.drivers.length; i++) {
            for (let j = 0; j < 7; j++) {
                if (matrix[i][j] == 2) {
                    numRoutesArray[j]++;
                }
            }
        }
        
        return numRoutesArray;
    }

    calculateDelta = (matrix) => {
        let numRoutes = this.calculateNumRoutesPerDay(matrix);
        let delta = Math.max(...numRoutes) - Math.min(...numRoutes);
        return delta;
    }

    updateConfigFiles = () => {
        optConfig = {"driver":[]};
        secConfig = {"driver":[]};
        

        for (let i = 0; i < this.drivers.length; i++) {
            const optObject = {"name":"","avail":"","offWithin":"","availDay":""};
            optObject.name = this.drivers[i].first + ' ' + this.drivers[i].last;
            optObject.avail = this.drivers[i].avail.join('');
            optObject.availDay = this.drivers[i].availDay;
            optObject.offWithin = this.calculateNewOffWithin('opt', i);
            optConfig.driver.push(optObject);
            const secObject = {...optObject};
            secObject.offWithin = this.calculateNewOffWithin('sec', i);
            secConfig.driver.push(secObject);
        }
    }

    calculateNewOffWithin = (optOrSec, i) => {
        let driverSchedule;
        if (optOrSec == 'opt') {
            driverSchedule = this.optMatrix[i];
        } else if (optOrSec == 'sec') {
            driverSchedule = this.secMatrix[i];
        }
        
        let index = 6;
        let counter = 0
        while (driverSchedule[index] == 2) {
            counter++;
            index--;
        }

        return 6 - counter;
    }
}