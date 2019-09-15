import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  private apiURL = "https://api.graph.cool/simple/v1/ck0k5hxsp3i8t0127meqvs7qr";

  constructor(private http: HttpClient) {
    this.createUser();
    this.allUsers();
  }

  allUsers(): void {
    const body = {
      query: `
        query {
          allUsers {
            id
            name
            email
          }
        }
      `
    };

    this.http
      .post(this.apiURL, body)
      .subscribe(res => console.log("Query: ", res));
  }

  createUser(): void {
    const body = {
      query: `
        mutation createNewUser($name: String!, $email: String!, $password: String!) {
          createUser(name: $name, email: $email, password: $password) {
            id
            name
            email
          }
        }
      `,
      variables: {
        name: "Leninha Oliveira",
        email: "leninha@gmail.com",
        password: "123456"
      }
    };

    this.http
      .post(this.apiURL, body)
      .subscribe(res => console.log("Mutation: ", res));
  }
}
