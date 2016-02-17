import {inject} from 'aurelia-framework';
import {Grid} from 'ag-grid/main';
import {ApiService} from './api-service';

@inject(ApiService)
export class Welcome {

    constructor(apiService) {
        this.apiService = apiService;
        this.plans = [];
        this.guides = [];
        this.gridOptions = {};

        this.columnDefs = [
            { headerName: "GuideId", field: "GuideId", valueGetter: this.guideValueGetter.bind(this), cellRenderer: this.guideDropdown.bind(this), width: 90, sortingOrder: ['asc','desc'], hide: false},
            { headerName: "ShortOutbound", field: "ShortOutbound", width: 110 , sortingOrder: ['asc','desc'], hide: false},
            { headerName: "ShortHomebound", field: "ShortHomebound", width: 110 , hide: false},
            { headerName: "Destination", field: "Destination", cellStyle: { color: 'darkred' }, width: 90 , sortingOrder: ['asc','desc'], hide: false},
            { headerName: "Resort", field: "Resort", width: 90 , sortingOrder: ['asc','desc'], hide: false},
            { headerName: "AirportCode", field: "AirportCode", width: 90, hide: true },
            { headerName: "PrintPnr", field: "PrintPnr", width: 90 ,  cellRenderer: this.pnrEditor.bind(this), hide: false},
            {   headerName: "TripName",
                volatile:true,
                field: "TripName",
                width: 90,
                cellClass: function (params) { return (params.data.Dirty == true ? 'dirty' : 'my-class-2'); }

            },
        ];
    }

    guideValueGetter(params) {

        let guideObj = this.guides.find(x => x.Id === Number.parseInt(params.data.GuideId));
        if (guideObj !== undefined) {
            return guideObj.GuideName;
        } else {
            return 'Not found';
        }
    }

    selectVisibleCol(col){
        console.log('change visibility for col ', col)
        //col.hide = !col.hide;
        this.gridOptions.columnApi.setColumnVisible(col.field, !!col.hide);
        col.hide = !col.hide;
    }
    
    activate() {

        this.apiService.getPlans('A')
            .then(plans => this.plans = plans)
            .then(() => this.apiService.getGuides())
            .then(guides => this.guides = guides)
            .then(() => this.initGrid());
        // .catch(error => {
        //     console.log(error.response);
        // });
    }


    submit() {
        //Set grid to new season
        // this.grid.setRowData(newRows)
        let dirtyRows = this.plans.filter(row => row.Dirty === true);
        console.log('dirtyes', dirtyRows);
    }
    
    hideCol(){
        console.log('hide');
    }
    
    initGrid() {

        this.gridOptions = {
            columnDefs: this.columnDefs,
            rowSelection: 'single',
            onSelectionChanged: this.onSelectionChanged,
            enableColResize: true,
            enableFilter: true,
            enableSorting: true,
            rowData: this.plans
        };

        var eGridDiv = document.querySelector('#myGrid');
        this.grid = new Grid(eGridDiv, this.gridOptions);
        this.gridOptions.api.sizeColumnsToFit();


    }
    
    pnrEditor(params){
      
        var eCell = document.createElement('div');
        eCell.className = "prewrp";
        eCell.setAttribute('contenteditable', 'true');
        eCell.setAttribute('title',params.value);
        //eCell.className = "prewrap";
        eCell.innerHTML = params.value;
        
        
        eCell.addEventListener('blur', evt => { this.blurPnrListener(evt, params, eCell) });
        return eCell;
        

    }

    //GuideEditor for Editing of Id
    guideDropdown(params) {
        var editing = false;

        var eCell = document.createElement('span');

        var eLabel = document.createTextNode(params.data.GuideName);
        eCell.appendChild(eLabel);

        var eSelect = document.createElement("select");

        this.guides.forEach(function (item) {
            var eOption = document.createElement("option");
            eOption.setAttribute("value", item.Id);
            eOption.innerHTML = item.GuideName;
            eSelect.appendChild(eOption);
        });

        eSelect.value = params.value;

        eCell.addEventListener('click', function () {
            if (!editing) {
                for (let i = 0; i < eSelect.options.length; i++) {
                    if (eSelect.options[i].text == eLabel.nodeValue) {
                        eSelect.options[i].selected = true;
                        break;
                    }
                }

                eCell.removeChild(eLabel);
                eCell.appendChild(eSelect);
                eSelect.focus();
                editing = true;
            }
        });

        eSelect.addEventListener('blur', function () {
            if (editing) {
                editing = false;
                eCell.removeChild(eSelect);
                console.log('removed eSelect')
                eCell.appendChild(eLabel);
            }
        });
        eSelect.addEventListener('change', evt => { this.changeListener(evt, params, eCell, eLabel, editing) });
       
        return eCell;
    }

    changeListener(evt, params, eCell, eLabel, editing) {
        if (editing) {
            let newValue = evt.target.value;
            let newLabel = evt.target.selectedOptions[0].innerText
            params.data[params.colDef.field] = newValue;
            params.data["GuideName"] = newLabel;
            params.data["Dirty"] = true;
            eLabel.nodeValue = newLabel;
            
            //removed remove since blur also removes
            //eCell.removeChild(evt.target);
                    
            eCell.appendChild(eLabel);
            editing = false;
            this.grid.refreshBody();
        }
    }

    blurPnrListener(evt, params, eCell){
        if(evt.target.innerText !== params.data.PrintPnr){
            params.data['PrintPnr'] = evt.target.innerText;
            params.data["Dirty"] = true;
            console.log('prn changed');
            this.grid.refreshBody();
        }else{
            console.log('no change');
        }
    }   


    onSelectionChanged() {
        //console.log(this.api.getSelectedRows());
    }

    canDeactivate() {
        if (this.fullName !== this.previousValue) {
            return confirm('Are you sure you want to leave?');
        }
    }
 }

export class UpperValueConverter {
    toView(value) {
        return value && value.toUpperCase();
    }
}
