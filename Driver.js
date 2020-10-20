class Driver {
    constructor(first, last, avail, offWithin, availDay) {
        this.first = first;                                         //first name
        this.last = last;                                           //last name
        this.avail = avail.split('').map(Number);                   //availability
        this.availTotal = this.getAvailTotal();                     //total days available
        this.availDay = availDay;                                   //number of days driver can work
        this.offWithin = offWithin;                                 //within how many days does an employee have to be off to comply with 5 days in a row working max
        this.secSchedules = this.calculateAllPossibleSchedules();   //seconday schedules
        this.optSchedules = this.findOptimalSchedules();            //optimal schedules
    }

    //calculate all schedules and add them to this.secSchedules, they will reduced in calculateOptimalSchedules
    calculateAllPossibleSchedules = () => {
        let allSchedules = [];
        
        //if driver days can work is more (shouldnt be, but just in case) or equal (more likely) to days available, make availability only schedule
        if (this.availTotal - this.availDay <= 0) {
            allSchedules.push(this.avail.slice().map(x => {return (x >= 1) ? 2 : 0}));
        } else {        //drivers here are available more days then they can work
            let numOnDays = this.getNumOnDays();
            let numFlexDays = this.availTotal - numOnDays;
            let numDaysToSchedule = this.availDay - numOnDays;

            let schedulePermutations = this.getPermutations(numFlexDays, numDaysToSchedule);
            for (let perm of schedulePermutations) {
                let slate = this.avail.slice();
                let permCopy = perm.slice();
                for (let i = 0; i < slate.length; i++) {
                    if (slate[i] == 1) {
                        slate[i] = permCopy.shift();
                    }
                }
                allSchedules.push(slate);
            }
        }
        

        //take out schedules that interfere with offWithin rule
        
        //if only one schedule exists, check if it complies
        if (allSchedules.length == 1) {
            
            //assume it doesnt, switch proceed to true if it does
            let proceed = false;
            
            //check if the existing schedule allows a day off 
            for (let i = 0; i < this.offWithin; i++) {
                if (allSchedules[0][i] == 0) {
                    proceed = true;
                }
            }
           
            //if no day is off, create new schedules that take each possible day off within the offWithin limit
            if (!proceed) {
                let schedEdit = allSchedules[0].slice();
                allSchedules = [];
                for (let i = 0; i < this.offWithin; i++) {
                    schedEdit[i] = 0;
                    allSchedules.push(schedEdit.slice());
                    schedEdit[i] = 2;
                }
            }

        } else {

            //take out any schedules that violate offWithin for rest
            for (let i = 0; i < allSchedules.length; i++) {
                let doKeep = false;
                for (let j = 0; j < this.offWithin; j++) {
                    if (allSchedules[i][j] == 0) {
                        doKeep = true;
                    }
                }
                if (!doKeep) {
                    allSchedules.splice(i,1);
                    i--;
                }
            }
            if (allSchedules.length == 0) {
                //lower availability
                this.availDay--;
                //try again
                allSchedules = this.calculateAllPossibleSchedules();
                console.log('no schedules after compliance check, if this error is logged twice, we have a problem.');
            }
        }

        return allSchedules;
    }

    getPermutations = (numFlexDays, numDaysToSchedule) => {
        let basePerm = [];
        for (let i = 0; i < numFlexDays; i++) {
            if (i < numDaysToSchedule) {
                basePerm.push(2);
            } else {
                basePerm.push(0);
            }
        } 
        let permutations = [];
        this.permutationsHelper(basePerm, [], permutations);
        //convert to string arrays 
        let stringPerms = permutations.map(JSON.stringify);
        //convert to set to remove duplicates
        let uniqueStringPerms = new Set(stringPerms);
        //convert back to array
        let uniquePerms = Array.from(uniqueStringPerms, JSON.parse);
        // console.log('test: ', basePerm, uniquePerms);
        return uniquePerms;
    }

    //recursive permutations helper
    //algorithm courtesy of AlgoExpert
    permutationsHelper = (array, currPerm, permutations) => {
        if (!array.length && currPerm.length) {
            permutations.push(currPerm);
        } else {
            for (let i = 0; i < array.length; i++) {
                let newArray = array.slice(0,i).concat(array.slice(i+1));
                let newPerm = currPerm.concat([array[i]]);
                this.permutationsHelper(newArray, newPerm, permutations);
            }
        }
    }
    
    //separate schedules into optimal and secondary schedules
    findOptimalSchedules = () => {
        let optimalSchedules = [];

        //if schedule has a weekend day off, make it optimal
        for (let i = 0; i < this.secSchedules.length; i++) {
            if (this.secSchedules[i][0] == 0 || this.secSchedules[i][6] == 0) {
                optimalSchedules.push(this.secSchedules[i].slice());
            }
        }

        //if schedule has both weekend days on, make sure employee has a "weekend" off in the middle of the week
        for (let i = 0; i < this.secSchedules.length; i++) {
            if(this.secSchedules[i][0] == 2 && this.secSchedules[i][6] == 2) {
                for (let j = 1; j < 5; j++) {
                    if (this.secSchedules[i][j] == 0 && this.secSchedules[i][j+1] == 0) {
                        optimalSchedules.push(this.secSchedules[i].slice());
                        break;
                    }
                }
            }
        }

        //if no schedules are considered optimal, make all secondary schedules optimal
        if (optimalSchedules.length == 0) {
            optimalSchedules = this.secSchedules.slice();
        }
        
        return optimalSchedules;
    }

    
    //returns num of days available
    getAvailTotal = () => {
        let total = 0;
        for (let i of this.avail) {
            if (i >= 1) {
                total++;
            }
        }
        return total;
    }

    getNumOnDays = () => {
        let numOnDays = 0;
        for (let day of this.avail) {
            if (day == 2) {
                numOnDays++;
            }
        }
        return numOnDays;
    }
    
}