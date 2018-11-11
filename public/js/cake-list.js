class CakeList {
    constructor () {
        fetch('/get-db')
            .then(res => res.json())
            .then(cakes => {
                this.cakes = cakes;
                this.renderCakes(cakes);
            });
    }
    renderCakes(cakes) {
        let cakeListDomString = '';
        cakes.forEach(cake => {
            cakeListDomString += 
                `<div class='card'>
                    <img class='cake-icon' src='${(cake.result_photo !== null ? cake.result_photo : cake.prototype)}'
                        alt='${cake.theme}'>
                    <div class='card-body'>
                        <h4 class='cake-name'>${cake.theme}</h4>
                    </div>
                </div>`;
        });
        $('.products-container').html(cakeListDomString);
    }
}