import React, { useEffect } from "react";
import { Routes, Route, Navigate, useParams, useLocation } from "react-router-dom";
import { Home } from "../pages/Home/Index";
import { Events } from "../pages/Events/Index";
import { EventDetail } from "../pages/EventDetail/Index";
import { Search } from "../pages/Search/Index";
import { Checkout } from "../pages/Checkout/Index";
import { CheckoutSuccess } from "../pages/Checkout/Success";
import { Login } from "../pages/Auth/Login";
import { Register } from "../pages/Auth/Register";
import { Profile } from "../pages/Profile/Index";
import { Orders } from "../pages/Orders/Index";
import { OrderDetail } from "../pages/Orders/Detail";
import { Stories } from "../pages/Stories/Index";
import { StoryDetail } from "../pages/Stories/Detail";
import { BecomeOrganizer } from "../pages/BecomeOrganizer/Index";
import { OrganizerDashboard } from "../pages/Organizer/Dashboard";
import { OrganizerEvents } from "../pages/Organizer/Events";
import { OrganizerTickets } from "../pages/Organizer/Tickets";
import { OrganizerRevenue } from "../pages/Organizer/Revenue";
import { OrganizerBlueTick } from "../pages/Organizer/BlueTick";
import { OrganizerSettings } from "../pages/Organizer/Settings";
import { PoliciesPage } from "../pages/Policies/Index";
import { AdminDashboard } from "../pages/Admin/Dashboard";
import { AdminTickets } from "../pages/Admin/Tickets";
import { AdminAnalytics } from "../pages/Admin/Analytics";
import { AdminViolations } from "../pages/Admin/Violations";
import { AdminEvents } from "../pages/Admin/Events";
import { AdminOrganizers } from "../pages/Admin/Organizers";
import { AdminUsers } from "../pages/Admin/Users";

// Dynamic document title manager based on active route
const PageTitleHandler: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;

    if (path === "/") {
      document.title = "HYPETICKET | Nền tảng Bán vé Sự kiện & Trình diễn Trực tiếp";
    } else if (path === "/events") {
      document.title = "Tất Cả Sự Kiện & Đại Nhạc Hội | HYPETICKET";
    } else if (path === "/stories") {
      document.title = "Khám Phá & Tạp Chí Nghệ Thuật | HYPETICKET";
    } else if (path === "/search") {
      document.title = "Tìm Kiếm Sự Kiện | HYPETICKET";
    } else if (path === "/checkout") {
      document.title = "Đặt Vé & Thanh Toán Trực Tuyến | HYPETICKET";
    } else if (path === "/checkout/success") {
      document.title = "Đặt Vé Thành Công | HYPETICKET";
    } else if (path === "/orders") {
      document.title = "Vé Của Tôi & Lịch Sử Đặt Vé | HYPETICKET";
    } else if (path === "/profile") {
      document.title = "Hồ Sơ Cá Nhân | HYPETICKET";
    } else if (path === "/login") {
      document.title = "Đăng Nhập Tài Khoản | HYPETICKET";
    } else if (path === "/register") {
      document.title = "Đăng Ký Tài Khoản | HYPETICKET";
    } else if (path === "/become-organizer") {
      document.title = "Đăng Ký Ban Tổ Chức Sự Kiện | HYPETICKET";
    } else if (path === "/organizer/dashboard") {
      document.title = "Tổng Quan Kênh Quản Trị Tổ Chức | HYPETICKET";
    } else if (path === "/organizer/events") {
      document.title = "Quản Lý Sự Kiện & Show Diễn | HYPE ORGANIZER";
    } else if (path === "/organizer/tickets") {
      document.title = "Vé & Quét Mã QR Check-in | HYPE ORGANIZER";
    } else if (path === "/organizer/revenue") {
      document.title = "Doanh Thu & Đối Soát Tài Chính | HYPE ORGANIZER";
    } else if (path === "/organizer/blue-tick") {
      document.title = "Nâng Hạng Tích Xanh Uy Tín (5 Sự Kiện) | HYPE ORGANIZER";
    } else if (path === "/organizer/settings") {
      document.title = "Cấu Hình Hồ Sơ Ban Tổ Chức | HYPE ORGANIZER";
    } else if (path === "/policies") {
      document.title = "Quy Trình & Chính Sách Hoạt Động | HYPETICKET";
    } else if (path === "/admin/tickets") {
      document.title = "Quản Lý Vé & Đơn Đặt Vé | HYPE ADMIN";
    } else if (path === "/admin/analytics") {
      document.title = "Thống Kê Doanh Số Chuyên Sâu | HYPE ADMIN";
    } else if (path === "/admin/violations") {
      document.title = "Quản Lý Vi Phạm & An Toàn Sàn | HYPE ADMIN";
    } else if (path.startsWith("/admin")) {
      document.title = "Master Admin Portal | HYPETICKET";
    }
  }, [location.pathname]);

  return null;
};

// Helper component to redirect /categories/:slug -> /events?category=:slug
const CategoryRedirect: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`/events?category=${slug}`} replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <>
      <PageTitleHandler />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:slug" element={<EventDetail />} />
        <Route path="/categories/:slug" element={<CategoryRedirect />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/stories/:slug" element={<StoryDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/become-organizer" element={<BecomeOrganizer />} />
        <Route path="/policies" element={<PoliciesPage />} />
        
        {/* Organizer Portal Routes */}
        <Route path="/organizer" element={<Navigate to="/organizer/dashboard" replace />} />
        <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
        <Route path="/organizer/events" element={<OrganizerEvents />} />
        <Route path="/organizer/tickets" element={<OrganizerTickets />} />
        <Route path="/organizer/revenue" element={<OrganizerRevenue />} />
        <Route path="/organizer/blue-tick" element={<OrganizerBlueTick />} />
        <Route path="/organizer/settings" element={<OrganizerSettings />} />

        {/* Admin Portal Routes */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/tickets" element={<AdminTickets />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/violations" element={<AdminViolations />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="/admin/organizers" element={<AdminOrganizers />} />
        <Route path="/admin/users" element={<AdminUsers />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};
