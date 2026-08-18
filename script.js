// =========================
// BUSINESSOS
// COMPLETE USD VERSION
// =========================


// =========================
// DATA
// =========================

let products =
    JSON.parse(
        localStorage.getItem("businessOSProducts")
    ) || [];

let customers =
    JSON.parse(
        localStorage.getItem("businessOSCustomers")
    ) || [];

let sales =
    JSON.parse(
        localStorage.getItem("businessOSSales")
    ) || [];


// =========================
// ELEMENTS
// =========================

const menuButton =
    document.getElementById("menuButton");

const navigation =
    document.getElementById("navigation");

const productList =
    document.getElementById("productList");

const customerList =
    document.getElementById("customerList");

const salesList =
    document.getElementById("salesList");

const revenueElement =
    document.getElementById("revenue");

const productCountElement =
    document.getElementById("productCount");

const customerCountElement =
    document.getElementById("customerCount");

const saleCountElement =
    document.getElementById("saleCount");

const resetDataButton =
    document.getElementById("resetDataButton");


// =========================
// MOBILE MENU
// =========================

if (menuButton) {

    menuButton.addEventListener(
        "click",
        () => {

            navigation.classList.toggle(
                "show"
            );

        }
    );

}


// =========================
// SAVE DATA
// =========================

function saveData() {

    localStorage.setItem(
        "businessOSProducts",
        JSON.stringify(products)
    );

    localStorage.setItem(
        "businessOSCustomers",
        JSON.stringify(customers)
    );

    localStorage.setItem(
        "businessOSSales",
        JSON.stringify(sales)
    );

}


// =========================
// UPDATE DASHBOARD
// =========================

function updateDashboard() {

    productCountElement.textContent =
        products.length;

    customerCountElement.textContent =
        customers.length;

    saleCountElement.textContent =
        sales.length;


    const totalRevenue =
        sales.reduce(
            (total, sale) => {

                return total +
                    Number(sale.amount);

            },
            0
        );


    revenueElement.textContent =
        `$${totalRevenue.toFixed(2)}`;

}


// =========================
// PRODUCTS
// =========================

function renderProducts() {

    if (products.length === 0) {

        productList.className =
            "empty-state";

        productList.innerHTML = `

            <div>
                📦
            </div>

            <h3>
                No products yet
            </h3>

            <p>
                Add your first product to start
                managing your inventory.
            </p>

        `;

        return;
    }


    productList.className =
        "data-grid";


    productList.innerHTML =
        products.map(
            (product, index) => {

                return `

                    <article
                        class="data-card">

                        <div
                            class="data-icon">
                            📦
                        </div>

                        <h3>
                            ${product.name}
                        </h3>

                        <p>
                            Price:
                            $${Number(
                                product.price
                            ).toFixed(2)}
                        </p>

                        <p>
                            Stock:
                            ${product.stock}
                        </p>

                        <div
                            class="card-actions">

                            <button
                                class="edit-button"
                                onclick="editProduct(${index})">

                                Edit

                            </button>

                            <button
                                class="delete-button"
                                onclick="deleteProduct(${index})">

                                Delete

                            </button>

                        </div>

                    </article>

                `;

            }
        ).join("");

}


// =========================
// ADD PRODUCT
// =========================

function addProduct() {

    const name =
        prompt(
            "Enter product name:"
        );


    if (!name) {
        return;
    }


    const price =
        Number(
            prompt(
                "Enter product price in USD:"
            )
        );


    if (
        isNaN(price) ||
        price < 0
    ) {

        alert(
            "Please enter a valid USD price."
        );

        return;
    }


    const stock =
        Number(
            prompt(
                "Enter stock quantity:"
            )
        );


    if (
        isNaN(stock) ||
        stock < 0
    ) {

        alert(
            "Please enter a valid stock quantity."
        );

        return;
    }


    products.push({

        name:
            name.trim(),

        price:
            price,

        stock:
            stock

    });


    saveData();

    renderProducts();

    updateDashboard();

}


// =========================
// EDIT PRODUCT
// =========================

function editProduct(index) {

    const product =
        products[index];


    if (!product) {
        return;
    }


    const name =
        prompt(
            "Product name:",
            product.name
        );


    if (!name) {
        return;
    }


    const price =
        Number(
            prompt(
                "Product price in USD:",
                product.price
            )
        );


    if (
        isNaN(price) ||
        price < 0
    ) {

        alert(
            "Please enter a valid USD price."
        );

        return;
    }


    const stock =
        Number(
            prompt(
                "Stock quantity:",
                product.stock
            )
        );


    if (
        isNaN(stock) ||
        stock < 0
    ) {

        alert(
            "Please enter a valid stock quantity."
        );

        return;
    }


    products[index] = {

        name:
            name.trim(),

        price:
            price,

        stock:
            stock

    };


    saveData();

    renderProducts();

    updateDashboard();

}


// =========================
// DELETE PRODUCT
// =========================

