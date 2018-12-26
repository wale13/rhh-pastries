$(() => {
    $('input').on('focus', () => {
        $('.login').addClass('clicked');
    }).on('focusout', () => {
        $('.login').removeClass('clicked');
    });
    $('form').on('submit', function(e) {
        $('.login').removeClass('clicked').addClass('loading');
        e.preventDefault();
        setTimeout(() => {
            this.submit();
        }, 2000);
    });
});