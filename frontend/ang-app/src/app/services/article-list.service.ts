import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ArticleListService {
    /* TODO Вынести baseUrl в конфигурацию приложения или хотя бы в базовый сервис */
    private apiBaseUrl = 'http://yii2-angular';

    constructor(private http: HttpClient) {}

    public getData() {
        return this.http.get(this.apiBaseUrl + '/test-api/articles.json');
    }

}