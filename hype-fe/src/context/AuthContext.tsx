import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface User {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  roles?: string[];
  hasPassword?: boolean;
  authProvider?: string;
}

export interface OrganizerRegisterData {
  organizationName: string;
  taxCode?: string;
  businessEmail?: string;
  phone?: string;
  websiteUrl?: string;
  logoUrl?: string;
  description?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password?: string) => Promise<boolean>;
  loginWithGoogle: (idToken: string, fallbackData?: { email?: string; name?: string; avatar?: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (name: string, phone: string, avatar: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<void>;
  registerOrganizer: (data: OrganizerRegisterData) => Promise<boolean>;
  refreshUser: () => Promise<User | null>;
  isAuthenticated: boolean;
  isOrganizer: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = "hype_ticket_user";
const TOKEN_KEY = "hype_ticket_token";
const API_BASE_URL = "http://localhost:8080/hype/api/v1/auth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const refreshUser = useCallback(async (): Promise<User | null> => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (!savedToken) return null;

    try {
      const res = await fetch("http://localhost:8080/hype/api/v1/users/profile", {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data) {
          const lockedEmailsStr = localStorage.getItem("hype_locked_user_emails") || "[]";
          let lockedList: string[] = [];
          try {
            lockedList = JSON.parse(lockedEmailsStr);
          } catch {}

          if (data.status === "LOCKED" || data.status === "BANNED" || lockedList.includes(data.email?.toLowerCase())) {
            localStorage.removeItem(USER_KEY);
            localStorage.removeItem(TOKEN_KEY);
            setUser(null);
            return null;
          }

          const freshUser: User = {
            name: data.name || data.fullName,
            email: data.email,
            phone: data.phone || "",
            avatar: data.avatar || data.avatarUrl,
            hasPassword: data.hasPassword !== undefined ? data.hasPassword : (data.authProvider === "GOOGLE" ? false : true),
            authProvider: data.authProvider || "LOCAL",
            roles: data.roles ? Array.from(data.roles) : [],
          };
          localStorage.setItem(USER_KEY, JSON.stringify(freshUser));
          setUser((prev) => {
            if (!prev) return freshUser;
            const same =
              prev.email === freshUser.email &&
              prev.name === freshUser.name &&
              prev.phone === freshUser.phone &&
              prev.avatar === freshUser.avatar &&
              prev.authProvider === freshUser.authProvider &&
              JSON.stringify(prev.roles?.slice().sort()) === JSON.stringify(freshUser.roles?.slice().sort());
            return same ? prev : freshUser;
          });
          return freshUser;
        }
      } else {
        // Nếu API trả về lỗi (do tài khoản bị khóa hoặc token hết hạn), đăng xuất ngay lập tức
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      }
    } catch (e) {
      console.warn("Error refreshing user profile:", e);
    }
    return null;
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    }
    refreshUser();

    // Listen for cross-component / cross-tab updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === USER_KEY && e.newValue) {
        try {
          setUser(JSON.parse(e.newValue));
        } catch {}
      }
    };

    const handleCustomRefresh = () => {
      refreshUser();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("hype_auth_refresh", handleCustomRefresh);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("hype_auth_refresh", handleCustomRefresh);
    };
  }, []);

  const isEmailLocked = (emailToCheck: string): boolean => {
    try {
      const lockedEmailsStr = localStorage.getItem("hype_locked_user_emails") || "[]";
      const lockedEmails: string[] = JSON.parse(lockedEmailsStr);
      return lockedEmails.includes(emailToCheck.toLowerCase().trim());
    } catch {
      return false;
    }
  };

  const login = async (email: string, password?: string): Promise<boolean> => {
    if (isEmailLocked(email)) {
      throw new Error("Tài khoản của bạn đã bị khóa bởi Quản trị viên. Vui lòng liên hệ hỗ trợ.");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng nhập thất bại");
      }

      if (data.user?.status === "LOCKED" || data.user?.status === "BANNED" || isEmailLocked(data.user?.email || email)) {
        throw new Error("Tài khoản của bạn đã bị khóa bởi Quản trị viên.");
      }

      const loggedUser: User = {
        name: data.user.name || data.user.fullName,
        email: data.user.email,
        phone: data.user.phone || "",
        avatar: data.user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${data.user.fullName}`,
        hasPassword: data.user.hasPassword !== undefined ? data.user.hasPassword : true,
        authProvider: data.user.authProvider || "LOCAL",
        roles: Array.from(data.user.roles || []),
      };

      localStorage.setItem(USER_KEY, JSON.stringify(loggedUser));
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(loggedUser);
      return true;
    } catch (error: any) {
      console.error("Login API Error:", error);
      throw error;
    }
  };

  const register = async (name: string, email: string, phone: string, password?: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName: name, email, phone, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (typeof data === "object" && !data.message) {
          const firstError = Object.values(data)[0] as string;
          throw new Error(firstError);
        }
        throw new Error(data.message || "Đăng ký thất bại");
      }

      const loggedUser: User = {
        name: data.user.name || data.user.fullName,
        email: data.user.email,
        phone: data.user.phone || "",
        avatar: data.user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${data.user.fullName}`,
        hasPassword: true,
        authProvider: "LOCAL",
        roles: Array.from(data.user.roles || []),
      };

      localStorage.setItem(USER_KEY, JSON.stringify(loggedUser));
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(loggedUser);
      return true;
    } catch (error: any) {
      console.error("Register API Error:", error);
      throw error;
    }
  };

  const loginWithGoogle = async (
    idToken: string,
    fallbackData?: { email?: string; name?: string; avatar?: string }
  ): Promise<boolean> => {
    if (fallbackData?.email && isEmailLocked(fallbackData.email)) {
      throw new Error("Tài khoản Google của bạn đã bị khóa bởi Quản trị viên.");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken,
          email: fallbackData?.email,
          name: fallbackData?.name,
          avatar: fallbackData?.avatar,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng nhập Google thất bại");
      }

      if (data.user?.status === "LOCKED" || data.user?.status === "BANNED" || isEmailLocked(data.user?.email || fallbackData?.email || "")) {
        throw new Error("Tài khoản Google này đã bị khóa bởi Quản trị viên.");
      }

      const loggedUser: User = {
        name: data.user.name || data.user.fullName,
        email: data.user.email,
        phone: data.user.phone || "",
        avatar:
          data.user.avatar ||
          data.user.avatarUrl ||
          `https://api.dicebear.com/7.x/adventurer/svg?seed=${data.user.fullName || data.user.email}`,
        hasPassword: data.user.hasPassword !== undefined ? data.user.hasPassword : false,
        authProvider: data.user.authProvider || "GOOGLE",
        roles: Array.from(data.user.roles || []),
      };

      localStorage.setItem(USER_KEY, JSON.stringify(loggedUser));
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(loggedUser);
      return true;
    } catch (error: any) {
      console.error("Google Login API Error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const updateProfile = async (name: string, phone: string, avatar: string) => {
    if (!user) return;
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) throw new Error("Chưa đăng nhập");

    const response = await fetch("http://localhost:8080/hype/api/v1/users/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ name, phone, avatar })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Cập nhật thông tin thất bại");
    }

    const updatedUser: User = {
      name: data.name || data.fullName,
      email: data.email,
      phone: data.phone || "",
      avatar: data.avatar || data.avatarUrl,
      hasPassword: data.hasPassword !== undefined ? data.hasPassword : user.hasPassword,
      authProvider: data.authProvider || user.authProvider || "LOCAL",
      roles: data.roles ? Array.from(data.roles) : [],
    };

    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    setUser({ ...updatedUser });
  };

  const changePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    if (!user) return;
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) throw new Error("Chưa đăng nhập");

    const response = await fetch("http://localhost:8080/hype/api/v1/users/change-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Thay đổi mật khẩu thất bại");
    }

    // Sau khi đặt hoặc đổi mật khẩu thành công, tài khoản đã có mật khẩu
    const updatedUser: User = {
      ...user,
      hasPassword: true,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const registerOrganizer = async (formData: OrganizerRegisterData): Promise<boolean> => {
    if (!user) throw new Error("Vui lòng đăng nhập để đăng ký Ban tổ chức");
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) throw new Error("Chưa đăng nhập");

    const response = await fetch("http://localhost:8080/hype/api/v1/organizer/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (!response.ok) {
      if (typeof data === "object" && !data.message) {
        const firstError = Object.values(data)[0] as string;
        throw new Error(firstError);
      }
      throw new Error(data.message || "Đăng ký Ban tổ chức thất bại");
    }

    const updatedUser: User = {
      name: data.name || data.fullName,
      email: data.email,
      phone: data.phone || "",
      avatar: data.avatar || data.avatarUrl,
      hasPassword: data.hasPassword !== undefined ? data.hasPassword : user.hasPassword,
      authProvider: data.authProvider || user.authProvider || "LOCAL",
      roles: data.roles ? Array.from(data.roles) : (user.roles || ["ROLE_USER"]),
    };

    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    setUser({ ...updatedUser });
    return true;
  };

  const isAuthenticated = user !== null;
  const isOrganizer = Boolean(user?.roles?.includes("ROLE_ORGANIZER"));
  const isAdmin = Boolean(user?.roles?.includes("ROLE_ADMIN"));

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      loginWithGoogle,
      logout,
      updateProfile,
      changePassword,
      registerOrganizer,
      refreshUser,
      isAuthenticated,
      isOrganizer,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
