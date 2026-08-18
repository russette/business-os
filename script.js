/* =========================================================
   BUSINESSOS
   Complete Business Management System
   ========================================================= */


/* =========================================================
   DATA
   ========================================================= */

let products = JSON.parse(localStorage.getItem("businessOSProducts")) || [];

let customers = JSON.parse(localStorage.getItem("businessOSCustomers")) || [];

let sales = JSON.parse(localStorage.getItem("businessOSSales")) || [];

let invoices = JSON.parse(localStorage.getItem("businessOSInvoices")) || [];


/* =========================================================
   SAVE DATA
   ========================================================= */

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


/* =========================================================
   MONEY
   ========================================================= */

function money(amount) {

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(Number(amount) || 0);
}


/* =========================================================
   ID GENERATOR
   ========================================================= */

function createId() {

    return Date.now().toString() +
        Math.random().toString(36).substring(2, 8);
}


/* =========================================================
   SCROLL
   ========================================================= */

function scrollToSection(id) {

    const section = document.getElementById(id);

    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }
}


/* =========================================================
   PRODUCTS
   ========================================================= */

function renderProducts() {

    const container =
        document.getElementById("productsList");

    if (!container) return;

    if (products.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    📦
                </div>

                <h3>No products yet</h3>

                <p>
                    Add your first product to start
                    managing your inventory.
                </p>

            </div>
        `;

        return;
    }


    container.innerHTML = products.map(product => {

        const status =
            Number(product.stock) > 0
                ? "IN STOCK"
                : "OUT OF STOCK";


        return `
            <div class="product-card">

                <h3>${escapeHTML(product.name)}</h3>

                <p class="product-price">
                    ${money(product.price)}
                </p>

                <p>
                    Stock: ${product.stock}
                </p>

                <span class="status">
                    ${status}
                </span>

                <div class="product-actions">

                    <button
                        class="edit-btn"
                        onclick="editProduct('${product.id}')">

                        Edit

                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteProduct('${product.id}')">

                        Delete

                    </button>

                </div>

            </div>
        `;

    }).join("");
}


/* =========================================================
   PRODUCT MODAL
   ========================================================= */

function openProductModal(productId = null) {

    const modal =
        document.getElementById("productModal");

    const title =
        document.getElementById("productModalTitle");

    const idInput =
        document.getElementById("productId");

    const nameInput =
        document.getElementById("productName");

    const priceInput =
        document.getElementById("productPrice");

    const stockInput =
        document.getElementById("productStock");


    if (!modal) return;


    if (productId) {

        const product =
            products.find(p => p.id === productId);

        if (!product) return;

        title.textContent = "Edit Product";

        idInput.value = product.id;

        nameInput.value = product.name;

        priceInput.value = product.price;

        stockInput.value = product.stock;

    } else {

        title.textContent = "Add Product";

        idInput.value = "";

        nameInput.value = "";

        priceInput.value = "";

        stockInput.value = "";

    }


    modal.classList.add("active");

    setTimeout(() => {
        nameInput.focus();
    }, 100);
}


function closeProductModal() {

    const modal =
        document.getElementById("productModal");

    if (modal) {

        modal.classList.remove("active");

    }
}


function editProduct(id) {

    openProductModal(id);
}


/* =========================================================
   SAVE PRODUCT
   ========================================================= */

const productForm =
    document.getElementById("productForm");

if (productForm) {

    productForm.addEventListener("submit", function(event) {

        event.preventDefault();


        const id =
            document.getElementById("productId").value;

        const name =
            document.getElementById("productName").value.trim();

        const price =
            Number(document.getElementById("productPrice").value);

        const stock =
            Number(document.getElementById("productStock").value);


        if (!name) {

            alert("Please enter a product name.");

            return;
        }


        if (price < 0 || stock < 0) {

            alert("Price and stock cannot be negative.");

            return;
        }


        if (id) {

            const product =
                products.find(p => p.id === id);

            if (product) {

                product.name = name;

                product.price = price;

                product.stock = stock;

            }

        } else {

            products.push({

                id: createId(),

                name: name,

                price: price,

                stock: stock

            });

        }


        saveData();

        renderAll();

        closeProductModal();

    });

}


/* =========================================================
   DELETE PRODUCT
   ========================================================= */

function deleteProduct(id) {

    const product =
        products.find(p => p.id === id);

    if (!product) return;


    const confirmed =
        confirm(
            `Delete "${product.name}"?`
        );


    if (!confirmed) return;


    products =
        products.filter(p => p.id !== id);


    saveData();

    renderAll();
}


/* =========================================================
   CUSTOMERS
   ========================================================= */

function renderCustomers() {

    const container =
        document.getElementById("customersList");

    if (!container) return;


    if (customers.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    👥
                </div>

                <h3>No customers yet</h3>

                <p>
                    Add your first customer to start
                    building your customer list.
                </p>

            </div>
        `;

        return;
    }


    container.innerHTML = customers.map(customer => {

        return `
            <div class="customer-card">

                <h3>
                    ${escapeHTML(customer.name)}
                </h3>

                ${
                    customer.email
                        ? `<p>📧 ${escapeHTML(customer.email)}</p>`
                        : ""
                }

                ${
                    customer.phone
                        ? `<p>📱 ${escapeHTML(customer.phone)}</p>`
                        : ""
                }

                <div class="product-actions">

                    <button
                        class="delete-btn"
                        onclick="deleteCustomer('${customer.id}')">

                        Delete

                    </button>

                </div>

            </div>
        `;

    }).join("");
}


