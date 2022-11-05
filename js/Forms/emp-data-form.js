"use strinct";

import { Schedule_Data } from '../Storage/storage-local.js';
import { SiteColors } from '../Data/site-data.js';
import { openWindow, closeWindow, createFullName } from '../Utilities/utilities.js';
import { FormSet } from './formset.js';
import { Employee, Schedule, Availability, Day } from '../Employee/employee.js';
import { Schedule_Display } from '../ScheduleDisplay/schedule-display.js';
import { PageNotification } from '../Notifications/notification.js';

export const form_window = document.querySelector('.js-employee_form_window');

export const EmployeeForm = new FormSet('EmployeeForm');
//console.log(EmployeeForm)
const employee_form_cancel_button = form_window.querySelector('.js-form-cancel_button');
const employee_form_reset_button = form_window.querySelector('.js-form-reset_button');
const employee_form_submit_button = form_window.querySelector('.js-form-submit_button');

const availability_checkboxes = EmployeeForm.checkboxs.filter( element => element.name.includes('dayoff') || element.name.includes('unavailable'));

// Form Button Functions
export function openNewEmployeeForm(state){
    if(state){
        autosetForm();
    }
    openWindow(form_window);
    
    setRadioButtonFunctions(EmployeeForm.radio_buttons);
    setAvailabilityCheckboxStyles(availability_checkboxes);
    employee_form_cancel_button.addEventListener('click', cancelEmployeeFormSubmission);
    employee_form_reset_button.addEventListener('click', resetEmployeeDataForm);
    employee_form_submit_button.addEventListener('click', submitEmployee);
}
function cancelEmployeeFormSubmission(){
    closeWindow(form_window);
    removeAllFormEventListeners();
    resetEmployeeDataForm();
    PageNotification.notify('error', '...what a waste.');
}
function resetEmployeeDataForm(){
    EmployeeForm.reset();
    resetRadioButtons(EmployeeForm.radio_buttons)
    availability_checkboxes.forEach( checkbox => {
        checkbox.parentElement.parentElement.style.backgroundColor = 'hsl(0 0% 100% / 0.5)';

        //reseting h3 and labels within the availability sections
        [...checkbox.parentElement.parentElement.children].forEach( child => {
            child.style.color = 'hsl(0 0% 10%)';
        })
    });

}

/**
 * 
 *      EMPLOYEE FORM FUNCTIONS
 */

function removeAllFormEventListeners(){
    employee_form_cancel_button.removeEventListener('click', cancelEmployeeFormSubmission);
    employee_form_reset_button.removeEventListener('click', resetEmployeeDataForm);
    employee_form_submit_button.removeEventListener('click', submitEmployee);
    removeRadioButtonEventListeners(EmployeeForm.radio_buttons);
    removeCheckboxStyleEventListeners(availability_checkboxes);
}

