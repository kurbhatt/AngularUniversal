import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {makeStateKey, TransferState} from '@angular/platform-browser';

const USERS_KEY = makeStateKey("USERS");
const POST_KEY = makeStateKey("POST");

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AngularUniversal';
  userData: any;
  post: any;

  constructor(private http: HttpClient, private state: TransferState) {
  }

  ngOnInit() {
      this.userData = this.state.get(USERS_KEY, null as any);
      if(!this.userData) {
          console.dir("User data not found in TransferState");
          this.http.get('https://jsonplaceholder.typicode.com/users').subscribe(response => {
              this.assignUsersData(response);
          });
      } else {
          console.dir("User data found in TransferState");
      }

      this.post = this.state.get(POST_KEY, null as any);
      if(!this.post) {
          console.dir("Post data not found in TransferState");
          this.http.get('https://jsonplaceholder.typicode.com/posts/1').subscribe(response => {
              this.assignPostData(response);
          });
      } else {
          console.dir("Post data found in TransferState");
      }
  }

  private assignUsersData(response) {
      this.userData = response;
      this.state.set(USERS_KEY, this.userData as any);
  }

    private assignPostData(response) {
        this.post = response;
        this.state.set(POST_KEY, this.post as any);
    }
}
