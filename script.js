// ==========================================
// BUSINESSOS V6
// COMPLETE APPLICATION
// ==========================================


// ==========================================
// DATA
// ==========================================

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


let invoices =
    JSON.parse(
        localStorage.getItem("businessOSInvoices")
    ) || [];


// ==========================================
// ELEMENTS
// ==========================================

const menuButton =
    document.getElementById("menuButton");

const navigation =
    document.getElementById("navigation");


const revenueElement =
    document.getElementById("revenue");

const productCountElement =
    document.getElementById("productCount");

const customerCountElement =
    document.getElementById("customerCount");

const saleCountElement =
    document.getElementById("saleCount");


const averageSaleElement =
    document.getElementById("averageSale");

const unitsInStockElement =
    document.getElementById("unitsInStock");

const inventoryValueElement =
    document.getElementById("inventoryValue");

const bestSellerElement =
    document.getElementById("bestSeller");


const productList =
    document.getElementById("productList");

const customerList =
    document.getElementById("customerList");

const salesList =
    document.getElementById("salesList");

const invoiceList =
    document.getElementById("invoiceList");


const topProductsElement =
    document.getElementById("topProducts");

const inventoryAlertsElement =
    document.getElementById("inventoryAlerts");

const salesOverviewElement =
    document.getElementById("salesOverview");


const revenueChart =
    document.getElementById("revenueChart");


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
    document.getElementById("productFormElement");

const customerFormElement =
    document.getElementById("customerFormElement");

const saleFormElement =
    document.getElementById("saleFormElement");

const invoiceFormElement =
    document.getElementById("invoiceFormElement");


// Buttons

const addProductButton =
    document.getElementById("addProductButton");

const addCustomerButton =
    document.getElementById("addCustomerButton");

const addSaleButton =
    document.getElementById("addSaleButton");

const createInvoiceButton =
    document.getElementById("createInvoiceButton");


const cancelProductButton =
    document.getElementById("cancelProductButton");

const cancelCustomerButton =
    document.getElementById("cancelCustomerButton");

const cancelSaleButton =
    document.getElementById("cancelSaleButton");

const cancelInvoiceButton =
    document.getElementById("cancelInvoiceButton");


const resetDataButton =
    document.getElementById("resetDataButton");


// Sale fields

const saleProduct =
    document.getElementById("saleProduct");

const saleQuantity =
    document.getElementById("saleQuantity");

const saleTotal =
    document.getElementById("saleTotal");


// Invoice fields

const invoiceCustomer =
    document.getElementById("invoiceCustomer");

const invoiceProduct =
    document.getElementById("invoiceProduct");

const invoiceQuantity =
    document.getElementById("invoiceQuantity");

const invoiceTotal =
    document.getElementById("invoiceTotal");


// ==========================================
// SAVE DATA
// ==========================================

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


// ==========================================
// MOBILE MENU
// ==========================================

menuButton.addEventListener(
    "click",
    function () {

        navigation.classList.toggle("show");

    }
);


navigation
    .querySelectorAll("a")
    .forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    navigation.classList.remove("show");

                }
            );

        }
    );


// ==========================================
// FORM HELPERS
// ==========================================

