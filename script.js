document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       BUSINESSOS V2
       Business management dashboard
    ===================================================== */

    let products =
        JSON.parse(localStorage.getItem("businessOSProducts")) || [];

    let customers =
        JSON.parse(localStorage.getItem("businessOSCustomers")) || [];

    let sales =
        JSON.parse(localStorage.getItem("businessOSSales")) || [];

    let invoices =
        JSON.parse(localStorage.getItem("businessOSInvoices")) || [];


    /* =====================================================
       STORAGE
    ===================================================== */

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


    /* =====================================================
       HELPERS
    ===================================================== */

    function money(value) {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(Number(value) || 0);
    }


    function createId() {
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


    function setText(id, value) {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = value;
        }
    }


    function formatDate(value) {

        if (!value) {
            return "—";
        }

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


    /* =====================================================
       DATA NORMALIZATION
       Prevents old/undefined data from breaking dashboard
    ===================================================== */

    function normalizeProducts() {

        products = products.map(product => ({
            id: product.id || createId(),
            name: String(product.name || "Unnamed Product"),
            price: Number(product.price) || 0,
            stock: Math.max(0, Number(product.stock) || 0)
        }));
    }


    function normalizeCustomers() {

        customers = customers.map(customer => ({
            id: customer.id || createId(),
            name: String(customer.name || "Unknown Customer"),
            email: String(customer.email || ""),
            phone: String(customer.phone || "")
        }));
    }


    function repairSales() {

        sales = sales.map(sale => {

            let product = null;

            if (sale.productId) {
                product = products.find(
                    product =>
                        String(product.id) ===
                        String(sale.productId)
                );
            }

            if (!product && sale.productName) {
                product = products.find(
                    product =>
                        String(product.name).toLowerCase() ===
                        String(sale.productName).toLowerCase()
                );
            }

            if (!product && sale.product) {

                if (typeof sale.product === "string") {

                    product = products.find(
                        product =>
                            String(product.name).toLowerCase() ===
                            String(sale.product).toLowerCase()
                    );

                } else if (
                    typeof sale.product === "object" &&
                    sale.product.id
                ) {

                    product = products.find(
                        product =>
                            String(product.id) ===
                            String(sale.product.id)
                    );
                }
            }


            const quantity =
                Math.max(
                    1,
                    Number(
                        sale.quantity ??
                        sale.qty ??
                        1
                    )
                );


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

                id: sale.id || createId(),

                productId:
                    product
                        ? product.id
                        : sale.productId || "",

                productName:
                    product
                        ? product.name
                        : (
                            sale.productName ||
                            "Unknown Product"
                        ),

                quantity,

                total,

                date:
                    sale.date ||
                    sale.createdAt ||
                    new Date().toISOString()

            };

        });
    }


    function normalizeInvoices() {

        invoices = invoices.map(invoice => {

            const product =
                products.find(
                    product =>
                        String(product.id) ===
                        String(invoice.productId)
                );

            const customer =
                customers.find(
                    customer =>
                        String(customer.id) ===
                        String(invoice.customerId)
                );


            const quantity =
                Math.max(
                    1,
                    Number(invoice.quantity) || 1
                );


            const subtotal =
                Number(invoice.subtotal) ||
                (
                    product
                    ? Number(product.price) * quantity
                    : 0
                );


            const discount =
                Math.min(
                    Math.max(
                        Number(invoice.discount) || 0,
                        0
                    ),
                    subtotal
                );


            const taxRate =
                Math.max(
                    0,
                    Number(invoice.taxRate) || 0
                );


            const taxable =
                subtotal - discount;


            const tax =
                Number(invoice.tax) ||
                taxable * (taxRate / 100);


            const total =
                Number(invoice.total) ||
                taxable + tax;


            return {

                id:
                    invoice.id || createId(),

                invoiceNumber:
                    invoice.invoiceNumber ||
                    "INV-" +
                    Math.floor(
                        100000 +
                        Math.random() * 900000
                    ),

                customerId:
                    invoice.customerId || "",

                customerName:
                    customer
                        ? customer.name
                        : (
                            invoice.customerName ||
                            "Unknown Customer"
                        ),

                productId:
                    invoice.productId || "",

                productName:
                    product
                        ? product.name
                        : (
                            invoice.productName ||
                            "Unknown Product"
                        ),

                quantity,

                subtotal,

                discount,

                taxRate,

                tax,

                total,

                dueDate:
                    invoice.dueDate || "",

                status:
                    invoice.status === "Paid"
                    ? "Paid"
                    : "Unpaid",

                createdAt:
                    invoice.createdAt ||
                    new Date().toISOString(),

                paidAt:
                    invoice.paidAt || null

            };

        });
    }


    /* =====================================================
       PRODUCTS
    ===================================================== */

    function renderProducts() {

        const list =
            document.getElementById("productsList");

        if (!list) {
            return;
        }


        if (!products.length) {

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


                const status =
                    stock > 0
                    ? "IN STOCK"
                    : "OUT OF STOCK";


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


    window.openProductModal =
        function(productId = null) {

            const modal =
                document.getElementById("productModal");

            if (!modal) {
                return;
            }


            document
                .getElementById("productForm")
                ?.reset();


            document.getElementById(
                "productId"
            ).value = "";


            if (productId) {

                const product =
                    products.find(
                        product =>
                            product.id === productId
                    );


                if (!product) {
                    return;
                }


                setText(
                    "productModalTitle",
                    "Edit Product"
                );


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

                setText(
                    "productModalTitle",
                    "Add Product"
                );

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


            if (price < 0 || stock < 0) {
                alert("Price and stock cannot be negative.");
                return;
            }


            if (productId) {

                const product =
                    products.find(
                        product =>
                            product.id === productId
                    );


                if (product) {

                    product.name = name;
                    product.price = price;
                    product.stock = stock;

                }

            } else {

                products.push({

                    id: createId(),

                    name,

                    price,

                    stock

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
                    product =>
                        product.id !== productId
                );


            saveData();

            renderAll();
        };


    /* =====================================================
       CUSTOMERS
    ===================================================== */

    function getCustomerSales(customerId) {

        /*
         * Sales currently do not contain customer IDs
         * in the original system, so only invoices are
         * used for customer billing statistics.
         */

        return invoices.filter(
            invoice =>
                String(invoice.customerId) ===
                String(customerId)
        );
    }


    function renderCustomers() {

        const list =
            document.getElementById("customersList");

        if (!list) {
            return;
        }


        if (!customers.length) {

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

                const customerInvoices =
                    getCustomerSales(customer.id);


                const amount =
                    customerInvoices.reduce(
                        (sum, invoice) =>
                            sum + Number(invoice.total || 0),
                        0
                    );


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

                        <p>
                            🧾 ${customerInvoices.length}
                            invoice${customerInvoices.length === 1 ? "" : "s"}
                        </p>

                        <p>
                            💰 ${money(amount)}
                        </p>

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

                id: createId(),

                name,

                email,

                phone

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
                    customer =>
                        customer.id !== customerId
                );


            saveData();

            renderAll();
        };


    /* =====================================================
       SALES
    ===================================================== */

    window.openSaleModal =
        function() {

            const select =
                document.getElementById(
                    "saleProduct"
                );


            if (!select) {
                return;
            }


            select.innerHTML = `
                <option value="">
                    Select a product
                </option>
            `;


            products.forEach(product => {

                const disabled =
                    Number(product.stock) <= 0
                    ? "disabled"
                    : "";


                select.innerHTML += `
                    <option
                        value="${product.id}"
                        ${disabled}>
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
                product =>
                    product.id === productId
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
                    product =>
                        product.id === productId
                );


            if (!product) {

                alert("Select a product.");

                return;
            }


            if (!Number.isInteger(quantity) || quantity <= 0) {

                alert("Enter a valid quantity.");

                return;
            }


            if (quantity > Number(product.stock)) {

                alert(
                    `Only ${product.stock} units available.`
                );

                return;
            }


            const total =
                Number(product.price) *
                quantity;


            sales.push({

                id: createId(),

                productId:
                    product.id,

                productName:
                    product.name,

                quantity,

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

        if (!list) {
            return;
        }


        if (!sales.length) {

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
                                        ${Number(sale.quantity) || 0}
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
                    sale =>
                        sale.id === saleId
                );


            if (sale) {

                const product =
                    products.find(
                        product =>
                            String(product.id) ===
                            String(sale.productId)
                    );


                if (product) {

                    product.stock +=
                        Number(sale.quantity) || 0;

                }

            }


            sales =
                sales.filter(
                    sale =>
                        sale.id !== saleId
                );


            saveData();

            renderAll();
        };


    /* =====================================================
       ANALYTICS
    ===================================================== */

    function updateAnalytics() {

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
                    sum +
                    Number(product.stock || 0),
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


        /* =================================================
           PRODUCT RANKING
        ================================================= */

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


        /* =================================================
           DASHBOARD
        ================================================= */

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


        /* =================================================
           ANALYTICS
        ================================================= */

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


        /* =================================================
           SALES OVERVIEW
        ================================================= */

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


    /* =====================================================
       TOP PRODUCTS
    ===================================================== */

    function renderTopProducts(ranked) {

        const container =
            document.getElementById(
                "topProducts"
            );


        if (!container) {
            return;
        }


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


    /* =====================================================
       INVENTORY ALERTS
    ===================================================== */

    function renderInventoryAlerts() {

        const container =
            document.getElementById(
                "inventoryAlerts"
            );


        if (!container) {
            return;
        }


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
                        ${Number(product.stock)}
                        left in stock.
                    </div>
                `
            ).join("");
    }


    /* =====================================================
       REVENUE CHART
    ===================================================== */

    function renderRevenueChart() {

        const container =
            document.getElementById(
                "revenueChart"
            );


        if (!container) {
            return;
        }


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


    /* =====================================================
       INVOICE MODAL
    ===================================================== */

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


        if (!select) {
            return;
        }


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


        if (!select) {
            return;
        }


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


        if (!input) {
            return;
        }


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


        if (!input) {
            return;
        }


        const date = new Date();

        date.setDate(
            date.getDate() + 14
        );


        input.value =
            date.toISOString()
                .split("T")[0];
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
                product =>
                    product.id === productId
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
            taxable *
            (Math.max(0, taxRate) / 100);


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


    /* =====================================================
       CREATE INVOICE
    ===================================================== */

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
                    customer =>
                        customer.id === customerId
                );


            const product =
                products.find(
                    product =>
                        product.id === productId
                );


            if (!customer) {

                alert("Select a customer.");

                return;
            }


            if (!product) {

                alert("Select a product.");

                return;
            }


            if (!Number.isInteger(quantity) || quantity <= 0) {

                alert("Enter a valid quantity.");

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
                (Math.max(0, taxRate) / 100);


            const total =
                taxable + tax;


            invoices.push({

                id: createId(),

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

                quantity,

                subtotal,

                discount:
                    actualDiscount,

                taxRate,

                tax,

                total,

                dueDate:
                    document.getElementById(
                        "invoiceDueDate"
                    ).value,

                status:
                    "Unpaid",

                createdAt:
                    new Date().toISOString(),

                paidAt:
                    null

            });


            saveData();

            renderAll();

            closeInvoiceModal();


            alert(
                "Invoice created successfully."
            );

        });


    /* =====================================================
       RENDER INVOICES
    ===================================================== */

    function renderInvoices() {

        const list =
            document.getElementById(
                "invoicesList"
            );


        if (!list) {
            return;
        }


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

                    const paid =
                        invoice.status === "Paid";


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
                                        ${Number(
                                            invoice.quantity
                                        ) || 0}
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
    ${safe(invoice.status)}
</span>

<br>

<button
    class="edit-btn"
    onclick="toggleInvoicePaid('${invoice.id}')">

    ${invoice.status === "Paid"
        ? "Mark as Unpaid"
        : "Mark as Paid"}

</button>
<button
    class="secondary-btn"
    onclick="viewInvoice('${invoice.id}')">

    👁️ View Invoice

</button>
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


    /* =====================================================
       PAYMENT STATUS
    ===================================================== */

    window.markInvoicePaid =
        function(invoiceId) {

            const invoice =
                invoices.find(
                    invoice =>
                        invoice.id === invoiceId
                );


            if (!invoice) {
                return;
            }


            if (invoice.status === "Paid") {
                return;
            }


            invoice.status = "Paid";

            invoice.paidAt =
                new Date().toISOString();


            saveData();

            renderAll();


            alert(
                `${invoice.invoiceNumber} marked as paid.`
            );
        };


    window.markInvoiceUnpaid =
        function(invoiceId) {

            const invoice =
                invoices.find(
                    invoice =>
                        invoice.id === invoiceId
                );


            if (!invoice) {
                return;
            }


            invoice.status = "Unpaid";

            invoice.paidAt = null;


            saveData();

            renderAll();

        };
window.toggleInvoicePaid = function(invoiceId) {

    const invoice = invoices.find(
        invoice => invoice.id === invoiceId
    );

    if (!invoice) return;

    invoice.status =
        invoice.status === "Paid"
            ? "Unpaid"
            : "Paid";

    saveData();
    renderAll();
};
window.viewInvoice = function(invoiceId) {

    const invoice = invoices.find(
        invoice => invoice.id === invoiceId
    );

    if (!invoice) return;

    const customer = customers.find(
        customer => customer.id === invoice.customerId
    );

    const printWindow = window.open(
        "",
        "_blank",
        "width=900,height=800"
    );

    if (!printWindow) {
        alert("Please allow pop-ups for BusinessOS.");
        return;
    }

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>

            <title>${safe(invoice.invoiceNumber)} | BusinessOS</title>

            <style>

                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    padding: 40px;
                    font-family:
                        Inter,
                        -apple-system,
                        BlinkMacSystemFont,
                        "Segoe UI",
                        sans-serif;
                    background: #f3f4f6;
                    color: #111827;
                }

                .invoice {
                    max-width: 800px;
                    margin: auto;
                    padding: 50px;
                    background: white;
                    box-shadow: 0 10px 40px rgba(0,0,0,.08);
                }

                .header {
                    display: flex;
                    justify-content: space-between;
                    gap: 30px;
                    margin-bottom: 50px;
                }

                .brand {
                    font-size: 28px;
                    font-weight: 800;
                }

                .brand span {
                    color: #2563eb;
                }

                .invoice-title {
                    text-align: right;
                }

                .invoice-title h1 {
                    margin: 0 0 5px;
                    font-size: 30px;
                }

                .invoice-title p {
                    margin: 4px 0;
                    color: #6b7280;
                }

                .details {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                    margin-bottom: 40px;
                }

                .details h3 {
                    margin-bottom: 8px;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: .08em;
                    color: #6b7280;
                }

                .details p {
                    margin: 4px 0;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 30px;
                }

                th {
                    padding: 12px;
                    text-align: left;
                    background: #f8fafc;
                    border-bottom: 1px solid #e5e7eb;
                }

                td {
                    padding: 15px 12px;
                    border-bottom: 1px solid #e5e7eb;
                }

                .right {
                    text-align: right;
                }

                .totals {
                    width: 320px;
                    margin-left: auto;
                }

                .total-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                }

                .grand-total {
                    margin-top: 10px;
                    padding-top: 15px;
                    border-top: 2px solid #111827;
                    font-size: 20px;
                    font-weight: 800;
                }

                .status {
                    display: inline-block;
                    margin-top: 10px;
                    padding: 6px 12px;
                    border-radius: 999px;
                    background: ${
                        invoice.status === "Paid"
                            ? "#dcfce7"
                            : "#fef3c7"
                    };
                    color: ${
                        invoice.status === "Paid"
                            ? "#166534"
                            : "#92400e"
                    };
                    font-weight: 700;
                    font-size: 13px;
                }

                .footer {
                    margin-top: 50px;
                    padding-top: 20px;
                    border-top: 1px solid #e5e7eb;
                    text-align: center;
                    color: #6b7280;
                    font-size: 13px;
                }

                .print-button {
                    display: block;
                    margin: 25px auto 0;
                    padding: 12px 20px;
                    border: 0;
                    border-radius: 8px;
                    background: #2563eb;
                    color: white;
                    font-weight: 700;
                    cursor: pointer;
                }

                @media print {

                    body {
                        padding: 0;
                        background: white;
                    }

                    .invoice {
                        box-shadow: none;
                        max-width: none;
                    }

                    .print-button {
                        display: none;
                    }

                }

            </style>

        </head>

        <body>

            <div class="invoice">

                <div class="header">

                    <div>

                        <div class="brand">
                            Business<span>OS</span>
                        </div>

                        <p>
                            Business Management System
                        </p>

                    </div>

                    <div class="invoice-title">

                        <h1>INVOICE</h1>

                        <p>
                            ${safe(invoice.invoiceNumber)}
                        </p>

                        <div class="status">
                            ${safe(invoice.status)}
                        </div>

                    </div>

                </div>


                <div class="details">

                    <div>

                        <h3>Bill To</h3>

                        <p>
                            <strong>
                                ${safe(
                                    invoice.customerName
                                )}
                            </strong>
                        </p>

                        ${
                            customer?.email
                                ? `<p>${safe(customer.email)}</p>`
                                : ""
                        }

                        ${
                            customer?.phone
                                ? `<p>${safe(customer.phone)}</p>`
                                : ""
                        }

                    </div>


                    <div>

                        <h3>Invoice Details</h3>

                        <p>
                            <strong>Due Date:</strong>
                            ${formatDate(invoice.dueDate)}
                        </p>

                        <p>
                            <strong>Created:</strong>
                            ${formatDate(invoice.createdAt)}
                        </p>

                    </div>

                </div>


                <table>

                    <thead>

                        <tr>

                            <th>
                                Product
                            </th>

                            <th class="right">
                                Quantity
                            </th>

                            <th class="right">
                                Price
                            </th>

                            <th class="right">
                                Total
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td>
                                ${safe(invoice.productName)}
                            </td>

                            <td class="right">
                                ${invoice.quantity}
                            </td>

                            <td class="right">
                                ${money(
                                    invoice.subtotal /
                                    invoice.quantity
                                )}
                            </td>

                            <td class="right">
                                ${money(invoice.subtotal)}
                            </td>

                        </tr>

                    </tbody>

                </table>


                <div class="totals">

                    <div class="total-row">

                        <span>
                            Subtotal
                        </span>

                        <strong>
                            ${money(invoice.subtotal)}
                        </strong>

                    </div>


                    <div class="total-row">

                        <span>
                            Discount
                        </span>

                        <strong>
                            -${money(invoice.discount)}
                        </strong>

                    </div>


                    <div class="total-row">

                        <span>
                            Tax (${invoice.taxRate}%)
                        </span>

                        <strong>
                            ${money(invoice.tax)}
                        </strong>

                    </div>


                    <div class="total-row grand-total">

                        <span>
                            Total
                        </span>

                        <strong>
                            ${money(invoice.total)}
                        </strong>

                    </div>

                </div>


                <div class="footer">

                    Thank you for doing business with us.

                    <br>

                    BusinessOS — Built by Russette

                </div>


                <button
                    class="print-button"
                    onclick="window.print()">

                    🖨️ Print / Save as PDF

                </button>

            </div>

        </body>
        </html>
    `);

    printWindow.document.close();
};
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


    /* =====================================================
       MODALS
    ===================================================== */

    document
        .querySelectorAll(".modal")
        .forEach(modal => {

            modal.addEventListener(
                "click",
                event => {

                    if (event.target === modal) {

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


    /* =====================================================
       SCROLL
    ===================================================== */

    window.scrollToSection =
        function(sectionId) {

            document
                .getElementById(sectionId)
                ?.scrollIntoView({
                    behavior: "smooth"
                });

        };


    /* =====================================================
       RESET
    ===================================================== */

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


    /* =====================================================
       RENDER EVERYTHING
    ===================================================== */

    function renderAll() {

        renderProducts();

        renderCustomers();

        renderSales();

        renderInvoices();

        updateAnalytics();

    }


    /* =====================================================
       STARTUP
    ===================================================== */

    normalizeProducts();

    normalizeCustomers();

    repairSales();

    normalizeInvoices();

    saveData();

    renderAll();

});
