

class LocalStorage{
    constructor(name){
        this.name = name;
        this.store = localStorage.getItem(this.name) ? JSON.parse(localStorage.getItem(this.name)): [];
        this.temp_store = localStorage.getItem('temp-data') ? JSON.parse(localStorage.getItem('temp-data')): [];
    }
    updateStore(){
        localStorage.setItem(this.name, JSON.stringify(this.store));
    }
    updateTempStore(){
        localStorage.setItem('temp-data', JSON.stringify(this.temp_store));
    }
    changeStore(new_store){
        this.store = new_store;
        this.updateStore();
    }
    addItem(data){
        this.store.push(data);
        this.updateStore();
    }
    addItems(items){
        const len = items.length;
        for(let i = 0; i < len; i++){
            this.store.push(items[i]);
        }
        this.updateStore();
    }
    replaceItemFromArray(new_store){
        const replaced_store = this.store.map( obj => new_store.find( o => o.id === obj.id) || obj );
        this.changeStore(replaced_store);
    }
    replaceItem(item){
        this.store.forEach( obj => {
            if(obj.id == item.id){
                for(let key in item){
                    obj[key] = item[key];
                }
            }
        })
        this.updateStore();
    }
    getItem(id){
        return this.store.find( item => item.id == id);
    }
    getTempItem(id){
        return this.temp_store.find( item => item.id == id);
    }
    getItemIndex(id){
        return this.store.findIndex( item => item.id == id);
    }
    getStore(){
        return this.store;
    }
    clearStore(){
        this.store = [];
        this.updateStore();
    }
    clearTempStore(){
        this.temp_store = [];
        this.updateTempStore();
    }
    deleteItem(id){
        const new_array = this.store.filter( item => item.id != id);
        this.changeStore(new_array);
    }
}

export const Schedule_Data = new LocalStorage('schedule-store');

