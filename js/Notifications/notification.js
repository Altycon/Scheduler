

class Notification{
    constructor(){
        this.parent = document.querySelector('.js-notification');
        this.message_element = this.parent.querySelector('p');
    }
    setNotification(type){
        switch(type){
            case 'success':
                this.bg_color = 'hsl(120 100% 50% / 0.5)';
                this.txt_color = 'hsl(0 0% 100%)';
                break;
            case 'error':
                this.bg_color = 'hsl(0 100% 50% / 0.5)';
                this.txt_color = 'hsl(0 0% 100%)';
                break;
            case 'general':
                this.bg_color = 'hsl(180 100% 50% / 0.5)';
                this.txt_color = 'hsl(0 0% 100%)';
                break;
            default:
                this.bg_color = 'hsl(0 0% 90%)';
                this.txt_color = 'hsl(0 0% 10%)';
        }
    }
    notify(type,message){
        this.setNotification(type);
        this.parent.style.backgroundColor = this.bg_color;
        this.message_element.style.color = this.txt_color;
        this.message_element.style.fontWeight = 700;
        this.message_element.style.textShadow = '2px 2px 2px hsl(0 0% 0% / 0.5)';
        this.message_element.innerText = message;

        this.parent.classList.add('notify');
        
        setTimeout(()=>{
            this.parent.classList.remove('notify');
        },3500);
    }
}

export const PageNotification = new Notification();