import {inject} from 'aurelia-framework';
import {Grid} from 'ag-grid/main';
import {ApiService} from './api-service';

@inject(ApiService)
export class Welcome {

    constructor(apiService) {
        this.apiService = apiService;
        this.plans = [];
        this.guides = [];
        this.seasons = [];
        this.gridOptions = {};
        this.statusOptions = ['Ok', '?', 'x'];
        this.selectedValues = ['x', 'STR'];
        this.tourtypeOptions = ['x', 'CYK', 'KRY', 'RUN', 'SAF', 'STR'];
        this.travelPlanOptions = ['x', 'Pågående', 'Klar'];
        this.columnDefs = [
            { headerName: "C", field: "Cancelled", width: 40, hide: false, cellClass: this.cellBgColor, cellRenderer: this.checkboxEditor.bind(this) },
            { headerName: "TripName", field: "TripName", width: 90, hide: false, cellClass: this.cellBgColor },
            { headerName: "Season", field: "SeasonDescription", width: 75, hide: false, cellClass: this.cellBgColor },
            { headerName: "Nat", field: "Nat", width: 50, hide: false, cellClass: this.cellBgColor },
            { headerName: "Prod", field: "Producent", width: 60, hide: false, cellClass: this.cellBgColor },
            { headerName: "PP", field: "Personalplanering", width: 60, hide: false, cellClass: this.cellBgColor },
            { headerName: "Dest", field: "Destination", cellStyle: { color: 'darkred' }, width: 60, sortingOrder: ['asc', 'desc'], hide: false, cellClass: this.cellBgColor },
            { headerName: "Tour", field: "Resort", width: 70, sortingOrder: ['asc', 'desc'], hide: false, cellClass: this.cellBgColor },
            { headerName: "Airport", field: "AirportCode", width: 70, editable: true, newValueHandler: this.textValueChangedHandler.bind(this), hide: false, cellClass: this.cellBgColor },
            { headerName: "Tour type", field: "TourType", cellRenderer: this.genDropDown.bind(this), width: 90, sortingOrder: ['asc', 'desc'], hide: false, cellClass: this.cellBgColor, optionValues: this.tourtypeOptions },
            { headerName: "Tl cost s", field: "RLkostnad", width: 95, editable: true, newValueHandler: this.textValueChangedHandler.bind(this), hide: false, cellClass: this.cellBgColor },
            { headerName: "Tl cost flt", field: "KostnadRLflyg", width: 95, editable: true, newValueHandler: this.textValueChangedHandler.bind(this), hide: false, cellClass: this.cellBgColor },
            { headerName: "Outbound", field: "ShortOutbound", width: 90, sortingOrder: ['asc', 'desc'], hide: false, cellClass: this.cellBgColor },
            { headerName: "Homebound", field: "ShortHomebound", width: 100, hide: false, cellClass: this.cellBgColor },
            { headerName: "CRS Bono", field: "Bokningsnummer", width: 85, editable: true, newValueHandler: this.textValueChangedHandler.bind(this), hide: false, cellClass: this.cellBgColor },
            { headerName: "Htl/Conn", field: "OrderBoardFlight", width: 85, editable: true, newValueHandler: this.textValueChangedHandler.bind(this), hide: false, cellClass: this.cellBgColor },
            { headerName: "PrintPnr", field: "PrintPnr", width: 90, cellRenderer: this.pnrEditor.bind(this), hide: false, cellClass: this.cellBgColor },
            { headerName: "Travel plan", field: "TravelPlanOk", cellRenderer: this.genDropDown.bind(this), width: 95, sortingOrder: ['asc', 'desc'], hide: false, cellClass: this.cellBgColor, optionValues: this.travelPlanOptions },
            { headerName: "Tour leader", field: "GuideId", valueGetter: this.guideValueGetter.bind(this), cellRenderer: this.guideDropdown.bind(this), minWidth: 50, width: 170, sortingOrder: ['asc', 'desc'], hide: false, cellClass: this.cellBgColor },
            { headerName: "Status", field: "Status", cellRenderer: this.genDropDown.bind(this), width: 80, sortingOrder: ['asc', 'desc'], hide: false, cellClass: this.cellBgColor, optionValues: this.statusOptions },
            { headerName: "Booking status", field: "Ant", width: 120, editable: true, newValueHandler: this.textValueChangedHandler.bind(this), hide: false, cellClass: this.cellBgColor },
            { headerName: "Dbl book", field: "Dubbelbok", width: 100, editable: true, newValueHandler: this.textValueChangedHandler.bind(this), hide: false, cellClass: this.cellBgColor },
            { headerName: "Also guiding", field: "Lederaven", width: 100, editable: true, newValueHandler: this.textValueChangedHandler.bind(this), hide: false, cellClass: this.cellBgColor },
            { headerName: "Stud", field: "StudId", valueGetter: this.studValueGetter.bind(this), cellRenderer: this.guideDropdown.bind(this), width: 70, sortingOrder: ['asc', 'desc'], hide: false, cellClass: this.cellBgColor },
            { headerName: "Stud status", field: "StudOK", cellRenderer: this.genDropDown.bind(this), width: 100, sortingOrder: ['asc', 'desc'], hide: false, cellClass: this.cellBgColor, optionValues: this.statusOptions },
            { headerName: "Stud PNR/Print", field: "StudBokningsnr", width: 140, editable: true, newValueHandler: this.textValueChangedHandler.bind(this), hide: false, cellClass: this.cellBgColor },
            { headerName: "Petty cash", field: "Reskassa", width: 90, editable: true, newValueHandler: this.textValueChangedHandler.bind(this), hide: false, cellClass: this.cellBgColor },
            { headerName: "Travel doc", field: "MaterialsSent", width: 90, hide: false, cellClass: this.cellBgColor, cellRenderer: this.checkboxEditor.bind(this) },
            { headerName: "Gr visa", field: "GroupVisa", width: 80, hide: false, cellClass: this.cellBgColor, cellRenderer: this.checkboxEditor.bind(this) },
            { headerName: "Tl Visa", field: "GuideVisa", width: 80, hide: false, cellClass: this.cellBgColor, cellRenderer: this.checkboxEditor.bind(this) },
            { headerName: "Work permit", field: "WorkPermitOk", width: 100, hide: false, cellClass: this.cellBgColor, cellRenderer: this.checkboxEditor.bind(this) },
            { headerName: "Central accounting", field: "CentralAccounting", width: 140, editable: true, newValueHandler: this.textValueChangedHandler.bind(this), hide: false, cellClass: this.cellBgColor },
            { headerName: "Notering", field: "Notering", width: 140, editable: true, newValueHandler: this.textValueChangedHandler.bind(this), hide: false, cellClass: this.cellBgColor },
            { headerName: "Rls bed", field: "Rlstidbadd", width: 90, hide: true, cellClass: this.cellBgColor },
            { headerName: "Rls flt", field: "Rlstidflyg", width: 90, hide: true, cellClass: this.cellBgColor },
            { headerName: "Min", field: "Minant", width: 60, editable: true, newValueHandler: this.textValueChangedHandler.bind(this), hide: false, cellClass: this.cellBgColor },
            { headerName: "Max", field: "Maxant", width: 60, editable: true, newValueHandler: this.textValueChangedHandler.bind(this), hide: false, cellClass: this.cellBgColor },
        ];
    }

