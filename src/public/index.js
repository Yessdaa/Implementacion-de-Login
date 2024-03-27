const socket = io('http://localhost:9080');

function getData(e) {
    e.preventDefault();
    let product = {};
    const title = document.getElementById('product-title').value;
    const description = document.getElementById('product-descr').value;
    const price = document.getElementById('product-price').value;
    const stock = document.getElementById('product-stock').value;
    const code = document.getElementById('product-pcode').value;
    const category = document.getElementById('product-category').value;

    product = {
        title: title,
        description: description,
        code: code,
        price: price,
        status: true,
        stock: stock,
        category: category
    };

    socket.emit('newProduct', product, (error) => {
        if (error) {           
            const errorLabel = document.getElementById('error-label');
            errorLabel.textContent = error;
        } else {
            const errorLabel = document.getElementById('error-label');
            errorLabel.textContent = ""; 
        }
    });
}


socket.on('connect', function () {
    console.log('Connected to server');
    socket.on('productList', function (productList) {
        console.log('Received productList:', productList);
        renderProductList(productList);
    });
});



function renderProductList(productList) {
    var productListContainer = document.querySelector('#productListUL');
    productListContainer.innerHTML = '';
    productList.forEach(function (product) {
        var listItem = document.createElement('li');
        listItem.className = 'product-li';

        var productDiv = document.createElement('div');
        productDiv.className = 'productDiv'
        productDiv.textContent = product.title;
        listItem.appendChild(productDiv);

        productDiv = document.createElement('div');
        productDiv.className = 'productDiv'
        productDiv.textContent = product.price;
        listItem.appendChild(productDiv);

        productDiv = document.createElement('div');
        productDiv.className = 'productDiv'
        productDiv.textContent = product.stock;
        listItem.appendChild(productDiv);

        productDiv = document.createElement('div');
        productDiv.className = 'productDiv'
        productDiv.textContent = product.description;
        listItem.appendChild(productDiv);

        productDiv = document.createElement('div');
        productDiv.className = 'productDiv'
        productDiv.textContent = product.code;
        listItem.appendChild(productDiv);

        productDiv = document.createElement('div');
        productDiv.className = 'productDiv'
        productDiv.textContent = product.category;
        listItem.appendChild(productDiv);


        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Borrar';
        deleteButton.className = 'btn-delete';
        deleteButton.addEventListener('click', function () {
            socket.emit('deleteProduct', product.id);
        });
        listItem.appendChild(deleteButton);

        productListContainer.appendChild(listItem);
    });
}