package com.dipxinh.identity.internal.web;

import com.dipxinh.identity.internal.application.dto.LoginResult;
import com.dipxinh.identity.internal.application.exception.EmailAlreadyExistsException;
import com.dipxinh.identity.internal.application.exception.InvalidCredentialsException;
import com.dipxinh.identity.internal.application.service.AuthService;
import com.dipxinh.identity.internal.web.dto.LoginRequest;
import com.dipxinh.identity.internal.web.dto.LoginResponse;
import com.dipxinh.identity.internal.web.dto.RegisterRequest;
import com.dipxinh.identity.internal.web.dto.UserProfileResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.webmvc.autoconfigure.WebMvcProperties;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.Instant;

@RestController
@RequestMapping("/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final boolean cookieSecure;

    public AuthController(
        AuthService authService,
        @Value("${app.security.cookie.secure:false}") boolean cookieSecure
    ) {
        this.authService = authService;
        this.cookieSecure = cookieSecure;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
        @Valid @RequestBody LoginRequest request,
        @RequestHeader(value = "User-Agent", defaultValue = "Browser") String userAgent
    ) {
        LoginResult result = authService.login(request.email(), request.password(), userAgent);

        long maxAgeSeconds = Math.max(0, Duration.between(Instant.now(), result.refreshTokenExpiresAt()).toSeconds());
        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", result.rawRefreshToken())
            .httpOnly(true)
            .secure(cookieSecure)
            .path("/v1/auth")
            .sameSite("Lax")
            .maxAge(maxAgeSeconds)
            .build();

        LoginResponse responseBody = new LoginResponse(
            result.accessToken(),
            new UserProfileResponse(
                result.user().getId(),
                result.user().getEmail(),
                result.user().getDisplayName()
            )
        );

        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
            .body(responseBody);
    }

    @PostMapping("/register")
    public  ResponseEntity<UserProfileResponse> register(
        @Valid
        @RequestBody
        RegisterRequest request)
    {
        var user = authService.register(request.email(), request.password(),request.displayName());
        UserProfileResponse response = new UserProfileResponse(user.getId(), user.getEmail(), user.getDisplayName());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(
        @CookieValue(name = "refreshToken", required = false) String rawRefreshToken
    ) {
        if (rawRefreshToken == null || rawRefreshToken.isBlank()) {
            throw new InvalidCredentialsException();
        }

        LoginResult result = authService.refresh(rawRefreshToken);

        long maxAgeSeconds = Math.max(0, Duration.between(Instant.now(), result.refreshTokenExpiresAt()).toSeconds());
        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", result.rawRefreshToken())
            .httpOnly(true)
            .secure(cookieSecure)
            .path("/v1/auth")
            .sameSite("Lax")
            .maxAge(maxAgeSeconds)
            .build();

        LoginResponse responseBody = new LoginResponse(
            result.accessToken(),
            new UserProfileResponse(
                result.user().getId(),
                result.user().getEmail(),
                result.user().getDisplayName()
            )
        );

        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
            .body(responseBody);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
        @org.springframework.security.core.annotation.AuthenticationPrincipal com.dipxinh.identity.internal.security.UserPrincipal principal,
        @CookieValue(name = "refreshToken", required = false) String rawRefreshToken
    ) {
        if (principal != null) {
            authService.logout(principal.sessionId());
        }
        else if(rawRefreshToken != null && !rawRefreshToken.isBlank())
        {
            authService.logoutByRefreshToken(rawRefreshToken);
        }

        ResponseCookie deleteCookie = ResponseCookie.from("refreshToken", "")
            .httpOnly(true)
            .secure(cookieSecure)
            .path("/v1/auth")
            .sameSite("Lax")
            .maxAge(0)
            .build();

        return ResponseEntity.noContent()
            .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
            .build();
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ProblemDetail> handleInvalidCredentials(InvalidCredentialsException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
            HttpStatus.UNAUTHORIZED,
            "Email hoặc mật khẩu không chính xác."
        );
        problem.setTitle("Invalid Credentials");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(problem);
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ProblemDetail> handleEmailExists(EmailAlreadyExistsException ex)
    {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
            HttpStatus.CONFLICT,
            ex.getMessage()
        );

        problem.setTitle("Email Already Exists");
        return ResponseEntity.status(HttpStatus.CONFLICT).body(problem);
    }
}
