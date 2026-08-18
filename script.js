// =========================
// BUSINESSOS V5
// INVOICES
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


let invoices =
    JSON.parse(
        localStorage.getItem(
            "businessOSInvoices"
        )
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

const invoiceList =
    document.getElementById("invoiceList");


// Dashboard

const revenueElement =
    document.getElementById("revenue");

const productCountElement =
    document.getElementById("productCount");

const customerCountElement =
    document.getElementById("customerCount");

const saleCountElement =
    document.getElementById("saleCount");


// Analytics

const averageSaleElement =
    document.getElementById("averageSale");

const unitsInStockElement =
    document.getElementById("unitsInStock");

const inventoryValueElement =
    document.getElementById("inventoryValue");

const bestSellerElement =
    document.getElementById("bestSeller");

const topProductsElement =
    document.getElementById("topProducts");

const inventoryAlertsElement =
    document.getElementById("inventoryAlerts");

const salesOverviewElement =
    document.getElementById("salesOverview");


// Forms

const productForm =
    document.getElementById("productForm");

const customerForm =
    document.getElementById("customerForm");

const saleForm =
    document.getElementById("saleForm");

const invoiceForm =
    document.getElementById("invoiceForm");


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

const invoiceFormElement =
    document.getElementById(
        "invoiceFormElement"
    );


// Buttons

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

const createInvoiceButton =
    document.getElementById(
        "createInvoiceButton"
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

const cancelInvoiceButton =
    document.getElementById(
        "cancelInvoiceButton"
    );


const resetDataButton =
    document.getElementById(
        "resetDataButton"
    );


// Sales

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


// Invoice

const invoiceCustomer =
    document.getElementById(
        "invoiceCustomer"
    );

const invoiceProduct =
    document.getElementById(
        "invoiceProduct"
    );

const invoiceQuantity =
    document.getElementById(
        "invoiceQuantity"
    );

const invoiceTotal =
    document.getElementById(
        "invoiceTotal"
    );


// =========================
// MOBILE MENU
// =========================

if (
    menuButton &&
    navigation
) {

    menuButton.addEventListener(
        "click",
        function () {

            navigation.classList.toggle(
                "show"
            );

        }
    );


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


    localStorage.setItem(
        "businessOSInvoices",
        JSON.stringify(invoices)
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
                        sale.amount || 0
                    );

            },
            0
        );


    revenueElement.textContent =
        "$" +
        revenue.toFixed(2);


    updateAnalytics();

}


// =========================
// ANALYTICS
// =========================

function updateAnalytics() {

    const revenue =
        sales.reduce(
            function (
                total,
                sale
            ) {

                return total +
                    Number(
                        sale.amount || 0
                    );

            },
            0
        );


    const averageSale =
        sales.length
            ? revenue / sales.length
            : 0;


    averageSaleElement.textContent =
        "$" +
        averageSale.toFixed(2);


    const units =
        products.reduce(
            function (
                total,
                product
            ) {

                return total +
                    Number(
                        product.stock || 0
                    );

            },
            0
        );


    unitsInStockElement.textContent =
        units;


    const inventoryValue =
        products.reduce(
            function (
                total,
                product
            ) {

                return total +
                    (
                        Number(
                            product.price || 0
                        ) *
                        Number(
                            product.stock || 0
                        )
                    );

            },
            0
        );


    inventoryValueElement.textContent =
        "$" +
        inventoryValue.toFixed(2);


    const productSales = {};


    sales.forEach(
        function (sale) {

            if (
                !productSales[
                    sale.product
                ]
            ) {

                productSales[
                    sale.product
                ] = 0;

            }


            productSales[
                sale.product
            ] += Number(
                sale.quantity || 0
            );

        }
    );


    const sorted =
        Object.entries(
            productSales
        ).sort(
            function (
                a,
                b
            ) {

                return b[1] - a[1];

            }
        );


    bestSellerElement.textContent =
        sorted.length
            ? sorted[0][0]
            : "None yet";


    renderTopProducts(
        sorted
    );


    renderInventoryAlerts();


    renderSalesOverview(
        revenue
    );

}


