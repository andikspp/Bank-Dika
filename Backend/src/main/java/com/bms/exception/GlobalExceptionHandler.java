package com.bms.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

/**
 * Exception global untuk menangani berbagai jenis exception di seluruh
 * aplikasi.
 * Menyediakan penanganan khusus untuk IllegalArgumentException dan
 * ResponseStatusException.
 * Setiap metode penanganan exception mengembalikan pesan kesalahan yang sesuai
 * kepada klien.
 * 
 * @RestControllerAdvice memungkinkan penanganan exception di seluruh controller
 *                       dalam aplikasi Spring Boot.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Menangani IllegalArgumentException dan mengembalikan status HTTP 400 (Bad
     * Request).
     * 
     * @param ex
     * @return
     */
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String handleIllegalArgument(IllegalArgumentException ex) {
        return ex.getMessage();
    }

    /**
     * Menangani ResponseStatusException dan mengembalikan pesan alasan dari
     * exception tersebut.
     * 
     * @param ex
     * @return
     */
    @ExceptionHandler(ResponseStatusException.class)
    public String handleResponseStatus(ResponseStatusException ex) {
        return ex.getReason();
    }
}