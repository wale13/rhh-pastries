const getDB = () => {
    fetch('/get-db')
        .then(res => res.json())
        .then(res => {
            console.log(res);
            document.querySelector('.ins').innerHTML = 'Here is Your DB:<br>';
            let tableString = '<table><tr>';
            Object.keys(res[0]).forEach(keyName => tableString += `<th>${keyName}</th>`);
            tableString += '</tr>';
            res.forEach(el => {
                tableString += '<tr>';
                Object.values(el).forEach(val => {
                    tableString += `<td>${val}</td>`;
                });
                tableString += '</tr>';
            });
            tableString += '</table>';
            document.querySelector('.ins').innerHTML += tableString;
        });
};

document.querySelector('.getDB').addEventListener('click', getDB);