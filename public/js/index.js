/* global $ fetch */
let currentPage = 1;
let showQty = 8;
class CakeList {
    constructor(offset, limit, curPage) {
        const data = {offset: offset, limit: limit};
        fetch('/get-page', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(cakes => {
                this.cakes = cakes;
                this.renderCakes(cakes);
            });
        fetch('/get-cakes-qty')
            .then(res => res.json())
            .then(qty => {
                this.pages = qty['count(*)'];
                this.renderPaginator(this.pages, limit, curPage);
                this.addEventListeners();
            });
    }
    renderCakes(cakes) {
        let cakeListDomString = '';
        cakes.forEach(cake => {
            cakeListDomString += 
                `<div class='card'>
                    <img class='cake-icon' src='${(cake.result_photo ? cake.result_photo : cake.prototype ? cake.prototype : './pic/cake.jpg')}'
                        alt='${cake.theme}'>
                    <div class='card-body'>
                        <h4 class='cake-name'>${cake.theme}</h4>
                    </div>
                </div>`;
        });
        $('.products-showcase').html(cakeListDomString);
    }
    renderPaginator(pages, limit, curPage) {
        const pagesQty = pages / limit;
        let htmlString = '';
        if (pagesQty <= 1) {
            return;
        } else {
            for (let i = 1; i <= Math.ceil(pagesQty); i++) {
                if (i === curPage) {
                    htmlString += `<a class='active' data-id='${i}'>${i}</a>`;
                    continue;
                }
                htmlString += `<a class='page-link' data-id='${i}'>${i}</a>`;
            }
        }
        $('.pagination').html(htmlString);
    }
    addEventListeners() {
        $('a.page-link').click(function() {
            currentPage = $(this).data("id");
            cakeList();
        });
    }
}
let cakeList = () => new CakeList(showQty * currentPage - showQty, showQty, currentPage);
cakeList();