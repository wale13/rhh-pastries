/* global $ fetch */
let currentPage = 1,
    showQty = 10,
    section = 'in-work';

class CakeList {
    
    constructor(offset, limit, curPage, section) {
        let data = {offset: offset, limit: limit};
        data.section = section;
        this.section = section;
        fetch('/get-admin-page', {
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
        fetch('/get-sections')
            .then(res => res.json())
            .then(sections => {
                this.sections = sections;
                this.renderSections(this.sections);
            });
        fetch('/get-cakes-qty', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        })
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
            let cakeName = cake.theme;
            cakeName = cakeName.charAt(0).toUpperCase() + cakeName.slice(1);
            cakeListDomString += 
                `<div class='card'>
                    <img class='cake-icon' 
                        src='${(cake.result_photo ? cake.result_photo : cake.prototype ? cake.prototype : './pic/cake.jpg')}'
                        alt='${cakeName}'>
                    <div class='card-body'>
                        <h4 class='cake-name'>${cakeName}</h4>
                    </div>
                    <div class='form-buttons'>
                        <button type='button' class='btn-edit-order action-button grey-btn' data-id='${cake.order_id}'>Деталі</button>
                    </div>
                </div>`;
        });
        $('.products-showcase').html(cakeListDomString);
    }
    
    renderSections(sections) {
        let sectionsDomString = `<ul class="sections-menu">
                                <li data-name="in-work">В роботі</li>
                                <li data-name="all">Всі</li>`;
        sections.forEach(section => {
            const name = section.cake_section;
            sectionsDomString += `<li data-name="${name}">${name}</li>`;
        });
        sectionsDomString += '</ul>';
        $('.cake-sections').html(sectionsDomString);
        $(`.cake-sections li[data-name="${this.section}"]`).addClass('active');
    }
    
    renderPaginator(pages, limit, curPage) {
        const pagesQty = pages / limit;
        let htmlString = '';
        if (pagesQty > 1) {
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
let cakeList = () => new CakeList(showQty * currentPage - showQty, showQty, currentPage, section);
cakeList();

$('.sorteners select').change(function() {
    showQty = $(this).val();
    currentPage = 1;
    cakeList();
});

$('.products-showcase, .cake').on('click', 'img', function() {
    const link = $(this).attr('src');
    if (!['./pic/cake.jpg', './pic/noavatar.jpg'].includes(link)) {
        const caption = $(this).attr('alt');
        $('.modal-img').attr('src', link);
        $('.modal-caption').html(caption);
        $('#pic-modal').fadeIn(600);
    }
});

$('#pic-modal, .close-modal').click(() => {
    $('#pic-modal').fadeOut(300);
});

$('.cake-sections').on('click', '.sections-menu li', function() {
    section = $(this).data('name');
    currentPage = 1;
    cakeList();
});