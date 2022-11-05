
export class FormSet{
    constructor(form){
        this.form = document.getElementById(form)
        this.inputs = [...this.form.elements].filter( element => element.name) || [];
        this.radio_buttons = this.inputs.filter( radio_button => radio_button.type == 'radio') || [];
        this.checkboxs = this.inputs.filter( checkbox => checkbox.type == 'checkbox') || [];
        this.times = this.inputs.filter( time => time.type == 'time') || [];
        this.state = false;
    }
    reset(){
        this.form.reset();
    }
    resetValue(name){
        this.inputs.find( input => input.name === name).value = "";
    }
    getValue(name){
        return this.inputs.find( input => input.name == name).value;
    }
    getInput(name){
        return this.inputs.find( input => input.name == name);
    }
    getSingleRadio(name,value){
        return this.radio_buttons.filter(radio => radio.name == name).find( button => button.value == value)
    }
    getRadioSelection(name){
        const radio_group = this.radio_buttons.filter( button => button.name == name);
        return radio_group.find( active => active.checked).value;
    }
    setRadioSelection(name,value){
        const radio_group = this.radio_buttons.filter( button => button.name == name);
        radio_group.forEach( radio_btn => {
            if(radio_btn.value == value){
                radio_btn.checked = true;
            }else{
                radio_btn.checked = false;
            }
        })
    }
    resetRadioSelections(name){
        this.radio_buttons.forEach( radio_btn => {
            if(radio_btn.name == name){
                radio_btn.checked = true;
            }
        })
    }
    setCheckbox(name,bool){
        this.checkboxs.find( checkbox => {
            if(checkbox.name == name){
                checkbox.checked = bool;
            }
        })
    }
    getNameGroup(name){
        return this.inputs.filter( input => input.name == name || input.name.includes(name));
    }
    setValue(name,value){
        this.inputs.find( input => input.name == name).value = value;
    }
    getTitleElement(element_name){
        return this.form.querySelector(element_name)
    }
}