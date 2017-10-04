export class PageViewModel{
    id:any;
    isVisible:boolean;
    isDisabled:boolean;

    constructor(data:any){
       this.id = data.id;
       this.isVisible = data.isVisible;
       this.isDisabled = data.isDisabled;
    }
}