// I might want to move this function to a seperate file
function changeEmployeeData(employee){
    console.log('first', employee)
    const {first_name, last_name, full_name, store, management, type, shift, shift_type, minHours, maxHours} = employee;
    const temp_employee = new Employee();
    temp_employee.setId(employee.id);
    const new_first_name = EmployeeForm.getValue('firstname');
    const new_last_name = EmployeeForm.getValue('lastname');
    const new_store = EmployeeForm.getRadioSelection('store');
    const new_management = EmployeeForm.getInput('management').checked;
    const new_shift = EmployeeForm.getRadioSelection('shift');
    const new_shift_type = EmployeeForm.getRadioSelection('shift-type');
    const new_min_hour = +EmployeeForm.getValue('minhour');
    const new_max_hour = +EmployeeForm.getValue('maxhour');
    
    if(first_name != new_first_name) {
        temp_employee.setFirstName(new_first_name);
        temp_employee.setFullName(new_first_name)
    }else{
        temp_employee.setFirstName(first_name);
        temp_employee.setFullName(
            temp_employee.createFullNameString(temp_employee.first_name,last_name)
        )
    }
    if(last_name != new_last_name){
        temp_employee.setLastName(new_last_name);
        temp_employee.setFullName(
            temp_employee.createFullNameString(temp_employee.first_name,new_last_name)
        )
    }else{
        temp_employee.setLastName(last_name);
        temp_employee.setFullName(
            temp_employee.createFullNameString(temp_employee.first_name,last_name)
        )
    }
    if(store != new_store){
        temp_employee.setStore(new_store);
    }else{
        temp_employee.setStore(store);
    }
    // add managagement if changed
    if(management != new_management){
        temp_employee.setManagement(new_management);
    }else{
        temp_employee.setManagement(management);
    }
    // add change type (based on management) or set
    temp_employee.setType(temp_employee.management);

    if(shift != new_shift){
        temp_employee.setShift(new_shift);
    }else{
        temp_employee.setShift(shift);
    }
    if(shift_type != new_shift_type){
        temp_employee.setShiftType(new_shift_type);
    }else{
        temp_employee.setShiftType(shift_type);
    }
    if(minHours != new_min_hour){
        temp_employee.setMinHours(new_min_hour);
    }else{
        temp_employee.setMinHours(minHours);
    }
    if(maxHours != new_max_hour){
        temp_employee.setMaxHours(new_max_hour);
    }else{
        temp_employee.setMaxHours(maxHours);
    }
    
    // get availability from form and set tempemploye availability
    // scan through employee schedule and change any dayoff's and unavailablity's
    // if dayoff/unavailable changes in schedule, change schedule to availability


    //--- below--- This is not working...ugh

    temp_employee.availability = new Availability(getAvailability(EmployeeForm));
    const new_schedule = employee.schedule.days.map( (day ) => {
        const index = employee.schedule.days.indexOf(day);
        console.log(index)
        const avl_day = employee.availability.days[index];
        if(avl_day.off || avl_day.unavailable){
            day.start = "";
            day.stop = "";
        }
        if(avl_day.off) {
            day.off = avl_day.off; 
        }
        if(avl_day.unavailable){
            day.unavailable = avl_day.unavailable;
        }
        return day;
    });

    // ---- above not working

    
    temp_employee.schedule = new Schedule(new_schedule);
    Schedule_Data.replaceItem(temp_employee);
}


function submitEmployee(){
    if(!confirm('Add a new employee?')){
        PageNotification.notify('error','What are you doing?');
    }else{
        if(!EmployeeForm.state){
            const new_employee = new Employee(
                EmployeeForm.getValue('firstname'),
                EmployeeForm.getValue('lastname'),
                EmployeeForm.getRadioSelection('store'),
                EmployeeForm.getInput('management').checked,
                EmployeeForm.getRadioSelection('shift'),
                EmployeeForm.getRadioSelection('shift-type'),
                +EmployeeForm.getValue('minhour'),
                +EmployeeForm.getValue('maxhour'),
                getAvailability(EmployeeForm)
            );
            Schedule_Display.createWeekElement(new_employee);
            Schedule_Data.addItem(new_employee);
            PageNotification.notify('success', `${new_employee.full_name} added to the schedule!`);
            console.log(new_employee);
        }else{
            // This is when updating employee data
            // This should occur when EmployeeForm state == true;

            const employee_id = EmployeeForm.form.getAttribute('data-id');
            const employee = Schedule_Data.getItem(employee_id);

            changeEmployeeData(employee)
            
            EmployeeForm.state = false;
        } 
        closeWindow(form_window)
        removeAllFormEventListeners();
        resetEmployeeDataForm();
    }
}

function getAvailability(EmployeeForm){
    const availability = [];
    const days = [...EmployeeForm.form.querySelectorAll('.js-availability-day')];
        for(let i = 0; i < days.length; i++){
            const day_element = days[i];
            const title = day_element.querySelector('h3').innerText;
            const short_title = title.slice(0,3).toLowerCase();
            const day_off = day_element.querySelector('.js-dayoff-checkbox').checked;
            const unavailable = day_element.querySelector('.js-unavailable-checkbox').checked;
            const start = EmployeeForm.getValue(`${short_title}start`); //day_element.querySelector('.js-day-time-start').value;
            const stop = EmployeeForm.getValue(`${short_title}stop`); //day_element.querySelector('.js-day-time-stop').value;
            availability.push(new Day(title,day_off,unavailable,start,stop,'availability'));
        }
    return availability;
}

