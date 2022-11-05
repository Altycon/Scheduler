"use strict";

import { Schedule_Data } from "./Storage/storage-local.js";
import { Schedule_Display } from "./ScheduleDisplay/schedule-display.js";

import { openNewEmployeeForm } from "./Forms/emp-data-form.js";
import { generateRandomEmployees } from "./Employee/generate.js";
import { PageNotification } from "./Notifications/notification.js";

const ApplicationInformation = {
    name: 'The Scheduler',
    author: 'Clayton McDaniel',
    data: 'October 2022'
}


// Variables
const NewEmployeeButton = document.querySelector('.js-add-employee_button');
const GenerateButton = document.querySelector('.js-generate_button');
const PrintButton = document.querySelector('.js-print-schedule_button');
const ScheduleDisplay_Loader = document.querySelector('.js-display-loader');

// Home Page Initialization

const init = ()=> {
    Schedule_Display.displaySavedData(Schedule_Data.store);

    NewEmployeeButton.addEventListener('click', openNewEmployeeForm);
    GenerateButton.addEventListener('click', generateRandomEmployees);
    PrintButton.addEventListener('click', ()=> window.print())

    PageNotification.notify('general', 'Welcome to the Scheduler');
    ScheduleDisplay_Loader.classList.add('hidden');
}
document.addEventListener('DOMContentLoaded', init);