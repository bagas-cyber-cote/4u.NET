// Mikrotik Hotspot Login Handler
// This script handles login for Mikrotik hotspot system

function handleLogin(type) {
    // Hide all error notifications first
    const subscriptionError = document.getElementById('subscription-error');
    const voucherError = document.getElementById('voucher-error');
    if (subscriptionError) subscriptionError.style.display = 'none';
    if (voucherError) voucherError.style.display = 'none';

    // Create form to post to Mikrotik login
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/login'; // Mikrotik login endpoint

    // Add standard Mikrotik hidden fields
    const dstInput = document.createElement('input');
    dstInput.type = 'hidden';
    dstInput.name = 'dst';
    dstInput.value = window.location.href; // Current page as destination
    form.appendChild(dstInput);

    const popupInput = document.createElement('input');
    popupInput.type = 'hidden';
    popupInput.name = 'popup';
    popupInput.value = 'true';
    form.appendChild(popupInput);

    if (type === 'subscription') {
        const username = document.getElementById('sub-username').value.trim();
        const password = document.getElementById('sub-password').value.trim();

        if (!username || !password) {
            if (subscriptionError) {
                subscriptionError.innerText = 'Username dan Password harus diisi!';
                subscriptionError.style.display = 'block';
            }
            return;
        }

        // Add username and password for membership login
        const userInput = document.createElement('input');
        userInput.type = 'hidden';
        userInput.name = 'username';
        userInput.value = username;
        form.appendChild(userInput);

        const passInput = document.createElement('input');
        passInput.type = 'hidden';
        passInput.name = 'password';
        passInput.value = password;
        form.appendChild(passInput);

    } else if (type === 'voucher') {
        const voucher = document.getElementById('voucher-code').value.trim();

        if (!voucher) {
            if (voucherError) {
                voucherError.innerText = 'Kode Voucher harus diisi!';
                voucherError.style.display = 'block';
            }
            return;
        }

        // For voucher, use voucher code as username, empty password
        const userInput = document.createElement('input');
        userInput.type = 'hidden';
        userInput.name = 'username';
        userInput.value = voucher;
        form.appendChild(userInput);

        const passInput = document.createElement('input');
        passInput.type = 'hidden';
        passInput.name = 'password';
        passInput.value = '';
        form.appendChild(passInput);
    }

    // Submit the form to Mikrotik
    document.body.appendChild(form);
    form.submit();
}

function switchTab(tabName) {
    // Hide all forms
    document.querySelectorAll('.login-form').forEach(form => {
        form.classList.remove('active');
    });

    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected form
    if (tabName === 'subscription') {
        document.getElementById('subscription-form').classList.add('active');
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
    } else if (tabName === 'voucher') {
        document.getElementById('voucher-form').classList.add('active');
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
    }
}

function toggleMembershipTable() {
    const tableContainer = document.getElementById('membership-table-container');
    tableContainer.style.display = tableContainer.style.display === 'none' ? 'block' : 'none';
}

function toggleVoucherTable() {
    const tableContainer = document.getElementById('voucher-table-container');
    tableContainer.style.display = tableContainer.style.display === 'none' ? 'block' : 'none';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Clear all input data
    document.querySelectorAll('input').forEach(input => {
        input.value = '';
    });

    // Check for expired parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('expired') === 'true') {
        // Show expiry notification based on active tab
        const activeTab = document.querySelector('.tab-btn.active');
        if (activeTab && activeTab.textContent.includes('Membership')) {
            const notification = document.getElementById('subscription-expiry-notification');
            if (notification) {
                notification.style.display = 'block';
            }
        } else if (activeTab && activeTab.textContent.includes('Voucher')) {
            const notification = document.getElementById('voucher-expiry-notification');
            if (notification) {
                notification.style.display = 'block';
            }
        }
    }

    // Prevent form submission warning
    window.onbeforeunload = null;
});
