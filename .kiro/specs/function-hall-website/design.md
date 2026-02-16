# Function Hall Website - Design Document

## 1. Architecture Overview

### 1.1 System Architecture
```
┌─────────────────────────────────────────┐
│         Static Website (Client)         │
├─────────────────────────────────────────┤
│  HTML5 + Tailwind CSS + Vanilla JS     │
│  ├── Navigation & Routing (Anchors)    │
│  ├── UI Components (Cards, Forms)      │
│  ├── Animation Engine (GSAP)           │
│  ├── Carousel System (Swiper.js)       │
│  ├── Form Validation (Custom JS)       │
│  ├── Dark Mode (localStorage)          │
│  └── State Management (localStorage)   │
└─────────────────────────────────────────┘
         │
         ├──> CDN Libraries (Tailwind, GSAP, Swiper)
         ├──> Google Fonts (Poppins)
         └──> WhatsApp API (External redirect)
```

### 1.2 Technology Stack
- **Frontend Framework**: None (Vanilla JavaScript)
- **CSS Framework**: Tailwind CSS v3 (CDN)
- **Animation Library**: GSAP v3.12.5
- **Carousel Library**: Swiper.js v11
- **Font**: Google Fonts - Poppins
- **Hosting**: Hostinger Shared Hosting
- **Server Config**: Apache (.htaccess)

### 1.3 Design Principles
- Mobile-first responsive design
- Progressive enhancement
- Performance optimization
- Accessibility compliance
- SEO-friendly structure
- Zero build process

## 2. Component Design

### 2.1 Navigation Component
**Purpose**: Fixed navigation bar with smooth scrolling and dark mode toggle

**Structure**:
```html
<nav class="fixed w-full bg-white dark:bg-gray-900">
  <div class="container">
    <h1>Logo/Brand</h1>
    <div class="nav-links">
      <a href="#about">About</a>
      <a href="#gallery">Gallery</a>
      <a href="#testimonials">Reviews</a>
      <a href="#calendar">Calendar</a>
      <a href="#contact">Contact</a>
    </div>
    <button onclick="toggleDarkMode()">🌓</button>
  </div>
</nav>
```

**Behavior**:
- Fixed position at top (z-index: 50)
- Smooth scroll to sections on link click
- Dark mode toggle saves preference to localStorage
- Responsive: hamburger menu on mobile (future enhancement)

### 2.2 Hero Section
**Purpose**: Eye-catching banner with call-to-action

**Structure**:
```html
<section class="hero">
  <img src="hero.webp" class="background">
  <div class="overlay"></div>
  <div class="content">
    <h2 class="hero-title">Main Headline</h2>
    <button onclick="openModal()">Book Now</button>
  </div>
</section>
```

**Animations**:
- Title fades in from top (GSAP)
- Duration: 1.2s
- Easing: default

### 2.3 Facilities Cards
**Purpose**: Display key features in card layout

**Structure**:
```html
<section id="about">
  <h2 class="section-title">Our Facilities</h2>
  <div class="grid md:grid-cols-3">
    <div class="card">
      <h3>Feature Title</h3>
      <p>Description</p>
    </div>
  </div>
</section>
```

**Styling**:
- White background (dark mode: gray-900)
- Border radius: 15px
- Box shadow: 0 10px 25px rgba(0,0,0,0.1)
- Hover: translateY(-10px)
- Transition: 0.4s

### 2.4 Animated Counters
**Purpose**: Display impressive statistics with animation

**Structure**:
```html
<section class="stats">
  <div class="counter-item">
    <h3 class="counter" data-target="500">0</h3>
    <p>Label</p>
  </div>
</section>
```

**Logic**:
```javascript
// Trigger on scroll into view
// Animate from 0 to data-target value
// Increment: target / 100
// Speed: 20ms per increment
// Only animate once per page load
```

### 2.5 Gallery Carousel
**Purpose**: Showcase hall images in auto-playing slider

**Configuration**:
```javascript
new Swiper(".mySwiper", {
  loop: true,
  autoplay: { delay: 3000 }
});
```

