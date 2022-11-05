import { openEmployeeDataDisplay } from '../Employee/emp-data-display.js';
import { openEmployeeTimeForm } from '../Forms/emp-time-form.js';

class ScheduleDisplay{
    constructor(parent){
        this.parent = document.querySelector(parent);
        this.header = this.parent.querySelector('header');
        this.display = this.parent.querySelector('.js-schedule_display');
        this.manager_container = this.display.querySelector('.js-management_container');
        this.employee_container = this.display.querySelector('.js-employee_container');
        this.verification_display = this.parent.querySelector('.js-scheudle_display_results');
    }
    createWeekElement(employee){
        const article = document.createElement('article');
        article.setAttribute('data-id', employee.id);
        article.classList.add('grid');
        article.classList.add('row');

        const fragment = new DocumentFragment();

        const name_element = document.createElement('h3');
        const acro = employee.store === 'bevmo' ? 'BM':'GP'; // I should store this in a data obj
        name_element.setAttribute('data-store-acronymn', acro);
        name_element.setAttribute('data-management', employee.management);
        name_element.setAttribute('tabindex', "0");
        name_element.classList.add('flex-centered');
        name_element.innerText = employee.full_name;
        name_element.addEventListener('click', openEmployeeDataDisplay);

        fragment.appendChild(name_element);

        employee.availability.days.forEach( (day,index) => {
            const day_element = document.createElement('p');
            day_element.setAttribute('data-day-name',day.day);
            // day_element.setAttribute('data-day-type', day.type);
            day_element.setAttribute('tabindex', "0");
            day_element.classList.add('flex-centered');
            
            const scheduled_day = employee.schedule.days[index];
            
          

            if(scheduled_day.start === "" && scheduled_day.stop === ""){
                if(scheduled_day.off){
                    day_element.innerText = 'dayoff';
                    day_element.classList.add('dayoff');
                    day_element.setAttribute('data-day-type', 'dayoff');
                }else if(scheduled_day.unavailable){
                    day_element.innerText = 'unavailable';
                    day_element.classList.add('unavailable');
                    day_element.setAttribute('data-day-type', 'unavailable');
                }else if(scheduled_day.type === 'available'){
                    day_element.innerText = day.timeToString;
                    day_element.classList.add(day.type);
                    day_element.setAttribute('data-day-type', day.type);
                }  
            }else{
                day_element.innerText = scheduled_day.timeToString;
                day_element.classList.add(scheduled_day.type);
                day_element.setAttribute('data-day-type', scheduled_day.type);
            }
            
            day_element.addEventListener('click', openEmployeeTimeForm);
            fragment.appendChild(day_element);
        })
        
        article.appendChild(fragment);

        this.injectEmployeeElement(article,employee)
        
    }
    injectEmployeeElement(element,employee){
        // check store and management choices to determine wich section to add too
        let parent_container;
        // const employee_container = document.querySelector('.js-employee_container');
        // const manager_container = document.querySelector('.js-management_container');
        // parent_container = employee.management ? manager_container:employee_container;

        if(employee.management){
            parent_container = this.manager_container;
        }else{
            parent_container = this.employee_container;
        }

        // placing the employee inside parent container
        switch(employee.store){
            case 'bevmo':
                parent_container.appendChild(element);
                break;
            case 'gopuff':
                if(parent_container.firstChild){
                    parent_container.insertBefore(element, parent_container.firstChild);
                }else{
                    parent_container.appendChild(element);
                }
                break;
        }
    }
    displaySavedData(storage){
        const len = storage.length;
        for(let i = 0; i < len; i++){
            const employee = storage[i];
            this.createWeekElement(employee);
        }
    }
    clearDisplay(){
        while(this.employee_container.firstChild){
            this.employee_container.removeChild(this.employee_container.firstChild);
        }
        while(this.manager_container.firstChild){
            this.manager_container.removeChild(this.manager_container.firstChild);
        }
    }
    getEmployeeWeekData(){

    }
    setEmployeeWeekData(){

    }
    getEmployeeDayData(){

    }
    setEmployeeDay(){

    }
    getWeekData(){

    }
    getDayData(){
        
    }
}

export const Schedule_Display = new ScheduleDisplay('.js-employee-schedule');

