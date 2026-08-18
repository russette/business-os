// =========================
// BUSINESSOS V2
// =========================

// -------------------------
// DATA
// -------------------------

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


// -------------------------
// ELEMENTS
// -------------------------

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


// -------------------------
// FORMS
// -------------------------

const productForm =
    document.getElementById("productForm");

const customerForm =
    document.getElementById("customerForm");

const saleForm =
    document.getElementById("saleForm");

const productFormElement =
    document.getElementById("productFormElement");

const customerFormElement =
    document.getElementById("customerFormElement");

const saleFormElement =
    document.getElementById("saleFormElement");


// -------------------------
// BUTTONS
// -------------------------

const addProductButton =
    document.getElementById("addProductButton");

const addCustomerButton =
    document.getElementById("addCustomerButton");

const addSaleButton =
    document.getElementById("addSaleButton");

const cancelProductButton =
    document.getElementById("cancelProductButton");

const cancelCustomerButton =
    document.getElementById("cancelCustomerButton");

const cancelSaleButton =
    document.getElementById("cancelSaleButton");

const resetDataButton =
    document.getElementById("resetDataButton");


// -------------------------
// MOBILE MENU
// -------------------------

if (menuButton) {

    menuButton.addEventListener(
        "click",
        function () {

            navigation.classList.toggle(
                "show"
            );

        }
    );

}


// -------------------------
// CLOSE MOBILE MENU
// -------------------------

if (navigation) {

    navigation
        .querySelectorAll("a")
        .forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    navigation.classList.remove(
                        "show"
                    );

                }
            );

        });

}


// -------------------------
// SAVE DATA
// -------------------------

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


// -------------------------
// DASHBOARD
// -------------------------

function updateDashboard() {

    productCountElement.textContent =
        products.length;

    customerCountElement.textContent =
        customers.length;

    saleCountElement.textContent =
        sales.length;


    const totalRevenue =
        sales.reduce(
            function (total, sale) {

                return total +
                    Number(sale.amount);

            },
            0
        );


    revenueElement.textContent =
        "$" + totalRevenue.toFixed(2);

}


// -------------------------
// SHOW FORM
// -------------------------

function showForm(form) {

    form.classList.remove(
        "hidden"
    );

    form.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


// -------------------------
// HIDE FORM
// -------------------------

function hideForm(form) {

    form.classList.add(
        "hidden"
    );

}


// =========================
// PRODUCTS
// =========================

// -------------------------
// RENDER PRODUCTS
// -------------------------

function renderProducts() {

    if (products.length === 0) {

        productList.className =
            "empty-state";

        productList.innerHTML = `

            <div>📦</div>

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
            function (product, index) {

                return `

                    <article class="data-card">

                        <div class="data-icon">
                            📦
                        </div>

                        <h3>
                            ${escapeHTML(
                                product.name
                            )}
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

                        <div class="card-actions">

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


// -------------------------
// ADD PRODUCT
// -------------------------

if (addProductButton) {

    addProductButton.addEventListener(
        "click",
        function () {

            showForm(
                productForm
            );

        }
    );

}


// -------------------------
// CANCEL PRODUCT
// -------------------------

if (cancelProductButton) {

    cancelProductButton.addEventListener(
        "click",
        function () {

            productFormElement.reset();

            hideForm(
                productForm
            );

        }
    );

}


// -------------------------
// SUBMIT PRODUCT
// -------------------------

if (productFormElement) {

    productFormElement.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById(
                        "productName"
                    )
                    .value
                    .trim();


            const price =
                Number(
                    document
                        .getElementById(
                            "productPrice"
                        )
                        .value
                );


            const stock =
                Number(
                    document
                        .getElementById(
                            "productStock"
                        )
                        .value
                );


            if (!name) {

                alert(
                    "Please enter a product name."
                );

                return;
            }


            if (
                isNaN(price) ||
                price < 0
            ) {

                alert(
                    "Please enter a valid USD price."
                );

                return;
            }


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

                name: name,

                price: price,

                stock: stock

            });


            saveData();

            renderProducts();

            updateDashboard();

            productFormElement.reset();

            hideForm(
                productForm
            );

        }
    );

}


