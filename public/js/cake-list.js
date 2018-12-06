class CakeList {
    constructor (offset, limit, currentPage) {
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
                this.renderPaginator(this.pages, limit, currentPage);
            });
    }
    renderCakes(cakes) {
        let cakeListDomString = '';
        cakes.forEach(cake => {
            cakeListDomString += 
                `<div class='card'>
                    <img class='cake-icon' src='${(cake.result_photo !== null ? cake.result_photo : cake.prototype !== null ? cake.prototype : './pic/cake.jpg')}'
                        alt='${cake.theme}'>
                    <div class='card-body'>
                        <h4 class='cake-name'>${cake.theme}</h4>
                    </div>
                </div>`;
        });
        $('.products-showcase').html(cakeListDomString);
    }
    renderPaginator(pages, limit, currentPage) {
        const pagesQty = pages / limit;
        let htmlString = '';
        if (pagesQty <= 1) {
            return;
        } else {
            for (let i = 1; i <= Math.ceil(pagesQty); i++) {
                if (i === currentPage) {
                    htmlString += `<a href="#" class='active'>${i}</a>`;
                    continue;
                }
                htmlString += `<a href="#">${i}</a>`;
            }
        }
        $('.pagination').html(htmlString);
    }
}