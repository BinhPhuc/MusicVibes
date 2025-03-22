import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
    BrowserModule,
    provideClientHydration,
} from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { HttpClientModule } from "@angular/common/http";
import { LoginHeaderComponent } from "./components/login-header/login-header.component";
import { LoginFooterComponent } from "./components/login-footer/login-footer.component";
import { HomeFooterComponent } from "./components/home-footer/home-footer.component";
import { HomeHeaderComponent } from "./components/home-header/home-header.component";
import { HomeComponent } from "./components/home/home.component";
import { PlaylistComponent } from './components/playlist/playlist.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        LoginHeaderComponent,
        LoginFooterComponent,
        HomeFooterComponent,
        HomeHeaderComponent,
        HomeComponent,
        PlaylistComponent,
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule
    ],
    providers: [provideClientHydration()],
    bootstrap: [AppComponent],
})
export class AppModule {}
