
import { TransformTimeToString } from "../Utilities/utilities.js";


export class Employee{
    constructor(fname,lname,store,management,shift,shift_type,minhours,maxhours,availability){
        this.id = Math.random() * 100;
        this.first_name = fname;
        this.last_name = lname;
        this.full_name = this.createFullNameString(fname,lname) || "";
        this.store = store || "";
        this.management = management || false;
        this.type = this.setType(management);
        this.shift = shift || "";
        this.shift_type = shift_type || "";
        this.minHours = minhours || 5;
        this.maxHours = maxhours || 40;

        this.availability = new Availability(availability) || null;
        this.schedule = new Schedule(availability) || null;
    }
    setFirstName(fname){
        this.first_name = fname;
    }
    setLastName(lname){
        this.last_name = lname;
    }
    setFullName(flname){
        this.full_name = flname;
    }
    setStore(store){
        this.store = store;
    }
    setManagement(managment){
        this.management = managment;
    }
    setType(bool){
        return bool ? "Manager":"Employee";
    }
    setShift(shift){
        this.shift = shift;
    }
    setShiftType(shift_type){
        this.shift_type = shift_type;
    }
    setMinHours(minhour){
        this.minHours = minhour;
    }
    setMaxHours(maxhour){
        this.maxHours = maxhour;
    }
    setId(id){
        this.id = id;
    }
    createFullNameString(fname,lname){
        if (!fname) return;
        return `${fname} ${lname}`;
    }
}

export class Availability{
    constructor(week){
        this.days = week || [];
    }
}


export class Schedule{
    constructor(week){
        this.days = week || [];
        this.setGroup();
    }
    setGroup(){
        if(this.days.length > 0){
            this.days.forEach(day => {
                if(day.group != "schedule"){
                    day.group = "schedule";
                }
            });
        }
    }
}

export class Day{
    constructor(day,off,unavailable,start,stop,group){
        this.day = day;
        this.off = off || false;
        this.unavailable = unavailable || false;
        this.start = start || "";
        this.stop = stop || "";
        this.group = group || "";
        if(!this.off){
            this.type = 'available';
            this.timeToString = `${TransformTimeToString(this.start,'any')} - ${TransformTimeToString(this.stop,'any')}`;
        }
        if(this.off){
            this.type = 'dayoff';
            this.timeToString = "";
        }
        if(this.unavailable){
            this.type = 'unavailable';
            this.timeToString = "";
        }
    }
    setType(){
        
    }
}