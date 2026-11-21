package com.dipxinh.identity.internal.application.exception;

public class EmailAlreadyExistsException extends RuntimeException{
    public EmailAlreadyExistsException(String message)
    {
        super(message);
    }
}
