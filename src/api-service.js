import {inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
@inject(HttpClient)
export class ApiService {
    constructor(http) {
        http.configure(config => {
            config
                .useStandardConfiguration()
                .withBaseUrl('http://localhost/Tui.Tema.Plan.Web/api/')
                .withDefaults({
                    credentials: 'include' //Oklart om denna har nån funktion Valid values; omit, same-origin and include
                });
        });
        this.http = http;
        this.isRequesting = false;
    }

    getFolders() {
        this.isRequesting = true;
        return this.http.fetch('folders')
            .then(response => response.json())
            .then(data => {
                this.isRequesting = false;
                return data;
            });
    }

    getPlans(season) {
        return this.http.fetch('planapi/planb/' + season)
            .then(response => response.json())
            .then(data => {

                return data;
            });
    }
    
    getGuides(season) {
        return this.http.fetch('guideapi/')
            .then(response => response.json())
            .then(data => {
                return data;
            });
    }
}

