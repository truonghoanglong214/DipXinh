package com.dipxinh.identity.internal.application.exception;

public class SlugAlreadyExistsException extends RuntimeException {
    public SlugAlreadyExistsException(String message)
    {
        super(message);
    }
}