/* =========================================================
   CUSTOMER MODAL
   ========================================================= */

function openCustomerModal() {

    const modal =
        document.getElementById("customerModal");

    if (!modal) return;


    document.getElementById("customerForm").reset();

    modal.classList.add("active");


    setTimeout(() => {

        document
            .getElementById("customerName")
            .focus();

    }, 100);
}


function closeCustomerModal() {

    const modal =
        document.getElementById("customerModal");

    if (modal) {

        modal.classList.remove("active");

    }
}


/* =========================================================
   SAVE CUSTOMER
   ========================================================= */

const customerForm =
    document.getElementById("customerForm");

if (customerForm) {

    customerForm.addEventListener("submit", function(event) {

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


        if (!name) {

            alert("Please enter the customer's name.");

            return;
        }


        customers.push({

            id: createId(),

            name: name,

            email: email,

            phone: phone

        });


        saveData();

        renderAll();

        closeCustomerModal();

    });

}


/* =========================================================
   DELETE CUSTOMER
   ========================================================= */

function deleteCustomer(id) {

    const customer =
        customers.find(c => c.id === id);

    if (!customer) return;


    if (
        !confirm(
            `Delete customer "${customer.name}"?`
        )
    ) return;


    customers =
        customers.filter(c => c.id !== id);


    saveData();

    renderAll();
}


/* =========================================================
   SALES MODAL
   ========================================================= */

function openSaleModal() {

    const modal =
        document.getElementById("saleModal");

    if (!modal) return;


    const select =
        document.getElementById("saleProduct");


    select.innerHTML = `
        <option value="">
            Select a product
        </option>
    `;


    products.forEach(product => {

        select.innerHTML += `
            <option value="${product.id}">
                ${escapeHTML(product.name)}
                — ${money(product.price)}
                (${product.stock} in stock)
            </option>
        `;

    });


    document
        .getElementById("saleQuantity")
        .value = 1;


    updateSaleTotal();


    modal.classList.add("active");
}


function closeSaleModal() {

    const modal =
        document.getElementById("saleModal");

    if (modal) {

        modal.classList.remove("active");

    }
}


/* =========================================================
   SALE TOTAL
   ========================================================= */

function updateSaleTotal() {

    const productId =
        document.getElementById("saleProduct")?.value;

    const quantity =
        Number(
            document.getElementById("saleQuantity")?.value
        ) || 0;


    const product =
        products.find(p => p.id === productId);


    const total =
        product
            ? product.price * quantity
            : 0;


    const totalElement =
        document.getElementById("saleTotal");


    if (totalElement) {

        totalElement.textContent =
            money(total);

    }
}


document
    .getElementById("saleProduct")
    ?.addEventListener(
        "change",
        updateSaleTotal
    );


document
    .getElementById("saleQuantity")
    ?.addEventListener(
        "input",
        updateSaleTotal
    );


/* =========================================================
   SAVE SALE
   ========================================================= */

const saleForm =
    document.getElementById("saleForm");

