import {inject} from 'aurelia-framework';
import {Grid} from 'ag-grid/main';
import {ApiService} from './api-service';

@inject(ApiService)
export class Welcome {

    constructor(apiService) {
        this.apiService = apiService;
        this.plans = [];
        this.guides = [];
        this.gridOptions = {
            rowSelection: 'multiple',
            enableColResize: true,
            onSelectionChanged: this.onSelectionChanged,
        };

        this.columnDefs = [
            { headerName: "GuideId", field: "GuideId", valueGetter: this.guideValueGetter.bind(this), cellRenderer: this.guideEditor2.bind(this), width: 90 },
           // { headerName: "GuideName", field: "GuideName", cellRenderer: this.guideEditor.bind(this), width: 90 },
            { headerName: "ShortOutbound", field: "ShortOutbound", width: 110 },
            { headerName: "ShortHomebound", field: "ShortHomebound", width: 110 },
            { headerName: "Destination", field: "Destination", cellStyle: { color: 'darkred' }, width: 90 },
            { headerName: "Resort", field: "Resort", width: 90 },
            { headerName: "AirportCode", field: "AirportCode", width: 90 },
            { headerName: "TripName", field: "TripName", width: 90 },
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
        //this.gridOptions.columnApi.sizeColumnsToFit(400);
        
        /*
        var allColumnIds = [];
        this.columnDefs.forEach(function (columnDef) {
            allColumnIds.push(columnDef.field);
        });
        this.gridOptions.columnApi.autoSizeColumns(allColumnIds);
*/
        //console.log(this.plans);
        //         let col = this.gridOptions.columnApi.getColumn('TripName');
        //         this.gridOptions.columnApi.setColumnVisible('TripName', !col);
        //         this.gridOptions.api.refreshView();
        // 
        //         // get the grid to space out it's columns
        //         this.gridOptions.columnApi.sizeColumnsToFit();
        //this.api.sizeColumnsToFit();
        
        //this.gridOptions.columnApi.setColumnVisible('TripName', false);
        // this.apiService.getPlans('A')
        //     .then(plans => this.plans = plans)
        //     .then(() => console.log('got new plans', this.plans.length))
        //     .then(() => this.grid.setRowData(this.plans))
        //     .catch(error => {
        //         console.log(error.response);
        //     });
        //Set grid to new season
        // this.grid.setRowData(newRows)
       

    }

    initGrid() {

        this.gridOptions = {
            columnDefs: this.columnDefs,
            rowSelection: 'multiple',
            onSelectionChanged: this.onSelectionChanged,
            enableFilter: true,
            rowData: this.plans
        };

        var eGridDiv = document.querySelector('#myGrid');
        this.grid = new Grid(eGridDiv, this.gridOptions);
        

    }

    //GuideEditor for Editing of Id
    guideEditor2(params) {
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
                    if(eSelect.options[i].text == eLabel.nodeValue ){
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
                eCell.appendChild(eLabel);
            }
        });

        eSelect.addEventListener('change', function () {

            if (editing) {
                editing = false;
                var newValue = eSelect.value;
                var newLabel = eSelect.selectedOptions[0].innerText
                params.data[params.colDef.field] = newValue;
                params.data["GuideName"] = newLabel;

                eLabel.nodeValue = newLabel;
                eCell.removeChild(eSelect);
                eCell.appendChild(eLabel);
            }
        });
        return eCell;
    }



    

    onSelectionChanged() {
        console.log(this.api.getSelectedRows());
    }

    canDeactivate() {
        if (this.fullName !== this.previousValue) {
            return confirm('Are you sure you want to leave?');
        }
    }
    
    // findGuideNameById(id){
    //     let guideObj = this.guides.find(x => x.Id === Number.parseInt(id));
    //     if(guideObj !== undefined){
    //         return guideObj.GuideName;
    //     }else {
    //     return 'Not found';
    //     }
    //     
    // }
}

export class UpperValueConverter {
    toView(value) {
        return value && value.toUpperCase();
    }
}




// guideEditor(params) {
//         var editing = false;
// 
//         var eCell = document.createElement('span');
// 
//         var eLabel = document.createTextNode(params.data.GuideName);
//         eCell.appendChild(eLabel);
// 
//         var eSelect = document.createElement("select");
//         //Funny use of .bind to get this to tag along in a orderly fashion
//         //var find = this.findGuideNameById.bind(this);
//         this.guides.forEach(function (item) {
//             var eOption = document.createElement("option");
//             eOption.setAttribute("value", item.GuideName);
//             eOption.innerHTML = item.GuideName;
//             eSelect.appendChild(eOption);
//         });
// 
//         eSelect.value = params.value;
// 
//         eCell.addEventListener('click', function () {
//             if (!editing) {
//                 eCell.removeChild(eLabel);
//                 eCell.appendChild(eSelect);
//                 eSelect.focus();
//                 editing = true;
//             }
//         });
// 
//         eSelect.addEventListener('blur', function () {
//             if (editing) {
//                 editing = false;
//                 eCell.removeChild(eSelect);
//                 eCell.appendChild(eLabel);
//             }
//         });
// 
//         eSelect.addEventListener('change', function () {
// 
//             if (editing) {
//                 editing = false;
//                 var newValue = eSelect.value;
//                 var newLabel = eSelect.selectedOptions[0].innerText
//                 params.data[params.colDef.field] = newValue;
//                 params.data["GuideName"] = newLabel;
// 
//                 eLabel.nodeValue = newLabel;
//                 eCell.removeChild(eSelect);
//                 eCell.appendChild(eLabel);
//             }
//         });
//         return eCell;
//     }