const toggleForm = () => {
    $('div.form-holder').toggleClass('show-form', 750);
    fetch('/get-new-order-id')
        .then(res => res.json())
        .then(res => {
            $('.order-number').html(res);
        });
};

$('.btn-add-order, .form-close').on('click', toggleForm);

jQuery.fn.serializeObject = function() {
    let arrayData = this.serializeArray();
    let objectData = {};
    $.each(arrayData, function() {
        let value;
        if (this.value != null) {
            value = this.value;
        } else {
            value = '';
        }
        if (objectData[this.name] != null) {
            if (!objectData[this.name].push) {
                objectData[this.name] = [objectData[this.name]];
            }
            objectData[this.name].push(value);
        } else {
            objectData[this.name] = value;
        }
    });
    return objectData;
};

const showSendOrderAlert = (message) => {
    const alertTemplate = 
        `<div class="alert-success">${message}</div>`;
    $('.form-holder').append(alertTemplate);
    toggleForm();
    setTimeout(() => {
        $('.alert-success').fadeOut(1500);
    }, 1000);
};

const sendOrder = (e) => {
    const form = $('.cake');
    if (form[0].checkValidity()) {
        e.preventDefault();
        // const data = JSON.stringify(form.serializeObject());
        fetch('/add-order', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: /**data**/JSON.stringify(form.serializeObject())
        })
            .then(res => res.json())
            .then(res => {
                showSendOrderAlert(res);
            });
    }
};

$('.submit-new').click(sendOrder);