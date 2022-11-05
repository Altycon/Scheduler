

import { openWindow, closeWindow, TransformTimeToString, capatalizeWord } from "../Utilities/utilities.js";
import { Schedule_Data } from "../Storage/storage-local.js";
import { PageNotification } from "../Notifications/notification.js";
import { EmployeeForm, openNewEmployeeForm, styleFormDayParent } from "../Forms/emp-data-form.js";

const employee_data_window = document.querySelector('.js-employee_data_window');
const employee_delete_button = employee_data_window.querySelector('.js-data-delete_button');
const employee_update_button = employee_data_window.querySelector('.js-data-update_button');
const data_window_close_button = employee_data_window.querySelector('.js-data-close_button');

class EmployeeDataDisplay{
    constructor(class_name){
        this.display = document.querySelector(class_name);
    }
}
function injectEmployeeDataIntoFrom(employee){
    // console.log(EmployeeForm);
    // console.log(employee);
    EmployeeForm.form.setAttribute('data-id', employee.id);
    EmployeeForm.setValue('firstname', employee.first_name);
    EmployeeForm.setValue('lastname', employee.last_name);
    EmployeeForm.setCheckbox('management', employee.management);
    EmployeeForm.setRadioSelection('store',employee.store);
    EmployeeForm.setRadioSelection('shift', employee.shift);
    EmployeeForm.setValue('minhour',employee.minHours);
    EmployeeForm.setValue('maxhour', employee.maxHours);
    EmployeeForm.setRadioSelection('shift-type', employee.shift_type);

    const parent_elements = EmployeeForm.form.querySelectorAll('.js-availability-day');
    employee.availability.days.forEach( (day,index) => {
        const short_name = day.day.slice(0,3).toLowerCase();
        const start_name = `${short_name}start`;
        const stop_name = `${short_name}stop`;

        EmployeeForm.setCheckbox(`${short_name}dayoff`, day.off);
        EmployeeForm.setCheckbox(`${short_name}unavailable`,day.unavailable);
        EmployeeForm.setValue(start_name, day.start);
        EmployeeForm.setValue(stop_name, day.stop);

        const dayoff_checkbox = EmployeeForm.getInput(`${short_name}dayoff`);
        const unavailable_checkbox = EmployeeForm.getInput(`${short_name}unavailable`);

        styleFormDayParent(parent_elements[index], start_name,stop_name,dayoff_checkbox,unavailable_checkbox,day.start,day.stop);
    });
    
}
function updateEmployeeData(ev){
    const { target } = ev;
    const employee_id = +target.parentElement.dataset.id;
    const employee = Schedule_Data.getItem(employee_id);


    injectEmployeeDataIntoFrom(employee);

    closeWindow(employee_data_window);

    openNewEmployeeForm(false)
    EmployeeForm.state = true;
    // Then when form is submitted, change employee data in storage
    //  -- use function that i used in day display form.
    
    console.log(employee_id)
}

export function openEmployeeDataDisplay(ev){
    const target = ev.target;
    const employee_id = target.parentElement.dataset.id;

    const employee_data = Schedule_Data.getItem(employee_id);
    addDataToDisplay(employee_data);

    const opened_window = openWindow(employee_data_window);
    opened_window.querySelector('.content header').setAttribute('data-id', employee_id);

    data_window_close_button.addEventListener('click', closeEmployeeDataDisplay);
    employee_delete_button.addEventListener('click', deleteEmployeeData);
    employee_update_button.addEventListener('click', updateEmployeeData);
}

function closeEmployeeDataDisplay(){
    closeWindow(employee_data_window);
    data_window_close_button.removeEventListener('click',closeEmployeeDataDisplay);
    employee_delete_button.removeEventListener('click', deleteEmployeeData);
    PageNotification.notify('general', 'Welcome back');
}

function addDataToDisplay(employee_data){
    // name store management shift
    const data_display_elements = [...employee_data_window.querySelectorAll('[data-display]')];
    const availability_days = [...employee_data_window.querySelectorAll('.js-availability-day')];
    const schedule_days = [...employee_data_window.querySelectorAll('.js-schedule-day')];

    data_display_elements[0].innerText = employee_data.full_name;
    data_display_elements[1].innerText = capatalizeWord(employee_data.store);
    data_display_elements[2].innerText = employee_data.management ? "Management":"Employee";
    data_display_elements[3].innerText = employee_data.shift_type;
    data_display_elements[6].innerText = employee_data.minHours.toString();
    data_display_elements[7].innerText = employee_data.maxHours.toString();

    const sch_days = employee_data.schedule.days;
    sch_days.forEach( (s_day,index) => { 
        schedule_days[index].setAttribute('data-day-type', s_day.type);
        if(s_day.start == "" || s_day.stop == ""){
            if(s_day.off){
                schedule_days[index].children[1].innerText = "Day";
                schedule_days[index].children[2].innerText = "Off";
            }else{
                schedule_days[index].children[1].innerText = "--:-- --";
                schedule_days[index].children[2].innerText = "--:-- --";
            }
        }else{
            schedule_days[index].children[1].innerText = TransformTimeToString(s_day.start)
            schedule_days[index].children[2].innerText = TransformTimeToString(s_day.stop);
        }
    })
    
    const avl_days = employee_data.availability.days;
    avl_days.forEach( (a_day,index) => {
        availability_days[index].setAttribute('data-day-type', a_day.type);
        if(a_day.start == "" || a_day.stop == ""){
            if(a_day.off){
                availability_days[index].children[1].innerText = "Day";
                availability_days[index].children[2].innerText = "Off";
            }else{
                availability_days[index].children[1].innerText = "--:-- --";
                availability_days[index].children[2].innerText = "--:-- --";
            }
        }else{
            availability_days[index].children[1].innerText = TransformTimeToString(a_day.start)
            availability_days[index].children[2].innerText = TransformTimeToString(a_day.stop);
        }
        
        
    })
}

function removeEmployeeElement(id){
    let parent_container;
    const employee_container = document.querySelector('.js-employee_container');
    const manager_container = document.querySelector('.js-management_container');

    const employee_elements = [...employee_container.querySelectorAll('article')];
    const manager_elements = [...manager_container.querySelectorAll('article')];

    employee_elements.find( emp_element => {
        if(emp_element.dataset.id == id){
            employee_container.removeChild(emp_element);
            return true;
        }
    });
    manager_elements.find( man_element => {
        if(man_element.dataset.id == id){
            manager_container.removeChild(man_element);
            return true;
        }
    });
}

function deleteEmployeeData(ev){
    if(!confirm('Are you sure you want to delete this employee?')){
        PageNotification.notify('general', 'Whao...that was close...')
    }else{
        const target = ev.target;
        const employee_id = +target.parentElement.dataset.id;
        Schedule_Data.deleteItem(employee_id);
        removeEmployeeElement(employee_id);
        closeEmployeeDataDisplay();
        PageNotification.notify('success', 'Successfully deleted employee from schedule!');
    }
}
