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

const showAlert = (message) => {
    const alertTemplate = 
        `<div class="alert-success">
          <strong>${message}</strong>
        </div>`;
    $('.form-holder').append(alertTemplate);
    $('.cake').fadeOut(1500, () => {
        $('.alert-success').fadeOut(700, () => {
            $('.form-holder').toggleClass('show-form');
        });
    });
};

const sendOrder = (e) => {
    const form = $('.cake');
    if (form[0].checkValidity()) {
        e.preventDefault();
        const data = JSON.stringify(form.serializeObject());
        fetch('/add-order', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: data
        })
            .then(res => res.json())
            .then(res => {
                showAlert(res);
            });
    }
};

$('.submit-new').click(sendOrder);

$(() => {
    fetch('/get-new-order-id')
        .then(res => res.json())
        .then(res => {
            $('.order-number').append(res);
        });
});