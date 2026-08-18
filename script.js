document.addEventListener("DOMContentLoaded", () => {

    /* ===============================
       DATA
    =============================== */

    let products =
        JSON.parse(localStorage.getItem("businessOSProducts")) || [];

    let customers =
        JSON.parse(localStorage.getItem("businessOSCustomers")) || [];

    let sales =
        JSON.parse(localStorage.getItem("businessOSSales")) || [];

    let invoices =
        JSON.parse(localStorage.getItem("businessOSInvoices")) || [];


    /* ===============================
       STORAGE
    =============================== */

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


    /* ===============================
       HELPERS
    =============================== */

    function money(value) {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(Number(value) || 0);
    }


    function id() {
        return Date.now().toString() +
            Math.random().toString(36).slice(2);
    }


    function safe(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function setText(elementId, value) {
        const element =
            document.getElementById(elementId);

        if (element) {
            element.textContent = value;
        }
    }


    function formatDate(value) {

        if (!value) return "—";

        const date = new Date(value);

        if (isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    }


    /* ===============================
       FIX OLD SALES DATA
    =============================== */

    function repairSales() {

        sales = sales.map(sale => {

            let product = null;

            /*
             * Try every possible way
             * the old system may have
             * stored the product.
             */

            if (sale.productId) {
                product = products.find(
                    p => String(p.id) === String(sale.productId)
                );
            }

            if (!product && sale.productName) {
                product = products.find(
                    p =>
                        p.name.toLowerCase() ===
                        String(sale.productName).toLowerCase()
                );
            }

            if (!product && sale.product) {

                if (typeof sale.product === "string") {

                    product = products.find(
                        p =>
                            p.name.toLowerCase() ===
                            sale.product.toLowerCase()
                    );

                } else if (typeof sale.product === "object") {

                    product = products.find(
                        p =>
                            String(p.id) ===
                            String(sale.product.id)
                    );
                }
            }


            const quantity =
                Number(
                    sale.quantity ??
                    sale.qty ??
                    1
                );


            /*
             * Support all possible old
             * price/total fields.
             */

            let total =
                Number(
                    sale.total ??
                    sale.amount ??
                    sale.saleTotal
                );


            if (!Number.isFinite(total)) {
                total = 0;
            }


            if (total === 0 && product) {

                total =
                    Number(product.price) *
                    quantity;
            }


            return {

                ...sale,

                id:
                    sale.id || id(),

                productId:
                    product
                        ? product.id
                        : sale.productId,

                productName:
                    product
                        ? product.name
                        : (
                            sale.productName ||
                            "Unknown Product"
                        ),

                quantity:
                    quantity,

                total:
                    total,

                date:
                    sale.date ||
                    sale.createdAt ||
                    new Date().toISOString()

            };

        });


        saveData();
    }


    /* ===============================
       PRODUCTS
    =============================== */

    function renderProducts() {

        const list =
            document.getElementById("productsList");

        if (!list) return;


        if (products.length === 0) {

            list.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📦</div>
                    <h3>No products yet</h3>
                    <p>
                        Add your first product to start
                        managing your inventory.
                    </p>
                </div>
            `;

            return;
        }


        list.innerHTML =
            products.map(product => {

                const stock =
                    Number(product.stock) || 0;

                return `
                    <div class="product-card">

                        <h3>
                            ${safe(product.name)}
                        </h3>

                        <p class="product-price">
                            ${money(product.price)}
                        </p>

                        <p>
                            Stock: ${stock}
                        </p>

                        <span class="status">
                            ${
                                stock > 0
                                ? "IN STOCK"
                                : "OUT OF STOCK"
                            }
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


    /* ===============================
       ADD / EDIT PRODUCT
    =============================== */

    window.openProductModal =
        function(productId = null) {

            const modal =
                document.getElementById("productModal");

            if (!modal) return;


            const form =
                document.getElementById("productForm");

            if (form) {
                form.reset();
            }


            if (productId) {

                const product =
                    products.find(
                        p => p.id === productId
                    );

                if (!product) return;


                document.getElementById(
                    "productModalTitle"
                ).textContent = "Edit Product";


                document.getElementById(
                    "productId"
                ).value = product.id;


                document.getElementById(
                    "productName"
                ).value = product.name;


                document.getElementById(
                    "productPrice"
                ).value = product.price;


                document.getElementById(
                    "productStock"
                ).value = product.stock;

            } else {

                document.getElementById(
                    "productModalTitle"
                ).textContent = "Add Product";

            }


            modal.classList.add("active");
        };


    window.closeProductModal =
        function() {

            document
                .getElementById("productModal")
                ?.classList.remove("active");
        };


    window.editProduct =
        function(productId) {
            openProductModal(productId);
        };


    document
        .getElementById("productForm")
        ?.addEventListener("submit", event => {

            event.preventDefault();


            const productId =
                document.getElementById(
                    "productId"
                ).value;


            const name =
                document.getElementById(
                    "productName"
                ).value.trim();


            const price =
                Number(
                    document.getElementById(
                        "productPrice"
                    ).value
                );


            const stock =
                Number(
                    document.getElementById(
                        "productStock"
                    ).value
                );


            if (!name) {
                alert("Enter a product name.");
                return;
            }


            if (productId) {

                const product =
                    products.find(
                        p => p.id === productId
                    );

                if (product) {

                    product.name = name;
                    product.price = price;
                    product.stock = stock;

                }

            } else {

                products.push({

                    id: id(),

                    name: name,

                    price: price,

                    stock: stock

                });

            }


            saveData();

            renderAll();

            closeProductModal();

        });


    window.deleteProduct =
        function(productId) {

            if (!confirm("Delete this product?")) {
                return;
            }


            products =
                products.filter(
                    p => p.id !== productId
                );


            saveData();

            renderAll();
        };


    /* ===============================
       CUSTOMERS
    =============================== */

    function renderCustomers() {

        const list =
            document.getElementById("customersList");

        if (!list) return;


        if (customers.length === 0) {

            list.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">👥</div>
                    <h3>No customers yet</h3>
                    <p>
                        Add your first customer to start
                        building your customer list.
                    </p>
                </div>
            `;

            return;
        }


        list.innerHTML =
            customers.map(customer => {

                return `
                    <div class="customer-card">

                        <h3>
                            ${safe(customer.name)}
                        </h3>

                        ${
                            customer.email
                            ? `<p>📧 ${safe(customer.email)}</p>`
                            : ""
                        }

                        ${
                            customer.phone
                            ? `<p>📱 ${safe(customer.phone)}</p>`
                            : ""
                        }

                        <button
                            class="delete-btn"
                            onclick="deleteCustomer('${customer.id}')">
                            Delete
                        </button>

                    </div>
                `;

            }).join("");
    }


    window.openCustomerModal =
        function() {

            document
                .getElementById("customerForm")
                ?.reset();

            document
                .getElementById("customerModal")
                ?.classList.add("active");
        };


    window.closeCustomerModal =
        function() {

            document
                .getElementById("customerModal")
                ?.classList.remove("active");
        };


    document
        .getElementById("customerForm")
        ?.addEventListener("submit", event => {

            event.preventDefault();


            const name =
                document.getElementById(
                    "customerName"
                ).value.trim();


            const email =
                document.getElementById(
                    "customerEmail"
                ).value.trim();


            const phone =
                document.getElementById(
                    "customerPhone"
                ).value.trim();


            if (!name) {
                alert("Enter customer name.");
                return;
            }


            customers.push({

                id: id(),

                name: name,

                email: email,

                phone: phone

            });


            saveData();

            renderAll();

            closeCustomerModal();

        });


    window.deleteCustomer =
        function(customerId) {

            if (!confirm("Delete this customer?")) {
                return;
            }


            customers =
                customers.filter(
                    c => c.id !== customerId
                );


            saveData();

            renderAll();
        };


    /* ===============================
       SALES
    =============================== */

    window.openSaleModal =
        function() {

            const select =
                document.getElementById(
                    "saleProduct"
                );


            if (!select) return;


            select.innerHTML = `
                <option value="">
                    Select a product
                </option>
            `;


            products.forEach(product => {

                select.innerHTML += `
                    <option value="${product.id}">
                        ${safe(product.name)}
                        — ${money(product.price)}
                    </option>
                `;

            });


            document.getElementById(
                "saleQuantity"
            ).value = 1;


            updateSaleTotal();


            document
                .getElementById("saleModal")
                ?.classList.add("active");
        };


    window.closeSaleModal =
        function() {

            document
                .getElementById("saleModal")
                ?.classList.remove("active");
        };


    function updateSaleTotal() {

        const productId =
            document.getElementById(
                "saleProduct"
            )?.value;


        const quantity =
            Number(
                document.getElementById(
                    "saleQuantity"
                )?.value
            ) || 0;


        const product =
            products.find(
                p => p.id === productId
            );


        const total =
            product
            ? Number(product.price) * quantity
            : 0;


        setText(
            "saleTotal",
            money(total)
        );
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


    document
        .getElementById("saleForm")
        ?.addEventListener("submit", event => {

            event.preventDefault();


            const productId =
                document.getElementById(
                    "saleProduct"
                ).value;


            const quantity =
                Number(
                    document.getElementById(
                        "saleQuantity"
                    ).value
                );


            const product =
                products.find(
                    p => p.id === productId
                );


            if (!product) {

                alert("Select a product.");

                return;
            }


            if (
                quantity <= 0 ||
                quantity > Number(product.stock)
            ) {

                alert(
                    `Only ${product.stock} units available.`
                );

                return;
            }


            const total =
                Number(product.price) *
                quantity;


            sales.push({

                id: id(),

                productId:
                    product.id,

                productName:
                    product.name,

                quantity:
                    quantity,

                total:
                    total,

                date:
                    new Date().toISOString()

            });


            product.stock -= quantity;


            saveData();

            renderAll();

            closeSaleModal();

        });


    function renderSales() {

        const list =
            document.getElementById("salesList");

        if (!list) return;


        if (sales.length === 0) {

            list.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🧾</div>
                    <h3>No sales yet</h3>
                    <p>
                        Your recorded sales will appear here.
                    </p>
                </div>
            `;

            return;
        }


        list.innerHTML =
            [...sales]
                .reverse()
                .map(sale => {

                    return `
                        <div class="sale-card">

                            <div class="sale-info">

                                <div class="sale-icon">
                                    🧾
                                </div>

                                <div>

                                    <strong>
                                        ${safe(
                                            sale.productName ||
                                            "Unknown Product"
                                        )}
                                    </strong>

                                    <p>
                                        Quantity:
                                        ${sale.quantity}
                                    </p>

                                    <p>
                                        ${formatDate(
                                            sale.date
                                        )}
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

                })
                .join("");
    }


    window.deleteSale =
        function(saleId) {

            if (!confirm("Delete this sale?")) {
                return;
            }


            const sale =
                sales.find(
                    s => s.id === saleId
                );


            if (sale) {

                const product =
                    products.find(
                        p =>
                            p.id ===
                            sale.productId
                    );


                if (product) {

                    product.stock +=
                        Number(sale.quantity);

                }

            }


            sales =
                sales.filter(
                    s => s.id !== saleId
                );


            saveData();

            renderAll();
        };


    /* ===============================
       ANALYTICS
    =============================== */

    function updateAnalytics() {

        /*
         * IMPORTANT:
         * Revenue comes directly from
         * repaired sales totals.
         */

        const totalRevenue =
            sales.reduce(
                (sum, sale) =>
                    sum + Number(sale.total || 0),
                0
            );


        const unitsSold =
            sales.reduce(
                (sum, sale) =>
                    sum + Number(sale.quantity || 0),
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
                    sale =>
                        Number(sale.total || 0)
                )
            )
            : 0;


        const unitsInStock =
            products.reduce(
                (sum, product) =>
                    sum + Number(product.stock || 0),
                0
            );


        const inventoryValue =
            products.reduce(
                (sum, product) =>
                    sum +
                    Number(product.price || 0) *
                    Number(product.stock || 0),
                0
            );


        /* =========================
           PRODUCT RANKINGS
        ========================= */

        const productSales = {};


        sales.forEach(sale => {

            const name =
                sale.productName ||
                "Unknown Product";


            if (!productSales[name]) {
                productSales[name] = 0;
            }


            productSales[name] +=
                Number(sale.quantity || 0);

        });


        const ranked =
            Object.entries(productSales)
                .sort(
                    (a, b) =>
                        b[1] - a[1]
                );


        const bestSeller =
            ranked.length
            ? ranked[0][0]
            : "—";


        /* =========================
           MAIN DASHBOARD
        ========================= */

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


        /* =========================
           ANALYTICS CARDS
        ========================= */

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


        /* =========================
           SALES OVERVIEW
        ========================= */

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


        renderTopProducts(ranked);

        renderInventoryAlerts();

        renderRevenueChart();
    }


    /* ===============================
       TOP PRODUCTS
    =============================== */

    function renderTopProducts(ranked) {

        const container =
            document.getElementById(
                "topProducts"
            );


        if (!container) return;


        if (!ranked.length) {

            container.innerHTML = `
                <div class="empty-state">
                    No sales yet.
                </div>
            `;

            return;
        }


        container.innerHTML =
            ranked
                .slice(0, 5)
                .map(
                    ([name, quantity], index) => `
                        <div class="product-card">

                            <h3>
                                #${index + 1}
                                ${safe(name)}
                            </h3>

                            <p>
                                ${quantity} sold
                            </p>

                        </div>
                    `
                )
                .join("");
    }


    /* ===============================
       INVENTORY ALERTS
    =============================== */

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


        if (!lowStock.length) {

            container.innerHTML = `
                <div class="success-message">
                    ✅ All products have healthy stock levels.
                </div>
            `;

            return;
        }


        container.innerHTML =
            lowStock.map(
                product => `
                    <div class="success-message">
                        ⚠️
                        ${safe(product.name)}
                        has only
                        ${product.stock}
                        left in stock.
                    </div>
                `
            ).join("");
    }


    /* ===============================
       REVENUE CHART
    =============================== */

    function renderRevenueChart() {

        const container =
            document.getElementById(
                "revenueChart"
            );


        if (!container) return;


        if (!sales.length) {

            container.innerHTML = `
                <div class="empty-chart">
                    Make your first sale to see
                    your revenue trend.
                </div>
            `;

            return;
        }


        const recent =
            [...sales]
                .sort(
                    (a, b) =>
                        new Date(a.date) -
                        new Date(b.date)
                )
                .slice(-10);


        const max =
            Math.max(
                ...recent.map(
                    sale =>
                        Number(sale.total || 0)
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
                box-sizing:border-box;
            ">

                ${recent.map(sale => {

                    const amount =
                        Number(sale.total || 0);


                    const height =
                        max > 0
                        ? Math.max(
                            10,
                            (amount / max) * 130
                        )
                        : 10;


                    return `
                        <div
                            title="${money(amount)}"
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


    /* ===============================
       INVOICES
    =============================== */

    window.openInvoiceModal =
        function() {

            populateInvoiceCustomers();

            populateInvoiceProducts();

            document
                .getElementById("invoiceForm")
                ?.reset();


            generateInvoiceNumber();

            setDueDate();

            updateInvoiceTotal();


            document
                .getElementById("invoiceModal")
                ?.classList.add("active");
        };


    window.closeInvoiceModal =
        function() {

            document
                .getElementById("invoiceModal")
                ?.classList.remove("active");
        };


    function populateInvoiceCustomers() {

        const select =
            document.getElementById(
                "invoiceCustomer"
            );


        if (!select) return;


        select.innerHTML = `
            <option value="">
                Select a customer
            </option>
        `;


        customers.forEach(customer => {

            select.innerHTML += `
                <option value="${customer.id}">
                    ${safe(customer.name)}
                </option>
            `;

        });
    }


    function populateInvoiceProducts() {

        const select =
            document.getElementById(
                "invoiceProduct"
            );


        if (!select) return;


        select.innerHTML = `
            <option value="">
                Select a product
            </option>
        `;


        products.forEach(product => {

            select.innerHTML += `
                <option value="${product.id}">
                    ${safe(product.name)}
                    — ${money(product.price)}
                </option>
            `;

        });
    }


    function generateInvoiceNumber() {

        const input =
            document.getElementById(
                "invoiceNumber"
            );


        if (!input) return;


        input.value =
            "INV-" +
            Math.floor(
                100000 +
                Math.random() * 900000
            );
    }


    function setDueDate() {

        const input =
            document.getElementById(
                "invoiceDueDate"
            );


        if (!input) return;


        const date = new Date();

        date.setDate(
            date.getDate() + 14
        );


        input.value =
            date.toISOString().split("T")[0];
    }


    function updateInvoiceTotal() {

        const productId =
            document.getElementById(
                "invoiceProduct"
            )?.value;


        const quantity =
            Number(
                document.getElementById(
                    "invoiceQuantity"
                )?.value
            ) || 0;


        const discount =
            Number(
                document.getElementById(
                    "invoiceDiscount"
                )?.value
            ) || 0;


        const taxRate =
            Number(
                document.getElementById(
                    "invoiceTax"
                )?.value
            ) || 0;


        const product =
            products.find(
                p => p.id === productId
            );


        const subtotal =
            product
            ? Number(product.price) * quantity
            : 0;


        const actualDiscount =
            Math.min(
                Math.max(discount, 0),
                subtotal
            );


        const taxable =
            subtotal - actualDiscount;


        const tax =
            taxable * (taxRate / 100);


        const total =
            taxable + tax;


        setText(
            "invoiceSubtotal",
            money(subtotal)
        );


        setText(
            "invoiceDiscountDisplay",
            "-" + money(actualDiscount)
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


    document
        .getElementById("invoiceForm")
        ?.addEventListener("submit", event => {

            event.preventDefault();


            const customerId =
                document.getElementById(
                    "invoiceCustomer"
                ).value;


            const productId =
                document.getElementById(
                    "invoiceProduct"
                ).value;


            const quantity =
                Number(
                    document.getElementById(
                        "invoiceQuantity"
                    ).value
                );


            const customer =
                customers.find(
                    c => c.id === customerId
                );


            const product =
                products.find(
                    p => p.id === productId
                );


            if (!customer) {

                alert("Select a customer.");

                return;
            }


            if (!product) {

                alert("Select a product.");

                return;
            }


            const subtotal =
                Number(product.price) *
                quantity;


            const discount =
                Number(
                    document.getElementById(
                        "invoiceDiscount"
                    ).value
                ) || 0;


            const taxRate =
                Number(
                    document.getElementById(
                        "invoiceTax"
                    ).value
                ) || 0;


            const actualDiscount =
                Math.min(
                    Math.max(discount, 0),
                    subtotal
                );


            const taxable =
                subtotal - actualDiscount;


            const tax =
                taxable *
                (taxRate / 100);


            const total =
                taxable + tax;


            invoices.push({

                id: id(),

                invoiceNumber:
                    document.getElementById(
                        "invoiceNumber"
                    ).value,

                customerId:
                    customer.id,

                customerName:
                    customer.name,

                productId:
                    product.id,

                productName:
                    product.name,

                quantity:
                    quantity,

                subtotal:
                    subtotal,

                discount:
                    actualDiscount,

                taxRate:
                    taxRate,

                tax:
                    tax,

                total:
                    total,

                dueDate:
                    document.getElementById(
                        "invoiceDueDate"
                    ).value,

                status:
                    "Unpaid",

                createdAt:
                    new Date().toISOString()

            });


            saveData();

            renderAll();

            closeInvoiceModal();


            alert("Invoice created successfully.");

        });


    function renderInvoices() {

        const list =
            document.getElementById(
                "invoicesList"
            );


        if (!list) return;


        if (!invoices.length) {

            list.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🧾</div>
                    <h3>No invoices yet</h3>
                    <p>
                        Create your first invoice
                        for a customer.
                    </p>
                </div>
            `;

            return;
        }


        list.innerHTML =
            [...invoices]
                .reverse()
                .map(invoice => {

                    return `
                        <div class="invoice-card">

                            <div class="invoice-main">

                                <div class="invoice-icon">
                                    🧾
                                </div>

                                <div>

                                    <h3>
                                        ${safe(
                                            invoice.invoiceNumber
                                        )}
                                    </h3>

                                    <p>
                                        ${safe(
                                            invoice.customerName
                                        )}
                                    </p>

                                    <p>
                                        ${safe(
                                            invoice.productName
                                        )}
                                        ×
                                        ${invoice.quantity}
                                    </p>

                                    <p>
                                        Due:
                                        ${formatDate(
                                            invoice.dueDate
                                        )}
                                    </p>

                                </div>

                            </div>

                            <div class="invoice-meta">

                                <strong>
                                    ${money(
                                        invoice.total
                                    )}
                                </strong>

                                <span class="invoice-status">
                                    ${safe(
                                        invoice.status
                                    )}
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

                })
                .join("");
    }


    window.deleteInvoice =
        function(invoiceId) {

            if (!confirm("Delete this invoice?")) {
                return;
            }


            invoices =
                invoices.filter(
                    invoice =>
                        invoice.id !== invoiceId
                );


            saveData();

            renderAll();
        };


    /* ===============================
       RESET
    =============================== */

    window.resetBusinessData =
        function() {

            if (
                !confirm(
                    "Delete ALL BusinessOS data?"
                )
            ) {
                return;
            }


            products = [];

            customers = [];

            sales = [];

            invoices = [];


            saveData();

            renderAll();


            alert(
                "BusinessOS data has been reset."
            );
        };


    /* ===============================
       MODAL CLOSE
    =============================== */

    document
        .querySelectorAll(".modal")
        .forEach(modal => {

            modal.addEventListener(
                "click",
                event => {

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


    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                document
                    .querySelectorAll(
                        ".modal.active"
                    )
                    .forEach(modal => {

                        modal.classList.remove(
                            "active"
                        );

                    });

            }

        }
    );


    /* ===============================
       EVERYTHING
    =============================== */

    function renderAll() {

        renderProducts();

        renderCustomers();

        renderSales();

        renderInvoices();

        updateAnalytics();
    }


    /* ===============================
       START
    =============================== */

    repairSales();

    renderAll();

});
