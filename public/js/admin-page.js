/* global $ fetch */
let currentPage = 1,
    showQty = 10,
    section = 'in-work',
    offset = () => showQty * currentPage - showQty;

class CakeList {
    
    constructor(offset, limit, curPage, section) {
        const data = {
            offset: offset, 
            limit: limit,
            section: section
        };
        const fetchParams = {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        };
        fetch('/get-admin-page', fetchParams)
            .then(res => res.json())
            .then(res => {
                this.renderCakes(res, section);
            });
        fetch('/get-sections')
            .then(res => res.json())
            .then(res => {
                this.renderSections(res);
            });
        fetch('/get-cakes-qty', fetchParams)
            .then(res => res.json())
            .then(res => {
                this.renderPaginator(res['count(*)'], limit, curPage);
                this.addEventListeners();
            });
    }
    
    renderCakes(cakes, section) {
        let cakeListDomString = '';
        if (section === 'in-work') {
            cakeListDomString += 
                `<div class='card new-order'>
                    <img class='new-order-icon' src='./pic/new-order.png' alt='add new order'>
                    <h4 class='new-order-name'>Нове замовлення</h4>
                </div>`;
            cakes.forEach(cake => {
                const cakeID = cake.order_id,
                      cakeName = cake.theme,
                      sponges = cake.sponges,
                      cream = cake.cream,
                      filling = cake.fillings,
                      comments = cake.comments,
                      weight = cake.final_weight;
                let details = `<div class='client'>
                                    <img class='mini-avatar'
                                         src='${cake.avatar ? cake.avatar : './pic/noavatar.jpg'}'
                                         alt='${cake.name + ' ' + cake.surname + '</br>' + cake.tel}'>
                                    <div class='client-info'>
                                        <p>${cake.name + ' ' + cake.surname}</p>
                                        <p>${cake.tel}</p>
                                    </div>
                               </div>`;
                if (sponges) {
                    details += `<div><h5>Коржі: </h5><h6>${sponges.replace(/,/g, ', ').replace(/\+/g, ' + ')}.</h6></div>`;
                } if (cream) {
                    details += `<div><h5>Крем: </h5><h6>${cream.replace(/,/g, ', ').replace(/\+/g, ' + ')}.</h6></div>`;
                } if (filling) {
                    details += `<div><h5>Наповнення: </h5><h6>${filling.replace(/,/g, ', ').replace(/\+/g, ' + ')}.</h6></div>`;
                } if (weight) {
                    details += `<div><h5>Вага: </h5><h6>${weight} кг</h6></div>`;
                } if (comments) {
                    details += `<div><h5>Коментар: </h5><h6>${comments}</h6></div>`;
                }
                cakeListDomString += 
                    `<div class='card detailed'>
                        <div class='cake-main'>
                            <img class='cake-icon' 
                                 src='${(cake.result_photo ? cake.result_photo : cake.prototype ? cake.prototype : './pic/cake.jpg')}'
                                 alt='${cakeName}'
                                 data-id='${cakeID}'>
                            <h6 class='mini-id'>${cake.order_id}</h6>
                            <h4 class='cake-name'>${cakeName.charAt(0).toUpperCase() + cakeName.slice(1)}</h4>
                        </div>
                        <div class='cake-details'>
                            ${details}
                            <div class='form-buttons'>
                                <button type='button' 
                                    class='btn-edit-order action-button grey-btn' 
                                    data-id='${cake.order_id}'>Деталі</button>
                            </div>
                        </div>
                        
                    </div>`;
            });
        } else {
            cakes.forEach(cake => {
                let cakeName = cake.theme;
                cakeName = cakeName.charAt(0).toUpperCase() + cakeName.slice(1);
                cakeListDomString += 
                    `<div class='card'>
                        <div class='cake-main'>
                            <img class='cake-icon' 
                                src='${(cake.result_photo ? 
                                cake.result_photo : cake.prototype ?
                                cake.prototype : './pic/cake.jpg')}'
                                alt='${cakeName}'>
                            <h4 class='cake-name'>${cakeName}</h4>
                        </div>
                        <div class='form-buttons'>
                            <button type='button' 
                                class='btn-edit-order action-button grey-btn' 
                                data-id='${cake.order_id}'>Деталі</button>
                        </div>
                    </div>`;
            });
        }
        $('.products-showcase').html(cakeListDomString);
    }
    
    renderSections(sections) {
        let sectionsDomString = `<ul class="sections-menu">
                                <li data-name="in-work">В роботі</li>
                                <li data-name="all">Всі</li>`;
        sections.forEach(sect => {
            const name = sect.cake_section;
            sectionsDomString += `<li data-name="${name}">${name}</li>`;
        });
        sectionsDomString += '</ul>';
        $('.cake-sections').html(sectionsDomString);
        $(`.cake-sections li[data-name="${section}"]`).addClass('active');
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
let cakeList = () => new CakeList(offset(), showQty, currentPage, section);
cakeList();

$('.sorteners select').change(function() {
    showQty = $(this).val();
    currentPage = 1;
    cakeList();
});

$('.products-showcase, .cake').on('click', 'img:not(.new-order-icon)', function() {
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