// -------------------------
// EDIT PRODUCT
// -------------------------

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
                "Price in USD:",
                product.price
            )
        );


    if (
        isNaN(price) ||
        price < 0
    ) {

        alert(
            "Enter a valid USD price."
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
            "Enter a valid stock quantity."
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


// -------------------------
// DELETE PRODUCT
// -------------------------

function deleteProduct(index) {

    if (
        !confirm(
            "Delete this product?"
        )
    ) {

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

// -------------------------
// RENDER CUSTOMERS
// -------------------------

function renderCustomers() {

    if (customers.length === 0) {

        customerList.className =
            "empty-state";

        customerList.innerHTML = `

            <div>👥</div>

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
            function (customer, index) {

                return `

                    <article class="data-card">

                        <div class="data-icon">
                            👤
                        </div>

                        <h3>
                            ${escapeHTML(
                                customer.name
                            )}
                        </h3>

                        <p>
                            ${escapeHTML(
                                customer.email
                            )}
                        </p>

                        <p>
                            ${escapeHTML(
                                customer.phone || "No phone"
                            )}
                        </p>

                        <div class="card-actions">

                            <button
                                class="delete-button"
                                onclick="deleteCustomer(${index})">

                                Delete

                            </button>

                        </div>

                    </article>

                `;

            }
        ).join("");

}


// -------------------------
// SHOW CUSTOMER FORM
// -------------------------

if (addCustomerButton) {

    addCustomerButton.addEventListener(
        "click",
        function () {

            showForm(
                customerForm
            );

        }
    );

}


// -------------------------
// CANCEL CUSTOMER
// -------------------------

if (cancelCustomerButton) {

    cancelCustomerButton.addEventListener(
        "click",
        function () {

            customerFormElement.reset();

            hideForm(
                customerForm
            );

        }
    );

}


// -------------------------
// SUBMIT CUSTOMER
// -------------------------

if (customerFormElement) {

    customerFormElement.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById(
                        "customerName"
                    )
                    .value
                    .trim();


            const email =
                document
                    .getElementById(
                        "customerEmail"
                    )
                    .value
                    .trim();


            const phone =
                document
                    .getElementById(
                        "customerPhone"
                    )
                    .value
                    .trim();


            if (!name) {

                alert(
                    "Please enter the customer's name."
                );

                return;
            }


            if (!email) {

                alert(
                    "Please enter the customer's email."
                );

                return;
            }


            customers.push({

                name: name,

                email: email,

                phone: phone

            });


            saveData();

            renderCustomers();

            updateDashboard();

            customerFormElement.reset();

            hideForm(
                customerForm
            );

        }
    );

}


// -------------------------
// DELETE CUSTOMER
// -------------------------

function deleteCustomer(index) {

    if (
        !confirm(
            "Delete this customer?"
        )
    ) {

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

// -------------------------
// RENDER SALES
// -------------------------

function renderSales() {

    if (sales.length === 0) {

        salesList.className =
            "empty-state";

        salesList.innerHTML = `

            <div>🧾</div>

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
            function (sale, index) {

                return `

                    <article class="data-card">

                        <div class="data-icon">
                            🧾
                        </div>

                        <h3>
                            ${escapeHTML(
                                sale.description
                            )}
                        </h3>

                        <p>
                            Amount:
                            $${Number(
                                sale.amount
                            ).toFixed(2)}
                        </p>

                        <div class="card-actions">

                            <button
                                class="delete-button"
                                onclick="deleteSale(${index})">

                                Delete

                            </button>

                        </div>

                    </article>

                `;

            }
        ).join("");

}


// -------------------------
// SHOW SALE FORM
// -------------------------

if (addSaleButton) {

    addSaleButton.addEventListener(
        "click",
        function () {

            showForm(
                saleForm
            );

        }
    );

}


// -------------------------
// CANCEL SALE
// -------------------------

if (cancelSaleButton) {

    cancelSaleButton.addEventListener(
        "click",
        function () {

            saleFormElement.reset();

            hideForm(
                saleForm
            );

        }
    );

}


// -------------------------
// SUBMIT SALE
// -------------------------

if (saleFormElement) {

    saleFormElement.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const description =
                document
                    .getElementById(
                        "saleDescription"
                    )
                    .value
                    .trim();


            const amount =
                Number(
                    document
                        .getElementById(
                            "saleAmount"
                        )
                        .value
                );


            if (!description) {

                alert(
                    "Please enter a sale description."
                );

                return;
            }


            if (
                isNaN(amount) ||
                amount <= 0
            ) {

                alert(
                    "Please enter a valid USD amount."
                );

                return;
            }


            sales.push({

                description:
                    description,

                amount:
                    amount

            });


            saveData();

            renderSales();

            updateDashboard();

            saleFormElement.reset();

            hideForm(
                saleForm
            );

        }
    );

}


// -------------------------
// DELETE SALE
// -------------------------

function deleteSale(index) {

    if (
        !confirm(
            "Delete this sale?"
        )
    ) {

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
// RESET EVERYTHING
// =========================

if (resetDataButton) {

    resetDataButton.addEventListener(
        "click",
        function () {

            const confirmed =
                confirm(
                    "Delete ALL BusinessOS data? This cannot be undone."
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


            productFormElement.reset();

            customerFormElement.reset();

            saleFormElement.reset();


            hideForm(
                productForm
            );

            hideForm(
                customerForm
            );

            hideForm(
                saleForm
            );


            alert(
                "BusinessOS has been reset successfully."
            );

        }
    );

}


// =========================
// SECURITY
// =========================

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// =========================
// START BUSINESSOS
// =========================

renderProducts();

renderCustomers();

renderSales();

updateDashboard();