if (saleForm) {

    saleForm.addEventListener("submit", function(event) {

        event.preventDefault();


        const productId =
            document.getElementById("saleProduct").value;

        const quantity =
            Number(
                document.getElementById("saleQuantity").value
            );


        const product =
            products.find(p => p.id === productId);


        if (!product) {

            alert("Please select a product.");

            return;
        }


        if (quantity <= 0) {

            alert("Quantity must be at least 1.");

            return;
        }


        if (quantity > Number(product.stock)) {

            alert(
                `Only ${product.stock} units of ${product.name} are in stock.`
            );

            return;
        }


        const total =
            product.price * quantity;


        sales.push({

            id: createId(),

            productId: product.id,

            productName: product.name,

            quantity: quantity,

            total: total,

            date: new Date().toISOString()

        });


        product.stock -= quantity;


        saveData();

        renderAll();

        closeSaleModal();

    });

}


/* =========================================================
   SALES LIST
   ========================================================= */

function renderSales() {

    const container =
        document.getElementById("salesList");

    if (!container) return;


    if (sales.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    🧾
                </div>

                <h3>No sales yet</h3>

                <p>
                    Your recorded sales will appear here.
                </p>

            </div>
        `;

        return;
    }


    const sortedSales =
        [...sales].reverse();


    container.innerHTML =
        sortedSales.map(sale => {

            return `
                <div class="sale-card">

                    <div class="sale-info">

                        <div class="sale-icon">
                            🧾
                        </div>

                        <div>

                            <strong>
                                ${escapeHTML(sale.productName)}
                            </strong>

                            <p>
                                Quantity: ${sale.quantity}
                            </p>

                            <p>
                                ${formatDate(sale.date)}
                            </p>

                        </div>

                    </div>


                    <div>

                        <strong>
                            ${money(sale.total)}
                        </strong>

                        <br>

                        <button
                            class="delete-btn"
                            onclick="deleteSale('${sale.id}')">

                            Delete

                        </button>

                    </div>

                </div>
            `;

        }).join("");
}


/* =========================================================
   DELETE SALE
   ========================================================= */

function deleteSale(id) {

    const sale =
        sales.find(s => s.id === id);

    if (!sale) return;


    if (!confirm("Delete this sale?")) {

        return;
    }


    const product =
        products.find(
            p => p.id === sale.productId
        );


    if (product) {

        product.stock =
            Number(product.stock) +
            Number(sale.quantity);

    }


    sales =
        sales.filter(s => s.id !== id);


    saveData();

    renderAll();
}


/* =========================================================
   INVOICES
   ========================================================= */

function openInvoiceModal() {

    const modal =
        document.getElementById("invoiceModal");

    if (!modal) return;


    populateInvoiceCustomers();

    populateInvoiceProducts();


    document
        .getElementById("invoiceForm")
        .reset();


    generateInvoiceNumber();

    setInvoiceDueDate();


    updateInvoiceTotal();


    modal.classList.add("active");
}


function closeInvoiceModal() {

    const modal =
        document.getElementById("invoiceModal");

    if (modal) {

        modal.classList.remove("active");

    }
}


/* =========================================================
   INVOICE CUSTOMER SELECT
   ========================================================= */

function populateInvoiceCustomers() {

    const select =
        document.getElementById("invoiceCustomer");

    if (!select) return;


    select.innerHTML = `
        <option value="">
            Select a customer
        </option>
    `;


    customers.forEach(customer => {

        select.innerHTML += `
            <option value="${customer.id}">
                ${escapeHTML(customer.name)}
            </option>
        `;

    });
}


/* =========================================================
   INVOICE PRODUCT SELECT
   ========================================================= */

function populateInvoiceProducts() {

    const select =
        document.getElementById("invoiceProduct");

    if (!select) return;


    select.innerHTML = `
        <option value="">
            Select a product
        </option>
    `;


    products.forEach(product => {

        select.innerHTML += `
            <option value="${product.id}">
                ${escapeHTML(product.name)}
                — ${money(product.price)}
            </option>
        `;

    });
}


/* =========================================================
   INVOICE NUMBER
   ========================================================= */

function generateInvoiceNumber() {

    const element =
        document.getElementById("invoiceNumber");

    if (!element) return;


    const number =
        Math.floor(
            100000 +
            Math.random() * 900000
        );


    element.value =
        `INV-${number}`;
}


/* =========================================================
   INVOICE DUE DATE
   ========================================================= */

function setInvoiceDueDate() {

    const input =
        document.getElementById("invoiceDueDate");

    if (!input) return;


    const date =
        new Date();

    date.setDate(
        date.getDate() + 14
    );


    input.value =
        date.toISOString()
            .split("T")[0];
}


/* =========================================================
   INVOICE TOTAL
   ========================================================= */

function updateInvoiceTotal() {

    const productId =
        document.getElementById("invoiceProduct")?.value;


    const quantity =
        Number(
            document.getElementById("invoiceQuantity")?.value
        ) || 0;


    const discount =
        Number(
            document.getElementById("invoiceDiscount")?.value
        ) || 0;


    const taxRate =
        Number(
            document.getElementById("invoiceTax")?.value
        ) || 0;


    const product =
        products.find(p => p.id === productId);


    const subtotal =
        product
            ? product.price * quantity
            : 0;


    const afterDiscount =
        Math.max(
            0,
            subtotal - discount
        );


    const tax =
        afterDiscount * (taxRate / 100);


    const total =
        afterDiscount + tax;


    setText(
        "invoiceSubtotal",
        money(subtotal)
    );


    setText(
        "invoiceDiscountDisplay",
        `-${money(discount)}`
    );


    setText(
        "invoiceTaxDisplay",
        money(tax)
    );


    setText(
        "invoiceTotal",
        money(total)
    );
}


/* =========================================================
   INVOICE INPUT EVENTS
   ========================================================= */

document
    .getElementById("invoiceProduct")
    ?.addEventListener(
        "change",
        updateInvoiceTotal
    );


document
    .getElementById("invoiceQuantity")
    ?.addEventListener(
        "input",
        updateInvoiceTotal
    );


document
    .getElementById("invoiceDiscount")
    ?.addEventListener(
        "input",
        updateInvoiceTotal
    );


document
    .getElementById("invoiceTax")
    ?.addEventListener(
        "input",
        updateInvoiceTotal
    );


/* =========================================================
   SAVE INVOICE
   ========================================================= */

const invoiceForm =
    document.getElementById("invoiceForm");

if (invoiceForm) {

    invoiceForm.addEventListener("submit", function(event) {

        event.preventDefault();


        const customerId =
            document.getElementById("invoiceCustomer").value;

        const productId =
            document.getElementById("invoiceProduct").value;

        const quantity =
            Number(
                document.getElementById("invoiceQuantity").value
            );


        const dueDate =
            document.getElementById("invoiceDueDate").value;


        const discount =
            Number(
                document.getElementById("invoiceDiscount").value
            ) || 0;


        const taxRate =
            Number(
                document.getElementById("invoiceTax").value
            ) || 0;


        const customer =
            customers.find(
                c => c.id === customerId
            );


        const product =
            products.find(
                p => p.id === productId
            );


        if (!customer) {

            alert(
                "Please select a customer."
            );

            return;
        }


        if (!product) {

            alert(
                "Please select a product."
            );

            return;
        }


        if (quantity <= 0) {

            alert(
                "Quantity must be at least 1."
            );

            return;
        }


        const subtotal =
            product.price * quantity;


        const safeDiscount =
            Math.min(
                Math.max(discount, 0),
                subtotal
            );


        const taxableAmount =
            subtotal - safeDiscount;


        const tax =
            taxableAmount *
            (Math.max(taxRate, 0) / 100);


        const total =
            taxableAmount + tax;


        const invoiceNumber =
            document.getElementById(
                "invoiceNumber"
            ).value;


        invoices.push({

            id: createId(),

            invoiceNumber: invoiceNumber,

            customerId: customer.id,

            customerName: customer.name,

            productId: product.id,

            productName: product.name,

            quantity: quantity,

            subtotal: subtotal,

            discount: safeDiscount,

            taxRate: taxRate,

            tax: tax,

            total: total,

            dueDate: dueDate,

            createdAt: new Date().toISOString(),

            status: "Unpaid"

        });


        saveData();

        renderAll();

        closeInvoiceModal();


        alert(
            `Invoice ${invoiceNumber} created successfully.`
        );

    });

}


/* =========================================================
   INVOICE LIST
   ========================================================= */

function renderInvoices() {

    const container =
        document.getElementById("invoicesList");

    if (!container) return;


    if (invoices.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    🧾
                </div>

                <h3>No invoices yet</h3>

                <p>
                    Create your first invoice for a customer.
                </p>

            </div>
        `;

        return;
    }


    const sortedInvoices =
        [...invoices].reverse();


    container.innerHTML =
        sortedInvoices.map(invoice => {

            return `
                <div class="invoice-card">

                    <div class="invoice-main">

                        <div class="invoice-icon">
                            🧾
                        </div>

                        <div>

                            <h3>
                                ${escapeHTML(invoice.invoiceNumber)}
                            </h3>

                            <p>
                                ${escapeHTML(invoice.customerName)}
                            </p>

                            <p>
                                ${escapeHTML(invoice.productName)}
                                × ${invoice.quantity}
                            </p>

                            <p>
                                Due:
                                ${formatDate(invoice.dueDate)}
                            </p>

                        </div>

                    </div>


                    <div class="invoice-meta">

                        <strong>
                            ${money(invoice.total)}
                        </strong>

                        <span class="invoice-status">
                            ${escapeHTML(invoice.status)}
                        </span>

                        <br>

                        <button
                            class="delete-btn"
                            onclick="deleteInvoice('${invoice.id}')">

                            Delete

                        </button>

                    </div>

                </div>
            `;

        }).join("");
}


