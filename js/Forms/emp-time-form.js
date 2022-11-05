
import { openWindow, closeWindow, TransformTimeToString,capatalizeWord } from "../Utilities/utilities.js";
import { Schedule_Data } from "../Storage/storage-local.js";
import { SiteColors } from "../Data/site-data.js";
import { FormSet } from "./formset.js";
import { Day } from "../Employee/employee.js";
import { PageNotification } from "../Notifications/notification.js";

const day_window = document.querySelector('.js-employee_day_window');
const day_window_close_button = day_window.querySelector('.js-day-close_button');
const day_update_button = day_window.querySelector('.js-day-update_button');

const TimeForm = new FormSet('NewTimeForm');
//console.log(TimeForm);


// I might want to move this function to a seperate file
function changeEmployeeDayData(employee_id,store,new_day, new_unschedule_time){
    const new_store = [...store];

    for(let i = 0; i < new_store.length; i++){
        const employee = new_store[i];
        if(+employee.id == employee_id){
            for(let j = 0; j < employee.schedule.days.length; j++){
                const sdl_day = employee.schedule.days[j];
                if(sdl_day.day == new_day.day){
                    sdl_day.off = new_day.off;
                    sdl_day.unavailable = new_day.unavailable;
                    sdl_day.start = new_day.start;
                    sdl_day.stop = new_day.stop;
                    if(new_unschedule_time){
                        sdl_day.type = 'available';
                    }else{
                        if(sdl_day.start != "" || sdl_day.stop != ""){
                            sdl_day.type = 'scheduled';
                        }else{
                            sdl_day.type = new_day.type;
                        }
                    }
                    
                    sdl_day.timeToString = new_day.timeToString;
                }
            }
        }
    }
    return new_store;
}

function updateScheduleDay(ev){
    const target = ev.target;
    
    const employee_id = TimeForm.form.getAttribute('data-id');
    const day_name = TimeForm.form.getAttribute('data-day');

    const new_from_time = TimeForm.getInput('newfromtime').value;
    const new_to_time = TimeForm.getInput('newtotime').value;
    const new_dayoff_time = TimeForm.getInput('newdayoff').checked;
    const new_unvailable_time = TimeForm.getInput('newunavailable').checked;
    const new_unschedule_time = TimeForm.getInput('newunschedule').checked;
    const new_timeToString = `${TransformTimeToString(new_from_time,'any')}-${TransformTimeToString(new_to_time,'any')}`;

    const store = Schedule_Data.getStore();
    const new_day = new Day(day_name,new_dayoff_time,new_unvailable_time,new_from_time,new_to_time,'schedule');

    const new_store = changeEmployeeDayData(employee_id,store,new_day,new_unschedule_time);

    Schedule_Data.changeStore(new_store);

    const employee_week_element = document.querySelector(`[data-id='${employee_id}']`);
    const day_element = employee_week_element.querySelector(`[data-day-name=${day_name}]`);

    if(new_dayoff_time){
        day_element.innerText = "dayoff";
        day_element.setAttribute('data-day-type', 'dayoff');
        replaceClass(day_element,'dayoff');
        TimeForm.form.setAttribute('data-day-type', 'dayoff');
    }
    if(new_unvailable_time){
        day_element.innerText = "unavailable";
        day_element.setAttribute('data-day-type', 'unavailable');
        replaceClass(day_element,'unavailable');
        TimeForm.form.setAttribute('data-day-type', 'unavailable');
    }
    if(!new_dayoff_time && !new_unvailable_time){
        day_element.innerText = new_timeToString;
        day_element.setAttribute('data-day-type', 'scheduled');
        replaceClass(day_element,'scheduled');
        TimeForm.form.setAttribute('data-day-type', 'scheduled');   
    }
    if(new_unschedule_time){
        const emp = Schedule_Data.getItem(employee_id);
        const day = findDayData(day_name,emp);
        day_element.innerText = day.timeToString; // I need to get employee availablity time;
        day_element.setAttribute('data-day-type', 'available');
        replaceClass(day_element,'available');
        TimeForm.form.setAttribute('data-day-type', 'available'); 
    }

    closeEmployeeDayDisplay();
    const employee_name = Schedule_Data.getItem(employee_id).full_name;
    PageNotification.notify('success', `Updated ${employee_name}'s ${capatalizeWord(day_name)} schedule`)
}

export function openEmployeeTimeForm({target}){
    const employee_id = target.parentElement.dataset.id;
    TimeForm.form.setAttribute('data-id', employee_id);
    TimeForm.form.setAttribute('data-day', target.dataset.dayName);
    TimeForm.form.setAttribute('data-day-type', target.dataset.dayType)
    
    const employee_data = Schedule_Data.getItem(employee_id);
  
    addTimeToDisplay(target,employee_data);
    day_window_close_button.addEventListener('click', closeEmployeeDayDisplay);
    day_update_button.addEventListener('click', updateScheduleDay);
    listenToDayDisplayCheckBoxs();
    openWindow(day_window);
}

function closeEmployeeDayDisplay(){
    closeWindow(day_window);
    resetDayDisplay();
    day_window_close_button.removeEventListener('click', closeEmployeeDayDisplay);
    day_update_button.removeEventListener('click', updateScheduleDay);
    TimeForm.checkboxs.forEach( checkbox => {
        checkbox.removeEventListener('click', setDayDisplayStyleFromCheckbox);
    });
}

