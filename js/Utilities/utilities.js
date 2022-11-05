

export const random = (min,max,bool)=> bool ? Math.floor(Math.random()*(max-min)+min):Math.random()*(max-min)+min;
export const scale = (num, InMin, InMax, OutMin, OutMax)=>{
    return (num - InMin)*(OutMax-OutMin)/(InMax-InMin)+OutMin;
}
export const lockBody = ()=> document.body.style.overflow = 'hidden';
export const unlockBody = ()=> document.body.style.overflow = 'auto';
export const createFullName = (fname,lname)=> `${fname} ${lname}`;
// windows
export function openWindow(window_element){
    lockBody();
    window_element.classList.add('open');
    return window_element;
}
export function closeWindow(window_element){
    window_element.classList.add('close');
   // window_element.querySelector('.overlay').addEventListener('animationend', removeOpen);
    window_element.querySelector('.content').addEventListener('animationend', removeOpen);
    function removeOpen({target}){
        window_element.classList.remove('close');
        window_element.classList.remove('open');
        target.removeEventListener('animationend', removeOpen);
    }
    unlockBody();
}


export function TransformTimeToString(time,str){
    
    if(!time || time === ""){
        return str || "";
    }
    // I can do this better....
    let time_of_day = 'am';
    const regex = /[\d]+/g;
    const matches = time.match(regex);
    let hour = +matches[0];
    const minutes = matches[1];

    if(hour > 11 && hour < 24){
        time_of_day = 'pm';
    }
    hour = hour % 12;
    if(hour == 0) hour = 12;

    const result = `${hour}:${minutes}${time_of_day}`;
    return result;
}



// Rename this
export function convertTimeStringTo24cycle(time_string){
    const time_of_day = time_string.slice(-2);
    const shortend = time_string.slice(0,-2);
    const time_parts = shortend.split(':');
    let hour = +time_parts[0]
    const minutes = time_parts[1];

    if(time_of_day == 'pm' && hour < 12){
        hour += 12
    }else if(time_of_day == 'am' && hour == 12){
        hour = 0;
    }
    const result = `${hour < 10 ? '0':''}${hour}:${minutes}`;
    console.log(result)
    return result;
}





export function capatalizeWord(word){
    return word[0].toUpperCase() + word.substr(1); 
}
export function capatalizeAll(sentence){
    const words = sentence.split(" ");
    return words.map( word => word[0].toUpperCase() + word.substr(1)).join(" ");
}
