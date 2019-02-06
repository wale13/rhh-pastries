const toggleFormShow = () => {
    $('div.form-holder').toggleClass('show-form', 600);
    $('body').toggleClass('hide-scroll');
    $('form.cake')[0].reset();
};

const toggleForm = (e) => {
    const purpose = e.data.formPurpose;
    $('.form-close').removeClass('invisible');
    $('.cake fieldset').prop('disabled', true);
    $('button[type=reset').addClass('invisible');
    $('.delete-btn').addClass('invisible');
    $('.order-header').removeClass('invisible');
    if (purpose === 'create') {
        $('.cake fieldset:not(#result-fieldset):not(#tech_data)').prop('disabled', false);
        $('button[type=reset').removeClass('invisible');
        $('#avatar-link, #prototype-link').click();
        fetch('/get-new-order-id')
        .then(res => res.json())
        .then(res => {
            $('.order-number').html(res);
        });
        $('input[name="tel"]').off().focusout(function() {
            if ($(this).val().length == 10) {
                const data = {tel: $(this).val().toString()};
                fetch('/get-client', {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify(data)
                })
                    .then(res => res.json())
                    .then(client => {
                        fillForm(client);
                    });
            }
        });
    } else if (purpose === 'edit') {
        const id = $(e.currentTarget).data('id');
        $('.cake fieldset').prop('disabled', false);
        $('.delete-btn').removeClass('invisible');
        fetch(`/get-order/${id}`)
            .then(res => res.json())
            .then(product => {
                fillForm(product);
            });
    } else if (purpose === 'edit-client') {
        const id = $(e.currentTarget).data('id');
        $('#client-fieldset, #tech_data').prop('disabled', false);
        $('.order-header').addClass('invisible');
        $('.form-close').addClass('invisible');
        fetch(`/get-client/${id}`)
            .then(res => res.json())
            .then(client => {
                fillForm(client);
            });
    }
    $('.submit-new').off().on('click', {formPurpose: purpose}, sendOrder);
    toggleFormShow();
};

const sendOrder = (e) => {
    const form = $('.cake');
    const purpose = e.data.formPurpose;
    const link = purpose === 'create' ? '/add-order' : 
                 purpose === 'edit' ? '/edit-order' : '/edit-client';
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
            .then(res => showAlert(res));
    }
};

const showAlert = (message) => {
    $('#alert-message').html(message);
    toggleFormShow();
    cakeList();
    $('#alert-modal').show();
    setTimeout(() => {
        $('#alert-modal').fadeOut(600);
    }, 1500);
};

const fillForm = (formData) => {
    const data = formData;
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
            value = value.trim();
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

$('.new-order').click({formPurpose: 'create'}, toggleForm);

$('.products-showcase').on('click', '.btn-edit-order, .cake-body-icon', {formPurpose: 'edit'}, toggleForm);

$('.products-showcase').on('click', '.btn-edit-client', {formPurpose: 'edit-client'}, toggleForm);

$('.delete-btn').click(function() {
    const id = $(this).data('id');
    $('#delete-modal').fadeIn(300);
    $('.ok-btn').off().click(() => {
        const link = '/delete-order/' + id;
        fetch(link)
            .then(res => res.json())
            .then(res => {
                $('.cancel-btn').click();
                showAlert(res);
            });
    });
});

$('.cancel-btn').click(() => {
    $('#delete-modal').fadeOut(200);
});

$('.form-close, .close-btn').on('click', toggleFormShow);

$('#avatar-link').on('click change', function() {
    if ($(this).val()) {
        $('#avatar-img').attr({
            src: $(this).val(),
            alt: $('input[name="name"]').val() + ' ' + 
                 $('input[name="surname"]').val() + '</br>' +
                 $('input[name="tel"]').val()
        });
    } else {
        $('#avatar-img').attr('src', './pic/noavatar.jpg');
    }
});

$('#prototype-link').on('click change', function() {
    if ($(this).val()) {
        $('#prototype-img').attr({
            src: $(this).val(),
            alt: $('input[name="theme"]').val()
        });
    } else {
        $('#prototype-img').attr('src', './pic/cake.jpg');
    }
});

$('#result-link').on('click change', function() {
    if ($(this).val()) {
        $('#result-img').attr({
            src: $(this).val(),
            alt: $('input[name="theme"]').val()
        });
    } else {
        $('#result-img').attr('src', './pic/cake.jpg');
    }
});

$('*[required]').prev().css('color', '#F50');

$('.btn-contacts').click(function() {
    if (!$('.contacts').hasClass('shown')) {
        fetch('/get-clients-list')
            .then(res => res.json())
            .then(contacts => {
                let contactsHTMLString = `<div class='contacts-heading'>
                                              <p>Контакти:</p>
                                          </div>
                                          <div class='contacts-list'>`;
                contacts.forEach(contact => {
                    const name = contact.name,
                          surname = contact.surname,
                          avatar = contact.avatar;
                    contactsHTMLString += `<div class='contact-card' 
                                            data-id='${contact.client_id}'>
                                                <div class='contact-photo'>
                                                    <img class='contact-img unclickable' 
                                                         src="${avatar ? avatar : './pic/noavatar.jpg'}" 
                                                         alt='${name + surname}' 
                                                    />
                                                </div>
                                                <div class='contact-name'>
                                                    <p>${name}</p>
                                                    <p>${surname}</p>
                                                </div>
                                           </div>`;
                });
                contactsHTMLString += '</div>';
                $('.contacts').html(contactsHTMLString);
            })
            .then(() => {
                $('.contacts').addClass('shown', 400);
                $('.btn-contacts').addClass('active');
            });
    } else {
        $('.contacts').removeClass('shown', 400);
        $('.btn-contacts').removeClass('active');
    }
});

$('.contacts').on('click', '.contact-card', function(e) {
    const id = $(e.currentTarget).data('id');
    fetch(`/get-client/${id}`)
        .then(res => res.json())
        .then(client => {
            fillForm(client);
        });
    $('.contacts').removeClass('shown', 400);
    $('.btn-contacts').removeClass('active');
});