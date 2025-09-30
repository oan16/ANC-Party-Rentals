// ================= Preview Function =================
function previewItem() {
    const itemSelect = document.getElementById('item');
    const previewImg = document.getElementById('previewImg');

    if (!itemSelect.value) {
        previewImg.style.display = 'none';
        previewImg.src = '';
        return;
    }

    const parts = itemSelect.value.split('|');
    const imgFile = parts[2]; // third part is the image filename
    previewImg.src = imgFile; // assumes images are in same folder as rent.html
    previewImg.style.display = 'block';
}

// ================= Cart Functionality =================
let cart = [];

function addToCart() {
    const itemSelect = document.getElementById('item');
    if (!itemSelect.value) {
        alert('Please select an item.');
        return;
    }

    const [itemName, price, imgFile] = itemSelect.value.split('|');
    const quantity = parseInt(document.getElementById('quantity').value);
    const subtotal = price * quantity;

    // Check if item already exists in cart
    const existing = cart.find(i => i.itemName === itemName);
    if (existing) {
        existing.quantity += quantity;
        existing.subtotal += subtotal;
    } else {
        cart.push({ itemName, price: parseInt(price), quantity, subtotal, imgFile });
    }

    updateCartTable();
}

// Update the cart table
function updateCartTable() {
    const tbody = document.querySelector('#cartTable tbody');
    tbody.innerHTML = '';

    let totalAmount = 0;

    cart.forEach((item, index) => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td><img src="${item.imgFile}" alt="${item.itemName}" style="width:50px;"></td>
            <td>${item.itemName}</td>
            <td>₱${item.price}</td>
            <td>${item.quantity}</td>
            <td>₱${item.subtotal}</td>
            <td><button onclick="removeItem(${index})">Remove</button></td>
        `;

        tbody.appendChild(tr);
        totalAmount += item.subtotal;
    });

    document.getElementById('totalAmount').textContent = totalAmount;
}

// Remove item from cart
function removeItem(index) {
    cart.splice(index, 1);
    updateCartTable();
}

// ================= Submit Rental =================
function submitRental() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;

    // Convert cart to a string for submission (can be stored in DB)
    const cartData = JSON.stringify(cart);

    fetch('/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&cart=${encodeURIComponent(cartData)}`
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        cart = []; // clear cart
        updateCartTable();
        document.getElementById('rentForm').reset();
        document.getElementById('previewImg').style.display = 'none';
    })
    .catch(err => console.error(err));
}

// Prevent default form submit
document.getElementById('rentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    submitRental();
});