function addTimeToDisplay(target,employee_data){
    const day_name = target.dataset.dayName;
    day_window.querySelector('.js-time-display_employee-name').innerText = employee_data.full_name;
    TimeForm.getTitleElement('h3').innerText = capatalizeWord(day_name);

    const day_data = findDayData(day_name,employee_data);
    TimeForm.form.setAttribute('data-day-type', day_data.type);

    switch(day_data.type){
        case 'dayoff':
            TimeForm.getInput('newdayoff').checked = true;
            TimeForm.form.style.backgroundColor = 'hsl(0 100% 50% / 0.2)';
            TimeForm.getInput('newunschedule').parentElement.style.display = 'none';
            break;
        case 'unavailable':
            TimeForm.getInput('newunavailable').checked = true;
            TimeForm.form.style.backgroundColor = 'hsl(0 100% 0% / 0.5)';
            TimeForm.getInput('newunschedule').parentElement.style.display = 'none';
            break;
        case 'scheduled':
            TimeForm.form.style.backgroundColor = 'hsl(0 0% 100% / 0.2)';
            TimeForm.getInput('newunschedule').parentElement.style.display = 'block';
            break;
        case 'available':
            TimeForm.form.style.backgroundColor = 'hsl(120 100% 50% / 0.2)';
            TimeForm.getInput('newunschedule').parentElement.style.display = 'none';
            break;
        default:
            TimeForm.form.style.backgroundColor = 'hsl(120 100% 50% / 0.2)';
            TimeForm.getInput('newunschedule').parentElement.style.display = 'none';
            break;
    }

    TimeForm.setValue('newfromtime', day_data.start);
    TimeForm.setValue('newtotime', day_data.stop);
};

function findDayData(day_name,employee_data){
    const schedule_day = employee_data.schedule.days.find( obj => {
        return obj.day == day_name;
    });
    const availability_day = employee_data.availability.days.find( obj => {
        return obj.day == day_name;
    });
    if(schedule_day.type != 'available'){
        return schedule_day
    }else{
        return availability_day;
    };
};

function resetDayDisplay(){
    day_window.querySelector('.js-time-display_employee-name').innerText = "";
    TimeForm.form.style.backgroundColor = 'transparent';
    TimeForm.resetValue('newfromtime');
    TimeForm.resetValue('newtotime');
    TimeForm.getInput('newdayoff').checked = false;
    TimeForm.getInput('newunavailable').checked = false;
    TimeForm.getInput('newunschedule').checked = false;
    TimeForm.getInput('newunschedule').parentElement.style.display = 'none';
    TimeForm.form.setAttribute('data-day-type',"");
    TimeForm.form.setAttribute('data-id', "");
    
};

function setDayDisplayStyleFromCheckbox({target}){
    Schedule_Data.updateStore();
    const employee_id = +TimeForm.form.getAttribute('data-id');
    const employee_data = Schedule_Data.getItem(employee_id);
    
    const day_name = TimeForm.form.getAttribute('data-day-type');
    const checkboxs = TimeForm.checkboxs;
    const day_off_checkbox = checkboxs[0];
    const unavailable_checkbox = checkboxs[1];
    const unschedule_checkbox = checkboxs[2];

    if(!day_off_checkbox.checked && !unavailable_checkbox.checked){
        TimeForm.form.style.backgroundColor = 'hsl(0 0% 90% / 0.5)';
        TimeForm.form.style.color = 'white';
        TimeForm.setValue('newfromtime', '');
        TimeForm.setValue('newtotime', '');
        TimeForm.form.setAttribute('data-day-type', 'scheduled');
    }
    if(day_off_checkbox.checked){
        TimeForm.form.style.backgroundColor = 'hsl(0 100% 50% / 0.2)';
        TimeForm.form.style.color = 'white';
        TimeForm.resetValue('newfromtime');
        TimeForm.resetValue('newtotime');
        TimeForm.form.setAttribute('data-day-type', 'dayoff');
    }
    if(unavailable_checkbox.checked){
        TimeForm.form.style.backgroundColor = 'hsl(0 0% 0% / 0.2)';
        TimeForm.form.style.color = 'white';
        TimeForm.resetValue('newfromtime');
        TimeForm.resetValue('newtotime');
        TimeForm.form.setAttribute('data-day-type', 'unavailable');
    }
    if(day_off_checkbox.checked && unavailable_checkbox.checked){
        TimeForm.form.style.backgroundColor = 'hsl(0 50% 50% / 0.2)';
        TimeForm.form.style.color = 'white';
        TimeForm.resetValue('newfromtime');
        TimeForm.resetValue('newtotime');
        TimeForm.form.setAttribute('data-day-type', 'unavailable');
    }
    if(unschedule_checkbox.checked){
        TimeForm.form.style.backgroundColor = 'hsl(120 100% 50% / 0.2)';
        TimeForm.form.style.color = 'white';
        TimeForm.resetValue('newfromtime');
        TimeForm.resetValue('newtotime');
        TimeForm.form.setAttribute('data-day-type', 'available');
    }
};

function listenToDayDisplayCheckBoxs(){
    TimeForm.checkboxs.forEach( checkbox => {
        checkbox.addEventListener('click', setDayDisplayStyleFromCheckbox);
    });
};

function replaceClass(element, new_class){
    const arr = ["available","schedule","dayoff","unavailable"];
    for(let i = 0; i < arr.length; i++){
        const clss = arr[i];
        if(element.classList.contains(clss)){
            element.classList.remove(clss);
            break;
        }
    }
    element.classList.add(new_class);
};