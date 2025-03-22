import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { RegisterDTO } from "../../dtos/register.dto";
import { UserService } from "../../services/user.service";
import { Router } from "@angular/router";

@Component({
    selector: "app-register",
    templateUrl: "./register.component.html",
    styleUrl: "./register.component.scss",
})
export class RegisterComponent {
    public registerForm: FormGroup;
    public submitted = false;
    public showPassword = false;
    public showRetypePassword = false;
    public toastMessage: string = "";
    public isToastVisible: boolean = false;
    public toastType: "success" | "error" = "success";
    public countdown: number = 5;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private router: Router
    ) {
        this.registerForm = this.fb.group(
            {
                username: ["", [Validators.required, Validators.minLength(3)]],
                email: ["", [Validators.required, Validators.email]],
                password: ["", [Validators.required, Validators.minLength(6)]],
                retypePassword: ["", Validators.required],
            },
            { validator: this.matchPasswords }
        );
    }

    get f() {
        return this.registerForm.controls;
    }

    matchPasswords(group: FormGroup) {
        const password = group.get("password")?.value;
        const retypePassword = group.get("retypePassword")?.value;
        return password === retypePassword ? null : { mismatch: true };
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
    updateCountdownMessage() {
        this.toastMessage = `Register successfully, you will be redirected to login in ${this.countdown}s`;
    }

    togglePassword() {
        this.showPassword = !this.showPassword;
    }

    toggleRetypePassword() {
        this.showRetypePassword = !this.showRetypePassword;
    }

    onRegister() {
        this.submitted = true;
        if (this.registerForm.invalid) {
            return;
        }
        const registerDTO: RegisterDTO = {
            email: this.registerForm.get("email")?.value,
            username: this.registerForm.get("username")?.value,
            password: this.registerForm.get("password")?.value,
            retype_password: this.registerForm.get("retypePassword")?.value,
        };
        console.log(registerDTO);
        this.userService.register(registerDTO).subscribe({
            next: () => {
                debugger;
                this.updateCountdownMessage();
                this.showToast(this.toastMessage, "success");
                let countdownInterval = setInterval(() => {
                    this.countdown--;
                    this.updateCountdownMessage();
                    if (this.countdown === 0) {
                        clearInterval(countdownInterval);
                        this.router.navigate(["/login"]);
                    }
                }, 1000);
            },
            complete: () => {
                debugger;
            },
            error: (error: any) => {
                debugger;
                this.showToast(
                    "Register failed, please check your username and password",
                    "error"
                );
            },
        });
    }
}