function showForm(form) {

    form.classList.remove("hidden");

    form.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


function hideForm(form) {

    form.classList.add("hidden");

}


// ==========================================
// DASHBOARD
// ==========================================

function updateDashboard() {

    const revenue =
        sales.reduce(
            function (total, sale) {

                return total +
                    Number(sale.amount || 0);

            },
            0
        );


    revenueElement.textContent =
        "$" + revenue.toFixed(2);


    productCountElement.textContent =
        products.length;


    customerCountElement.textContent =
        customers.length;


    saleCountElement.textContent =
        sales.length;


    updateAnalytics();

    renderRevenueChart();
}


// ==========================================
// ANALYTICS
// ==========================================

function updateAnalytics() {

    const revenue =
        sales.reduce(
            function (total, sale) {

                return total +
                    Number(sale.amount || 0);

            },
            0
        );


    const average =
        sales.length
            ? revenue / sales.length
            : 0;


    averageSaleElement.textContent =
        "$" + average.toFixed(2);


    const stock =
        products.reduce(
            function (total, product) {

                return total +
                    Number(product.stock || 0);

            },
            0
        );


    unitsInStockElement.textContent =
        stock;


    const inventoryValue =
        products.reduce(
            function (total, product) {

                return total +
                    Number(product.price || 0) *
                    Number(product.stock || 0);

            },
            0
        );


    inventoryValueElement.textContent =
        "$" + inventoryValue.toFixed(2);


    const productSales = {};


    sales.forEach(
        function (sale) {

            if (
                !productSales[sale.product]
            ) {

                productSales[sale.product] = 0;

            }


            productSales[sale.product] +=
                Number(sale.quantity || 0);

        }
    );


    const sorted =
        Object.entries(productSales)
            .sort(
                function (a, b) {

                    return b[1] - a[1];

                }
            );


    bestSellerElement.textContent =
        sorted.length
            ? sorted[0][0]
            : "None yet";


    renderTopProducts(sorted);

    renderInventoryAlerts();

    renderSalesOverview(revenue);

}


// ==========================================
// TOP PRODUCTS
// ==========================================

function renderTopProducts(sorted) {

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
                function (item, index) {

                    return `

                        <div class="analytics-row">

                            <span>
                                <strong>
                                    #${index + 1}
                                </strong>

                                ${escapeHTML(item[0])}
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


// ==========================================
// INVENTORY ALERTS
// ==========================================

function renderInventoryAlerts() {

    const lowStock =
        products.filter(
            function (product) {

                return Number(product.stock) <= 3;

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
                function (product) {

                    const message =
                        Number(product.stock) === 0
                            ? "OUT OF STOCK"
                            : `${product.stock} left`;


                    return `

                        <div class="analytics-row">

                            <span>
                                📦
                                ${escapeHTML(product.name)}
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


// ==========================================
// SALES OVERVIEW
// ==========================================

function renderSalesOverview(revenue) {

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
            function (total, sale) {

                return total +
                    Number(sale.quantity || 0);

            },
            0
        );


    const largestSale =
        Math.max(
            ...sales.map(
                function (sale) {

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
                    revenue / sales.length
                ).toFixed(2)}
            </strong>

        </div>


        <div class="analytics-row">

            <span>
                Largest sale
            </span>

            <strong>
                $${largestSale.toFixed(2)}
            </strong>

        </div>

    `;
}


// ==========================================
// REVENUE CHART
// ==========================================

function renderRevenueChart() {

    if (!revenueChart) return;


    const ctx =
        revenueChart.getContext("2d");


    const width =
        revenueChart.clientWidth || 600;

    const height =
        300;


    const pixelRatio =
        window.devicePixelRatio || 1;


    revenueChart.width =
        width * pixelRatio;

    revenueChart.height =
        height * pixelRatio;


    ctx.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
    );


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    const dailyRevenue = {};


    sales.forEach(
        function (sale) {

            const date =
                new Date(sale.date)
                    .toLocaleDateString(
                        "en-US",
                        {
                            month: "short",
                            day: "numeric"
                        }
                    );


            if (
                !dailyRevenue[date]
            ) {

                dailyRevenue[date] = 0;

            }


            dailyRevenue[date] +=
                Number(sale.amount || 0);

        }
    );


    const labels =
        Object.keys(dailyRevenue);


    const values =
        Object.values(dailyRevenue);


    if (!labels.length) {

        ctx.fillStyle =
            "#9ca3af";

        ctx.font =
            "14px Arial";

        ctx.textAlign =
            "center";

        ctx.fillText(
            "Your revenue chart will appear here after your first sale.",
            width / 2,
            height / 2
        );

        return;
    }


    const padding = 45;


    const chartWidth =
        width - padding * 2;

    const chartHeight =
        height - padding * 2;


    const maxValue =
        Math.max(
            ...values,
            1
        );


    // Grid lines

    ctx.strokeStyle =
        "#e5e7eb";

    ctx.lineWidth =
        1;


    for (
        let i = 0;
        i <= 4;
        i++
    ) {

        const y =
            padding +
            (
                chartHeight *
                i /
                4
            );


        ctx.beginPath();

        ctx.moveTo(
            padding,
            y
        );

        ctx.lineTo(
            width - padding,
            y
        );

        ctx.stroke();


        const value =
            maxValue *
            (
                1 - i / 4
            );


        ctx.fillStyle =
            "#9ca3af";

        ctx.font =
            "11px Arial";

        ctx.textAlign =
            "left";

        ctx.fillText(
            "$" + Math.round(value),
            5,
            y + 4
        );

    }


    // Revenue line

    ctx.beginPath();


    values.forEach(
        function (value, index) {

            const x =
                labels.length === 1
                    ? width / 2
                    : padding +
                      (
                        chartWidth *
                        index /
                        (labels.length - 1)
                      );


            const y =
                padding +
                chartHeight -
                (
                    value /
                    maxValue
                ) *
                chartHeight;


            if (index === 0) {

                ctx.moveTo(
                    x,
                    y
                );

            } else {

                ctx.lineTo(
                    x,
                    y
                );

            }

        }
    );


    ctx.strokeStyle =
        "#6366f1";

    ctx.lineWidth =
        3;

    ctx.stroke();


    // Points

    values.forEach(
        function (value, index) {

            const x =
                labels.length === 1
                    ? width / 2
                    : padding +
                      (
                        chartWidth *
                        index /
                        (labels.length - 1)
                      );


            const y =
                padding +
                chartHeight -
                (
                    value /
                    maxValue
                ) *
                chartHeight;


            ctx.beginPath();

            ctx.arc(
                x,
                y,
                5,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                "#6366f1";

            ctx.fill();


            ctx.fillStyle =
                "#6b7280";

            ctx.font =
                "11px Arial";

            ctx.textAlign =
                "center";


            ctx.fillText(
                labels[index],
                x,
                height - 12
            );

        }
    );

}


// ==========================================
// PRODUCTS
// ==========================================

function renderProducts() {

    if (!products.length) {

        productList.className =
            "empty-state";


        productList.innerHTML = `

            <div class="empty-icon">
                📦
            </div>

            <h3>
                No products yet
            </h3>

            <p>
                Add your first product to start managing inventory.
            </p>

        `;

        return;
    }


    productList.className =
        "data-grid";


    productList.innerHTML =
        products
            .map(
                function (product, index) {

                    let status =
                        "IN STOCK";


                    if (
                        Number(product.stock) === 0
                    ) {

                        status =
                            "OUT OF STOCK";

                    } else if (
                        Number(product.stock) <= 3
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
                                ${escapeHTML(product.name)}
                            </h3>

                            <p>
                                Price:
                                $${Number(product.price).toFixed(2)}
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
                                    onclick="editProduct(${index})"
                                >
                                    Edit
                                </button>

                                <button
                                    class="delete-button"
                                    onclick="deleteProduct(${index})"
                                >
                                    Delete
                                </button>

                            </div>

                        </article>

                    `;

                }
            )
            .join("");
}


// Add product

addProductButton.addEventListener(
    "click",
    function () {

        showForm(productForm);

    }
);


cancelProductButton.addEventListener(
    "click",
    function () {

        productFormElement.reset();

        hideForm(productForm);

    }
);


productFormElement.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            document
                .getElementById("productName")
                .value
                .trim();


        const price =
            Number(
                document
                    .getElementById("productPrice")
                    .value
            );


        const stock =
            Number(
                document
                    .getElementById("productStock")
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
                "Enter a valid price."
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

            name: name,

            price: price,

            stock: stock

        });


        saveData();

        renderProducts();

        updateSaleProductOptions();

        updateInvoiceProductOptions();

        updateDashboard();


        productFormElement.reset();

        hideForm(productForm);

    }
);


