import $ from 'jquery';
import { Customer } from "./dto/customer";

let customers: Array<Customer> = [];
let totalCustomers = 0;
const BASE_API = 'http://localhost:8080/pos';
const CUSTOMERS_SERVICE_API = `${BASE_API}/customers`;

loadAllCustomers();


function loadAllCustomers():void{
    const http = new XMLHttpRequest();

    http.onreadystatechange = () => {

        if (http.readyState === http.DONE) {

            if (http.status !== 200) {
                alert("Failed to fetch customers, try again...!");
                return;
            }

            totalCustomers = +(http.getResponseHeader('X-Total-Count'));
            customers = JSON.parse(http.responseText);

            $('#tbl-customers tbody tr').remove();

            customers.forEach((c) => {
                const rowHtml = `<tr>
                 <td>${c.id}</td>
                 <td>${c.name}</td>
                 <td>${c.address}</td>
                 <td><i class="fas fa-trash"></i></td>
                 </tr>` ;


                $('#tbl-customers tbody').append(rowHtml);
            });
        }

    };

    http.open('GET', CUSTOMERS_SERVICE_API , true);


    http.send();

};


$("#btn-save").on('click', (eventData) => {
    console.log("save");
    eventData.preventDefault();

    const txtId = $("#txt-id");
    const txtName = $("#txt-name");
    const txtAddress = $("#txt-address");

    let id = (txtId.val() as string).trim();
    let name = (txtName.val() as string).trim();
    let address = (txtAddress.val() as string).trim();

    let validated = true;

    $('#txt-id, #txt-name, #txt-address').removeClass('is-invalid');

    if (address.length < 3) {
        txtAddress.addClass('is-invalid');
        txtAddress.trigger('select');
        validated = false;
    }

    if (!/^[A-Za-z ]+$/.test(name)) {
        txtName.addClass('is-invalid');
        txtName.trigger('select');
        validated = false;
    }

    if (!/^C\d{3}$/.test(id)) {
        txtId.addClass('is-invalid');
        txtId.trigger('select');
        validated = false;
    }

    if (!validated) {
        return;
    }

    saveCustomer(new Customer(id, name, address));
});

function saveCustomer(customer: Customer): void {

    const http = new XMLHttpRequest();

    http.onreadystatechange = () => {

        if (http.readyState !== http.DONE) return;

        if (http.status !== 201){
            alert("Failed to save the customer, retry");
            return;
        }

        alert("Customer has been saved successfully");
        //navigateToPage(pageCount);
        $("#txt-id, #txt-name, #txt-address").val('');
        $("#txt-id").trigger('focus');

    };

    http.open('POST', CUSTOMERS_SERVICE_API, true);

    // 4. 
    http.setRequestHeader('Content-Type', 'application/json');

    http.send(JSON.stringify(customer));

}

function deleteCustomer(id: string): void {
    const http = new XMLHttpRequest();

    http.onreadystatechange = () => {

        if (http.readyState === http.DONE) {

            if (http.status !== 204) {
                alert("Failed to delete customer, try again...!");
                return;
            }

        
        }

    };

    http.open('DELETE', CUSTOMERS_SERVICE_API + `?id=${id}`, true);

    http.send();
}

$('#btn-clear').on('click', () => {
    $("#tbl-customers tbody tr.selected").removeClass('selected');
    $("#txt-id").removeAttr('disabled').trigger('focus');
});