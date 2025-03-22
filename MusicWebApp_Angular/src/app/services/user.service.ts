import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RegisterDTO } from "../dtos/register.dto";
import { Observable } from "rxjs";
import { LoginDTO } from "../dtos/login.dto";

@Injectable({
    providedIn: "root",
})
export class UserService {
    private apiRegister = "http://localhost:8088/api/v1/users/register";
    private apiLogin = "http://localhost:8088/api/v1/users/login";
    private apiConfig = {
        headers: this.createHeader(),
    };
    constructor(private http: HttpClient) {}
    private createHeader(): HttpHeaders {
        return new HttpHeaders({
            "Content-Type": "application/json",
            "Accept-Language": "vi",
        });
    }
    register(registerDTO: RegisterDTO): Observable<any> {
        return this.http.post<any>(
            this.apiRegister,
            registerDTO,
            this.apiConfig
        );
    }
    login(loginDTO: LoginDTO): Observable<any> {
        return this.http.post<any>(this.apiLogin, loginDTO, this.apiConfig);
    }
}