// Edit product

function editProduct(index) {

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

        name: name.trim(),

        price: price,

        stock: stock

    };


    saveData();

    renderProducts();

    updateSaleProductOptions();

    updateInvoiceProductOptions();

    updateDashboard();

}


// Delete product

function deleteProduct(index) {

    if (
        !confirm(
            "Delete this product?"
        )
    ) return;


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


// ==========================================
// CUSTOMERS
// ==========================================

function renderCustomers() {

    if (!customers.length) {

        customerList.className =
            "empty-state";


        customerList.innerHTML = `

            <div class="empty-icon">
                👥
            </div>

            <h3>
                No customers yet
            </h3>

            <p>
                Add your first customer to start building your customer list.
            </p>

        `;

        return;
    }


    customerList.className =
        "data-grid";


    customerList.innerHTML =
        customers
            .map(
                function (customer, index) {

                    return `

                        <article class="data-card">

                            <div class="data-icon">
                                👤
                            </div>

                            <h3>
                                ${escapeHTML(customer.name)}
                            </h3>

                            <p>
                                ${escapeHTML(customer.email)}
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
                                    onclick="deleteCustomer(${index})"
                                >
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

        showForm(customerForm);

    }
);


cancelCustomerButton.addEventListener(
    "click",
    function () {

        customerFormElement.reset();

        hideForm(customerForm);

    }
);


customerFormElement.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            document
                .getElementById("customerName")
                .value
                .trim();


        const email =
            document
                .getElementById("customerEmail")
                .value
                .trim();


        const phone =
            document
                .getElementById("customerPhone")
                .value
                .trim();


        if (!name || !email) {

            alert(
                "Enter the customer's name and email."
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

        updateInvoiceCustomerOptions();

        updateDashboard();


        customerFormElement.reset();

        hideForm(customerForm);

    }
);


function deleteCustomer(index) {

    if (
        !confirm(
            "Delete this customer?"
        )
    ) return;


    customers.splice(
        index,
        1
    );


    saveData();

    renderCustomers();

    updateInvoiceCustomerOptions();

    updateDashboard();

}


// ==========================================
// SALES
// ==========================================

function updateSaleProductOptions() {

    saleProduct.innerHTML = `

        <option value="">
            Select a product
        </option>

    `;


    products.forEach(
        function (product, index) {

            const option =
                document.createElement("option");


            option.value =
                index;


            option.textContent =
                `${product.name} — $${Number(
                    product.price
                ).toFixed(2)} — Stock: ${product.stock}`;


            option.disabled =
                Number(product.stock) <= 0;


            saleProduct.appendChild(
                option
            );

        }
    );


    updateSaleTotal();
}


function updateSaleTotal() {

    if (
        saleProduct.value === ""
    ) {

        saleTotal.value =
            "$0.00";

        return;
    }


    const product =
        products[
            Number(saleProduct.value)
        ];


    const quantity =
        Number(saleQuantity.value);


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
            Number(product.price) *
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

        showForm(saleForm);

        updateSaleTotal();

    }
);


cancelSaleButton.addEventListener(
    "click",
    function () {

        saleFormElement.reset();

        saleTotal.value =
            "$0.00";

        hideForm(saleForm);

    }
);


saleFormElement.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const productIndex =
            Number(saleProduct.value);


        const quantity =
            Number(saleQuantity.value);


        const product =
            products[productIndex];


        if (!product) {

            alert(
                "Select a product."
            );

            return;
        }


        if (
            !Number.isInteger(quantity) ||
            quantity < 1
        ) {

            alert(
                "Enter a valid quantity."
            );

            return;
        }


        if (
            Number(product.stock) <
            quantity
        ) {

            alert(
                `Only ${product.stock} units are available.`
            );

            return;
        }


        const total =
            Number(product.price) *
            quantity;


        product.stock =
            Number(product.stock) -
            quantity;


        sales.push({

            product:
                product.name,

            quantity:
                quantity,

            amount:
                total,

            date:
                new Date().toISOString()

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

        hideForm(saleForm);


        alert(
            `Sale recorded!\n\n${quantity} × ${product.name}\nTotal: $${total.toFixed(2)}`
        );

    }
);


// ==========================================
// SALES DISPLAY
// ==========================================

function renderSales() {

    if (!sales.length) {

        salesList.className =
            "empty-state";


        salesList.innerHTML = `

            <div class="empty-icon">
                🧾
            </div>

            <h3>
                No sales yet
            </h3>

            <p>
                Your recorded sales will appear here.
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
                function (sale, reverseIndex) {

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
                                ${escapeHTML(sale.product)}
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
                                ${formatDate(sale.date)}
                            </p>

                            <div class="card-actions">

                                <button
                                    class="delete-button"
                                    onclick="deleteSale(${index})"
                                >
                                    Delete
                                </button>

                            </div>

                        </article>

                    `;

                }
            )
            .join("");
}


function deleteSale(index) {

    if (
        !confirm(
            "Delete this sale?"
        )
    ) return;


    const sale =
        sales[index];


    if (sale) {

        const product =
            products.find(
                function (item) {

                    return item.name ===
                        sale.product;

                }
            );


        if (product) {

            product.stock +=
                Number(sale.quantity);

        }

    }


    sales.splice(
        index,
        1
    );


    saveData();

    renderProducts();

    renderSales();

    updateDashboard();

}


// ==========================================
// INVOICE DROPDOWNS
// ==========================================

function updateInvoiceCustomerOptions() {

    invoiceCustomer.innerHTML = `

        <option value="">
            Select a customer
        </option>

    `;


    customers.forEach(
        function (customer, index) {

            const option =
                document.createElement("option");


            option.value =
                index;


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
        function (product, index) {

            const option =
                document.createElement("option");


            option.value =
                index;


            option.textContent =
                `${product.name} — $${Number(
                    product.price
                ).toFixed(2)} — Stock: ${product.stock}`;


            option.disabled =
                Number(product.stock) <= 0;


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
            Number(invoiceProduct.value)
        ];


    const quantity =
        Number(invoiceQuantity.value);


    if (
        !product ||
        quantity < 1
    ) {

        invoiceTotal.value =
            "$0.00";

        return;
    }


    invoiceTotal.value =
        "$" +
        (
            Number(product.price) *
            quantity
        ).toFixed(2);

}


invoiceProduct.addEventListener(
    "change",
    updateInvoiceTotal
);


invoiceQuantity.addEventListener(
    "input",
    updateInvoiceTotal
);


// ==========================================
// INVOICES
// ==========================================

createInvoiceButton.addEventListener(
    "click",
    function () {

        if (!customers.length) {

            alert(
                "Add a customer first."
            );

            document
                .getElementById("customers")
                .scrollIntoView({
                    behavior: "smooth"
                });

            return;
        }


        if (!products.length) {

            alert(
                "Add a product first."
            );

            return;
        }


        updateInvoiceCustomerOptions();

        updateInvoiceProductOptions();

        invoiceQuantity.value =
            1;

        updateInvoiceTotal();

        showForm(invoiceForm);

    }
);


cancelInvoiceButton.addEventListener(
    "click",
    function () {

        invoiceFormElement.reset();

        invoiceTotal.value =
            "$0.00";

        hideForm(invoiceForm);

    }
);


function getNextInvoiceNumber() {

    if (!invoices.length) {

        return "INV-0001";

    }


    const last =
        invoices[invoices.length - 1];


    const number =
        Number(
            String(last.number)
                .replace("INV-", "")
        );


    return (
        "INV-" +
        String(number + 1)
            .padStart(4, "0")
    );

}


invoiceFormElement.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const customer =
            customers[
                Number(invoiceCustomer.value)
            ];


        const product =
            products[
                Number(invoiceProduct.value)
            ];


        const quantity =
            Number(invoiceQuantity.value);


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
            !Number.isInteger(quantity) ||
            quantity < 1
        ) {

            alert(
                "Enter a valid quantity."
            );

            return;
        }


        if (
            Number(product.stock) <
            quantity
        ) {

            alert(
                `Only ${product.stock} units are available.`
            );

            return;
        }


        const total =
            Number(product.price) *
            quantity;


        const invoice = {

            number:
                getNextInvoiceNumber(),

            date:
                new Date().toISOString(),

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
                    Number(product.price)

            },

            quantity:
                quantity,

            total:
                total

        };


        invoices.push(invoice);


        product.stock =
            Number(product.stock) -
            quantity;


        sales.push({

            product:
                product.name,

            quantity:
                quantity,

            amount:
                total,

            date:
                new Date().toISOString()

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

        hideForm(invoiceForm);


        alert(
            `${invoice.number} created successfully!`
        );


        printInvoice(
            invoices.length - 1
        );

    }
);


// ==========================================
// INVOICE DISPLAY
// ==========================================

function renderInvoices() {

    if (!invoices.length) {

        invoiceList.className =
            "empty-state";


        invoiceList.innerHTML = `

            <div class="empty-icon">
                🧾
            </div>

            <h3>
                No invoices yet
            </h3>

            <p>
                Create your first invoice for a customer.
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
                function (invoice, reverseIndex) {

                    const index =
                        invoices.length -
                        1 -
                        reverseIndex;


                    return `

                        <article class="data-card">

                            <div class="data-icon">
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
                                ${formatDate(invoice.date)}
                            </p>

                            <div class="card-actions">

                                <button
                                    class="edit-button"
                                    onclick="printInvoice(${index})"
                                >
                                    Print
                                </button>

                                <button
                                    class="delete-button"
                                    onclick="deleteInvoice(${index})"
                                >
                                    Delete
                                </button>

                            </div>

                        </article>

                    `;

                }
            )
            .join("");
}


// ==========================================
// PRINT INVOICE
// ==========================================

function printInvoice(index) {

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
            "Please allow pop-ups to print invoices."
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

                    padding:
                        50px;

                    color:
                        #111;

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
                        34px;

                }


                .invoice-number {

                    text-align:
                        right;

                }


                .customer {

                    margin-bottom:
                        30px;

                }


                table {

                    width:
                        100%;

                    border-collapse:
                        collapse;

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
                        26px;

                    font-weight:
                        bold;

                    margin-top:
                        30px;

                }


                .footer {

                    text-align:
                        center;

                    color:
                        #777;

                    margin-top:
                        80px;

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


                    <div class="invoice-number">

                        <strong>
                            ${invoice.number}
                        </strong>

                        <br>

                        ${formatDate(invoice.date)}

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
                            invoice.customer.phone || ""
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

                    <br><br>

                    Powered by BusinessOS.

                </div>

            </div>


            <script>

                window.onload = function () {

                    window.print();

                };

            <\/script>

        </body>

        </html>

    `);


    printWindow.document.close();

}


// ==========================================
// DELETE INVOICE
// ==========================================

function deleteInvoice(index) {

    if (
        !confirm(
            "Delete this invoice?"
        )
    ) return;


    const invoice =
        invoices[index];


    if (invoice) {

        const product =
            products.find(
                function (item) {

                    return item.name ===
                        invoice.product.name;

                }
            );


        if (product) {

            product.stock +=
                Number(invoice.quantity);

        }


        const saleIndex =
            sales.findIndex(
                function (sale) {

                    return (
                        sale.product ===
                            invoice.product.name &&
                        Number(sale.quantity) ===
                            Number(invoice.quantity)
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

    updateDashboard();

}


// ==========================================
// RESET BUSINESS
// ==========================================

resetDataButton.addEventListener(
    "click",
    function () {

        const confirmed =
            confirm(
                "WARNING: This will delete ALL BusinessOS data. Continue?"
            );


        if (!confirmed) return;


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


        alert(
            "BusinessOS has been reset."
        );

    }
);


// ==========================================
// HELPERS
// ==========================================

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

    if (!date) return "";


    return new Date(date)
        .toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );

}


// ==========================================
// INITIALIZE
// ==========================================

renderProducts();

renderCustomers();

renderSales();

renderInvoices();

updateSaleProductOptions();

updateInvoiceProductOptions();

updateInvoiceCustomerOptions();

updateDashboard();


// Redraw chart when window changes size

window.addEventListener(
    "resize",
    renderRevenueChart
);
