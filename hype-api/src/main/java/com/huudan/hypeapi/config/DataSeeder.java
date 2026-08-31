package com.huudan.hypeapi.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.huudan.hypeapi.model.*;
import com.huudan.hypeapi.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Component
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final OrganizerProfileRepository organizerProfileRepository;
    private final CategoryRepository categoryRepository;
    private final VenueRepository venueRepository;
    private final EventRepository eventRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final ArticleRepository articleRepository;
    private final ViolationRepository violationRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    @Autowired
    public DataSeeder(RoleRepository roleRepository,
                      UserRepository userRepository,
                      OrganizerProfileRepository organizerProfileRepository,
                      CategoryRepository categoryRepository,
                      VenueRepository venueRepository,
                      EventRepository eventRepository,
                      TicketTypeRepository ticketTypeRepository,
                      ArticleRepository articleRepository,
                      ViolationRepository violationRepository,
                      PasswordEncoder passwordEncoder,
                      ObjectMapper objectMapper) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.organizerProfileRepository = organizerProfileRepository;
        this.categoryRepository = categoryRepository;
        this.venueRepository = venueRepository;
        this.eventRepository = eventRepository;
        this.ticketTypeRepository = ticketTypeRepository;
        this.articleRepository = articleRepository;
        this.violationRepository = violationRepository;
        this.passwordEncoder = passwordEncoder;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String... args) throws Exception {
        seedRolesAndUsers();
        seedCategories();
        seedVenues();
        seedEventsAndTickets();
        seedArticles();
        seedViolations();
    }

    private void seedRolesAndUsers() {
        Role roleUser = roleRepository.findByCode("ROLE_USER").orElseGet(() ->
                roleRepository.save(Role.builder().code("ROLE_USER").name("User").build()));
        Role roleOrg = roleRepository.findByCode("ROLE_ORGANIZER").orElseGet(() ->
                roleRepository.save(Role.builder().code("ROLE_ORGANIZER").name("Organizer").build()));
        Role roleAdmin = roleRepository.findByCode("ROLE_ADMIN").orElseGet(() ->
                roleRepository.save(Role.builder().code("ROLE_ADMIN").name("Admin").build()));

        // Admin Account
        if (userRepository.findByEmail("admin@hypeticket.vn").isEmpty()) {
            User admin = User.builder()
                    .email("admin@hypeticket.vn")
                    .fullName("Hype System Administrator")
                    .passwordHash(passwordEncoder.encode("Admin@123456"))
                    .phone("0909000111")
                    .avatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150")
                    .status(UserStatus.ACTIVE)
                    .roles(new HashSet<>(Arrays.asList(roleUser, roleOrg, roleAdmin)))
                    .build();
            userRepository.save(admin);
        }

        // Organizer Account
        if (userRepository.findByEmail("organizer@spaceplus.vn").isEmpty()) {
            User orgUser = User.builder()
                    .email("organizer@spaceplus.vn")
                    .fullName("SpacePlus Entertainment")
                    .passwordHash(passwordEncoder.encode("Org@123456"))
                    .phone("0912345678")
                    .avatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150")
                    .status(UserStatus.ACTIVE)
                    .roles(new HashSet<>(Arrays.asList(roleUser, roleOrg)))
                    .build();
            User savedOrg = userRepository.save(orgUser);

            OrganizerProfile profile = OrganizerProfile.builder()
                    .user(savedOrg)
                    .organizationName("SpacePlus Entertainment")
                    .businessEmail("contact@spaceplus.vn")
                    .phone("0912345678")
                    .websiteUrl("https://spaceplus.vn")
                    .description("Đơn vị tổ chức các lễ hội âm nhạc EDM & Visual Arts hàng đầu Việt Nam")
                    .isVerified(true)
                    .status("APPROVED")
                    .hasBlueTick(true)
                    .build();
            organizerProfileRepository.save(profile);
        }
    }

    private void seedCategories() {
        if (categoryRepository.count() == 0) {
            List<Category> categories = Arrays.asList(
                    Category.builder().name("Âm nhạc").slug("music").iconName("Music").imageUrl("https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600").build(),
                    Category.builder().name("EDM & Rave").slug("edm").iconName("Zap").imageUrl("https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600").build(),
                    Category.builder().name("Live Show & Acoustic").slug("live-show").iconName("Mic2").imageUrl("https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600").build(),
                    Category.builder().name("Nghệ thuật & Triển lãm").slug("arts").iconName("Palette").imageUrl("https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600").build(),
                    Category.builder().name("Nightlife & Club").slug("nightlife").iconName("Moon").imageUrl("https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=600").build(),
                    Category.builder().name("Công nghệ & Workshop").slug("tech-workshop").iconName("Laptop").imageUrl("https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600").build()
            );
            categoryRepository.saveAll(categories);
        }
    }

    private void seedVenues() {
        if (venueRepository.count() == 0) {
            List<Venue> venues = Arrays.asList(
                    Venue.builder().name("Trung tâm Hội chợ và Triển lãm Sài Gòn (SECC)").address("799 Nguyễn Văn Linh, Tân Phú, Quận 7").city("TP. Hồ Chí Minh").build(),
                    Venue.builder().name("Nhà Văn Hóa Thanh Niên").address("4 Phạm Ngọc Thạch, Bến Nghé, Quận 1").city("TP. Hồ Chí Minh").build(),
                    Venue.builder().name("Nhà Hát Bến Thành").address("6 Mạc Đĩnh Chi, Bến Nghé, Quận 1").city("TP. Hồ Chí Minh").build(),
                    Venue.builder().name("The Factory Contemporary Arts Centre").address("15 Nguyễn Ư Dĩ, Thảo Điền, TP. Thủ Đức").city("TP. Hồ Chí Minh").build(),
                    Venue.builder().name("Trung tâm Hội nghị Quốc gia").address("Đại lộ Thăng Long, Mễ Trì, Nam Từ Liêm").city("Hà Nội").build()
            );
            venueRepository.saveAll(venues);
        }
    }

    private void seedEventsAndTickets() throws Exception {
        if (eventRepository.count() == 0) {
            User organizer = userRepository.findByEmail("organizer@spaceplus.vn").orElse(null);
            if (organizer == null) return;

            Category catMusic = categoryRepository.findBySlug("music").orElse(null);
            Category catEdm = categoryRepository.findBySlug("edm").orElse(null);
            Category catLive = categoryRepository.findBySlug("live-show").orElse(null);

            List<Venue> venues = venueRepository.findAll();
            Venue venueSecc = venues.stream().filter(v -> v.getName().contains("SECC")).findFirst().orElse(null);
            Venue venueNvhtn = venues.stream().filter(v -> v.getName().contains("Thanh Niên")).findFirst().orElse(null);
            Venue venueFactory = venues.stream().filter(v -> v.getName().contains("Factory")).findFirst().orElse(null);

            // Event 1
            List<Map<String, String>> schedule1 = Arrays.asList(
                    Map.of("time", "18:30", "activity", "Mở cửa check-in & nhận quà độc quyền"),
                    Map.of("time", "19:30", "activity", "Opening DJ Set - Visual Neon Show"),
                    Map.of("time", "20:30", "activity", "Main Stage: Headliner Performance"),
                    Map.of("time", "22:30", "activity", "Grand Finale & Countdown Party")
            );
            List<Map<String, String>> faqs1 = Arrays.asList(
                    Map.of("q", "Sự kiện có giới hạn độ tuổi không?", "a", "Sự kiện dành cho khán giả từ 18 tuổi trở lên. Vui lòng mang CCCD/VNeID để đối soát tại cổng."),
                    Map.of("q", "Có được mang đồ ăn nước uống từ ngoài vào?", "a", "Không được mang đồ ăn, thức uống ngoài vào sự kiện. Bên trong có khu ẩm thực F&B đa dạng."),
                    Map.of("q", "Cách thức check-in vé?", "a", "Xuất trình mã QR trên ứng dụng hoặc email vé tại cổng để check-in.")
            );

            Event event1 = Event.builder()
                    .organizer(organizer)
                    .category(catEdm != null ? catEdm : catMusic)
                    .venue(venueNvhtn)
                    .title("HYPE FEST 2026 - Neon Beats in the Dark")
                    .slug("hype-fest-2026-neon-beats-in-the-dark")
                    .description("Lễ hội âm nhạc điện tử kết hợp nghệ thuật ánh sáng Neon lớn nhất mùa hè 2026 với sự góp mặt của các DJ quốc tế và dàn nghệ sĩ top đầu Việt Nam.")
                    .thumbnailUrl("https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800")
                    .location("TP. Hồ Chí Minh")
                    .address(venueNvhtn != null ? venueNvhtn.getAddress() : "Nhà Văn Hóa Thanh Niên, Quận 1")
                    .startAt(LocalDateTime.now().plusDays(20).withHour(19).withMinute(0))
                    .endAt(LocalDateTime.now().plusDays(20).withHour(23).withMinute(30))
                    .priceFrom(BigDecimal.valueOf(250000))
                    .status(EventStatus.PUBLISHED)
                    .featured(true)
                    .highlights(objectMapper.writeValueAsString(Arrays.asList("Hệ thống âm thanh L-Acoustics đỉnh cao", "Visual Mapping 3D 360 độ", "Trải nghiệm khu vực F&B không giới hạn")))
                    .scheduleJson(objectMapper.writeValueAsString(schedule1))
                    .faqsJson(objectMapper.writeValueAsString(faqs1))
                    .build();
            Event savedEv1 = eventRepository.save(event1);

            ticketTypeRepository.saveAll(Arrays.asList(
                    TicketType.builder().event(savedEv1).name("GA - General Admission").price(BigDecimal.valueOf(250000)).quantity(1000).soldQuantity(250).description("Vé vào cổng khu vực GA tự do").status(TicketTypeStatus.ACTIVE).build(),
                    TicketType.builder().event(savedEv1).name("VIP - Fan Zone").price(BigDecimal.valueOf(550000)).quantity(500).soldQuantity(120).description("Khu vực gần sân khấu + 1 Drink").status(TicketTypeStatus.ACTIVE).build(),
                    TicketType.builder().event(savedEv1).name("SVIP - Lounge Access").price(BigDecimal.valueOf(1200000)).quantity(100).soldQuantity(45).description("Lounge riêng biệt, F&B trọn gói, quà tặng độc quyền").status(TicketTypeStatus.ACTIVE).build()
            ));

            // Event 2
            Event event2 = Event.builder()
                    .organizer(organizer)
                    .category(catMusic)
                    .venue(venueSecc)
                    .title("Cyber Sound Arena - Electric Symphony Live")
                    .slug("cyber-sound-arena-electric-symphony-live")
                    .description("Bản giao hưởng hiện đại kết hợp dàn nhạc cổ điển và công nghệ âm thanh đa tầng điện tử.")
                    .thumbnailUrl("https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800")
                    .location("TP. Hồ Chí Minh")
                    .address(venueSecc != null ? venueSecc.getAddress() : "SECC, Quận 7")
                    .startAt(LocalDateTime.now().plusDays(45).withHour(18).withMinute(0))
                    .endAt(LocalDateTime.now().plusDays(45).withHour(22).withMinute(0))
                    .priceFrom(BigDecimal.valueOf(350000))
                    .status(EventStatus.PUBLISHED)
                    .featured(true)
                    .build();
            Event savedEv2 = eventRepository.save(event2);

            ticketTypeRepository.saveAll(Arrays.asList(
                    TicketType.builder().event(savedEv2).name("Standard Tier 1").price(BigDecimal.valueOf(350000)).quantity(800).soldQuantity(100).description("Khu vực tầng 2 khán đài").status(TicketTypeStatus.ACTIVE).build(),
                    TicketType.builder().event(savedEv2).name("Gold Arena").price(BigDecimal.valueOf(750000)).quantity(400).soldQuantity(80).description("Khu vực tầng 1 trung tâm").status(TicketTypeStatus.ACTIVE).build(),
                    TicketType.builder().event(savedEv2).name("Diamond Box").price(BigDecimal.valueOf(1800000)).quantity(50).soldQuantity(20).description("Hàng ghế VIP trực diện nhạc trưởng").status(TicketTypeStatus.ACTIVE).build()
            ));

            // Event 3
            Event event3 = Event.builder()
                    .organizer(organizer)
                    .category(catLive)
                    .venue(venueFactory)
                    .title("Indie Sunset Acoustic Night Vol. 4")
                    .slug("indie-sunset-acoustic-night-vol-4")
                    .description("Đêm nhạc mộc mạc dưới ánh hoàng hôn cùng những giai điệu Indie lãng mạn.")
                    .thumbnailUrl("https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800")
                    .location("TP. Hồ Chí Minh")
                    .address(venueFactory != null ? venueFactory.getAddress() : "Thảo Điền, TP. Thủ Đức")
                    .startAt(LocalDateTime.now().plusDays(10).withHour(17).withMinute(30))
                    .endAt(LocalDateTime.now().plusDays(10).withHour(21).withMinute(30))
                    .priceFrom(BigDecimal.valueOf(180000))
                    .status(EventStatus.PUBLISHED)
                    .featured(false)
                    .build();
            Event savedEv3 = eventRepository.save(event3);

            ticketTypeRepository.saveAll(Arrays.asList(
                    TicketType.builder().event(savedEv3).name("Single Pass").price(BigDecimal.valueOf(180000)).quantity(300).soldQuantity(85).description("1 vé + 1 đồ uống tự chọn").status(TicketTypeStatus.ACTIVE).build(),
                    TicketType.builder().event(savedEv3).name("Couple Pass").price(BigDecimal.valueOf(320000)).quantity(100).soldQuantity(30).description("2 vé + 2 đồ uống và snack").status(TicketTypeStatus.ACTIVE).build()
            ));
        }
    }

    private void seedArticles() throws Exception {
        if (articleRepository.count() == 0) {
            List<Map<String, String>> content1 = Arrays.asList(
                    Map.of("type", "paragraph", "value", "Không khí tại các lễ hội âm nhạc điện tử năm nay đang nóng lên hơn bao giờ hết với sự bùng nổ của công nghệ Visual Art và sân khấu tương tác 360 độ."),
                    Map.of("type", "heading", "value", "1. Chuẩn bị trang phục và phụ kiện dạ quang"),
                    Map.of("type", "paragraph", "value", "Ánh sáng Neon phản quang là tâm điểm của đêm diễn. Hãy lựa chọn trang phục sáng màu hoặc phát sáng dưới đèn UV để tạo dấu ấn cá nhân."),
                    Map.of("type", "quote", "value", "Âm nhạc không chỉ để nghe, mà là trải nghiệm thị giác và cảm xúc đồng điệu cùng hàng nghìn khán giả."),
                    Map.of("type", "heading", "value", "2. Quản lý vé điện tử và cổng check-in QR"),
                    Map.of("type", "paragraph", "value", "Lưu sẵn vé QR code vào điện thoại trước khi đến sự kiện để quá trình check-in qua cổng diễn ra nhanh chóng, tránh tình trạng mất sóng do đông người.")
            );

            Article article1 = Article.builder()
                    .slug("bi-kip-chay-show-hype-fest-2026")
                    .title("Bí kíp quẩy trọn vẹn HYPE FEST 2026: Từ trang phục Neon đến vị trí xem đẹp nhất")
                    .subtitle("Tất cả những gì bạn cần chuẩn bị cho đêm hội âm nhạc bùng nổ nhất mùa hè.")
                    .excerpt("Hướng dẫn chi tiết từ A-Z giúp bạn có trải nghiệm trọn vẹn tại đại nhạc hội Hype Fest 2026.")
                    .category("festival-guide")
                    .categoryName("Cẩm nang Festival")
                    .coverImage("https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800")
                    .publishedDate("28/08/2026")
                    .readTime("4 phút đọc")
                    .authorName("Minh Tuấn")
                    .authorRole("Music Editor")
                    .authorAvatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100")
                    .featured(true)
                    .relatedEventSlug("hype-fest-2026-neon-beats-in-the-dark")
                    .relatedEventTitle("HYPE FEST 2026 - Neon Beats in the Dark")
                    .contentJson(objectMapper.writeValueAsString(content1))
                    .build();

            Article article2 = Article.builder()
                    .slug("nghe-si-indie-viet-nam-va-su-chuyen-minh-2026")
                    .title("Làn sóng Indie Việt Nam 2026: Khi âm nhạc mộc mạc chạm đến hàng triệu trái tim")
                    .subtitle("Hành trình từ những phòng thu tự chế đến các concert cháy vé tại các sân vận động.")
                    .excerpt("Nhìn lại chặng đường phát triển và sự trỗi dậy mạnh mẽ của các nghệ sĩ Indie thế hệ mới.")
                    .category("artist-spotlight")
                    .categoryName("Gương mặt Nghệ sĩ")
                    .coverImage("https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800")
                    .publishedDate("25/08/2026")
                    .readTime("6 phút đọc")
                    .authorName("Hoàng Yến")
                    .authorRole("Culture Journalist")
                    .authorAvatar("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100")
                    .featured(true)
                    .contentJson(objectMapper.writeValueAsString(content1))
                    .build();

            articleRepository.saveAll(Arrays.asList(article1, article2));
        }
    }

    private void seedViolations() {
        if (violationRepository.count() == 0) {
            List<Violation> violations = Arrays.asList(
                    Violation.builder()
                            .type(ViolationType.BOT_SCALPER)
                            .typeLabel("Bot Phe Vé / Đầu Cơ")
                            .severity(ViolationSeverity.HIGH)
                            .title("Phát hiện tài khoản mua 15 vé VIP HYPE FEST trong 4 giây")
                            .target("bot.scalper99@gmail.com (IP: 113.161.42.10)")
                            .targetType("USER")
                            .evidence("15 giao dịch thành công liên tiếp cách nhau 250ms, nghi vấn dùng script tự động")
                            .status(ViolationStatus.PENDING)
                            .build(),
                    Violation.builder()
                            .type(ViolationType.EVENT_DISPUTE)
                            .typeLabel("Khiếu Nại Hoàn Tiền")
                            .severity(ViolationSeverity.HIGH)
                            .title("Sự kiện dời lịch diễn nhưng không kích hoạt hoàn vé cho khán giả")
                            .target("Cyber Sound Arena (SpacePlus Group)")
                            .targetType("ORGANIZER")
                            .evidence("Nhận được 42 đơn phản ánh từ khán giả yêu cầu hoàn tiền do đổi lịch sang tháng 11")
                            .status(ViolationStatus.PENDING)
                            .build(),
                    Violation.builder()
                            .type(ViolationType.FAKE_TICKET)
                            .typeLabel("Vé Giả / Lừa Đảo")
                            .severity(ViolationSeverity.MEDIUM)
                            .title("Phát hiện nhóm Facebook rao bán mã QR vé giả mạo Hype Fest")
                            .target("facebook.com/groups/vechohot2026")
                            .targetType("EVENT")
                            .evidence("Mã QR trên ảnh chụp không khớp với định dạng bảo mật của hệ thống Hype Ticket")
                            .status(ViolationStatus.RESOLVED)
                            .build()
            );
            violationRepository.saveAll(violations);
        }
    }
}
