import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import {base_url} from '../../providers/config/config';
// import { NavController, NavParams } from 'ionic-angular';

import { Http } from '@angular/http';

export class User{
	name: string;
	username: string;

	constructor(name: string, username: string){
		this.name = name;
		this.username = username;
	}
}

@Injectable()
export class AuthServiceProvider {
	currentUser: User;

	  constructor(private storage: Storage , public http: Http ) { }

	saveCredentials(str){
    		console.log('email is saved');
		  this.storage.set('ag_id', str);
	}


	public login(credentials){

		if(credentials.username === null || credentials.password === null){
			return Observable.throw("Please insert credentials");
		}else{
			return Observable.create(observer =>{

				// this.http.get( base_url + 'api/topics?key=43730487024f808fcxxxc22424' + '&user_id=' + 4)
			 //      .map(res => res.json())
			 //      .subscribe(data => {
			 //        this.topics = data.topics;
			 //        console.log(data);

			 //      })
				// let access = (credentials.password === 'pass' && credentials.email === 'email');
				// if(credentials.email === 'email'){
				// 		this.saveCredentials(credentials.email);
				// }
				// this.currentUser = new User('Simon', 'simom@gmail.com');
				// observer.next(access);
				// observer.complete();
			});
		}
	}

	public register(credentials){
		if(credentials.email === null || credentials.password === null){
			return Observable.throw("Please insert credentials");
		}else{
			return Observable.create(observer =>{
				observer.next(true);
				observer.complete();
			});
		}
	}

	public getUserInfo() : User{
// this.storage.get('email').then(email=>{
//         console.log('email: '+ email);
//       });
		// this.storage.get('email')
	 //      .then((email) => {
	 //        if (email) {
		// 		this.currentUser = new User('Simon', 'simom@gmail.com');
		// 		return this.currentUser;
	 //        } else {
		// 		return this.currentUser;
	 //        }
	 //      });


				this.currentUser = new User('Simon', 'simom@gmail.com');
				return this.currentUser;
	}

	public logout(){
		return Observable.create(observer => {
			this.currentUser = null;
			observer.next(true);
			observer.complete();

			this.storage.remove('email').then(()=>{
	    		console.log('email is removed');
	    	});
			// this.storage.clear().then(()=>{
			// console.log('all keys are cleared');
	  //   	});
		});
	}


}