/**
 * 
 * RADIO BUTTON FUNCTIONS AND CONTROLS
 */
function autosetForm(){
    EmployeeForm.setRadioSelection('store','bevmo');
    EmployeeForm.setRadioSelection('shift', 'day');
    EmployeeForm.setRadioSelection('shift-type','Part-Time');
}
function setRadioButtonFunctions(radio_buttons){
    radio_buttons.forEach( button => {
        if(button.checked){
            button.parentElement.style.backgroundColor = SiteColors.form.radio_selection;
        }else{
            button.parentElement.style.backgroundColor = SiteColors.transparent;
        }
        button.addEventListener('click', setActiveRadioButton);
    })
}
function setActiveRadioButton({target}){
    resetRadioButtons(EmployeeForm.radio_buttons)
    if(target.checked){
        target.parentElement.style.backgroundColor = SiteColors.form.radio_selection;
    }else{
        target.parentElement.style.backgroundColor = SiteColors.transparent;
    }
}
function resetRadioButtons(radio_buttons){
    radio_buttons.forEach( button => {
        if(!button.checked){
            button.parentElement.style.backgroundColor = SiteColors.transparent;
        }else{
            button.parentElement.style.backgroundColor = SiteColors.form.radio_selection;
        }
    })
}
function removeRadioButtonEventListeners(radio_buttons){
    radio_buttons.forEach( button => {
        button.removeEventListener('click', setActiveRadioButton)
    })
}

/**
 * 
 * CHECKBOXS FUNCTIONS AND STYLING
 */
export function styleFormDayParent(parent_element,start_name,stop_name,day_off_checkbox,unavailable_checkbox,start_time,stop_time){
    if(!start_time || start_time == "" || start_time == 'any'){
        start_time = '08:00';
    }
    if(!stop_time || stop_time == "" || stop_time == 'any'){
        stop_time = '17:00';
    }
    if(!day_off_checkbox.checked && !unavailable_checkbox.checked){
        parent_element.style.backgroundColor = SiteColors.available;
        parent_element.style.color = 'white';
        EmployeeForm.setValue(start_name, start_time);
        EmployeeForm.setValue(stop_name, stop_time);
    }
    if(day_off_checkbox.checked){
        parent_element.style.backgroundColor = SiteColors.dayoff;
        parent_element.style.color = 'white';
        EmployeeForm.resetValue(start_name);
        EmployeeForm.resetValue(stop_name);
    }
    if(unavailable_checkbox.checked){
        parent_element.style.backgroundColor = SiteColors.unavailable;
        parent_element.style.color = 'white';
        EmployeeForm.resetValue(start_name);
        EmployeeForm.resetValue(stop_name);
    }
    if(day_off_checkbox.checked && unavailable_checkbox.checked){
        parent_element.style.backgroundColor = SiteColors.unavailable_dayoff;
        parent_element.style.color = 'white';
        EmployeeForm.resetValue(start_name);
        EmployeeForm.resetValue(stop_name);
    }
}

function setDayParentStyle({target}){
    const short = target.name.slice(0,3);
    const start_name = `${short}start`;
    const stop_name = `${short}stop`;
    const start_time = EmployeeForm.getValue(start_name);
    const stop_time = EmployeeForm.getValue(stop_name);
    const checkboxs = EmployeeForm.checkboxs.filter( checkbox => checkbox.name.includes(short));
    const parent_element = target.parentElement.parentElement;
    const day_off_checkbox = checkboxs[0];
    const unavailable_checkbox = checkboxs[1];

    styleFormDayParent(parent_element,start_name,stop_name,day_off_checkbox,unavailable_checkbox,start_time,stop_time);
}


function setAvailabilityCheckboxStyles(checkboxs){
    checkboxs.forEach( checkbox => {
        checkbox.addEventListener('click', setDayParentStyle)
    })
}
function removeCheckboxStyleEventListeners(checkboxs){
    checkboxs.forEach( checkbox => {
        checkbox.removeEventListener('click', setDayParentStyle);
    })
}
