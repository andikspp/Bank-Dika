package com.bms.controller;

import com.bms.model.Transaction;
import com.bms.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    // Get all transactions
    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        List<Transaction> transactions = transactionService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }

    // Get transaction by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getTransactionById(@PathVariable Long id) {
        Optional<Transaction> transaction = transactionService.getTransactionById(id);
        return transaction.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get transactions by account number
    @GetMapping("/account/{accountNumber}")
    public ResponseEntity<List<Transaction>> getTransactionsByAccountNumber(@PathVariable String accountNumber) {
        List<Transaction> transactions = transactionService.getTransactionsByAccountNumber(accountNumber);
        return ResponseEntity.ok(transactions);
    }

    // Get transactions by type
    @GetMapping("/type/{transactionType}")
    public ResponseEntity<List<Transaction>> getTransactionsByType(@PathVariable String transactionType) {
        List<Transaction> transactions = transactionService.getTransactionsByType(transactionType);
        return ResponseEntity.ok(transactions);
    }

    // Get transactions by reference number
    @GetMapping("/reference/{referenceNumber}")
    public ResponseEntity<List<Transaction>> getTransactionsByReferenceNumber(@PathVariable String referenceNumber) {
        List<Transaction> transactions = transactionService.getTransactionsByReferenceNumber(referenceNumber);
        return ResponseEntity.ok(transactions);
    }

    // Create/record a new transaction
    @PostMapping
    public ResponseEntity<Transaction> recordTransaction(@RequestBody Transaction transaction) {
        Transaction savedTransaction = transactionService.recordTransaction(transaction);
        return ResponseEntity.ok(savedTransaction);
    }
}