function renderTopProducts(
    sorted
) {

    if (!sorted.length) {

        topProductsElement.innerHTML = `
            <p class="muted">
                No sales data yet.
            </p>
        `;

        return;
    }


    topProductsElement.innerHTML =
        sorted
            .slice(0, 5)
            .map(
                function (
                    item,
                    index
                ) {

                    return `
                        <div class="analytics-row">

                            <span>
                                <strong>
                                    #${index + 1}
                                </strong>

                                ${escapeHTML(
                                    item[0]
                                )}
                            </span>

                            <strong>
                                ${item[1]} sold
                            </strong>

                        </div>
                    `;

                }
            )
            .join("");

}


function renderInventoryAlerts() {

    const lowStock =
        products.filter(
            function (
                product
            ) {

                return Number(
                    product.stock
                ) <= 3;

            }
        );


    if (!lowStock.length) {

        inventoryAlertsElement.innerHTML = `
            <p class="muted">
                ✅ All products have healthy stock levels.
            </p>
        `;

        return;
    }


    inventoryAlertsElement.innerHTML =
        lowStock
            .map(
                function (
                    product
                ) {

                    return `
                        <div class="analytics-row">

                            <span>
                                📦
                                ${escapeHTML(
                                    product.name
                                )}
                            </span>

                            <strong>
                                ${
                                    Number(
                                        product.stock
                                    ) === 0
                                        ? "OUT OF STOCK"
                                        : `${product.stock} left`
                                }
                            </strong>

                        </div>
                    `;

                }
            )
            .join("");

}


function renderSalesOverview(
    revenue
) {

    if (!sales.length) {

        salesOverviewElement.innerHTML = `
            <p class="muted">
                No sales data yet.
            </p>
        `;

        return;
    }


    const unitsSold =
        sales.reduce(
            function (
                total,
                sale
            ) {

                return total +
                    Number(
                        sale.quantity || 0
                    );

            },
            0
        );


    const largest =
        Math.max(
            ...sales.map(
                function (
                    sale
                ) {

                    return Number(
                        sale.amount || 0
                    );

                }
            )
        );


    salesOverviewElement.innerHTML = `

        <div class="analytics-row">

            <span>
                Total revenue
            </span>

            <strong>
                $${revenue.toFixed(2)}
            </strong>

        </div>


        <div class="analytics-row">

            <span>
                Units sold
            </span>

            <strong>
                ${unitsSold}
            </strong>

        </div>


        <div class="analytics-row">

            <span>
                Average sale
            </span>

            <strong>
                $${(
                    revenue /
                    sales.length
                ).toFixed(2)}
            </strong>

        </div>


        <div class="analytics-row">

            <span>
                Largest sale
            </span>

            <strong>
                $${largest.toFixed(2)}
            </strong>

        </div>

    `;

}


// =========================
// FORM HELPERS
// =========================