**Features**:
- Infinite loop
- Auto-play (3s delay)
- Touch-enabled swipe
- Lazy loading images

### 2.6 Testimonials Carousel
**Purpose**: Display client reviews with ratings

**Configuration**:
```javascript
new Swiper(".testimonialSwiper", {
  loop: true,
  autoplay: { delay: 4000 },
  pagination: {
    el: ".swiper-pagination",
    clickable: true
  }
});
```

**Features**:
- Auto-play (4s delay)
- Pagination dots
- Star ratings display
- Client names

### 2.7 Event Calendar
**Purpose**: Check date availability

**Structure**:
```html
<section id="calendar">
  <div class="card">
    <input type="date" id="eventDate" min="today">
    <button onclick="checkAvailability()">Check</button>
    <div id="availabilityResult"></div>
  </div>
</section>
```

**Logic**:
```javascript
function checkAvailability() {
  // Get selected date
  // Validate: not in past
  // Check against bookedDates array
  // Display success/error message
}
```

**Booked Dates Storage**:
```javascript
const bookedDates = ['2026-03-15', '2026-03-20', '2026-04-10'];
```

### 2.8 Booking Modal
**Purpose**: Collect booking inquiry details

**Structure**:
```html
<div id="bookingModal" class="modal">
  <div class="modal-content">
    <span onclick="closeModal()">&times;</span>
    <form id="bookingForm" onsubmit="submitBooking(event)">
      <input type="text" id="bookingName" required>
      <input type="email" id="bookingEmail" required>
      <input type="tel" id="bookingPhone" required>
      <input type="date" id="bookingDate" required>
      <select id="eventType" required>
        <option value="wedding">Wedding</option>
        <option value="reception">Reception</option>
        <option value="birthday">Birthday Party</option>
        <option value="corporate">Corporate Event</option>
        <option value="other">Other</option>
      </select>
      <textarea id="bookingDetails" required></textarea>
      <button type="submit">Submit</button>
    </form>
    <div id="bookingMessage"></div>
  </div>
</div>
```

