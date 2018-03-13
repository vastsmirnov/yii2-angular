import {Component, OnInit} from '@angular/core';
import {ArticleListService} from '../services/article-list.service';
import {Article} from "../classes/article.class";

/* Компонент списка статей */

@Component({
    selector: 'app-articles-list',
    templateUrl: './articles-list.component.html',
    styleUrls: ['./articles-list.component.scss']
})
export class ArticlesListComponent implements OnInit {

    /* Статьи храним в компоненте. По-умалчанию их нет. */
    public articles: Array<Article> = [];

    constructor(private articlesListService: ArticleListService) {
    }

    ngOnInit() {
        /* После инициализации запрашиваем статьи по API */
        this.articlesListService.getData().subscribe((data: Array<Article>) => this.articles = data);
    }

}
