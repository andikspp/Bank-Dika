package com.bms.controller;

import com.bms.model.Customer;
import com.bms.service.CustomerService;
import com.bms.dto.customerManagement.GetCustomerDTO;
import com.bms.dto.customerManagement.GetCustomerDetailDTO;
import com.bms.dto.customerManagement.CreateCustomerDTO;
import com.bms.dto.customerManagement.UpdateCustomerDTO;
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
     * Get customer by ID
     * 
     * @param req
     * @return
     */
    @GetMapping("/{id}")
    public GetCustomerDetailDTO getCustomerById(@PathVariable Long id) {
        try {
            return customerService.getCustomerById(id);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching customer", e);
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

    /**
     * Update existing customer
     * 
     * @param id
     * @param req
     * @return
     */
    @PutMapping("/{id}")
    public Customer updateCustomer(@PathVariable Long id, @RequestBody UpdateCustomerDTO req) {
        try {
            return customerService.updateCustomer(id, req);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error updating customer", e);
        }
    }

    /**
     * Delete customer by ID
     * 
     * @param id
     * @return
     */
    @DeleteMapping("/{id}")
    public void deleteCustomer(@PathVariable Long id) {
        try {
            // debug id dari frontend
            System.out.println("CustomerController@Received delete customer request for ID: " + id);
            customerService.deleteCustomer(id);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error deleting customer", e);
        }
    }
}