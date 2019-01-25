/* global $ fetch navigator */
let currentPage = 1,
    showQty = 20,
    section = 'all',
    offset = () => showQty * currentPage - showQty;

class CakeList {
    
    constructor(offset, limit, curPage, section) {
        this.limit = limit;
        this.curPage = curPage;
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
        fetch('/get-cakes-qty', fetchParams)
            .then(res => res.json())
            .then(res => {
                this.pages = res['count(*)'];
            })
            .then(() => {
                fetch('/get-page', fetchParams)
                    .then(res => res.json())
                    .then(res => {
                        this.renderCakes(res);
                    });
            });
        fetch('/get-sections')
            .then(res => res.json())
            .then(res => {
                this.renderSections(res);
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
        this.renderPaginator(this.pages, this.limit, this.curPage);
        this.addEventListeners();
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
        let htmlString = `<nav class='pagination'>`;
        if (pagesQty > 1) {
            for (let i = 1; i <= Math.ceil(pagesQty); i++) {
                if (i === curPage) {
                    htmlString += `<a class='active' data-id='${i}'>${i}</a>`;
                    continue;
                }
                htmlString += `<a class='page-link' data-id='${i}' target='_self'>${i}</a>`;
            }
        }
        htmlString += `</nav>`;
        $('.products-showcase').append(htmlString);
    }
    
    addEventListeners() {
        $('a.page-link').click(function(e) {
            e.preventDefault();
            $('.card').addClass('blurred');
            currentPage = $(this).data("id");
            $('html').animate({ scrollTop: 0 }, "slow", "swing", cakeList);
        });
        if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            $('.products-showcase').off('mouseenter mouseleave')
                .on('mouseenter', '.cake-main', function() {
                    const $target = $(this).parents('.card');
                    $target.addClass('display-on-top');
                    $(this).siblings('.cake-details').slideDown(400);
                    this.timer = window.setTimeout(() => {
                        $target.siblings('.card').addClass('blurred');
                    }, 1500);
                })
                .on('mouseleave', '.cake-main', function() {
                    window.clearTimeout(this.timer);
                    $('.card').removeClass('display-on-top blurred');
                    $(this).siblings('.cake-details').slideUp(100);
                });
        } else if ($('.arrow').hasClass('arrow-left')) {
            $('.arrow-helper').click();
        } else {
            $(()=>{window.scrollTo({top: 1000, behavior: 'smooth'})});
        }
        $('.products-showcase').on('click', '.card img', function() {
            const link = $(this).prop('src');
            const cakeID = $(this).data('id');
            const caption = $(this).siblings('.cake-name').html();
            $('.modal-img').prop('src', link);
            $('.modal-caption').html(caption);
            $('.modal-cakeID').html(`#00${cakeID}`);
            $('body').addClass('hide-scroll');
            $('.modal').fadeIn(600);
            window.location.hash = "modal";
        });
    }
}

const cakeList = () => new CakeList(offset(), showQty, currentPage, section);
cakeList();

$('.modal, .close-modal').click(() => {
    $('.modal').fadeOut(300);
    $('body').removeClass('hide-scroll');
     window.location.hash = '';
});

$(window).on('hashchange', function() {
    if(window.location.hash != "#modal") {
        $('.modal').fadeOut(300);
    }
});

$('.cake-sections').on('click', '.sections-menu li', function(e) {
    e.preventDefault();
    $('.card').addClass('blurred');
    section = $(this).data('name');
    currentPage = 1;
    $('.products-showcase').animate({ scrollTop: 0 }, "slow", cakeList);
});

$('.arrow-helper').on('click', () => {
    $('.arrow').toggleClass('arrow-left');
    $('.left-nav').toggleClass('hide-menu');
    $('.sections-menu li.active, .sections-menu li.lights-off').toggleClass('lights-off').toggleClass('active');
    $('.products-showcase').toggleClass('stretch');
});

function hasTouch() {
    return 'ontouchstart' in document.documentElement
           || navigator.maxTouchPoints > 0
           || navigator.msMaxTouchPoints > 0;
}

if (hasTouch()) {
    try {
        for (let x in document.styleSheets) {
            const styleSheet = document.styleSheets[x];
            if (!styleSheet.rules) continue;

            for (let y = styleSheet.rules.length - 1; y >= 0; y--) {
                if (!styleSheet.rules[y].selectorText) continue;

                if (styleSheet.rules[y].selectorText.match(':hover')) {
                    styleSheet.deleteRule(y);
                }
            }
        }
    } catch (ex) {}
}