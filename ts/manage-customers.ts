import { Customer } from "./dto/customer";
import $ from 'jquery';

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