**Validation Rules**:
- Name: required, non-empty
- Email: required, valid format (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- Phone: required, 10 digits, starts with 6-9 (Indian format)
- Date: required, future date only
- Event Type: required, from dropdown
- Details: required, non-empty

**Submission Flow**:
1. Validate all fields
2. Show error if validation fails
3. Show success message
4. Clear form
5. Optional: Redirect to WhatsApp with pre-filled message

### 2.9 Contact Form
**Purpose**: General inquiry form

**Structure**:
```html
<form id="contactForm" onsubmit="submitContact(event)">
  <input type="text" id="name" required>
  <input type="email" id="email" required>
  <input type="tel" id="phone" required>
  <textarea id="message" required></textarea>
  <button type="submit">Send Message</button>
</form>
<div id="formMessage"></div>
```

**Validation**: Same as booking form

### 2.10 WhatsApp Button
**Purpose**: Quick access to WhatsApp chat

**Structure**:
```html
<a href="https://wa.me/91XXXXXXXXXX" class="whatsapp" target="_blank">
  💬
</a>
```

**Styling**:
- Fixed position: bottom-right (20px, 20px)
- Background: #25D366 (WhatsApp green)
- Border radius: 50% (circular)
- Box shadow for depth
- Hover: scale(1.1)

### 2.11 Scroll Progress Bar
**Purpose**: Visual indicator of scroll position

**Structure**:
```html
<div id="progress-bar"></div>
```

**Logic**:
```javascript
window.onscroll = function() {
  let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  let scrolled = (winScroll / height) * 100;
  document.getElementById("progress-bar").style.width = scrolled + "%";
};
```

**Styling**:
- Fixed position: top (0, 0)
- Height: 5px
- Background: rose-600
- Z-index: 1000

## 3. State Management

### 3.1 Dark Mode State
**Storage**: localStorage
**Key**: 'darkMode'
**Values**: 'true' | 'false'

**Implementation**:
```javascript
// Save preference
localStorage.setItem('darkMode', 'true');

// Load on page load
if (localStorage.getItem('darkMode') === 'true') {
  document.documentElement.classList.add('dark');
}

// Toggle
function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('darkMode', 
    document.documentElement.classList.contains('dark'));
}
```

### 3.2 Counter Animation State
**Storage**: In-memory variable
**Purpose**: Prevent re-animation on scroll

```javascript
let counterAnimated = false;

window.addEventListener('scroll', () => {
  if (!counterAnimated) {
    // Check if in viewport
    // Animate counters
    counterAnimated = true;
  }
});
```

### 3.3 Modal State
**Storage**: DOM display property
**States**: 'flex' (open) | 'none' (closed)

```javascript
function openModal() {
  document.getElementById('bookingModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('bookingModal').style.display = 'none';
}
```

## 4. Data Models

### 4.1 Booked Dates
```javascript
const bookedDates = [
  '2026-03-15',
  '2026-03-20',
  '2026-04-10'
];
```

### 4.2 Event Types
```javascript
const eventTypes = [
  { value: 'wedding', label: 'Wedding' },
  { value: 'reception', label: 'Reception' },
  { value: 'birthday', label: 'Birthday Party' },
  { value: 'corporate', label: 'Corporate Event' },
  { value: 'other', label: 'Other' }
];
```

### 4.3 Counter Data
```javascript
const counters = [
  { target: 500, label: 'Seating Capacity' },
  { target: 1000, label: 'Happy Events' },
  { target: 15, label: 'Years Experience' },
  { target: 100, label: 'Parking Slots' }
];
```

### 4.4 Testimonials
```javascript
const testimonials = [
  {
    text: "Amazing venue! Our wedding was perfect...",
    author: "Priya & Raj",
    rating: 5
  },
  // ... more testimonials
];
```

## 5. Styling System

### 5.1 Color Palette
**Light Mode**:
- Primary: rose-600 (#e11d48)
- Background: gray-50 (#f9fafb)
- Text: gray-800 (#1f2937)
- Card: white (#ffffff)

**Dark Mode**:
- Primary: rose-600 (#e11d48)
- Background: gray-900 (#111827)
- Text: gray-50 (#f9fafb)
- Card: gray-800 (#1f2937)

### 5.2 Typography
- Font Family: 'Poppins', sans-serif
- Weights: 300 (light), 400 (regular), 600 (semibold), 700 (bold)
- Base Size: 16px
- Headings: 
  - H1: 2xl (24px) / 2rem
  - H2: 3xl (30px) / 1.875rem
  - H3: lg (18px) / 1.125rem

### 5.3 Spacing
- Section Padding: py-20 (5rem top/bottom)
- Container Max Width: 7xl (80rem)
- Card Padding: 2rem
- Gap: 8 (2rem) for grids

### 5.4 Breakpoints (Tailwind)
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

### 5.5 Animations
**GSAP Animations**:
```javascript
// Hero title
gsap.from(".hero-title", {
  y: -50,
  opacity: 0,
  duration: 1.2
});

// Section titles
gsap.from(".section-title", {
  y: 40,
  opacity: 0,
  duration: 1,
  stagger: 0.3
});
```

**CSS Transitions**:
- Card hover: 0.4s ease
- Button hover: 0.3s ease
- Dark mode: 0.3s ease
- WhatsApp button: 0.3s ease

## 6. Form Validation

### 6.1 Email Validation
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  // Show error
}
```

### 6.2 Phone Validation (Indian Format)
```javascript
const phoneRegex = /^[6-9]\d{9}$/;
const cleanPhone = phone.replace(/\D/g, '');
if (!phoneRegex.test(cleanPhone)) {
  // Show error
}
```

### 6.3 Date Validation
```javascript
const selectedDate = new Date(dateInput.value);
const today = new Date();
today.setHours(0, 0, 0, 0);

if (selectedDate < today) {
  // Show error: past date
}
```

### 6.4 Required Field Validation
```javascript
if (!name || !email || !phone || !message) {
  // Show error: fill all fields
}
```

## 7. Performance Optimization

### 7.1 Image Optimization
- Format: WebP
- Max size: 200KB per image
- Lazy loading: `loading="lazy"` attribute
- Responsive images: CSS object-fit

### 7.2 Code Optimization
- Minified libraries from CDN
- Single CSS file (style.css)
- Single JS file (main.js)
- No unnecessary dependencies

### 7.3 Caching Strategy (.htaccess)
```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### 7.4 Compression (.htaccess)
```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript
</IfModule>
```

## 8. Accessibility

### 8.1 Keyboard Navigation
- All interactive elements focusable
- Tab order logical
- Enter/Space activate buttons
- Escape closes modals

### 8.2 ARIA Labels
```html
<button aria-label="Toggle dark mode">🌓</button>
<a href="#" aria-label="WhatsApp contact">💬</a>
```

### 8.3 Color Contrast
- Text on background: minimum 4.5:1
- Large text: minimum 3:1
- Interactive elements: clear focus indicators

### 8.4 Form Accessibility
- Labels associated with inputs
- Required fields marked
- Error messages announced
- Success messages announced

## 9. SEO Optimization

### 9.1 Meta Tags
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Royal Grand Function Hall - Premium venue for weddings, receptions, and events">
<title>Royal Grand Function Hall</title>
```

### 9.2 Semantic HTML
- `<nav>` for navigation
- `<section>` for content sections
- `<article>` for testimonials
- `<footer>` for footer
- Proper heading hierarchy (h1 → h2 → h3)

### 9.3 Image Alt Text
```html
<img src="hero.webp" alt="Royal Grand Function Hall interior" loading="lazy">
```

## 10. Error Handling

### 10.1 Form Errors
**Display Method**: Inline messages below form
**Styling**: Red background, red text
**Auto-clear**: On next submission attempt

### 10.2 Date Validation Errors
- Past date selected: "Please select a future date"
- No date selected: "Please select a date"
- Date already booked: "Sorry, this date is already booked"

### 10.3 Network Errors
- WhatsApp redirect: Opens in new tab (no error handling needed)
- CDN failures: Graceful degradation (basic styling remains)

## 11. Browser Compatibility

### 11.1 Supported Features
- CSS Grid (all modern browsers)
- Flexbox (all modern browsers)
- localStorage (all modern browsers)
- ES6 JavaScript (all modern browsers)
- CSS Custom Properties (all modern browsers)

### 11.2 Fallbacks
- No JavaScript: Forms still display (no validation)
- No CSS: Semantic HTML provides structure
- No images: Alt text provides context

## 12. Deployment Configuration

### 12.1 File Structure
```
public_html/
├── index.html
├── .htaccess
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── images/
│       ├── hero.webp
│       ├── hall1.webp
│       ├── hall2.webp
│       └── hall3.webp
```

### 12.2 .htaccess Configuration
```apache
# GZIP Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/html "access plus 1 hour"
</IfModule>
```

## 13. Testing Strategy

### 13.1 Manual Testing
- Test all forms with valid/invalid data
- Test dark mode toggle and persistence
- Test all navigation links
- Test WhatsApp button
- Test calendar date picker
- Test counter animations
- Test carousels (auto-play and manual)
- Test on multiple browsers
- Test on multiple devices

### 13.2 Performance Testing
- Google PageSpeed Insights
- GTmetrix
- WebPageTest
- Target: Load time < 3s

### 13.3 Accessibility Testing
- WAVE tool
- Lighthouse accessibility audit
- Keyboard navigation test
- Screen reader test (optional)

### 13.4 Responsive Testing
- Chrome DevTools device emulation
- Real device testing
- Breakpoint testing (320px, 768px, 1024px, 1920px)

## 14. Maintenance

### 14.1 Content Updates
- Update booked dates in main.js
- Add new gallery images
- Add new testimonials
- Update contact information

### 14.2 Regular Checks
- Check SSL certificate expiry
- Monitor website uptime
- Check for broken links
- Update CDN library versions (annually)

## 15. Correctness Properties

### Property 1: Form Validation Correctness
**Validates: Requirements 4.5, 4.6**

For all form submissions (booking and contact):
- If email is invalid format, submission must fail with error message
- If phone is not 10 digits starting with 6-9, submission must fail
- If any required field is empty, submission must fail
- If all validations pass, success message must display

### Property 2: Date Selection Correctness
**Validates: Requirements 4.4**

For all date selections in calendar:
- Past dates must not be selectable (min attribute enforced)
- If selected date is in bookedDates array, must show "booked" message
- If selected date is not in bookedDates array, must show "available" message
- Empty date selection must show error message

### Property 3: Dark Mode Persistence
**Validates: Requirements 4.9**

For dark mode toggle:
- When toggled ON, 'dark' class must be added to html element
- When toggled OFF, 'dark' class must be removed from html element
- State must be saved to localStorage
- On page reload, dark mode state must match localStorage value

### Property 4: Counter Animation Trigger
**Validates: Requirements 4.8**

For animated counters:
- Counters must only animate when scrolled into viewport
- Animation must start from 0 and end at data-target value
- Animation must only occur once per page load
- All counters must animate simultaneously when triggered

### Property 5: Modal State Management
**Validates: Requirements 4.5**

For booking modal:
- openModal() must set display to 'flex'
- closeModal() must set display to 'none'
- Form submission success must clear all form fields
- Modal must be closable via X button

### Property 6: Smooth Scroll Navigation
**Validates: Requirements 4.10**

For navigation links:
- Clicking any nav link must scroll to corresponding section
- Scroll must be smooth (not instant jump)
- URL hash must update to match section
- Navbar must remain fixed during scroll

### Property 7: Responsive Layout Integrity
**Validates: Requirements 4.12**

For all screen sizes (320px to 1920px):
- No horizontal scrolling must occur
- All text must be readable without zooming
- All interactive elements must be at least 44x44px on mobile
- Grid layouts must collapse to single column on mobile

### Property 8: Image Loading Performance
**Validates: Requirements 5.1**

For all images:
- Images must be in WebP format
- Images must have loading="lazy" attribute
- Images must have alt text
- Images must not cause layout shift during load

### Property 9: WhatsApp Integration
**Validates: Requirements 4.7**

For WhatsApp button and form integrations:
- Button must open WhatsApp in new tab
- URL must contain correct phone number format (wa.me/91XXXXXXXXXX)
- Form submissions must optionally redirect to WhatsApp with pre-filled message
- Message format must include all form field values

### Property 10: Scroll Progress Accuracy
**Validates: Requirements 4.10**

For scroll progress bar:
- Width must be 0% at page top
- Width must be 100% at page bottom
- Width must update continuously during scroll
- Calculation: (scrollTop / (scrollHeight - clientHeight)) * 100

## 16. Implementation Notes

### 16.1 Critical Path
1. HTML structure with semantic markup
2. Tailwind CSS styling via CDN
3. Custom CSS for components
4. GSAP animations setup
5. Swiper carousels setup
6. Form validation logic
7. Dark mode implementation
8. Counter animation logic
9. Calendar availability logic
10. WhatsApp integration

### 16.2 Dependencies Order
1. Load Tailwind CSS (CDN)
2. Load Google Fonts (CDN)
3. Load Swiper CSS (CDN)
4. Load custom style.css
5. Load Swiper JS (CDN)
6. Load GSAP (CDN)
7. Load custom main.js

### 16.3 Configuration Points
- WhatsApp number: 3 locations (index.html, main.js x2)
- Booked dates: main.js (bookedDates array)
- Counter values: index.html (data-target attributes)
- Theme color: index.html (rose-600 classes)
- Contact info: index.html (contact section)

## 17. Success Criteria

The implementation is successful when:
- ✅ All 12 user stories are fulfilled
- ✅ All 10 correctness properties pass
- ✅ Page loads in < 3 seconds
- ✅ Google PageSpeed score > 90
- ✅ Mobile-friendly test passes
- ✅ All forms validate correctly
- ✅ Dark mode persists across reloads
- ✅ Animations are smooth (60fps)
- ✅ No console errors
- ✅ Works on all target browsers
