document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       BUSINESSOS DATA
       ===================================================== */

    let products = JSON.parse(
        localStorage.getItem("businessOSProducts")
    ) || [];

    let customers = JSON.parse(
        localStorage.getItem("businessOSCustomers")
    ) || [];

    let sales = JSON.parse(
        localStorage.getItem("businessOSSales")
    ) || [];

    let invoices = JSON.parse(
        localStorage.getItem("businessOSInvoices")
    ) || [];


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
            Math.random()
                .toString(36)
                .substring(2, 8);
    }


    function setText(id, value) {

        const element =
            document.getElementById(id);

        if (element) {

            element.textContent = value;

        }
    }


    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function formatDate(date) {

        if (!date) return "—";

        const parsed =
            new Date(date);

        if (isNaN(parsed.getTime())) {

            return String(date);

        }

        return parsed.toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );
    }


    /* =====================================================
       NORMALIZE OLD SALES
       ===================================================== */

    function normalizeSales() {

        sales = sales.map(sale => {

            let productName =
                sale.productName;

            let total =
                Number(sale.total);


            /* Find product name if old sale
               didn't save it correctly */

            if (
                !productName ||
                productName === "undefined"
            ) {

                const product =
                    products.find(
                        p =>
                            p.id === sale.productId
                    );


                if (product) {

                    productName =
                        product.name;

                } else {

                    productName =
                        "Unknown Product";

                }
            }


            /* Fix old sales where total was
               missing or incorrectly saved */

            if (
                !Number.isFinite(total) ||
                total <= 0
            ) {

                const product =
                    products.find(
                        p =>
                            p.id === sale.productId
                    );


                if (product) {

                    total =
                        Number(product.price) *
                        Number(sale.quantity || 1);

                } else {

                    total = 0;

                }
            }


            return {
                ...sale,
                productName: productName,
                total: total,
                quantity:
                    Number(sale.quantity) || 1
            };

        });


        saveData();
    }


    /* =====================================================
       PRODUCTS
       ===================================================== */

    function renderProducts() {

        const container =
            document.getElementById(
                "productsList"
            );

        if (!container) return;


        if (products.length === 0) {

            container.innerHTML = `
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


        container.innerHTML =
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
                            ${escapeHTML(product.name)}
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


    /* =====================================================
       PRODUCT MODAL
       ===================================================== */

    window.openProductModal =
        function(id = null) {

            const modal =
                document.getElementById(
                    "productModal"
                );

            if (!modal) return;


            const form =
                document.getElementById(
                    "productForm"
                );


            if (form) {

                form.reset();

            }


            const idInput =
                document.getElementById(
                    "productId"
                );

            const title =
                document.getElementById(
                    "productModalTitle"
                );


            if (id) {

                const product =
                    products.find(
                        p => p.id === id
                    );


                if (!product) return;


                if (title) {

                    title.textContent =
                        "Edit Product";

                }


                if (idInput) {

                    idInput.value =
                        product.id;

                }


                document.getElementById(
                    "productName"
                ).value =
                    product.name;


                document.getElementById(
                    "productPrice"
                ).value =
                    product.price;


                document.getElementById(
                    "productStock"
                ).value =
                    product.stock;

            } else {

                if (title) {

                    title.textContent =
                        "Add Product";

                }


                if (idInput) {

                    idInput.value = "";

                }

            }


            modal.classList.add("active");
        };


    window.closeProductModal =
        function() {

            const modal =
                document.getElementById(
                    "productModal"
                );

            if (modal) {

                modal.classList.remove(
                    "active"
                );

            }
        };


    window.editProduct =
        function(id) {

            window.openProductModal(id);

        };


    /* =====================================================
       SAVE PRODUCT
       ===================================================== */

    const productForm =
        document.getElementById(
            "productForm"
        );


    if (productForm) {

        productForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const id =
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

                    alert(
                        "Please enter a product name."
                    );

                    return;
                }


                if (
                    price < 0 ||
                    stock < 0
                ) {

                    alert(
                        "Price and stock cannot be negative."
                    );

                    return;
                }


                if (id) {

                    const product =
                        products.find(
                            p => p.id === id
                        );


                    if (product) {

                        product.name =
                            name;

                        product.price =
                            price;

                        product.stock =
                            stock;

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

                window.closeProductModal();

            }
        );

    }


    /* =====================================================
       DELETE PRODUCT
       ===================================================== */

    window.deleteProduct =
        function(id) {

            const product =
                products.find(
                    p => p.id === id
                );


            if (!product) return;


            if (
                !confirm(
                    `Delete "${product.name}"?`
                )
            ) {

                return;

            }


            products =
                products.filter(
                    p => p.id !== id
                );


            saveData();

            renderAll();
        };


    /* =====================================================
       CUSTOMERS
       ===================================================== */

    function renderCustomers() {

        const container =
            document.getElementById(
                "customersList"
            );

        if (!container) return;


        if (customers.length === 0) {

            container.innerHTML = `
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


        container.innerHTML =
            customers.map(customer => {

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


    window.openCustomerModal =
        function() {

            const modal =
                document.getElementById(
                    "customerModal"
                );

            if (!modal) return;


            document
                .getElementById(
                    "customerForm"
                )
                ?.reset();


            modal.classList.add(
                "active"
            );
        };


    window.closeCustomerModal =
        function() {

            document
                .getElementById(
                    "customerModal"
                )
                ?.classList.remove(
                    "active"
                );
        };


    const customerForm =
        document.getElementById(
            "customerForm"
        );


    if (customerForm) {

        customerForm.addEventListener(
            "submit",
            event => {

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

                    alert(
                        "Please enter the customer's name."
                    );

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

                window.closeCustomerModal();

            }
        );

    }


    window.deleteCustomer =
        function(id) {

            if (
                !confirm(
                    "Delete this customer?"
                )
            ) return;


            customers =
                customers.filter(
                    c => c.id !== id
                );


            saveData();

            renderAll();
        };


    /* =====================================================
       SALES
       ===================================================== */

    window.openSaleModal =
        function() {

            const modal =
                document.getElementById(
                    "saleModal"
                );

            if (!modal) return;


            const select =
                document.getElementById(
                    "saleProduct"
                );


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


            document.getElementById(
                "saleQuantity"
            ).value = 1;


            updateSaleTotal();

            modal.classList.add(
                "active"
            );
        };


    window.closeSaleModal =
        function() {

            document
                .getElementById(
                    "saleModal"
                )
                ?.classList.remove(
                    "active"
                );
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
                ? Number(product.price) *
                  quantity
                : 0;


        setText(
            "saleTotal",
            money(total)
        );
    }


    document
        .getElementById(
            "saleProduct"
        )
        ?.addEventListener(
            "change",
            updateSaleTotal
        );


    document
        .getElementById(
            "saleQuantity"
        )
        ?.addEventListener(
            "input",
            updateSaleTotal
        );


    const saleForm =
        document.getElementById(
            "saleForm"
        );


    if (saleForm) {

        saleForm.addEventListener(
            "submit",
            event => {

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

                    alert(
                        "Please select a product."
                    );

                    return;
                }


                if (
                    quantity <= 0 ||
                    !Number.isInteger(quantity)
                ) {

                    alert(
                        "Enter a valid whole-number quantity."
                    );

                    return;
                }


                if (
                    quantity >
                    Number(product.stock)
                ) {

                    alert(
                        `Only ${product.stock} units are available.`
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

                    quantity:
                        quantity,

                    total:
                        total,

                    date:
                        new Date().toISOString()

                });


                product.stock -=
                    quantity;


                saveData();

                renderAll();

                window.closeSaleModal();

            }
        );

    }


    function renderSales() {

        const container =
            document.getElementById(
                "salesList"
            );

        if (!container) return;


        if (sales.length === 0) {

            container.innerHTML = `
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


        container.innerHTML =
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
                                        ${escapeHTML(
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
        function(id) {

            const sale =
                sales.find(
                    s => s.id === id
                );


            if (!sale) return;


            if (
                !confirm(
                    "Delete this sale?"
                )
            ) return;


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


            sales =
                sales.filter(
                    s => s.id !== id
                );


            saveData();

            renderAll();
        };


    /* =====================================================
       ANALYTICS
       ===================================================== */

    function updateAnalytics() {

        /*
         * IMPORTANT:
         * Revenue is calculated directly from sales.
         */

        const totalRevenue =
            sales.reduce(
                (sum, sale) => {

                    return sum +
                        Number(sale.total || 0);

                },
                0
            );


        const unitsSold =
            sales.reduce(
                (sum, sale) => {

                    return sum +
                        Number(sale.quantity || 0);

                },
                0
            );


        const averageSale =
            sales.length > 0
                ? totalRevenue /
                  sales.length
                : 0;


        const largestSale =
            sales.length > 0
                ? Math.max(
                    ...sales.map(
                        sale =>
                            Number(
                                sale.total || 0
                            )
                    )
                )
                : 0;


        const unitsInStock =
            products.reduce(
                (sum, product) => {

                    return sum +
                        Number(
                            product.stock || 0
                        );

                },
                0
            );


        const inventoryValue =
            products.reduce(
                (sum, product) => {

                    return sum +
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


        /* =================================================
           BEST SELLER
           ================================================= */

        const productSales = {};


        sales.forEach(sale => {

            const name =
                sale.productName ||
                "Unknown Product";


            if (
                !productSales[name]
            ) {

                productSales[name] = 0;

            }


            productSales[name] +=
                Number(
                    sale.quantity || 0
                );

        });


        const rankedProducts =
            Object.entries(
                productSales
            )
            .sort(
                (a, b) =>
                    b[1] - a[1]
            );


        const bestSeller =
            rankedProducts.length
                ? rankedProducts[0][0]
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
           ANALYTICS CARDS
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


        renderTopProducts(
            rankedProducts
        );


        renderInventoryAlerts();

        renderRevenueChart();
    }


    /* =====================================================
       TOP PRODUCTS
       ===================================================== */

    function renderTopProducts(
        rankedProducts
    ) {

        const container =
            document.getElementById(
                "topProducts"
            );


        if (!container) return;


        if (
            rankedProducts.length === 0
        ) {

            container.innerHTML = `
                <div class="empty-state">
                    No sales yet.
                </div>
            `;

            return;
        }


        container.innerHTML =
            rankedProducts
                .slice(0, 5)
                .map(
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


        if (!container) return;


        const lowStock =
            products.filter(
                product =>
                    Number(
                        product.stock
                    ) <= 3
            );


        if (
            lowStock.length === 0
        ) {

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


    /* =====================================================
       REVENUE TREND
       ===================================================== */

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
                    sale =>
                        Number(
                            sale.total || 0
                        )
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

                ${recentSales.map(
                    sale => {

                        const amount =
                            Number(
                                sale.total || 0
                            );


                        const height =
                            maxRevenue > 0
                                ? Math.max(
                                    8,
                                    (
                                        amount /
                                        maxRevenue
                                    ) * 130
                                )
                                : 8;


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

                    }
                ).join("")}

            </div>
        `;
    }


    /* =====================================================
       INVOICES
       ===================================================== */

    window.openInvoiceModal =
        function() {

            const modal =
                document.getElementById(
                    "invoiceModal"
                );


            if (!modal) return;


            populateInvoiceCustomers();

            populateInvoiceProducts();

            document
                .getElementById(
                    "invoiceForm"
                )
                ?.reset();


            generateInvoiceNumber();

            setInvoiceDueDate();

            updateInvoiceTotal();


            modal.classList.add(
                "active"
            );
        };


    window.closeInvoiceModal =
        function() {

            document
                .getElementById(
                    "invoiceModal"
                )
                ?.classList.remove(
                    "active"
                );
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
                    ${escapeHTML(
                        customer.name
                    )}
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
                    ${escapeHTML(
                        product.name
                    )}
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
                Math.random() *
                900000
            );
    }


    function setInvoiceDueDate() {

        const input =
            document.getElementById(
                "invoiceDueDate"
            );


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
                ? Number(product.price) *
                  quantity
                : 0;


        const safeDiscount =
            Math.min(
                Math.max(discount, 0),
                subtotal
            );


        const taxable =
            subtotal -
            safeDiscount;


        const tax =
            taxable *
            (Math.max(taxRate, 0) / 100);


        const total =
            taxable + tax;


        setText(
            "invoiceSubtotal",
            money(subtotal)
        );


        setText(
            "invoiceDiscountDisplay",
            "-" + money(safeDiscount)
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
        .getElementById(
            "invoiceProduct"
        )
        ?.addEventListener(
            "change",
            updateInvoiceTotal
        );


    document
        .getElementById(
            "invoiceQuantity"
        )
        ?.addEventListener(
            "input",
            updateInvoiceTotal
        );


    document
        .getElementById(
            "invoiceDiscount"
        )
        ?.addEventListener(
            "input",
            updateInvoiceTotal
        );


    document
        .getElementById(
            "invoiceTax"
        )
        ?.addEventListener(
            "input",
            updateInvoiceTotal
        );


    /* =====================================================
       SAVE INVOICE
       ===================================================== */

    const invoiceForm =
        document.getElementById(
            "invoiceForm"
        );


    if (invoiceForm) {

        invoiceForm.addEventListener(
            "submit",
            event => {

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
                        c =>
                            c.id ===
                            customerId
                    );


                const product =
                    products.find(
                        p =>
                            p.id ===
                            productId
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


                if (
                    quantity <= 0 ||
                    !Number.isInteger(quantity)
                ) {

                    alert(
                        "Enter a valid quantity."
                    );

                    return;
                }


                const subtotal =
                    Number(product.price) *
                    quantity;


                const discount =
                    Math.min(
                        Math.max(
                            Number(
                                document
                                    .getElementById(
                                        "invoiceDiscount"
                                    )
                                    .value
                            ) || 0,
                            0
                        ),
                        subtotal
                    );


                const taxRate =
                    Math.max(
                        Number(
                            document
                                .getElementById(
                                    "invoiceTax"
                                )
                                .value
                        ) || 0,
                        0
                    );


                const taxable =
                    subtotal -
                    discount;


                const tax =
                    taxable *
                    (taxRate / 100);


                const total =
                    taxable + tax;


                const invoiceNumber =
                    document.getElementById(
                        "invoiceNumber"
                    ).value;


                invoices.push({

                    id: createId(),

                    invoiceNumber:
                        invoiceNumber,

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
                        discount,

                    taxRate:
                        taxRate,

                    tax:
                        tax,

                    total:
                        total,

                    dueDate:
                        document
                            .getElementById(
                                "invoiceDueDate"
                            )
                            .value,

                    createdAt:
                        new Date()
                            .toISOString(),

                    status:
                        "Unpaid"

                });


                saveData();

                renderAll();

                window.closeInvoiceModal();


                alert(
                    `${invoiceNumber} created successfully.`
                );

            }
        );

    }


    /* =====================================================
       RENDER INVOICES
       ===================================================== */

    function renderInvoices() {

        const container =
            document.getElementById(
                "invoicesList"
            );


        if (!container) return;


        if (invoices.length === 0) {

            container.innerHTML = `
                <div class="empty-state">

                    <div class="empty-icon">
                        🧾
                    </div>

                    <h3>No invoices yet</h3>

                    <p>
                        Create your first invoice
                        for a customer.
                    </p>

                </div>
            `;

            return;
        }


        container.innerHTML =
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
                                        ${escapeHTML(
                                            invoice.invoiceNumber
                                        )}
                                    </h3>

                                    <p>
                                        ${escapeHTML(
                                            invoice.customerName
                                        )}
                                    </p>

                                    <p>
                                        ${escapeHTML(
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
                                    ${escapeHTML(
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
        function(id) {

            if (
                !confirm(
                    "Delete this invoice?"
                )
            ) return;


            invoices =
                invoices.filter(
                    invoice =>
                        invoice.id !== id
                );


            saveData();

            renderAll();
        };


    /* =====================================================
       RESET
       ===================================================== */

    window.resetBusinessData =
        function() {

            if (
                !confirm(
                    "This will permanently delete all BusinessOS data. Continue?"
                )
            ) {

                return;

            }


            if (
                !confirm(
                    "Are you absolutely sure?"
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
                "BusinessOS has been reset."
            );
        };


    /* =====================================================
       CLOSE MODALS
       ===================================================== */

    document
        .querySelectorAll(".modal")
        .forEach(modal => {

            modal.addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        modal
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

            if (
                event.key ===
                "Escape"
            ) {

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
       START
       ===================================================== */

    normalizeSales();

    renderAll();

});
