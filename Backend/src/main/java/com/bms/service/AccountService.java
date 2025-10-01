package com.bms.service;

import com.bms.dto.accountManagement.AccountResponseDTO;
import com.bms.dto.accountManagement.CreateAccountDTO;
import com.bms.dto.accountManagement.UpdateAccountDTO;
import com.bms.dto.accountManagement.UpdateAccountStatusDTO;
import com.bms.model.Account;
import com.bms.model.Customer;
import com.bms.model.Transaction;
import com.bms.repository.AccountRepository;
import com.bms.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.Optional;
import java.util.Collections;

/**
 * Service untuk manajemen rekening.
 * Operasi:
 * - Mendapatkan semua rekening.
 * - Mendapatkan rekening berdasarkan ID.
 * - Mendapatkan rekening berdasarkan ID nasabah.
 * - Membuat rekening baru dengan nomor rekening unik.
 * - Memperbarui informasi rekening.
 * - Memperbarui status rekening (aktif/non-aktif).
 * - Menghapus rekening.
 * - Mencari rekening berdasarkan nomor rekening.
 * - Mendapatkan statistik rekening.
 * - Memeriksa keberadaan nomor rekening.
 * - Mendapatkan rekening berdasarkan tipe.
 * - Mendapatkan rekening berdasarkan status.
 * Menggunakan repository AccountRepository dan CustomerRepository untuk operasi
 * database.
 * Mengembalikan data dalam bentuk DTO (Data Transfer Object).
 */
