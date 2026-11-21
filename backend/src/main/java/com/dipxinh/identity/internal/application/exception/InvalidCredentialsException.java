package com.dipxinh.identity.internal.application.exception;

public class InvalidCredentialsException extends RuntimeException{

    public InvalidCredentialsException()
    {
        super("Email or Password is invalid.");
    }
}
