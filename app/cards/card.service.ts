import { Injectable } from "@angular/core";
import { School } from './school';
import { ApiService } from '../api/api.service';

import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class CardService {

    constructor(private apiService:ApiService) {

    }

    filterSchools(queryString: string = '') {
        queryString = '/institutions/?sector=1&sector=2&sector=4&sector=5' + queryString;
        return this.apiService.get(queryString)
            .map((response) => {
                console.log(response.json());
                return response.json();
            });
    }



}
