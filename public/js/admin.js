// Request entire DB and display it on page as table
$('.getDB').click(getDB);

function getDB(e) {
    fetch('/get-db')
        .then(res => res.json())
        .then(res => {
            $('.ins').html('Here is Your DB:<br>');
            let tableString = '<table><tr>';
            Object.keys(res[0]).forEach(keyName => tableString += `<th>${keyName}</th>`);
            tableString += '</tr>';
            res.forEach(el => {
                tableString += '<tr>';
                Object.values(el).forEach(val => {
                    if (val === null) {
                        tableString += `<td></td>`;
                        return;
                    }
                    else if (/http/i.test(val)) {
                        tableString += `<td><img src=${val}></td>`;
                        return;
                    }
                    tableString += `<td>${val}</td>`;
                });
                tableString += '</tr>';
            });
            tableString += '</table>';
            $('.ins').append(tableString);
        });
}