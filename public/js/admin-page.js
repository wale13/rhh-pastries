/* global $ fetch */
let currentPage = 1,
    showQty = 18,
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
                this.renderContent(res, section);
            });
        fetch('/get-sections')
            .then(res => res.json())
            .then(res => {
                this.renderSections(res);
            });
        if (section !== ('in-work' && 'all-clients')) {
            fetch('/get-cakes-qty', fetchParams)
                .then(res => res.json())
                .then(res => {
                    this.renderPaginator(res['count(*)'], limit, curPage);
                });
        }
    }
    renderContent(content, section) {
        let cakeListDomString = '';
        if (section === 'in-work') {
            $('.pagination, .sorteners').addClass('invisible');
            let dates = {};
            content.forEach(cake => {
                const options = {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'},
                    date = new Date(cake['deadline']).toLocaleDateString("uk-UA", options);
                dates[date] ? dates[date].push(cake) : (dates[date] = [], dates[date].push(cake));
            });
            for (const date in dates) {
                cakeListDomString += `<section class='dated-group'>
                                            <div class='date-header'>
                                                ${date}
                                            </div>`;
                dates[date].forEach(cake => {
                    const cakeID = cake.order_id,
                          cakeName = cake.theme,
                          sponges = cake.sponges,
                          cream = cake.cream,
                          filling = cake.fillings,
                          comments = cake.comments,
                          delivery = cake.delivery,
                          weight = cake.desired_weight,
                          fullName = cake.name + " " + cake.surname,
                          shortDate = new Date(cake['deadline']).toLocaleDateString("uk-UA");
                    let details = `<div class='client'>
                                        <img class='mini-avatar'
                                             src="${cake.avatar ? cake.avatar : './pic/noavatar.jpg'}"
                                             alt="${fullName + "</br>" + cake.tel}">
                                        <div class='client-info'>
                                            <p>${cake.name + " " + cake.surname}</p>
                                            <p>${cake.tel}</p>
                                        </div>
                                   </div>
                                   <table class='order-details'>
                                        <tbody>`;
                    if (sponges) {
                        details += `<tr><td><b>Коржі: </b></td><td>${sponges.replace(/,/g, ', ').replace(/\+/g, ' + ')}.</td></tr>`;
                    } if (cream) {
                        details += `<tr><td><b>Крем: </b></td><td>${cream.replace(/,/g, ', ').replace(/\+/g, ' + ')}.</td></tr>`;
                    } if (filling) {
                        details += `<tr><td><b>Наповнення: </b></td><td>${filling.replace(/,/g, ', ').replace(/\+/g, ' + ')}.</td></tr>`;
                    } if (weight) {
                        details += `<tr><td><b>Вага: </b></td><td>± ${weight} кг</td></tr>`;
                    } if (comments) {
                        details += `<tr><td><b>Коментар: </b></td><td>${comments}</td></tr>`;
                    }
                    details += '</tbody></table>';
                    cakeListDomString += 
                        `<div class='card detailed'>
                            ${delivery ? '<i class="fas fa-shipping-fast"></i>' : ''}
                            <div class='cake-main'>
                                <img class='cake-icon' 
                                     src="${(cake.result_photo ? cake.result_photo : cake.prototype ? cake.prototype : './pic/cake.jpg')}"
                                     alt="${cakeName}"
                                     data-id='${cakeID}'>
                                <h5 class='mini-id'>${cakeID}</h6>
                                <h5 class='date'>${shortDate}</h5>
                                <h4 class='cake-name'>${cakeName.charAt(0).toUpperCase() + cakeName.slice(1)}</h4>
                            </div>
                            <div class='cake-details'>
                                ${details}
                                <div class='form-buttons'>
                                    <button type='button' 
                                        class='card-button btn-edit-order' 
                                        data-id='${cakeID}'>
                                        <i class="far fa-edit"></i>
                                    </button>
                                </div>
                            </div>
                        </div>`;
                });
                cakeListDomString += '</section>';
            }
        } else if (section === 'all-clients') {
            $('.pagination, .sorteners').addClass('invisible');
            content.forEach(client => {
                const fullName = client.name + " " + client.surname,
                      clientID = client.client_id;
                cakeListDomString += 
                    `<div class='card client-card'>
                        <div class='client-card-main'>
                            <img class='large-avatar'
                                 src='${client.avatar ? client.avatar : './pic/noavatar.jpg'}'
                                 alt="${fullName + "</br>" + client.tel}">
                            <h5 class='mini-id'>${clientID}</h6>
                        </div>
                        <div class='client-details'>
                            <h2><b>${fullName}</b></h2>
                            <h3><small>Тел.: </small>${client.tel}</b></h3>
                            <h4>Всього замовлень: ${client.total}</h4>
                            <h4>Замовлень "в роботі": ${client.in_progress}</h4>
                            <div class='form-buttons'>
                                <button type='button' 
                                    class='card-button btn-client-cakes' 
                                    data-id='${clientID}'>
                                    <i class="fas fa-birthday-cake"></i>
                                </button>
                                <button type='button' 
                                    class='card-button btn-edit-client' 
                                    data-id='${clientID}'>
                                    <i class="far fa-edit"></i>
                                </button>
                            </div>
                        </div>
                        <div class='clients-cakes'></div>
                    </div>`;
            });
        } else {
            $('.pagination, .sorteners').removeClass('invisible');
            content.forEach(cake => {
                const date = new Date(cake['deadline']).toLocaleDateString("uk-UA");
                let cakeName = cake.theme;
                cakeName = cakeName.charAt(0).toUpperCase() + cakeName.slice(1);
                cakeListDomString += 
                    `<div class='card'>
                        <div class='cake-main'>
                            <img class='cake-body-icon unclickable' 
                                src='${(cake.result_photo ? 
                                cake.result_photo : cake.prototype ?
                                cake.prototype : './pic/cake.jpg')}'
                                data-id='${cake.order_id}'
                                alt='${cakeName}'>
                            <h4 class='cake-name'>${cakeName}</h4>
                            <h5 class='date'>${date}</h5>
                            <h5 class='mini-id'>${cake.order_id}</h6>
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
        $('li').removeClass('active');
        $(`li[data-name="${section}"]`).addClass('active');
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
}

let cakeList = () => new CakeList(offset(), showQty, currentPage, section);
cakeList();

$('.sorteners select').change(function() {
    showQty = $(this).val();
    currentPage = 1;
    cakeList();
});

$('.pagination').on('click', '.page-link', function() {
    currentPage = $(this).data('id');
    cakeList();
});

$('.products-showcase').on('click', '.btn-client-cakes', function() {
    const target = $(this).parents('.client-details').siblings('.clients-cakes'),
          clientID = $(this).data('id');
    if (target.is(':empty')) {
        target.slideUp(0);
        fetch(`/client-cakes/${clientID}`)
            .then(res => res.json())
            .then(cakes => {
                cakes.forEach(cake => {
                    let cakeName = cake.theme;
                    const htmlString = `<div class='cake-main'>
                                            <img class='cake-body-icon mini unclickable' 
                                                src='${(cake.result_photo ? 
                                                cake.result_photo : cake.prototype ?
                                                cake.prototype : './pic/cake.jpg')}'
                                                data-id='${cake.order_id}'
                                                alt='${cakeName}'>
                                            <h4 class='cake-name'>${cakeName}</h4>
                                            <h5 class='mini-id'>${cake.order_id}</h6>
                                        </div>`;
                    target.append(htmlString);
                });
            });
    }
    target.slideToggle();
});

$('.products-showcase, .cake').on('click', 'img:not(.unclickable)', function() {
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

$('.cake-sections, .clients-menu').on('click', 'li', function() {
    section = $(this).data('name');
    currentPage = 1;
    cakeList();
});

$(window).scroll(function(){
    if ($(this).scrollTop() > 500) {
        $('#scroll').fadeIn();
    } else {
        $('#scroll').fadeOut();
    }
});

$('#scroll').click(function(){
    $('html, body').animate({ scrollTop: 0 }, 600);
});

$('#color-changer').click(() => {
    $('body').toggleClass('red-body');
});