$('.submit-new').click(testSend);

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

function testSend(e) {
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
        });
    }
}