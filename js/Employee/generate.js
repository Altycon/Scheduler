
import { Schedule_Display } from "../ScheduleDisplay/schedule-display.js";
import { random } from "../Utilities/utilities.js";
import { Employee, Day } from "./employee.js";
import { Bevmo_Data, Gopuff_Data } from "../Data/store-data.js";
import { PageNotification } from "../Notifications/notification.js";
import { Schedule_Data } from "../Storage/storage-local.js";

const names_list = [
    "Amy", "Adam", "Alice", "Andrew", "Adam", "Allan", "Anna",
    "Beatrice", "Bonny", "Brad", "Benjamin", "Berry",
    "Clayton", "Carrey", "Corra", "Cat", "Craig", "Constance", "Cody",
    "Dan", "Dustin", "Diego", "Dillan", "Dinaras", "Dion",
    "Elliot", "Ellis", "Emile", "Erin", "Ender", "Elvin",
    "Fin", "Finnlay", "Fionna", "Flyn", "Firaaz", "Fletcher",
    "Hussnan", "Hyden", "Heather",
    "Ian", "Idris", "Iesteyn",
    "James", "Jake", "Jamey", "Joan", "Jenny", "Jackson",
    "Kevin", "Kenzie", "Kerr", "Kez", "Katlyn",
    "Marvin", "Mason", "Mark", "Mary",
    "Owen", "Ozzy", "Oskar",
    "Rachel", "Richelle", "Renee",
    "Sandy", "Sean", "Same", "Sahil", "Stephanie",
    "Tyree", "Tyson"
];

const days_off_possibilities = [
    [1,1,0,0,0,0,0],
    [0,1,1,0,0,0,0],
    [0,0,1,1,0,0,0],
    [0,0,0,1,1,0,0],
    [0,0,0,0,1,1,0],
    [0,0,0,0,0,1,1],
];

const shift_possibilites = [
    "opening","day","evening","closing"
]

// Generator functions
function generateFirstName(){
    return names_list[Math.floor(Math.random() * names_list.length)];
}
function generateLastName(){
    return names_list[Math.floor(Math.random() * names_list.length)];
}
function generateStore(){
    return Math.random() > 0.5 ? 'bevmo':'gopuff';
}
function generateManagement(){
    return Math.random() < 0.5 ? true:false;
}
function generateShift(){
    return shift_possibilites[Math.floor(Math.random()*shift_possibilites.length)];
}
function generateShiftType(){
    return Math.random() > 0.5 ? "Full-Time":"Part-Time";
}
function generateMinHours(){
    return random(5,20,true);
}
function generateMaxHours(){
    return random(30,40,true)
}
function generateAvailability(store,shift,management){
    const weekdays = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    const store_data = store == 'bevmo' ? Bevmo_Data:Gopuff_Data;
    const days_off = days_off_possibilities[Math.floor(Math.random() * days_off_possibilities.length)];
    const shift_time = management ? store_data.shifts.full_time: store_data.shifts.part_time;
    const start_time = shift_time[shift][0]
    const stop_time = shift_time[shift][1];
    
    const availability = [];
    for(let i = 0; i < weekdays.length; i ++){
        const title = weekdays[i];
        const day_off = days_off[i] ? true:false;
        const unavailable = Math.random() > 0.05 ? false:true;
        const start = day_off ? "": start_time;
        const stop = day_off ? "":stop_time;
        availability.push(new Day(title,day_off,unavailable,start,stop,'availability'));
    }
    return availability;
}

export function generateRandomEmployees(){
    const count = prompt('How many employees?') || 5;
    const employee_container = document.querySelector('.js-employee_container');
    const manager_container = document.querySelector('.js-management_container');
    
    for(let i = 0; i < count; i++){
        const store = generateStore();
        const management = generateManagement();
        const shift = generateShift();

        const random_employee = new Employee(
            generateFirstName(),
            generateLastName(),
            store,
            management,
            shift,
            generateShiftType(), 
            generateMinHours(),
            generateMaxHours(),
            generateAvailability(store,shift,management)
        )
        //createEmployeeElements(random_employee);
        Schedule_Display.createWeekElement(random_employee);
        Schedule_Data.addItem(random_employee);
    }
    PageNotification.notify('success', 'Generation complete');
}
