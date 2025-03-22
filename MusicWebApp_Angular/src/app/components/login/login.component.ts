import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UserService } from "../../services/user.service";
import { Router } from "@angular/router";
import { LoginDTO } from "../../dtos/login.dto";
@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrl: "./login.component.scss",
})
export class LoginComponent implements OnInit {
    public loginForm: FormGroup;
    public submitted = false;
    public showPassword = false;
    public toastMessage: string = "";
    public isToastVisible: boolean = false;
    public toastType: "success" | "error" = "success";
    public countdown: number = 5;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            email: [
                "",
                [Validators.required, Validators.email],
            ],
            password: [
                "",
                [Validators.required, Validators.minLength(6)],
            ],
        });
    }

    get f() {
        return this.loginForm.controls;
    }

    ngOnInit() {}

    hideToast() {
        this.isToastVisible = false;
    }
    showToast(message: string, type: "success" | "error") {
        this.toastMessage = message;
        this.toastType = type;
        this.isToastVisible = true;

        setTimeout(() => {
            this.hideToast();
        }, 5500);
    }

    togglePassword() {
        this.showPassword = !this.showPassword;
    }

    updateCountdownMessage() {
        this.toastMessage = `Login successfully, you will be redirected to home page in ${this.countdown}s`;
    }

    onSubmit() {
        this.submitted = true;
        if (this.loginForm.invalid) {
            return;
        }
        const loginDTO: LoginDTO = {
            email: this.loginForm.get("email")?.value,
            password: this.loginForm.get("password")?.value,
        };
        this.userService.login(loginDTO).subscribe({
            next: (data: any) => {
                debugger;
                this.updateCountdownMessage();
                this.showToast(this.toastMessage, "success");
                let countdownInterval = setInterval(() => {
                    this.countdown--;
                    this.updateCountdownMessage();
                    if (this.countdown === 0) {
                        clearInterval(countdownInterval);
                        this.router.navigate(["/home"]).then(() => {
                            window.location.reload();
                        });
                    }
                }, 1000);
            },
            complete: () => {
                debugger;
                console.log("complete");
            },
            error: (error: any) => {
                debugger;
                this.showToast(
                    "Login failed, please check your username and password",
                    "error"
                );
                console.log(error);
            },
        });
    }
}
