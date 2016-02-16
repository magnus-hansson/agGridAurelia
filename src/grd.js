//import {computedFrom} from 'aurelia-framework';
import {inject} from 'aurelia-framework';
import {Grid} from 'ag-grid/main';
import {ApiService} from './api-service';

@inject(ApiService)
export class Welcome {

    constructor(apiService) {
        this.apiService = apiService;
        this.plans = [];
        this.guides = [];
        var resled = [{name:'arne', id:1}];
        this.gridOptions = {
            rowSelection: 'multiple',
            onSelectionChanged: this.onSelectionChanged,
        };

        this.columnDefs = [
            { headerName: "OutboundDate", field: "OutboundDate" },
            { headerName: "HomeboundDate", field: "HomeboundDate" },
            { headerName: "Destination", field: "Destination", cellStyle: { color: 'darkred' } },
            { headerName: "Resort", field: "Resort" },
            { headerName: "AirportCode", field: "AirportCode" },
            { headerName: "TripName", field: "TripName" },
            { headerName: "GuideId", field: "GuideId", cellRenderer: this.guideEditor.bind(this) }
        ];
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
        // this.apiService.getPlans('A')
        //     .then(plans => this.plans = plans)
        //     .then(() => console.log('got new plans', this.plans.length))
        //     .then(() => this.grid.setRowData(this.plans))
        //     .catch(error => {
        //         console.log(error.response);
        //     });
        //Set grid to new season
     
        // var newRows = [
        //     { make: "Toyota", model: "Celica", price: 35000 },
        //     { make: "Toyota", model: "Celica", price: 35000 },
        //     { make: "Toyota", model: "Celica", price: 35000 }]
        // this.grid.setRowData(newRows)
       

    }

    initGrid() {
        // var columnDefs = [
        //     { headerName: "OutboundDate", field: "OutboundDate" },
        //     { headerName: "HomeboundDate", field: "HomeboundDate" },
        //     { headerName: "Destination", field: "Destination", cellStyle: { color: 'darkred' } },
        //     { headerName: "Resort", field: "Resort" },
        //     { headerName: "AirportCode", field: "AirportCode" },
        //     { headerName: "TripName", field: "TripName" },
        //     { headerName: "GuideId", field: "GuideId", cellRenderer: this.guideEditor }
        // ];

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

    guideEditor(params) {
        var editing = false;

        var eCell = document.createElement('span');
       
        var guideObj = this.guides.find(x => x.Id === params.value);
        let guideName
        if(guideObj !== undefined){
            guideName = guideObj.GuideName
        }else{
            guideName = 'undef';
        }
        var eLabel = document.createTextNode(guideName);
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
                params.data[params.colDef.field] = newValue;
                //TODO: leta rätt på vald guides namn...
                eLabel.nodeValue = newValue;
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
}

export class UpperValueConverter {
    toView(value) {
        return value && value.toUpperCase();
    }
}
