package com.bms.controller;

import com.bms.dto.accountManagement.AccountResponseDTO;
import com.bms.dto.accountManagement.CreateAccountDTO;
import com.bms.dto.accountManagement.UpdateAccountDTO;
import com.bms.dto.accountManagement.UpdateAccountStatusDTO;
import com.bms.dto.accountManagement.CreateDepositAccountDTO;
import com.bms.dto.accountManagement.CreateWithdrawalAccountDTO;
import com.bms.dto.accountManagement.CreateTransferDTO;
import com.bms.model.Account;
import com.bms.model.Transaction;
import com.bms.service.AccountService;
import com.bms.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.math.BigDecimal;
import java.util.Collections;

/**
 * Controller untuk mengelola rekening bank.
 * Menangani operasi CRUD dan pencarian rekening.
 * Controller berfungsi untuk menerima request dari client,
 * memanggil service yang sesuai, dan mengembalikan response ke client.
 */
@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @Autowired
    private TransactionService transactionService;

    /**
     * Get all accounts
     * 
     * @return
     */
    @GetMapping
    public ResponseEntity<List<AccountResponseDTO>> getAllAccounts() {
        try {
            List<AccountResponseDTO> accounts = accountService.getAllAccounts();
            return ResponseEntity.ok(accounts);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Gagal mengambil data rekening: " + e.getMessage());
        }
    }

    /**
     * Get account by ID
     * 
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    public ResponseEntity<AccountResponseDTO> getAccountById(@PathVariable Long id) {
        try {
            AccountResponseDTO account = accountService.getAccountById(id);
            return ResponseEntity.ok(account);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Gagal mengambil data rekening: " + e.getMessage());
        }
    }

    /**
     * Get accounts by customer ID
     * 
     * @param customerId
     * @return
     */
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<AccountResponseDTO>> getAccountsByCustomerId(@PathVariable Long customerId) {
        try {
            List<AccountResponseDTO> accounts = accountService.getAccountsByCustomerId(customerId);
            return ResponseEntity.ok(accounts);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Gagal mengambil data rekening: " + e.getMessage());
        }
    }

    /**
     * Create new account
     * 
     * @param createAccountDTO
     * @return
     */
    @PostMapping("/add")
    public ResponseEntity<?> createAccount(@Valid @RequestBody CreateAccountDTO createAccountDTO) {
        try {
            // debug data dari createAccountDTO
            System.out.println("Menerima request pembuatan rekening dengan data: " + createAccountDTO);
            AccountResponseDTO newAccount = accountService.createAccount(createAccountDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(newAccount);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Gagal membuat rekening: " + e.getMessage()));
        }
    }

    /**
     * Update account details
     * 
     * @param id
     * @param updateAccountDTO
     * @return
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAccount(@PathVariable Long id,
            @Valid @RequestBody UpdateAccountDTO updateAccountDTO) {
        try {
            AccountResponseDTO updatedAccount = accountService.updateAccount(id, updateAccountDTO);
            return ResponseEntity.ok(updatedAccount);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Gagal mengupdate rekening: " + e.getMessage()));
        }
    }

    /**
     * Update account status
     * 
     * @param id
     * @param updateAccountStatusDTO
     * @return
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateAccountStatus(@PathVariable Long id,
            @Valid @RequestBody UpdateAccountStatusDTO updateAccountStatusDTO) {
        // debug data yang diterima
        System.out.println(
                "AccountController@Menerima request update status rekening dengan data: " + updateAccountStatusDTO);
        try {
            AccountResponseDTO updatedAccount = accountService.updateAccountStatus(id, updateAccountStatusDTO);
            // debug data yang dikembalikan
            System.out.println("Rekening berhasil diupdate: " + updatedAccount);
            return ResponseEntity.ok(updatedAccount);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Gagal mengupdate status rekening: " + e.getMessage()));
        }
    }

    /**
     * Delete account
     * 
     * @param id
     * @return
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable Long id) {
        try {
            accountService.deleteAccount(id);
            return ResponseEntity.ok(Map.of("message", "Rekening berhasil dihapus"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Gagal menghapus rekening: " + e.getMessage()));
        }
    }

    /**
     * Search accounts by account number (partial match)
     * 
     * @param accountNumber
     * @return
     */
    @GetMapping("/search")
    public ResponseEntity<List<AccountResponseDTO>> searchAccounts(@RequestParam String accountNumber) {
        try {
            List<AccountResponseDTO> accounts = accountService.searchAccountsByNumber(accountNumber);
            return ResponseEntity.ok(accounts);
        } catch (Exception e) {
            // Jika error, return array kosong
            return ResponseEntity.ok(Collections.emptyList());
        }
    }

    /**
     * Get account statistics
     * 
     * @return
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getAccountStatistics() {
        try {
            Map<String, Object> statistics = accountService.getAccountStatistics();
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Gagal mengambil statistik rekening: " + e.getMessage());
        }
    }

    /**
     * Check if account number exists
     * 
     * @param accountNumber
     * @return
     */
    @GetMapping("/check-number/{accountNumber}")
    public ResponseEntity<Map<String, Boolean>> checkAccountNumber(@PathVariable String accountNumber) {
        try {
            boolean exists = accountService.isAccountNumberExists(accountNumber);
            return ResponseEntity.ok(Map.of("exists", exists));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Gagal memeriksa nomor rekening: " + e.getMessage());
        }
    }

    /**
     * Get accounts by type
     * 
     * @param accountType
     * @return
     */
    @GetMapping("/type/{accountType}")
    public ResponseEntity<List<AccountResponseDTO>> getAccountsByType(@PathVariable String accountType) {
        try {
            List<AccountResponseDTO> accounts = accountService.getAccountsByType(accountType);
            return ResponseEntity.ok(accounts);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Gagal mengambil data rekening: " + e.getMessage());
        }
    }

    /**
     * Get accounts by status
     * 
     * @param status
     * @return
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<AccountResponseDTO>> getAccountsByStatus(@PathVariable String status) {
        try {
            List<AccountResponseDTO> accounts = accountService.getAccountsByStatus(status);
            return ResponseEntity.ok(accounts);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Gagal mengambil data rekening: " + e.getMessage());
        }
    }

    /**
     * Deposit funds into an account by nomor rekening
     * 
     * @param accountNumber
     * @param amount
     * @return
     */
    @PostMapping("/deposit/{accountNumber}")
    public ResponseEntity<?> depositToAccount(
            @PathVariable String accountNumber,
            @RequestBody CreateDepositAccountDTO depositDTO) {
        try {
            BigDecimal amount = depositDTO.getAmount();
            AccountResponseDTO updatedAccount = accountService.depositToAccount(accountNumber, amount);

            // --- Catat transaksi DEPOSIT ---
            Transaction depositTransaction = new Transaction();
            depositTransaction.setTransactionType("DEPOSIT");
            depositTransaction.setAmount(amount);
            depositTransaction.setDescription("Setoran tunai");
            depositTransaction.setStatus("SUCCESS");

            String referenceNumber = "DEP-" + System.currentTimeMillis();
            depositTransaction.setReferenceNumber(referenceNumber);
            Account account = accountService.getAccountEntityByAccountNumber(accountNumber);
            depositTransaction.setAccount(account);
            transactionService.recordTransaction(depositTransaction);

            return ResponseEntity.ok(Map.of(
                    "message", "Deposit berhasil",
                    "updatedAccount", updatedAccount,
                    "depositTransaction", depositTransaction));
        } catch (IllegalArgumentException e) {
            // Jika rekening tidak ditemukan atau amount tidak valid
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Gagal melakukan deposit: " + e.getMessage()));
        }
    }

    /**
     * Withdraw funds from an account by nomor rekening
     * 
     * @param accountNumber
     * @param amount
     * @return
     */
    @PostMapping("/withdraw/{accountNumber}")
    public ResponseEntity<?> withdrawFromAccount(
            @PathVariable String accountNumber,
            @RequestBody CreateWithdrawalAccountDTO withdrawalDTO) {
        try {
            BigDecimal amount = new BigDecimal(withdrawalDTO.getAmount());
            AccountResponseDTO updatedAccount = accountService.withdrawFromAccount(accountNumber, amount);

            // --- Catat transaksi WITHDRAWAL ---
            Transaction withdrawalTransaction = new Transaction();
            withdrawalTransaction.setTransactionType("WITHDRAWAL");
            withdrawalTransaction.setAmount(amount);
            withdrawalTransaction.setDescription("Penarikan tunai");
            withdrawalTransaction.setStatus("SUCCESS");
            String referenceNumber = "WD-" + System.currentTimeMillis();
            withdrawalTransaction.setReferenceNumber(referenceNumber);
            Account account = accountService.getAccountEntityByAccountNumber(accountNumber);
            withdrawalTransaction.setAccount(account);
            transactionService.recordTransaction(withdrawalTransaction);

            return ResponseEntity.ok(Map.of(
                    "message", "Penarikan berhasil",
                    "updatedAccount", updatedAccount,
                    "withdrawalTransaction", withdrawalTransaction));
        } catch (IllegalArgumentException e) {
            // Jika rekening tidak ditemukan atau amount tidak valid
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Gagal melakukan penarikan: " + e.getMessage()));
        }
    }

    /**
     * Transfer funds between two accounts by nomor rekening
     * 
     * @param transferDTO
     * @return
     */
    @PostMapping("/transfer")
    public ResponseEntity<?> transferBetweenAccounts(@Valid @RequestBody CreateTransferDTO transferDTO) {
        try {
            AccountResponseDTO fromAccount = accountService.transferBetweenAccounts(
                    transferDTO.getFromAccountNumber(),
                    transferDTO.getToAccountNumber(),
                    new BigDecimal(transferDTO.getAmount()));

            // --- Catat transaksi untuk pengirim (DEBIT) ---
            Transaction senderTransaction = new Transaction();
            senderTransaction.setTransactionType("TRANSFER_DEBIT");
            senderTransaction.setAmount(new BigDecimal(transferDTO.getAmount()));
            senderTransaction.setDescription(transferDTO.getDescription());
            senderTransaction.setStatus("SUCCESS");
            String referenceNumber = "TRF-" + System.currentTimeMillis();
            senderTransaction.setReferenceNumber(referenceNumber);
            Account senderAccount = accountService.getAccountEntityByAccountNumber(transferDTO.getFromAccountNumber());
            senderTransaction.setAccount(senderAccount);
            transactionService.recordTransaction(senderTransaction);

            // --- Catat transaksi untuk penerima (CREDIT) ---
            Transaction receiverTransaction = new Transaction();
            receiverTransaction.setTransactionType("TRANSFER_CREDIT");
            receiverTransaction.setAmount(new BigDecimal(transferDTO.getAmount()));
            receiverTransaction.setDescription(transferDTO.getDescription());
            receiverTransaction.setStatus("SUCCESS");
            receiverTransaction.setReferenceNumber(referenceNumber); // gunakan referensi yang sama
            Account receiverAccount = accountService.getAccountEntityByAccountNumber(transferDTO.getToAccountNumber());
            receiverTransaction.setAccount(receiverAccount);
            transactionService.recordTransaction(receiverTransaction);

            return ResponseEntity.ok(Map.of(
                    "message", "Transfer berhasil",
                    "fromAccount", fromAccount,
                    "senderTransaction", senderTransaction,
                    "receiverTransaction", receiverTransaction));
        } catch (IllegalArgumentException e) {
            // Jika rekening tidak ditemukan atau amount tidak valid
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Gagal melakukan transfer: " + e.getMessage()));
        }
    }
}