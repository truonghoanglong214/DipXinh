package com.dipxinh.identity.internal.application.service;

import com.dipxinh.identity.internal.application.dto.LoginResult;
import com.dipxinh.identity.internal.application.exception.EmailAlreadyExistsException;
import com.dipxinh.identity.internal.application.exception.InvalidCredentialsException;
import com.dipxinh.identity.internal.application.port.out.AppUserRepository;
import com.dipxinh.identity.internal.application.port.out.AuthRefreshTokenRepository;
import com.dipxinh.identity.internal.application.port.out.AuthSessionRepository;
import com.dipxinh.identity.internal.domain.AppUser;
import com.dipxinh.identity.internal.domain.AuthRefreshToken;
import com.dipxinh.identity.internal.domain.AuthSession;
import com.dipxinh.identity.internal.domain.UserStatus;
import com.dipxinh.identity.internal.security.JwtTokenService;
import com.dipxinh.identity.internal.security.TokenHashUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Locale;
import java.util.UUID;

@Service
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final AuthSessionRepository authSessionRepository;
    private final AuthRefreshTokenRepository authRefreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;

    public AuthService(
        AppUserRepository appUserRepository,
        AuthSessionRepository authSessionRepository,
        AuthRefreshTokenRepository authRefreshTokenRepository,
        PasswordEncoder passwordEncoder,
        JwtTokenService jwtTokenService
    ) {
        this.appUserRepository = appUserRepository;
        this.authSessionRepository = authSessionRepository;
        this.authRefreshTokenRepository = authRefreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenService = jwtTokenService;
    }

    public AppUser authenticate(String email, String rawPassword) {
        if (email == null || email.isBlank() || rawPassword == null || rawPassword.isEmpty()) {
            throw new InvalidCredentialsException();
        }
        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
        AppUser existedUser = appUserRepository.findByEmail(normalizedEmail)
            .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(rawPassword, existedUser.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }

        if (!existedUser.canLogin()) {
            throw new InvalidCredentialsException();
        }

        return existedUser;
    }

    @Transactional
    public AppUser register(String email, String rawPassword, String displayName)
    {
        if(email == null || email.isBlank() || rawPassword == null || rawPassword.isBlank())
        {
            throw new InvalidCredentialsException();
        }

        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
        if(appUserRepository.existsByEmail(normalizedEmail))
        {
            throw new EmailAlreadyExistsException("Email has been used.");
        }

        String passwordHash = passwordEncoder.encode(rawPassword);
        AppUser user = new AppUser(
            null,
            normalizedEmail,
            passwordHash,
            displayName,
            UserStatus.ACTIVE
        );

        return appUserRepository.save(user);
    }

    @Transactional
    public LoginResult login(String email, String rawPassword, String clientLabel) {
        AppUser user = authenticate(email, rawPassword);
        Instant now = Instant.now();
        Instant sessionExpiry = now.plus(7, ChronoUnit.DAYS);

        AuthSession newSession = new AuthSession(
            null,
            user.getId(),
            clientLabel != null && !clientLabel.isBlank() ? clientLabel : "Unknown Client",
            now,
            now,
            sessionExpiry,
            null,
            null
        );
        AuthSession savedSession = authSessionRepository.save(newSession);

        String rawRefreshToken = TokenHashUtils.generateRandomOpaqueToken();
        String tokenHash = TokenHashUtils.hashSha256(rawRefreshToken);

        AuthRefreshToken refreshToken = new AuthRefreshToken(
            null,
            savedSession.id(),
            tokenHash,
            null,
            now,
            sessionExpiry,
            null,
            null,
            null
        );
        authRefreshTokenRepository.save(refreshToken);

        String accessToken = jwtTokenService.generateAccessToken(
            user.getId(),
            savedSession.id(),
            user.getEmail()
        );

        return new LoginResult(user, savedSession, accessToken, rawRefreshToken, sessionExpiry);
    }

    public AppUser getProfile(UUID userId) {
        return appUserRepository.findById(userId)
            .orElseThrow(InvalidCredentialsException::new);
    }

    @Transactional(noRollbackFor = InvalidCredentialsException.class)
    public LoginResult refresh(String rawRefreshToken) {
        if (rawRefreshToken == null || rawRefreshToken.isBlank()) {
            throw new InvalidCredentialsException();
        }

        String tokenHash = TokenHashUtils.hashSha256(rawRefreshToken);
        AuthRefreshToken oldToken = authRefreshTokenRepository.findByTokenHash(tokenHash)
            .orElseThrow(InvalidCredentialsException::new);

        AuthSession session = authSessionRepository.findById(oldToken.sessionId())
            .orElseThrow(InvalidCredentialsException::new);

        Instant now = Instant.now();

        // 1. PHÁT HIỆN REPLAY ATTACK (Token đã dùng hoặc đã bị thu hồi)
        if (oldToken.usedAt() != null || oldToken.revokedAt() != null || !session.isActive(now)) {
            // Đánh dấu token bị tái sử dụng
            AuthRefreshToken reuseToken = new AuthRefreshToken(
                oldToken.id(),
                oldToken.sessionId(),
                oldToken.tokenHash(),
                oldToken.parentTokenId(),
                oldToken.createdAt(),
                oldToken.expiresAt(),
                oldToken.usedAt(),
                now,
                now
            );
            authRefreshTokenRepository.save(reuseToken);

            // Thu hồi toàn bộ session và tất cả token của session này
            AuthSession revokedSession = new AuthSession(
                session.id(),
                session.userId(),
                session.clientLabel(),
                session.createdAt(),
                session.lastUsedAt(),
                session.absoluteExpiresAt(),
                now,
                "REUSE_DETECTED"
            );
            authSessionRepository.save(revokedSession);
            authRefreshTokenRepository.revokeAllBySessionId(session.id(), now);

            throw new InvalidCredentialsException();
        }

        // Kiểm tra hạn sử dụng của refresh token
        if (now.isAfter(oldToken.expiresAt())) {
            throw new InvalidCredentialsException();
        }

        // 2. TOKEN HỢP LỆ: Đánh dấu token cũ là ĐÃ DÙNG
        AuthRefreshToken usedOldToken = new AuthRefreshToken(
            oldToken.id(),
            oldToken.sessionId(),
            oldToken.tokenHash(),
            oldToken.parentTokenId(),
            oldToken.createdAt(),
            oldToken.expiresAt(),
            now,
            null,
            null
        );
        authRefreshTokenRepository.save(usedOldToken);

        // 3. Cập nhật lastUsedAt cho Session
        AuthSession updatedSession = new AuthSession(
            session.id(),
            session.userId(),
            session.clientLabel(),
            session.createdAt(),
            now,
            session.absoluteExpiresAt(),
            null,
            null
        );
        authSessionRepository.save(updatedSession);

        // 4. Sinh Refresh Token mới (không vượt quá absoluteExpiresAt của session)
        Instant newRefreshExpiry = now.plus(7, ChronoUnit.DAYS);
        if (newRefreshExpiry.isAfter(session.absoluteExpiresAt())) {
            newRefreshExpiry = session.absoluteExpiresAt();
        }

        String newRawRefreshToken = TokenHashUtils.generateRandomOpaqueToken();
        String newTokenHash = TokenHashUtils.hashSha256(newRawRefreshToken);

        AuthRefreshToken newRefreshToken = new AuthRefreshToken(
            null,
            session.id(),
            newTokenHash,
            oldToken.id(),
            now,
            newRefreshExpiry,
            null,
            null,
            null
        );
        authRefreshTokenRepository.save(newRefreshToken);

        // 5. Cấp Access Token mới
        AppUser user = appUserRepository.findById(session.userId())
            .orElseThrow(InvalidCredentialsException::new);

        String newAccessToken = jwtTokenService.generateAccessToken(
            user.getId(),
            session.id(),
            user.getEmail()
        );

        return new LoginResult(user, updatedSession, newAccessToken, newRawRefreshToken, newRefreshExpiry);
    }

    @Transactional
    public void logout(UUID sessionId) {
        Instant now = Instant.now();
        authSessionRepository.findById(sessionId).ifPresent(session -> {
            AuthSession revokedSession = new AuthSession(
                session.id(),
                session.userId(),
                session.clientLabel(),
                session.createdAt(),
                session.lastUsedAt(),
                session.absoluteExpiresAt(),
                now,
                "USER_LOGOUT"
            );
            authSessionRepository.save(revokedSession);
            authRefreshTokenRepository.revokeAllBySessionId(sessionId, now);
        });
    }

    @Transactional
    public void logoutByRefreshToken(String rawRefreshToken)
    {
        if(rawRefreshToken == null || rawRefreshToken.isBlank())
        {
            return;
        }

        String tokenHash = TokenHashUtils.hashSha256(rawRefreshToken);
        authRefreshTokenRepository.findByTokenHash(tokenHash)
            .ifPresent(token -> logout(token.sessionId()));
    }
}