function showForm(
    form
) {

    form.classList.remove(
        "hidden"
    );


    form.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


function hideForm(
    form
) {

    form.classList.add(
        "hidden"
    );

}


// =========================
// PRODUCTS
// =========================

function renderProducts() {

    if (!products.length) {

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
        products
            .map(
                function (
                    product,
                    index
                ) {

                    let status =
                        "IN STOCK";


                    if (
                        Number(
                            product.stock
                        ) === 0
                    ) {

                        status =
                            "OUT OF STOCK";

                    } else if (
                        Number(
                            product.stock
                        ) <= 3
                    ) {

                        status =
                            "LOW STOCK";

                    }


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

                            <p>
                                Status:
                                ${status}
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
            )
            .join("");

}


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
            !Number.isFinite(price) ||
            price <= 0
        ) {

            alert(
                "Enter a valid selling price."
            );

            return;
        }


        if (
            !Number.isFinite(stock) ||
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

        updateInvoiceProductOptions();

        updateDashboard();


        productFormElement.reset();

        hideForm(
            productForm
        );

    }
);


function editProduct(
    index
) {

    const product =
        products[index];


    if (!product) return;


    const name =
        prompt(
            "Product name:",
            product.name
        );


    if (!name) return;


    const price =
        Number(
            prompt(
                "Selling price in USD:",
                product.price
            )
        );


    if (
        !Number.isFinite(price) ||
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
        !Number.isFinite(stock) ||
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

    updateInvoiceProductOptions();

    updateDashboard();

}


function deleteProduct(
    index
) {

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

    updateInvoiceProductOptions();

    updateDashboard();

}


// =========================
// CUSTOMERS
// =========================

function renderCustomers() {

    if (!customers.length) {

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
        customers
            .map(
                function (
                    customer,
                    index
                ) {

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
                                    customer.phone ||
                                    "No phone"
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
            )
            .join("");

}


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

        updateInvoiceCustomerOptions();

        updateDashboard();


        customerFormElement.reset();

        hideForm(
            customerForm
        );

    }
);


function deleteCustomer(
    index
) {

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

    updateInvoiceCustomerOptions();

    updateDashboard();

}


// =========================
// SALES
// =========================

function updateSaleProductOptions() {

    if (!saleProduct) return;


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
                String(index);


            option.textContent =
                `${product.name} — $${Number(
                    product.price
                ).toFixed(2)} — Stock: ${
                    product.stock
                }`;


            if (
                Number(
                    product.stock
                ) <= 0
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


function updateSaleTotal() {

    if (
        !saleProduct ||
        !saleQuantity ||
        !saleTotal
    ) {

        return;
    }


    if (
        saleProduct.value === ""
    ) {

        saleTotal.value =
            "$0.00";

        return;
    }


    const product =
        products[
            Number(
                saleProduct.value
            )
        ];


    const quantity =
        Number(
            saleQuantity.value
        );


    if (
        !product ||
        quantity < 1
    ) {

        saleTotal.value =
            "$0.00";

        return;
    }


    saleTotal.value =
        "$" +
        (
            Number(
                product.price
            ) *
            quantity
        ).toFixed(2);

}


saleProduct.addEventListener(
    "change",
    updateSaleTotal
);


saleQuantity.addEventListener(
    "input",
    updateSaleTotal
);


addSaleButton.addEventListener(
    "click",
    function () {

        if (!products.length) {

            alert(
                "Add a product first."
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
            saleProduct.value === ""
        ) {

            alert(
                "Select a product."
            );

            return;
        }


        const product =
            products[
                productIndex
            ];


        if (!product) {

            alert(
                "Product not found."
            );

            return;
        }


        if (
            !Number.isInteger(
                quantity
            ) ||
            quantity < 1
        ) {

            alert(
                "Enter a valid quantity."
            );

            return;
        }


        if (
            Number(
                product.stock
            ) < quantity
        ) {

            alert(
                `Not enough stock. Only ${product.stock} available.`
            );

            return;
        }


        const total =
            Number(
                product.price
            ) *
            quantity;


        product.stock =
            Number(
                product.stock
            ) -
            quantity;


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

        updateSaleProductOptions();

        updateInvoiceProductOptions();

        updateDashboard();


        saleFormElement.reset();

        saleTotal.value =
            "$0.00";

        hideForm(
            saleForm
        );


        alert(
            `Sale recorded successfully!\n\n${quantity} × ${product.name}\nTotal: $${total.toFixed(2)}`
        );

    }
);


// =========================
// SALES DISPLAY
// =========================

function renderSales() {

    if (!sales.length) {

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
        sales
            .slice()
            .reverse()
            .map(
                function (
                    sale,
                    reverseIndex
                ) {

                    const index =
                        sales.length -
                        1 -
                        reverseIndex;


                    return `
                        <article class="data-card">

                            <div class="data-icon">
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
            )
            .join("");

}


function deleteSale(
    index
) {

    if (
        !confirm(
            "Delete this sale?"
        )
    ) {

        return;
    }


    const sale =
        sales[index];


    if (sale) {

        const product =
            products.find(
                function (
                    item
                ) {

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

    }


    sales.splice(
        index,
        1
    );


    saveData();

    renderProducts();

    renderSales();

    updateSaleProductOptions();

    updateInvoiceProductOptions();

    updateDashboard();

}


// =========================
// INVOICE OPTIONS
// =========================

function updateInvoiceCustomerOptions() {

    invoiceCustomer.innerHTML = `
        <option value="">
            Select a customer
        </option>
    `;


    customers.forEach(
        function (
            customer,
            index
        ) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                String(index);


            option.textContent =
                `${customer.name} — ${customer.email}`;


            invoiceCustomer.appendChild(
                option
            );

        }
    );

}


function updateInvoiceProductOptions() {

    invoiceProduct.innerHTML = `
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
                String(index);


            option.textContent =
                `${product.name} — $${Number(
                    product.price
                ).toFixed(2)} — Stock: ${
                    product.stock
                }`;


            invoiceProduct.appendChild(
                option
            );

        }
    );


    updateInvoiceTotal();

}


function updateInvoiceTotal() {

    if (
        invoiceProduct.value === ""
    ) {

        invoiceTotal.value =
            "$0.00";

        return;
    }


    const product =
        products[
            Number(
                invoiceProduct.value
            )
        ];


    const quantity =
        Number(
            invoiceQuantity.value
        );


    if (
        !product ||
        quantity < 1
    ) {

        invoiceTotal.value =
            "$0.00";

        return;
    }


    const total =
        Number(
            product.price
        ) *
        quantity;


    invoiceTotal.value =
        "$" +
        total.toFixed(2);

}


invoiceProduct.addEventListener(
    "change",
    updateInvoiceTotal
);


invoiceQuantity.addEventListener(
    "input",
    updateInvoiceTotal
);


// =========================
// CREATE INVOICE
// =========================

createInvoiceButton.addEventListener(
    "click",
    function () {

        if (!customers.length) {

            alert(
                "Add a customer first before creating an invoice."
            );

            document
                .getElementById(
                    "customers"
                )
                .scrollIntoView({
                    behavior: "smooth"
                });

            return;
        }


        if (!products.length) {

            alert(
                "Add a product first before creating an invoice."
            );

            return;
        }


        updateInvoiceCustomerOptions();

        updateInvoiceProductOptions();


        invoiceQuantity.value =
            1;


        updateInvoiceTotal();


        showForm(
            invoiceForm
        );

    }
);


cancelInvoiceButton.addEventListener(
    "click",
    function () {

        invoiceFormElement.reset();

        invoiceTotal.value =
            "$0.00";

        hideForm(
            invoiceForm
        );

    }
);


// =========================
// INVOICE NUMBER
// =========================

function getNextInvoiceNumber() {

    if (!invoices.length) {

        return "INV-0001";

    }


    const last =
        invoices[invoices.length - 1];


    const number =
        Number(
            last.number
                .replace(
                    "INV-",
                    ""
                )
        );


    return (
        "INV-" +
        String(
            number + 1
        ).padStart(
            4,
            "0"
        )
    );

}


// =========================
// CREATE
// =========================

invoiceFormElement.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const customerIndex =
            Number(
                invoiceCustomer.value
            );


        const productIndex =
            Number(
                invoiceProduct.value
            );


        const quantity =
            Number(
                invoiceQuantity.value
            );


        const customer =
            customers[
                customerIndex
            ];


        const product =
            products[
                productIndex
            ];


        if (
            !customer ||
            !product
        ) {

            alert(
                "Select a customer and product."
            );

            return;
        }


        if (
            !Number.isInteger(
                quantity
            ) ||
            quantity < 1
        ) {

            alert(
                "Enter a valid quantity."
            );

            return;
        }


        if (
            Number(
                product.stock
            ) < quantity
        ) {

            alert(
                `Not enough stock. Only ${product.stock} available.`
            );

            return;
        }


        const total =
            Number(
                product.price
            ) *
            quantity;


        const invoice = {

            number:
                getNextInvoiceNumber(),

            date:
                new Date()
                    .toISOString(),

            customer: {

                name:
                    customer.name,

                email:
                    customer.email,

                phone:
                    customer.phone

            },

            product: {

                name:
                    product.name,

                price:
                    Number(
                        product.price
                    )

            },

            quantity:
                quantity,

            total:
                total

        };


        invoices.push(
            invoice
        );


        // Invoice represents a completed sale.

        product.stock =
            Number(
                product.stock
            ) -
            quantity;


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

        renderInvoices();

        updateSaleProductOptions();

        updateInvoiceProductOptions();

        updateDashboard();


        invoiceFormElement.reset();

        invoiceTotal.value =
            "$0.00";


        hideForm(
            invoiceForm
        );


        alert(
            `${invoice.number} created successfully!`
        );


        printInvoice(
            invoices.length - 1
        );

    }
);


// =========================
// INVOICE DISPLAY
// =========================

function renderInvoices() {

    if (!invoices.length) {

        invoiceList.className =
            "empty-state";


        invoiceList.innerHTML = `
            <div>
                🧾
            </div>

            <h3>
                No invoices yet
            </h3>

            <p>
                Create your first invoice
                for a customer.
            </p>
        `;

        return;
    }


    invoiceList.className =
        "data-grid";


    invoiceList.innerHTML =
        invoices
            .slice()
            .reverse()
            .map(
                function (
                    invoice,
                    reverseIndex
                ) {

                    const index =
                        invoices.length -
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

                                ${invoice.number}

                            </h3>


                            <p>

                                Customer:
                                ${escapeHTML(
                                    invoice.customer.name
                                )}

                            </p>


                            <p>

                                Product:
                                ${escapeHTML(
                                    invoice.product.name
                                )}

                            </p>


                            <p>

                                Total:
                                $${Number(
                                    invoice.total
                                ).toFixed(2)}

                            </p>


                            <p>

                                ${formatDate(
                                    invoice.date
                                )}

                            </p>


                            <div
                                class="card-actions">


                                <button
                                    class="edit-button"
                                    onclick="printInvoice(${index})">

                                    Print

                                </button>


                                <button
                                    class="delete-button"
                                    onclick="deleteInvoice(${index})">

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
// PRINT INVOICE
// =========================

function printInvoice(
    index
) {

    const invoice =
        invoices[index];


    if (!invoice) return;


    const printWindow =
        window.open(
            "",
            "_blank",
            "width=900,height=700"
        );


    if (!printWindow) {

        alert(
            "Please allow pop-ups to print the invoice."
        );

        return;
    }


    printWindow.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <title>
                ${invoice.number}
            </title>


            <style>

                body {

                    font-family:
                        Arial,
                        sans-serif;

                    margin:
                        0;

                    padding:
                        50px;

                    color:
                        #111;

                    background:
                        white;

                }


                .invoice {

                    max-width:
                        800px;

                    margin:
                        auto;

                }


                .header {

                    display:
                        flex;

                    justify-content:
                        space-between;

                    border-bottom:
                        2px solid #111;

                    padding-bottom:
                        25px;

                    margin-bottom:
                        30px;

                }


                h1 {

                    margin:
                        0;

                    font-size:
                        32px;

                }


                .number {

                    text-align:
                        right;

                }


                .customer {

                    margin-bottom:
                        35px;

                }


                table {

                    width:
                        100%;

                    border-collapse:
                        collapse;

                    margin-top:
                        30px;

                }


                th,
                td {

                    padding:
                        14px;

                    border-bottom:
                        1px solid #ddd;

                    text-align:
                        left;

                }


                th:last-child,
                td:last-child {

                    text-align:
                        right;

                }


                .total {

                    text-align:
                        right;

                    font-size:
                        24px;

                    font-weight:
                        bold;

                    margin-top:
                        30px;

                }


                .footer {

                    margin-top:
                        80px;

                    text-align:
                        center;

                    color:
                        #777;

                }


                @media print {

                    body {

                        padding:
                            20px;

                    }

                }

            </style>

        </head>


        <body>

            <div class="invoice">


                <div class="header">

                    <div>

                        <h1>
                            BusinessOS
                        </h1>

                        <p>
                            Business Management
                        </p>

                    </div>


                    <div class="number">

                        <strong>
                            ${invoice.number}
                        </strong>

                        <br>

                        ${formatDate(
                            invoice.date
                        )}

                    </div>

                </div>



                <div class="customer">

                    <strong>
                        BILL TO
                    </strong>

                    <p>
                        ${escapeHTML(
                            invoice.customer.name
                        )}
                    </p>

                    <p>
                        ${escapeHTML(
                            invoice.customer.email
                        )}
                    </p>

                    <p>
                        ${escapeHTML(
                            invoice.customer.phone ||
                            ""
                        )}
                    </p>

                </div>



                <table>

                    <thead>

                        <tr>

                            <th>
                                Product
                            </th>

                            <th>
                                Quantity
                            </th>

                            <th>
                                Price
                            </th>

                            <th>
                                Total
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        <tr>

                            <td>
                                ${escapeHTML(
                                    invoice.product.name
                                )}
                            </td>

                            <td>
                                ${invoice.quantity}
                            </td>

                            <td>
                                $${Number(
                                    invoice.product.price
                                ).toFixed(2)}
                            </td>

                            <td>
                                $${Number(
                                    invoice.total
                                ).toFixed(2)}
                            </td>

                        </tr>

                    </tbody>

                </table>



                <div class="total">

                    Total:
                    $${Number(
                        invoice.total
                    ).toFixed(2)}

                </div>



                <div class="footer">

                    Thank you for your business.

                    <br>

                    Powered by BusinessOS

                </div>


            </div>


            <script>

                window.onload =
                    function () {

                        window.print();

                    };

            <\/script>

        </body>

        </html>

    `);


    printWindow.document.close();

}


// =========================
// DELETE INVOICE
// =========================

function deleteInvoice(
    index
) {

    if (
        !confirm(
            "Delete this invoice?"
        )
    ) {

        return;
    }


    const invoice =
        invoices[index];


    if (invoice) {

        const product =
            products.find(
                function (
                    item
                ) {

                    return item.name ===
                        invoice.product.name;

                }
            );


        if (product) {

            product.stock +=
                Number(
                    invoice.quantity
                );

        }


        // Remove corresponding sale

        const saleIndex =
            sales.findIndex(
                function (
                    sale
                ) {

                    return (
                        sale.product ===
                            invoice.product.name &&
                        Number(
                            sale.quantity
                        ) ===
                            Number(
                                invoice.quantity
                            )
                    );

                }
            );


        if (
            saleIndex !== -1
        ) {

            sales.splice(
                saleIndex,
                1
            );

        }

    }


    invoices.splice(
        index,
        1
    );


    saveData();

    renderProducts();

    renderSales();

    renderInvoices();

    updateSaleProductOptions();

    updateInvoiceProductOptions();

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

        invoices = [];


        saveData();


        renderProducts();

        renderCustomers();

        renderSales();

        renderInvoices();


        updateSaleProductOptions();

        updateInvoiceProductOptions();

        updateInvoiceCustomerOptions();


        updateDashboard();


        productFormElement.reset();

        customerFormElement.reset();

        saleFormElement.reset();

        invoiceFormElement.reset();


        saleTotal.value =
            "$0.00";

        invoiceTotal.value =
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

        hideForm(
            invoiceForm
        );


        alert(
            "BusinessOS has been reset successfully."
        );

    }
);


// =========================
// HELPERS
// =========================

function escapeHTML(
    value
) {

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


function formatDate(
    date
) {

    if (!date) return "";


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

renderInvoices();

updateSaleProductOptions();

updateInvoiceProductOptions();

updateInvoiceCustomerOptions();

updateDashboard();
