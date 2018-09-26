import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import "rxjs";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RoomyApi{
	private baseUrl = 'https://project-roomy.firebaseio.com/';
	private currentHotel;
	constructor(private http: Http) {
		
	}
	getHotels(){
		return new Promise(resolve =>{
			this.http.get(`${this.baseUrl}/data.json`)
			.subscribe(res => resolve(res.json()));
		});
	}
	getHotelData(hotelId):Observable<any>{
		return this.http.get(`${this.baseUrl}/hotels/${hotelId}.json`)
		.map((response:Response)=>{
			this.currentHotel = response.json();
			return this.currentHotel;
		});
	}

	getBookingHistory(){
    return new Promise(resolve =>{
      this.http.get(`assets/data/BookingHistory.json`)
      .subscribe(res => resolve(res.json()));
    });
  }
}