// =========================
// BUSINESSOS V4
// ANALYTICS + INVENTORY + SALES
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


// Analytics elements

const averageSaleElement =
    document.getElementById(
        "averageSale"
    );

const unitsInStockElement =
    document.getElementById(
        "unitsInStock"
    );

const inventoryValueElement =
    document.getElementById(
        "inventoryValue"
    );

const bestSellerElement =
    document.getElementById(
        "bestSeller"
    );

const topProductsElement =
    document.getElementById(
        "topProducts"
    );

const inventoryAlertsElement =
    document.getElementById(
        "inventoryAlerts"
    );

const salesOverviewElement =
    document.getElementById(
        "salesOverview"
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


    // Average sale

    const averageSale =
        sales.length > 0
            ? revenue / sales.length
            : 0;


    averageSaleElement.textContent =
        "$" +
        averageSale.toFixed(2);


    // Units in stock

    const unitsInStock =
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
        unitsInStock;


    // Inventory value

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


    // Best seller

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


    const sortedProducts =
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


    if (
        sortedProducts.length > 0
    ) {

        bestSellerElement.textContent =
            sortedProducts[0][0];

    } else {

        bestSellerElement.textContent =
            "None yet";

    }


    renderTopProducts(
        sortedProducts
    );


    renderInventoryAlerts();


    renderSalesOverview(
        revenue
    );

}


// =========================
// TOP PRODUCTS
// =========================

function renderTopProducts(
    sortedProducts
) {

    if (
        sortedProducts.length === 0
    ) {

        topProductsElement.innerHTML = `

            <p class="muted">
                No sales data yet.
            </p>

        `;

        return;

    }


    topProductsElement.innerHTML =
        sortedProducts
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

                                ${item[1]}
                                sold

                            </strong>

                        </div>

                    `;

                }
            )
            .join("");

}


// =========================
// INVENTORY ALERTS
// =========================

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


    if (
        lowStock.length === 0
    ) {

        inventoryAlertsElement.innerHTML = `

            <p class="muted">

                ✅ All products have
                healthy stock levels.

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

                    const message =
                        Number(
                            product.stock
                        ) === 0
                            ? "OUT OF STOCK"
                            : `${product.stock} left`;


                    return `

                        <div
                            class="analytics-row">

                            <span>

                                📦

                                ${escapeHTML(
                                    product.name
                                )}

                            </span>


                            <strong>

                                ${message}

                            </strong>

                        </div>

                    `;

                }
            )
            .join("");

}


// =========================
// SALES OVERVIEW
// =========================

function renderSalesOverview(
    revenue
) {

    if (
        sales.length === 0
    ) {

        salesOverviewElement.innerHTML = `

            <p class="muted">

                No sales data yet.

            </p>

        `;

        return;

    }


    const totalUnitsSold =
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


    const highestSale =
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
                ${totalUnitsSold}
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
                $${highestSale.toFixed(2)}
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

    if (!form) return;


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

    if (!form) return;


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
                                ${status}

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
            )
            .join("");

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

    updateDashboard();

}


// =========================
// DELETE PRODUCT
// =========================

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
        customers
            .map(
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
                String(
                    index
                );


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


    const total =
        Number(
            product.price
        ) *
        quantity;


    saleTotal.value =
        "$" +
        total.toFixed(2);

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
// RENDER SALES
// =========================

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

            product.stock =
                Number(
                    product.stock
                ) +
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

updateSaleProductOptions();

updateDashboard();
