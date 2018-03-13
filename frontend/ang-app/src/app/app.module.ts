import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {HeaderComponent} from "./components/header/header.component";
import {FooterComponent} from "./components/footer/footer.component";
import { ArticlesListComponent } from './articles-list/articles-list.component';
import {ArticleListService} from "./services/article-list.service";
import {HttpClientModule} from "@angular/common/http";


@NgModule({
    declarations: [
        HeaderComponent,
        FooterComponent,
        AppComponent,
        ArticlesListComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule
    ],
    providers: [
        ArticleListService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
