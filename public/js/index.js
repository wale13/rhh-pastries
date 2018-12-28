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
            const cakeName = cake.theme,
                  sponges = cake.sponges,
                  cream = cake.cream,
                  filling = cake.fillings,
                  weight = cake.final_weight;
            let details = '';
            if (sponges) {
                details += `<div><h5>Коржі: </h5><h6>${sponges.replace(/,/g, ', ').replace(/\+/g, ' + ')}.</h6></div>`;
            } if (cream) {
                details += `<div><h5>Крем: </h5><h6>${cream.replace(/,/g, ', ').replace(/\+/g, ' + ')}.</h6></div>`;
            } if (filling) {
                details += `<div><h5>Наповнення: </h5><h6>${filling.replace(/,/g, ', ').replace(/\+/g, ' + ')}.</h6></div>`;
            } if (weight) {
                details += `<div><h5>Вага: </h5><h6>${weight} кг</h6></div>`;
            }
            cakeListDomString += 
                `<div class='card'>
                    <div class='card-body'>
                        <img class='cake-icon' src='${(cake.result_photo ? cake.result_photo : cake.prototype ? cake.prototype : './pic/cake.jpg')}'
                            alt='${cakeName}'>
                        <h4 class='cake-name'>${cakeName.charAt(0).toUpperCase() + cakeName.slice(1)}</h4>
                        <div class='cake-details'>
                            ${details}
                        </div>
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
        $('.products-showcase').off().on('mouseenter', '.card', function() {
            $(this).siblings('.card').css('filter', 'blur(4px) grayscale(80%)');
        }).on('mouseleave', '.card', function() {
            $(this).siblings('.card').css('filter', 'none');
        });
    }
}

let cakeList = () => new CakeList(showQty * currentPage - showQty, showQty, currentPage);
cakeList();