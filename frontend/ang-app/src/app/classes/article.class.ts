/**
 * Статья и составляющие ее поля для указания типизации
 */
export class Article {
    constructor(
        public title: string = '',
        public content: string = '',
        public image: string = '',
        public author: string = '',
        public url: string = '',
    ) {}
}