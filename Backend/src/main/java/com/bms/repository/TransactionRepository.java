package com.bms.repository;

import com.bms.model.Transaction;
import com.bms.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByAccount(Account account);

    List<Transaction> findByReferenceNumber(String referenceNumber);

    List<Transaction> findByTransactionType(String transactionType);

    List<Transaction> findByAccount_AccountNumber(String accountNumber);
}