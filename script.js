// =========================
// BUSINESSOS V3
// INVENTORY + SALES SYSTEM
// =========================


// =========================
// DATA
// =========================

let products =
    JSON.parse(
        localStorage.getItem(
            "businessOSProducts"
        )
    ) || [];


let customers =
    JSON.parse(
        localStorage.getItem(
            "businessOSCustomers"
        )
    ) || [];


let sales =
    JSON.parse(
        localStorage.getItem(
            "businessOSSales"
        )
    ) || [];


// =========================
// ELEMENTS
// =========================

const menuButton =
    document.getElementById(
        "menuButton"
    );


const navigation =
    document.getElementById(
        "navigation"
    );


const productList =
    document.getElementById(
        "productList"
    );


const customerList =
    document.getElementById(
        "customerList"
    );


const salesList =
    document.getElementById(
        "salesList"
    );


const revenueElement =
    document.getElementById(
        "revenue"
    );


const productCountElement =
    document.getElementById(
        "productCount"
    );


const customerCountElement =
    document.getElementById(
        "customerCount"
    );


const saleCountElement =
    document.getElementById(
        "saleCount"
    );


// =========================
// FORMS
// =========================

const productForm =
    document.getElementById(
        "productForm"
    );


const customerForm =
    document.getElementById(
        "customerForm"
    );


const saleForm =
    document.getElementById(
        "saleForm"
    );


const productFormElement =
    document.getElementById(
        "productFormElement"
    );


const customerFormElement =
    document.getElementById(
        "customerFormElement"
    );


const saleFormElement =
    document.getElementById(
        "saleFormElement"
    );


// =========================
// BUTTONS
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


const cancelProductButton =
    document.getElementById(
        "cancelProductButton"
    );


const cancelCustomerButton =
    document.getElementById(
        "cancelCustomerButton"
    );


const cancelSaleButton =
    document.getElementById(
        "cancelSaleButton"
    );


const resetDataButton =
    document.getElementById(
        "resetDataButton"
    );


// =========================
// SALES INPUTS
// =========================

const saleProduct =
    document.getElementById(
        "saleProduct"
    );


const saleQuantity =
    document.getElementById(
        "saleQuantity"
    );


const saleTotal =
    document.getElementById(
        "saleTotal"
    );


// =========================
// MOBILE MENU
// =========================

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


if (navigation) {

    navigation
        .querySelectorAll("a")
        .forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        navigation.classList.remove(
                            "show"
                        );

                    }
                );

            }
        );

}


// =========================
// SAVE
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
// DASHBOARD
// =========================

function updateDashboard() {

    productCountElement.textContent =
        products.length;


    customerCountElement.textContent =
        customers.length;


    saleCountElement.textContent =
        sales.length;


    const revenue =
        sales.reduce(
            function (
                total,
                sale
            ) {

                return total +
                    Number(
                        sale.amount
                    );

            },
            0
        );


    revenueElement.textContent =
        "$" +
        revenue.toFixed(2);

}


// =========================
// FORM HELPERS
// =========================

