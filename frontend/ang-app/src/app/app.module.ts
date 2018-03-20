import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {HeaderComponent} from "./components/header/header.component";
import {FooterComponent} from "./components/footer/footer.component";
import { ArticlesListComponent } from './articles-list/articles-list.component';
import {ArticleListService} from "./services/article-list.service";
import {HttpClientModule} from "@angular/common/http";
import { ArticlePreviewComponent } from './article-preview/article-preview.component';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import {CommonModule} from "@angular/common";


@NgModule({
    declarations: [
        HeaderComponent,
        FooterComponent,
        AppComponent,
        ArticlesListComponent,
        ArticlePreviewComponent,
        DatepickerComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        CommonModule
    ],
    providers: [
        ArticleListService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
