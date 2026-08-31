export interface TicketType {
  name: string; // e.g., "VIP", "Standard", "Early Bird"
  price: number;
  capacity: number;
  sold: number;
  description?: string;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  iconName: string; // Lucide icon name
  imageUrl: string;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  category: string; // category slug
  date: string; // e.g., "12/09/2026"
  time: string; // e.g., "19:00"
  venueId: string;
  venueName: string;
  location: string; // e.g., "TP. Hồ Chí Minh", "Hà Nội"
  priceFrom: number;
  status: "upcoming" | "sold-out";
  featured: boolean;
  ticketTypes: TicketType[];
  highlights?: string[];
  schedule?: { time: string; activity: string }[];
  faqs?: { q: string; a: string }[];
}

export interface ArticleAuthor {
  name: string;
  role: string;
  avatar: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: "behind-the-stage" | "artist-spotlight" | "festival-guide" | "culture-trends";
  categoryName: string;
  coverImage: string;
  publishedDate: string;
  readTime: string;
  author: ArticleAuthor;
  featured?: boolean;
  relatedEventSlug?: string;
  relatedEventTitle?: string;
  content: {
    type: "paragraph" | "heading" | "quote" | "image";
    value: string;
    caption?: string;
  }[];
}

export interface RefundRequest {
  requestedAt: string;
  reason: string;
  reasonDetail?: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  refundAmount: number;
  quantity: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string;
  resolvedAt?: string;
}

export interface OrderItem {
  ticketName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventImage: string;
  items: OrderItem[];
  subtotal: number;
  fee: number;
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: string;
  createdAt: string;
  isSample?: boolean;
  status?: "PAID" | "REFUND_PENDING" | "REFUNDED" | "CANCELLED" | "REJECTED_REFUND";
  refundRequest?: RefundRequest;
}