function showForm(form) {

    form.classList.remove(
        "hidden"
    );


    form.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


function hideForm(form) {

    form.classList.add(
        "hidden"
    );

}


// =========================
// PRODUCTS
// =========================

function renderProducts() {

    if (
        products.length === 0
    ) {

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
            function (
                product,
                index
            ) {

                const stockStatus =
                    product.stock === 0
                        ? "OUT OF STOCK"
                        : product.stock <= 3
                        ? "LOW STOCK"
                        : "IN STOCK";


                return `

                    <article
                        class="data-card">

                        <div
                            class="data-icon">

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


                        <p>

                            Status:
                            ${stockStatus}

                        </p>


                        <div
                            class="card-actions">


                            <button
                                class="edit-button"
                                onclick="editProduct(
                                    ${index}
                                )">

                                Edit

                            </button>


                            <button
                                class="delete-button"
                                onclick="deleteProduct(
                                    ${index}
                                )">

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

addProductButton.addEventListener(
    "click",
    function () {

        showForm(
            productForm
        );

    }
);


cancelProductButton.addEventListener(
    "click",
    function () {

        productFormElement.reset();

        hideForm(
            productForm
        );

    }
);


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
                "Enter a product name."
            );

            return;

        }


        if (
            isNaN(price) ||
            price <= 0
        ) {

            alert(
                "Enter a valid selling price."
            );

            return;

        }


        if (
            isNaN(stock) ||
            stock < 0
        ) {

            alert(
                "Enter a valid stock quantity."
            );

            return;

        }


        products.push({

            name:
                name,

            price:
                price,

            stock:
                stock

        });


        saveData();

        renderProducts();

        updateSaleProductOptions();

        updateDashboard();


        productFormElement.reset();

        hideForm(
            productForm
        );

    }
);


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
                "Selling price in USD:",
                product.price
            )
        );


    if (
        isNaN(price) ||
        price <= 0
    ) {

        alert(
            "Enter a valid price."
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

    updateSaleProductOptions();

    updateDashboard();

}


// =========================
// DELETE PRODUCT
// =========================

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

    updateSaleProductOptions();

    updateDashboard();

}


// =========================
// CUSTOMERS
// =========================

function renderCustomers() {

    if (
        customers.length === 0
    ) {

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
            function (
                customer,
                index
            ) {

                return `

                    <article
                        class="data-card">


                        <div
                            class="data-icon">

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
                                customer.phone ||
                                "No phone"
                            )}

                        </p>


                        <div
                            class="card-actions">


                            <button
                                class="delete-button"
                                onclick="deleteCustomer(
                                    ${index}
                                )">

                                Delete

                            </button>


                        </div>


                    </article>

                `;

            }
        ).join("");

}


// =========================
// ADD CUSTOMER
// =========================

addCustomerButton.addEventListener(
    "click",
    function () {

        showForm(
            customerForm
        );

    }
);


cancelCustomerButton.addEventListener(
    "click",
    function () {

        customerFormElement.reset();

        hideForm(
            customerForm
        );

    }
);


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
                "Enter the customer's name."
            );

            return;

        }


        if (!email) {

            alert(
                "Enter the customer's email."
            );

            return;

        }


        customers.push({

            name:
                name,

            email:
                email,

            phone:
                phone

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


// =========================
// DELETE CUSTOMER
// =========================

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
// UPDATE PRODUCT OPTIONS
// -------------------------

function updateSaleProductOptions() {

    saleProduct.innerHTML = `

        <option value="">
            Select a product
        </option>

    `;


    products.forEach(
        function (
            product,
            index
        ) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                index;


            option.textContent =
                `${product.name} — $${Number(
                    product.price
                ).toFixed(2)} — Stock: ${
                    product.stock
                }`;


            if (
                product.stock <= 0
            ) {

                option.disabled =
                    true;

            }


            saleProduct.appendChild(
                option
            );

        }
    );


    updateSaleTotal();

}


// -------------------------
// UPDATE SALE TOTAL
// -------------------------

function updateSaleTotal() {

    const index =
        Number(
            saleProduct.value
        );


    const quantity =
        Number(
            saleQuantity.value
        );


    if (
        saleProduct.value === "" ||
        !products[index] ||
        quantity <= 0
    ) {

        saleTotal.value =
            "$0.00";

        return;

    }


    const product =
        products[index];


    const total =
        product.price *
        quantity;


    saleTotal.value =
        "$" +
        total.toFixed(2);

}


// -------------------------
// SALE EVENTS
// -------------------------

saleProduct.addEventListener(
    "change",
    updateSaleTotal
);


saleQuantity.addEventListener(
    "input",
    updateSaleTotal
);


// -------------------------
// SHOW SALE FORM
// -------------------------

addSaleButton.addEventListener(
    "click",
    function () {

        if (
            products.length === 0
        ) {

            alert(
                "Add a product first before recording a sale."
            );

            return;

        }


        updateSaleProductOptions();

        saleQuantity.value =
            1;


        updateSaleTotal();


        showForm(
            saleForm
        );

    }
);


// -------------------------
// CANCEL SALE
// -------------------------

cancelSaleButton.addEventListener(
    "click",
    function () {

        saleFormElement.reset();

        saleTotal.value =
            "$0.00";


        hideForm(
            saleForm
        );

    }
);


// -------------------------
// RECORD SALE
// -------------------------

saleFormElement.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const productIndex =
            Number(
                saleProduct.value
            );


        const quantity =
            Number(
                saleQuantity.value
            );


        if (
            saleProduct.value === "" ||
            !products[productIndex]
        ) {

            alert(
                "Select a product."
            );

            return;

        }


        if (
            isNaN(quantity) ||
            quantity < 1 ||
            !Number.isInteger(
                quantity
            )
        ) {

            alert(
                "Enter a valid whole-number quantity."
            );

            return;

        }


        const product =
            products[productIndex];


        if (
            product.stock <
            quantity
        ) {

            alert(
                `Not enough stock. Only ${product.stock} available.`
            );

            return;

        }


        const total =
            product.price *
            quantity;


        // Reduce inventory

        product.stock -=
            quantity;


        // Create sale

        sales.push({

            product:
                product.name,

            quantity:
                quantity,

            amount:
                total,

            date:
                new Date()
                    .toISOString()

        });


        saveData();

        renderProducts();

        renderSales();

        updateDashboard();


        saleFormElement.reset();

        saleTotal.value =
            "$0.00";


        hideForm(
            saleForm
        );


        alert(
            `Sale recorded: ${quantity} × ${product.name} for $${total.toFixed(2)}`
        );

    }
);


// -------------------------
// RENDER SALES
// -------------------------

function renderSales() {

    if (
        sales.length === 0
    ) {

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
        sales
            .slice()
            .reverse()
            .map(
                function (
                    sale,
                    reverseIndex
                ) {

                    const actualIndex =
                        sales.length -
                        1 -
                        reverseIndex;


                    return `

                        <article
                            class="data-card">


                            <div
                                class="data-icon">

                                🧾

                            </div>


                            <h3>

                                ${escapeHTML(
                                    sale.product
                                )}

                            </h3>


                            <p>

                                Quantity:
                                ${sale.quantity}

                            </p>


                            <p>

                                Total:
                                $${Number(
                                    sale.amount
                                ).toFixed(2)}

                            </p>


                            <p>

                                ${formatDate(
                                    sale.date
                                )}

                            </p>


                            <div
                                class="card-actions">


                                <button
                                    class="delete-button"
                                    onclick="deleteSale(
                                        ${actualIndex}
                                    )">

                                    Delete

                                </button>


                            </div>


                        </article>

                    `;

                }
            )
            .join("");

}


// =========================
// DELETE SALE
// =========================

function deleteSale(index) {

    if (
        !confirm(
            "Delete this sale?"
        )
    ) {

        return;

    }


    const sale =
        sales[index];


    // Return sold stock

    const product =
        products.find(
            function (item) {

                return item.name ===
                    sale.product;

            }
        );


    if (product) {

        product.stock +=
            Number(
                sale.quantity
            );

    }


    sales.splice(
        index,
        1
    );


    saveData();

    renderProducts();

    renderSales();

    updateSaleProductOptions();

    updateDashboard();

}


// =========================
// RESET
// =========================

resetDataButton.addEventListener(
    "click",
    function () {

        if (
            !confirm(
                "Delete ALL BusinessOS data? This cannot be undone."
            )
        ) {

            return;

        }


        products = [];

        customers = [];

        sales = [];


        saveData();


        renderProducts();

        renderCustomers();

        renderSales();

        updateSaleProductOptions();

        updateDashboard();


        productFormElement.reset();

        customerFormElement.reset();

        saleFormElement.reset();


        saleTotal.value =
            "$0.00";


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


// =========================
// HELPERS
// =========================

function escapeHTML(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


function formatDate(date) {

    if (!date) {
        return "";
    }


    return new Date(
        date
    ).toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}


// =========================
// START
// =========================

renderProducts();

renderCustomers();

renderSales();

updateSaleProductOptions();

updateDashboard();