@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private CustomerRepository customerRepository;

    /**
     * Get all accounts
     * 
     * @return
     */
    public List<AccountResponseDTO> getAllAccounts() {
        try {
            List<Account> accounts = accountRepository.findAll();
            return accounts.stream().map(this::toDTO).collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching all accounts: " + e.getMessage());
        }
    }

    /**
     * Get account by ID
     * 
     * @param id
     * @return
     */
    public AccountResponseDTO getAccountById(Long id) {
        try {
            Account account = accountRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Rekening tidak ditemukan dengan ID: " + id));
            return toDTO(account);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching account by ID: " + e.getMessage());
        }
    }

    /**
     * Get accounts by customer ID
     * 
     * @param customerId
     * @return
     */
    public List<AccountResponseDTO> getAccountsByCustomerId(Long customerId) {
        try {
            Customer customer = customerRepository.findById(customerId)
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Nasabah tidak ditemukan dengan ID: " + customerId));
            List<Account> accounts = accountRepository.findByCustomer(customer);
            return accounts.stream().map(this::toDTO).collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching accounts by customer ID: " + e.getMessage());
        }
    }

    /**
     * Create new account
     * 
     * @param dto
     * @return
     */
    public AccountResponseDTO createAccount(CreateAccountDTO dto) {
        try {
            Customer customer = customerRepository.findById(dto.getCustomerId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Nasabah tidak ditemukan dengan ID: " + dto.getCustomerId()));

            String accountNumber;
            do {
                accountNumber = generateAccountNumber();
            } while (accountRepository.existsByAccountNumber(accountNumber));

            Account account = new Account();
            account.setAccountNumber(accountNumber);
            account.setAccountType(dto.getAccountType());
            account.setBalance(dto.getBalance() != null ? dto.getBalance() : BigDecimal.ZERO);
            account.setStatus(dto.getStatus() != null ? dto.getStatus().toUpperCase() : "ACTIVE");
            account.setOpenedAt(LocalDateTime.now());
            account.setCustomer(customer);

            Account savedAccount = accountRepository.save(account);
            return toDTO(savedAccount);
        } catch (Exception e) {
            throw new RuntimeException("Error creating account: " + e.getMessage());
        }
    }

    /**
     * Update account by ID
     * 
     * @param id
     * @param dto
     * @return
     */
    public AccountResponseDTO updateAccount(Long id, UpdateAccountDTO dto) {
        try {
            Account account = accountRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Rekening tidak ditemukan dengan ID: " + id));

            if (dto.getAccountType() != null)
                account.setAccountType(dto.getAccountType());
            if (dto.getBalance() != null)
                account.setBalance(dto.getBalance());

            Account updatedAccount = accountRepository.save(account);
            return toDTO(updatedAccount);
        } catch (Exception e) {
            throw new RuntimeException("Error updating account: " + e.getMessage());
        }
    }

    /**
     * Update account status by ID
     * 
     * @param id
     * @param dto
     * @return
     */
    public AccountResponseDTO updateAccountStatus(Long id, UpdateAccountStatusDTO dto) {
        try {
            Account account = accountRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Rekening tidak ditemukan dengan ID: " + id));

            if (dto.getStatus() != null && (dto.getStatus().equalsIgnoreCase("ACTIVE")
                    || dto.getStatus().equalsIgnoreCase("INACTIVE"))) {
                account.setStatus(dto.getStatus().toUpperCase());
            } else {
                throw new IllegalArgumentException("Status tidak valid. Gunakan 'ACTIVE' atau 'INACTIVE'.");
            }

            Account updatedAccount = accountRepository.save(account);
            return toDTO(updatedAccount);
        } catch (Exception e) {
            throw new RuntimeException("Error updating account status: " + e.getMessage());
        }
    }

    /**
     * Delete account by ID
     * 
     * @param id
     */
    public void deleteAccount(Long id) {
        try {
            if (!accountRepository.existsById(id)) {
                throw new IllegalArgumentException("Rekening tidak ditemukan dengan ID: " + id);
            }
            accountRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting account: " + e.getMessage());
        }
    }

    /**
     * Search accounts by account number
     * 
     * @param accountNumber
     * @return
     */
    public List<AccountResponseDTO> searchAccountsByNumber(String accountNumber) {
        try {
            Account account = accountRepository.findByAccountNumber(accountNumber)
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Rekening tidak ditemukan dengan nomor rekening: " + accountNumber));
            List<AccountResponseDTO> result = account != null ? List.of(toDTO(account)) : Collections.emptyList();
            return result;
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    /**
     * Get account statistics
     * 
     * @return
     */
    public Map<String, Object> getAccountStatistics() {
        try {
            long totalAccounts = accountRepository.count();
            double totalBalance = accountRepository.findAll().stream()
                    .map(Account::getBalance)
                    .mapToDouble(bd -> bd != null ? bd.doubleValue() : 0.0)
                    .sum();

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalAccounts", totalAccounts);
            stats.put("totalBalance", totalBalance);
            return stats;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching account statistics: " + e.getMessage());
        }
    }

    /**
     * Check if account number exists
     * 
     * @param accountNumber
     * @return
     */
    public boolean isAccountNumberExists(String accountNumber) {
        try {
            return accountRepository.existsByAccountNumber(accountNumber);
        } catch (Exception e) {
            throw new RuntimeException("Error checking account number existence: " + e.getMessage());
        }
    }

    /**
     * Get accounts by type
     * 
     * @param accountType
     * @return
     */
    public List<AccountResponseDTO> getAccountsByType(String accountType) {
        try {
            List<Account> accounts = accountRepository.findByAccountTypeIgnoreCase(accountType);
            return accounts.stream().map(this::toDTO).collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching accounts by type: " + e.getMessage());
        }
    }

    /**
     * Get accounts by status
     * 
     * @param status
     * @return
     */
    public List<AccountResponseDTO> getAccountsByStatus(String status) {
        try {
            List<Account> accounts = accountRepository.findByStatusIgnoreCase(status);
            return accounts.stream().map(this::toDTO).collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching accounts by status: " + e.getMessage());
        }
    }

    /**
     * deposit amount to account by account number
     * 
     * @param accountNumber
     * @param amount
     * @return
     */
    public AccountResponseDTO depositToAccount(String accountNumber, BigDecimal amount) {
        try {
            if (amount.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Jumlah deposit harus lebih besar dari nol.");
            }

            Account account = accountRepository.findByAccountNumber(accountNumber)
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Rekening tidak ditemukan dengan nomor rekening: " + accountNumber));

            account.setBalance(account.getBalance().add(amount));

            Account updatedAccount = accountRepository.save(account);
            return toDTO(updatedAccount);
        } catch (Exception e) {
            throw e;
        }
    }

    /**
     * withdraw amount from account by account number
     * 
     * @param accountNumber
     * @param amount
     * @return
     */
    public AccountResponseDTO withdrawFromAccount(String accountNumber, BigDecimal amount) {
        try {
            if (amount.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Jumlah penarikan harus lebih besar dari nol.");
            }

            Account account = accountRepository.findByAccountNumber(accountNumber)
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Rekening tidak ditemukan dengan nomor rekening: " + accountNumber));

            if (account.getBalance().compareTo(amount) < 0) {
                throw new IllegalArgumentException("Saldo rekening tidak mencukupi untuk penarikan ini.");
            }

            account.setBalance(account.getBalance().subtract(amount));
            Account updatedAccount = accountRepository.save(account);
            return toDTO(updatedAccount);
        } catch (Exception e) {
            throw e;
        }
    }

    /**
     * Transfer amount from one account to another
     * 
     * @param fromAccountNumber
     * @param toAccountNumber
     * @param amount
     * @return
     */
    public AccountResponseDTO transferBetweenAccounts(String fromAccountNumber, String toAccountNumber,
            BigDecimal amount) {
        try {
            if (fromAccountNumber.equals(toAccountNumber)) {
                throw new IllegalArgumentException("Rekening pengirim dan penerima tidak boleh sama.");
            }
            if (amount.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Jumlah transfer harus lebih besar dari nol.");
            }

            Account fromAccount = accountRepository.findByAccountNumber(fromAccountNumber)
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Rekening pengirim tidak ditemukan dengan nomor rekening: " + fromAccountNumber));

            Account toAccount = accountRepository.findByAccountNumber(toAccountNumber)
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Rekening penerima tidak ditemukan dengan nomor rekening: " + toAccountNumber));

            if (fromAccount.getBalance().compareTo(amount) < 0) {
                throw new IllegalArgumentException("Saldo rekening pengirim tidak mencukupi untuk transfer ini.");
            }

            fromAccount.setBalance(fromAccount.getBalance().subtract(amount));
            toAccount.setBalance(toAccount.getBalance().add(amount));

            accountRepository.save(fromAccount);
            accountRepository.save(toAccount);

            return toDTO(fromAccount);
        } catch (Exception e) {
            throw e;
        }
    }

    /**
     * Get Account entity by account number
     * 
     * @param accountNumber
     * @return
     */
    public Account getAccountEntityByAccountNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new IllegalArgumentException("Rekening tidak ditemukan"));
    }

    /**
     * Convert Account entity to AccountResponseDTO
     * 
     * @param account
     * @return
     */
    private AccountResponseDTO toDTO(Account account) {
        try {
            return new AccountResponseDTO(
                    account.getId(),
                    account.getAccountNumber(),
                    account.getAccountType(),
                    account.getBalance(),
                    account.getStatus(),
                    account.getCustomer() != null ? account.getCustomer().getFullName() : null,
                    account.getOpenedAt(),
                    account.getCustomer() != null ? account.getCustomer().getId() : null);
        } catch (Exception e) {
            throw new RuntimeException("Error converting Account to DTO: " + e.getMessage());
        }
    }

    /**
     * Generate random 10-digit account number
     * 
     * @return
     */
    private String generateAccountNumber() {
        try {
            Random random = new Random();
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < 10; i++) {
                sb.append(random.nextInt(10));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error generating account number: " + e.getMessage());
        }
    }
}