/* =========================================================
   DELETE INVOICE
   ========================================================= */

function deleteInvoice(id) {

    const invoice =
        invoices.find(i => i.id === id);

    if (!invoice) return;


    if (!confirm("Delete this invoice?")) {

        return;
    }


    invoices =
        invoices.filter(
            invoiceItem =>
                invoiceItem.id !== id
        );


    saveData();

    renderAll();
}


/* =========================================================
   ANALYTICS
   ========================================================= */

function updateAnalytics() {

    const totalRevenue =
        sales.reduce(
            (sum, sale) =>
                sum + Number(sale.total),
            0
        );


    const unitsInStock =
        products.reduce(
            (sum, product) =>
                sum + Number(product.stock),
            0
        );


    const inventoryValue =
        products.reduce(
            (sum, product) =>
                sum +
                Number(product.price) *
                Number(product.stock),
            0
        );


    const unitsSold =
        sales.reduce(
            (sum, sale) =>
                sum + Number(sale.quantity),
            0
        );


    const averageSale =
        sales.length
            ? totalRevenue / sales.length
            : 0;


    const largestSale =
        sales.length
            ? Math.max(
                ...sales.map(
                    sale => Number(sale.total)
                )
            )
            : 0;


    const productSales = {};


    sales.forEach(sale => {

        if (!productSales[sale.productName]) {

            productSales[sale.productName] = 0;

        }


        productSales[sale.productName] +=
            Number(sale.quantity);

    });


    let bestSeller = "—";


    const productNames =
        Object.keys(productSales);


    if (productNames.length > 0) {

        bestSeller =
            productNames.sort(
                (a, b) =>
                    productSales[b] -
                    productSales[a]
            )[0];

    }


    setText(
        "totalRevenue",
        money(totalRevenue)
    );


    setText(
        "totalProducts",
        products.length
    );


    setText(
        "totalCustomers",
        customers.length
    );


    setText(
        "totalSales",
        sales.length
    );


    setText(
        "averageSale",
        money(averageSale)
    );


    setText(
        "unitsInStock",
        unitsInStock
    );


    setText(
        "inventoryValue",
        money(inventoryValue)
    );


    setText(
        "bestSeller",
        bestSeller
    );


    setText(
        "overviewRevenue",
        money(totalRevenue)
    );


    setText(
        "unitsSold",
        unitsSold
    );


    setText(
        "overviewAverage",
        money(averageSale)
    );


    setText(
        "largestSale",
        money(largestSale)
    );


    renderTopProducts(productSales);

    renderInventoryAlerts();

    renderRevenueChart();

}


