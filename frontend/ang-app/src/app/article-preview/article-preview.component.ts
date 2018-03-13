import {Component, Input, OnInit} from '@angular/core';
import {Article} from "../classes/article.class";

/* Компонент для краткого Preview статьи */

@Component({
    selector: 'app-article-preview',
    templateUrl: './article-preview.component.html',
    styleUrls: ['./article-preview.component.scss']
})
export class ArticlePreviewComponent implements OnInit {

    /* Статью будем получать через входное свойство article */
    @Input() article: Article;

    constructor() {
    }

    ngOnInit() {
    }

}