    initGrid() {

        this.gridOptions = {
            columnDefs: this.columnDefs,
            rowSelection: 'single',
            onSelectionChanged: this.onSelectionChanged,
            onRowDoubleClicked: this.onRowDoubleClicked,
            enableColResize: true,
            enableFilter: true,
            enableSorting: true,
            rowData: this.plans,

        };

        var eGridDiv = document.querySelector('#myGrid');
        this.grid = new Grid(eGridDiv, this.gridOptions);
    }

   get selectedSeasonDescription(){
       return this.seasons
            .filter((season) => { return season.Selected })
            .map((filtredSeason) => { return filtredSeason.SeasonDescription });
   }                                 

    cellBgColor(params) {
        if (params.data.Cancelled)
            return 'row-cancelled';
        if (params.data.Dirty)
            return 'row-dirty';
        if (params.data.Nat === 'F')
            return 'row-finnish';

        return '';
    }

    guideValueGetter(params) {

        let guideObj = this.guides.find(x => x.Id === Number.parseInt(params.data.GuideId));
        if (guideObj !== undefined) {
            return guideObj.GuideName;
        } else {
            return 'Not found';
        }
    }

    textValueChangedHandler(params) {
        //TODO kolla om värdet ändrats?
        if (params.data[params.colDef.field] != params.newValue)
            params.data[params.colDef.field] = params.newValue;

        if (!params.data.Dirty) {
            params.data.Dirty = true;
            this.grid.refreshBody();
        }
    }

