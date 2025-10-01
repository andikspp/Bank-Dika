package com.bms.service;

import com.bms.model.Transaction;
import com.bms.model.Account;
import com.bms.repository.TransactionRepository;
import com.bms.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountRepository accountRepository;

    /**
     * Catat transaksi baru
     * Terima data deskripsi transaksi dari controller
     * 
     * @param transaction
     * @return
     */
    public Transaction recordTransaction(Transaction transaction) {
        // Validasi data transaksi
        if (transaction.getAccount() == null || transaction.getAmount() == null
                || transaction.getTransactionType() == null) {
            throw new IllegalArgumentException("Data transaksi tidak lengkap.");
        }

        // Simpan transaksi ke database
        return transactionRepository.save(transaction);
    }

    // Ambil semua transaksi
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    // Ambil transaksi berdasarkan ID
    public Optional<Transaction> getTransactionById(Long id) {
        return transactionRepository.findById(id);
    }

    // Ambil transaksi berdasarkan account
    public List<Transaction> getTransactionsByAccount(Account account) {
        return transactionRepository.findByAccount(account);
    }

    // Ambil transaksi berdasarkan nomor rekening
    public List<Transaction> getTransactionsByAccountNumber(String accountNumber) {
        return transactionRepository.findByAccount_AccountNumber(accountNumber);
    }

    // Ambil transaksi berdasarkan reference number
    public List<Transaction> getTransactionsByReferenceNumber(String referenceNumber) {
        return transactionRepository.findByReferenceNumber(referenceNumber);
    }

    // Ambil transaksi berdasarkan tipe transaksi
    public List<Transaction> getTransactionsByType(String transactionType) {
        return transactionRepository.findByTransactionType(transactionType);
    }
}