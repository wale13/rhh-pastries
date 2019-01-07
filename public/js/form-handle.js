/* global $ jQuery fetch cakeList */
const toggleFormShow = () => {
    $('div.form-holder').toggleClass('show-form', 750);
    $('form.cake')[0].reset();
};

const toggleForm = (e) => {
    const purpose = e.data.formPurpose;
    if (purpose === 'create') {
        $('#result-fieldset').prop('disabled', true);
        $('input[type=reset').removeClass('invisible');
        $('.delete-btn').addClass('invisible');
        $('#avatar-link, #prototype-link').click();
        fetch('/get-new-order-id')
        .then(res => res.json())
        .then(res => {
            $('.order-number').html(res);
        });
    } else if (purpose === 'edit') {
        const id = $(e.target).data('id');
        const url = '/get-order/' + id;
        $('#result-fieldset').prop('disabled', false);
        $('input[type=reset').addClass('invisible');
        $('.delete-btn').removeClass('invisible');
        fetch(url)
            .then(res => res.json())
            .then(product => {
                fillForm(product);
            });
    }
    $('.submit-new').off().on('click', {formPurpose: purpose}, sendOrder);
    toggleFormShow();
};

const sendOrder = (e) => {
    const form = $('.cake');
    const purpose = e.data.formPurpose;
    const link = purpose === 'create' ? '/add-order' : '/edit-order';
    if (form[0].checkValidity()) {
        e.preventDefault();
        fetch(link, {
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

const showSendOrderAlert = (message) => {
    const alertTemplate = 
        `<div class="alert-success">${message}</div>`;
    $('.form-holder').append(alertTemplate);
    toggleFormShow();
    cakeList();
    setTimeout(() => {
        $('.alert-success').fadeOut(3500);
    }, 2000);
};

const fillForm = (productData) => {
    const data = productData;
    $('.order-number').html(data['order_id']);
    $('.delete-btn').data('id', data['order_id']);
    let keys = Object.keys(data);
    keys.forEach((key) => {
        const formTargetEl = $('.cake').find(`[name='${key}']`);
        if (formTargetEl) {
            if (formTargetEl.length > 1) {
                let values = [];
                if (data[key] !== null) {
                    values = data[key].split(',');
                }
                for (let i = 0; i < formTargetEl.length; i++) {
                    const targeted = formTargetEl[i];
                    if (values.some(val => targeted.value === val)) {
                        targeted.checked = true;
                    }
                }
            } else if (formTargetEl.length === 1 && formTargetEl[0].type === 'checkbox') {
                if (formTargetEl[0].value === data[key]) {
                    formTargetEl[0].checked = true;
                }
            } else {
                formTargetEl.val(data[key]);
            }
        }
    });
    $('#avatar-link, #result-link, #prototype-link').click();
};

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

$('.btn-add-order').on('click', {formPurpose: 'create'}, toggleForm);

$('.products-showcase').on('click', '.btn-edit-order', {formPurpose: 'edit'}, toggleForm);

$('.delete-btn').click(function() {
    const id = $(this).data('id');
    $('.delete-modal').fadeIn(400);
    $('.ok-btn').off().click(() => {
        const link = '/delete-order/' + id;
        fetch(link)
            .then(res => res.json())
            .then(res => {
                $('.cancel-btn').click();
                showSendOrderAlert(res);
            });
    });
});

$('.cancel-btn').click(() => {
    $('.delete-modal').fadeOut(200);
});

$('.form-close, .close-btn').on('click', toggleFormShow);

$('#avatar-link').on('click change', function() {
    if ($(this).val()) {
        $('#avatar-img').attr('src', $(this).val());
    } else {
        $('#avatar-img').attr('src', './pic/noavatar.jpg');
    }
});

$('#prototype-link').on('click change', function() {
    if ($(this).val()) {
        $('#prototype-img').attr('src', $(this).val());
    } else {
        $('#prototype-img').attr('src', './pic/cake.jpg');
    }
});

$('#result-link').on('click change', function() {
    if ($(this).val()) {
        $('#result-img').attr('src', $(this).val());
    } else {
        $('#result-img').attr('src', './pic/cake.jpg');
    }
});

$('*[required]').prev().css('color', '#F50');