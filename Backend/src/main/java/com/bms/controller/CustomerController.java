package com.bms.controller;

import com.bms.model.Customer;
import com.bms.service.CustomerService;
import com.bms.dto.customerManagement.GetCustomerDTO;
import com.bms.dto.customerManagement.CreateCustomerDTO;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/**
 * Controller untuk manajemen customer.
 * Endpoints:
 * - GET /api/customers : Untuk mendapatkan semua customer.
 * - POST /api/customers : Untuk membuat customer baru.
 * Menggunakan service CustomerService untuk operasi terkait customer.
 * Mengembalikan response dalam format JSON.
 */
@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    /**
     * Get all customers
     * 
     * @return
     */
    @GetMapping
    public List<GetCustomerDTO> getAllCustomers() {
        try {
            return customerService.getAllCustomers();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching customers", e);
        }
    }

    /**
     * Create new customer
     * 
     * @param req
     * @return
     */
    @PostMapping
    public Customer createCustomer(@RequestBody CreateCustomerDTO req) {
        try {
            // debug data dari frontend
            System.out.println("CustomerController@Received create customer request: " + req);
            return customerService.createCustomer(req.getCustomer(), req.getUserId());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error creating customer", e);
        }
    }

}