    studValueGetter(params) {

        let guideObj = this.guides.find(x => x.Id === Number.parseInt(params.data.StudId));
        if (guideObj !== undefined) {
            return guideObj.GuideName;
        } else {
            return '--';
        }
    }

    selectVisibleCol(col) {
        console.log('change visibility for col ', col)
        this.gridOptions.columnApi.setColumnVisible(col.field, !!col.hide);
        col.hide = !col.hide;
    }

    setSelectedSeason(season) {
        season.Selected = !season.Selected;
        let selectedSeasons = this.seasons
            .filter((season) => { return season.Selected })
            .map((filtredSeason) => { return filtredSeason.CrsSeasonCode });

        this.apiService.getPlans(selectedSeasons.join('.'))
            .then(plans => this.plans = plans)
            .then(() => this.grid.setRowData(this.plans));
    }

    activate() {

        this.apiService.getPlans('A')
            .then(plans => this.plans = plans)
            .then(() => this.apiService.getGuides())
            .then(guides => this.guides = guides)
            .then(() => this.apiService.getSeasons())
            .then(seasons => this.seasons = seasons)
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

    hideCol() {
        console.log('hide');
    }

    pnrEditor(params) {

        var eCell = document.createElement('div');
        eCell.className = "prewrp";
        eCell.setAttribute('contenteditable', 'true');
        eCell.setAttribute('title', params.value);

        eCell.innerHTML = params.value;

        eCell.addEventListener('blur', evt => { this.blurPnrListener(evt, params, eCell) });
        return eCell;
    }

    checkboxEditor(params) {
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.checked = params.value;

        checkbox.addEventListener('click', evt => { this.checkBoxClickListener(evt, params) });

        return checkbox;
    }

    checkBoxClickListener(evt, params) {
        params.data[params.colDef.field] = evt.target.checked;
        params.data["Dirty"] = true;
        this.grid.refreshBody();
    }

    genDropDown(params) {
        var editing = false;
        var eCell = document.createElement('span');
        eCell.style.width = '100%';
        var eLabel = document.createTextNode(params.value);
        eCell.appendChild(eLabel);
        var eSelect = document.createElement("select");
        eSelect.style.width = '100%';
        params.colDef.optionValues.forEach(function (item) {
            var eOption = document.createElement("option");
            eOption.setAttribute("value", item);
            eOption.innerHTML = item;
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

                eCell.appendChild(eLabel);
            }
        });

        eSelect.addEventListener('change', evt => { this.changeDropDownListener(evt, params, eCell, eLabel, editing) });

        return eCell;
    }

    guideDropdown(params) {
        var editing = false;

        var eCell = document.createElement('span');

        let field = params.colDef.field;
        let name;
        if (field === 'GuideId')
            name = this.guideValueGetter(params);
        if (field === 'StudId')
            name = this.studValueGetter(params);


        var eLabel = document.createTextNode(name);
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

                eCell.appendChild(eLabel);
            }
        });

        eSelect.addEventListener('change', evt => { this.changeDropDownListener(evt, params, eCell, eLabel, editing) });

        return eCell;
    }

    changeDropDownListener(evt, params, eCell, eLabel, editing) {
        if (editing) {
            let newValue = evt.target.value;
            let newLabel = evt.target.selectedOptions[0].innerText


            params.data[params.colDef.field] = newValue;

            params.data["Dirty"] = true;
            eLabel.nodeValue = newLabel;

            eCell.appendChild(eLabel);
            editing = false;
            this.grid.refreshBody();
        }
    }

    blurPnrListener(evt, params, eCell) {
        if (evt.target.innerText !== params.data.PrintPnr) {
            params.data['PrintPnr'] = evt.target.innerText;
            params.data["Dirty"] = true;
            console.log('prn changed');
            this.grid.refreshBody();
        } else {
            console.log('no change');
        }
    }


    onSelectionChanged() {
        //console.log(this.api.getSelectedRows());
    }
    onRowDoubleClicked() {
        console.log('you double clicked, wanna edit?');
    }

    canDeactivate() {
        if (this.plans.filter(row => row.Dirty === true)) {
            return confirm('Are you sure you want to leave? you have unsaved changes');
        }
    }
}

export class UpperValueConverter {
    toView(value) {
        return value && value.toUpperCase();
    }
}
