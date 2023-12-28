import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiURL } from '../models/config'

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  apiURL = apiURL;

  loggedIn: boolean = false;
  loggedInUser !: any;

  constructor(private http: HttpClient) { }

  registerUser(userData: any) {
    return this.http.post(`${this.apiURL}/users`, userData);
  }

  loginIser(userCreds: any) {
    return this.http.post(`${this.apiURL}/userLogin`, userCreds);
  }

  postIotData(iotData: any) {
    return this.http.post(`${this.apiURL}/iotData`, iotData);
  }

  getIotData(date: any) {
    return this.http.post(`${this.apiURL}/getIotData`, { "date": date });
  }

  getAllData() {
    return this.http.get(`${this.apiURL}/getAllData`);
  }
}