function deleteProduct(index) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this product?"
        );


    if (!confirmed) {
        return;
    }


    products.splice(
        index,
        1
    );


    saveData();

    renderProducts();

    updateDashboard();

}


// =========================
// CUSTOMERS
// =========================

function renderCustomers() {

    if (customers.length === 0) {

        customerList.className =
            "empty-state";

        customerList.innerHTML = `

            <div>
                👥
            </div>

            <h3>
                No customers yet
            </h3>

            <p>
                Add your first customer to start
                building your customer list.
            </p>

        `;

        return;
    }


    customerList.className =
        "data-grid";


    customerList.innerHTML =
        customers.map(
            (customer, index) => {

                return `

                    <article
                        class="data-card">

                        <div
                            class="data-icon">
                            👤
                        </div>

                        <h3>
                            ${customer.name}
                        </h3>

                        <p>
                            ${customer.phone}
                        </p>

                        <button
                            class="delete-button"
                            onclick="deleteCustomer(${index})">

                            Delete

                        </button>

                    </article>

                `;

            }
        ).join("");

}


// =========================
// ADD CUSTOMER
// =========================

function addCustomer() {

    const name =
        prompt(
            "Customer name:"
        );


    if (!name) {
        return;
    }


    const phone =
        prompt(
            "Customer phone number:"
        );


    if (!phone) {
        return;
    }


    customers.push({

        name:
            name.trim(),

        phone:
            phone.trim()

    });


    saveData();

    renderCustomers();

    updateDashboard();

}


// =========================
// DELETE CUSTOMER
// =========================

function deleteCustomer(index) {

    const confirmed =
        confirm(
            "Delete this customer?"
        );


    if (!confirmed) {
        return;
    }


    customers.splice(
        index,
        1
    );


    saveData();

    renderCustomers();

    updateDashboard();

}


// =========================
// SALES
// =========================

function renderSales() {

    if (sales.length === 0) {

        salesList.className =
            "empty-state";

        salesList.innerHTML = `

            <div>
                🧾
            </div>

            <h3>
                No sales yet
            </h3>

            <p>
                Your recorded sales will
                appear here.
            </p>

        `;

        return;
    }


    salesList.className =
        "data-grid";


    salesList.innerHTML =
        sales.map(
            (sale, index) => {

                return `

                    <article
                        class="data-card">

                        <div
                            class="data-icon">
                            🧾
                        </div>

                        <h3>
                            ${sale.description}
                        </h3>

                        <p>
                            Amount:
                            $${Number(
                                sale.amount
                            ).toFixed(2)}
                        </p>

                        <button
                            class="delete-button"
                            onclick="deleteSale(${index})">

                            Delete

                        </button>

                    </article>

                `;

            }
        ).join("");

}


// =========================
// RECORD SALE
// =========================

function addSale() {

    const description =
        prompt(
            "What was sold?"
        );


    if (!description) {
        return;
    }


    const amount =
        Number(
            prompt(
                "Enter sale amount in USD:"
            )
        );


    if (
        isNaN(amount) ||
        amount <= 0
    ) {

        alert(
            "Please enter a valid USD sale amount."
        );

        return;
    }


    sales.push({

        description:
            description.trim(),

        amount:
            amount

    });


    saveData();

    renderSales();

    updateDashboard();

}


// =========================
// DELETE SALE
// =========================

function deleteSale(index) {

    const confirmed =
        confirm(
            "Delete this sale?"
        );


    if (!confirmed) {
        return;
    }


    sales.splice(
        index,
        1
    );


    saveData();

    renderSales();

    updateDashboard();

}


// =========================
// RESET BUSINESS DATA
// =========================

function resetBusinessData() {

    const confirmed =
        confirm(
            "This will permanently remove all BusinessOS products, customers and sales from this browser. Continue?"
        );


    if (!confirmed) {
        return;
    }


    products = [];

    customers = [];

    sales = [];


    saveData();

    renderProducts();

    renderCustomers();

    renderSales();

    updateDashboard();


    alert(
        "BusinessOS data has been reset."
    );

}


// =========================
// BUTTON EVENTS
// =========================

const addProductButton =
    document.getElementById(
        "addProductButton"
    );

const addCustomerButton =
    document.getElementById(
        "addCustomerButton"
    );

const addSaleButton =
    document.getElementById(
        "addSaleButton"
    );


if (addProductButton) {

    addProductButton.addEventListener(
        "click",
        addProduct
    );

}


if (addCustomerButton) {

    addCustomerButton.addEventListener(
        "click",
        addCustomer
    );

}


if (addSaleButton) {

    addSaleButton.addEventListener(
        "click",
        addSale
    );

}


if (resetDataButton) {

    resetDataButton.addEventListener(
        "click",
        resetBusinessData
    );

}


// =========================
// START APP
// =========================

renderProducts();

renderCustomers();

renderSales();

updateDashboard();
