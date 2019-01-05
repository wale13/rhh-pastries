/* global $ fetch */
let currentPage = 1,
    showQty = 10,
    section = 'none';

class CakeList {
    
    constructor(offset, limit, curPage, section) {
        let data = {offset: offset, limit: limit};
        if (section != 'none') {
            data.section = section;
        }
        this.section = section;
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
    
    renderSections(sections) {
        let sectionsDomString = `<ul class="sections-menu">
                                <li data-name="none">Всі</li>`;
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
        $('.products-showcase').off('mouseenter mouseleave').on('mouseenter', '.card', function() {
            $(this).siblings('.card').css('filter', 'blur(2px) grayscale(50%)');
        }).on('mouseleave', '.card', function() {
            $(this).siblings('.card').css('filter', 'none');
        });
    }
}

const cakeList = () => new CakeList(showQty * currentPage - showQty, showQty, currentPage, section);
cakeList();

$('.sorteners select').change(() => {
    showQty = $('select option:selected').data('qty');
    currentPage = 1;
    cakeList();
});

$('.cake-sections').on('click', '.sections-menu li', function() {
    section = $(this).data('name');
    currentPage = 1;
    cakeList();
});

$('.products-showcase').on('click', '.card img', function() {
    let link = $(this).prop('src');
    let caption = $(this).siblings('.cake-name').html();
    $('.modal-img').prop('src', link);
    $('.modal-caption').html(caption);
    $('.modal').fadeIn(600);
});

$('.modal, .close-modal').click(() => {
    $('.modal').fadeOut(300);
})