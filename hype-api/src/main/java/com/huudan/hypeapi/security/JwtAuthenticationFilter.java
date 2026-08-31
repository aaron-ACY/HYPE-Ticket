package com.huudan.hypeapi.security;

import com.huudan.hypeapi.model.UserStatus;
import com.huudan.hypeapi.repository.UserRepository;
import com.huudan.hypeapi.service.RedisService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final RedisService redisService;

    @Autowired
    public JwtAuthenticationFilter(
            JwtTokenProvider tokenProvider,
            UserRepository userRepository,
            RedisService redisService) {
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
        this.redisService = redisService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                String email = tokenProvider.getEmailFromJWT(jwt);

                // Kiểm tra trạng thái LOCKED qua Redis (< 1ms)
                if (checkIfLocked(email)) {
                    throw new DisabledException("Tài khoản của bạn đã bị khóa bởi Quản trị viên");
                }

                List<String> roles = tokenProvider.getRolesFromJWT(jwt);
                List<SimpleGrantedAuthority> authorities = roles.stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        email, null, authorities);
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (DisabledException ex) {
            // Tài khoản bị khóa — trả về 403 với thông báo rõ ràng để frontend biết logout
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"message\":\"Tài khoản của bạn đã bị khóa bởi Quản trị viên\",\"error\":\"ACCOUNT_LOCKED\"}");
            return;
        } catch (Exception ex) {
            log.debug("Lỗi xác thực JWT: {}", ex.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Kiểm tra trạng thái khóa tài khoản qua Redis trước, nếu Redis chưa có thì fallback về DB
     */
    private boolean checkIfLocked(String email) {
        try {
            if (redisService.isUserLocked(email)) {
                return true;
            }
        } catch (Exception e) {
            log.warn("Không kết nối được Redis, fallback kiểm tra qua Database: {}", e.getMessage());
        }

        // Fallback kiểm tra DB nếu chưa cache
        return userRepository.findByEmail(email).map(user -> {
            if (UserStatus.LOCKED.equals(user.getStatus()) || UserStatus.BANNED.equals(user.getStatus())) {
                try {
                    redisService.setUserLocked(email);
                } catch (Exception ignored) {}
                return true;
            }
            return false;
        }).orElse(false);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
