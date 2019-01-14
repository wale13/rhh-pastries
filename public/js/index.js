/* global $ fetch */
let currentPage = 1,
    showQty = 10,
    section = 'all',
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
        fetch('/get-page', fetchParams)
            .then(res => res.json())
            .then(cakes => {
                this.renderCakes(cakes);
            });
        fetch('/get-sections')
            .then(res => res.json())
            .then(sections => {
                this.renderSections(sections);
            });
        fetch('/get-cakes-qty', fetchParams)
            .then(res => res.json())
            .then(qty => {
                this.renderPaginator(qty['count(*)'], limit, curPage);
                this.addEventListeners();
            });
    }
    
    renderCakes(cakes) {
        let cakeListDomString = '';
        cakes.forEach(cake => {
            const cakeID = cake.order_id,
                  cakeName = cake.theme,
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
                        <div class='cake-main'>
                            <img class='cake-icon' 
                                 src='${(cake.result_photo ? cake.result_photo : cake.prototype ? cake.prototype : './pic/cake.jpg')}'
                                 alt='${cakeName}'
                                 data-id='${cakeID}'>
                            <h4 class='cake-name'>${cakeName.charAt(0).toUpperCase() + cakeName.slice(1)}</h4>
                        </div>
                        <div class='cake-details'>
                            ${details}
                        </div>
                    </div>
                </div>`;
        });
        $('.products-showcase').html(cakeListDomString);
    }
    
    renderSections(sections) {
        let sectionsDomString = `<ul class="sections-menu">
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
        $('.products-showcase').off('mouseenter mouseleave')
            .on('mouseenter', '.card', function() {
                $(this).addClass('display-on-top');
                $(this).find('.cake-details').slideDown(200);
                this.timer=window.setTimeout(() => {
                    $(this).siblings('.card').addClass('blurred');
                }, 1200);
                
            })
            .on('mouseleave', '.card', function() {
                window.clearTimeout(this.timer);
                $('.card').removeClass('display-on-top blurred');
                $('.cake-details').slideUp(100);
            });
        $('.products-showcase').on('click', '.card img', function() {
            const link = $(this).prop('src');
            const cakeID = $(this).data('id');
            const caption = $(this).siblings('.cake-name').html();
            $('.modal-img').prop('src', link);
            $('.modal-caption').html(caption);
            $('.modal-cakeID').html(`#00${cakeID}`);
            $('.modal').fadeIn(600);
            $('.page-name').addClass('centered');
        });
    }
}

const cakeList = () => new CakeList(offset(), showQty, currentPage, section);
cakeList();

$('.sorteners select').change(function() {
    showQty = $(this).val();
    currentPage = 1;
    cakeList();
});

$('.modal, .close-modal').click(() => {
    $('.modal').fadeOut(300);
    $('.page-name').removeClass('centered');
});

$('.cake-sections').on('click', '.sections-menu li', function() {
    section = $(this).data('name');
    currentPage = 1;
    cakeList();
});

$('.arrow-helper').on('click', () => {
    $('.arrow').toggleClass('arrow-left');
    $('.left-nav').toggleClass('hide-menu');
    $('.sections-menu li.active, .sections-menu li.lights-off').toggleClass('lights-off').toggleClass('active');
    $('section').toggleClass('stretch');
});