/* =========================================================
   TOP PRODUCTS
   ========================================================= */

function renderTopProducts(productSales) {

    const container =
        document.getElementById("topProducts");

    if (!container) return;


    const sorted =
        Object.entries(productSales)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);


    if (sorted.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                No sales yet.
            </div>
        `;

        return;
    }


    container.innerHTML =
        sorted.map(
            ([name, quantity], index) => {

                return `
                    <div class="product-card">

                        <h3>
                            #${index + 1}
                            ${escapeHTML(name)}
                        </h3>

                        <p>
                            ${quantity} sold
                        </p>

                    </div>
                `;

            }
        ).join("");
}


/* =========================================================
   INVENTORY ALERTS
   ========================================================= */

function renderInventoryAlerts() {

    const container =
        document.getElementById(
            "inventoryAlerts"
        );

    if (!container) return;


    const lowStock =
        products.filter(
            product =>
                Number(product.stock) <= 3
        );


    if (lowStock.length === 0) {

        container.innerHTML = `
            <div class="success-message">
                ✅ All products have healthy stock levels.
            </div>
        `;

        return;
    }


    container.innerHTML =
        lowStock.map(product => {

            return `
                <div class="success-message">

                    ⚠️
                    ${escapeHTML(product.name)}
                    has only
                    ${product.stock}
                    left in stock.

                </div>
            `;

        }).join("");
}


/* =========================================================
   REVENUE CHART
   ========================================================= */

function renderRevenueChart() {

    const container =
        document.getElementById(
            "revenueChart"
        );

    if (!container) return;


    if (sales.length === 0) {

        container.innerHTML = `
            <div class="empty-chart">
                Make your first sale to see
                your revenue trend.
            </div>
        `;

        return;
    }


    const recentSales =
        [...sales]
            .sort(
                (a, b) =>
                    new Date(a.date) -
                    new Date(b.date)
            )
            .slice(-10);


    const maxRevenue =
        Math.max(
            ...recentSales.map(
                sale => Number(sale.total)
            )
        );


    container.innerHTML = `
        <div style="
            width:100%;
            height:180px;
            display:flex;
            align-items:flex-end;
            gap:10px;
            padding:20px;
        ">

            ${recentSales.map(sale => {

                const height =
                    maxRevenue > 0
                        ? Math.max(
                            8,
                            (sale.total / maxRevenue) * 130
                        )
                        : 8;


                return `
                    <div
                        title="${money(sale.total)}"
                        style="
                            flex:1;
                            height:${height}px;
                            background:#2563eb;
                            border-radius:7px 7px 2px 2px;
                        ">
                    </div>
                `;

            }).join("")}

        </div>
    `;
}


/* =========================================================
   MAIN RENDER
   ========================================================= */

function renderAll() {

    renderProducts();

    renderCustomers();

    renderSales();

    renderInvoices();

    updateAnalytics();

}


/* =========================================================
   RESET BUSINESS
   ========================================================= */

function resetBusinessData() {

    const confirmed =
        confirm(
            "WARNING: This will permanently delete all BusinessOS data. Continue?"
        );


    if (!confirmed) return;


    const secondConfirm =
        confirm(
            "Are you absolutely sure? Products, customers, sales and invoices will be deleted."
        );


    if (!secondConfirm) return;


    products = [];

    customers = [];

    sales = [];

    invoices = [];


    saveData();

    renderAll();


    alert(
        "BusinessOS data has been reset."
    );
}


/* =========================================================
   HELPERS
   ========================================================= */

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent = value;

    }
}


function formatDate(dateString) {

    if (!dateString) return "—";


    const date =
        new Date(dateString);


    if (Number.isNaN(date.getTime())) {

        return dateString;

    }


    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );
}


function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   CLOSE MODALS WHEN CLICKING OUTSIDE
   ========================================================= */

document.querySelectorAll(".modal")
    .forEach(modal => {

        modal.addEventListener(
            "click",
            function(event) {

                if (
                    event.target === modal
                ) {

                    modal.classList.remove(
                        "active"
                    );

                }

            }
        );

    });


/* =========================================================
   ESC KEY CLOSES MODALS
   ========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key !== "Escape") return;


        document
            .querySelectorAll(".modal.active")
            .forEach(modal => {

                modal.classList.remove(
                    "active"
                );

            });

    }
);


/* =========================================================
   START BUSINESSOS
   ========================================================= */

renderAll();
