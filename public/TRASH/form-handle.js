const sendOrder = (e) => {
    const form = $('.cake');
    if (form[0].checkValidity()) {
        e.preventDefault();
        fetch('/add-order', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(form.serializeObject())
        })
            .then(res => res.json())
            .then(res => {
                showSendOrderAlert(res);
            });
    }
};

const toggleFormShow = () => {
    $('div.form-holder').toggleClass('show-form', 750);
};

const toggleForm = (e) => {
    if (e.data.formPurpose === 'create') {
        $('#result-fieldset').prop('disabled', true);
        fetch('/get-new-order-id')
        .then(res => res.json())
        .then(res => {
            $('.order-number').html(res);
        });
        $('.submit-new').click(sendOrder);
    } else if (e.data.formPurpose === 'edit') {
        $('#result-fieldset').prop('disabled', false);
    }
    toggleFormShow();
};

$('.btn-add-order').on('click', {formPurpose: 'create'}, toggleForm);

$('.btn-edit-order').on('click', {formPurpose: 'edit'}, toggleForm);

$('.form-close').on('click', toggleFormShow);

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
    toggleFormShow();
    setTimeout(() => {
        $('.alert-success').fadeOut(1500);
    }, 1000);
};

$('#avatar-link').change(function() {
    $('#avatar-img').attr('src', $(this).val());
});

$('#prototype-link').change(function() {
    $('#prototype-img').attr('src', $(this).val());
});

$('#result-link').change(function() {
    $('#result-img').attr('src', $(this).val());
});

$('*[required]').prev().css('color', '#F50');