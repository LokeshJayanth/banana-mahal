// ============================================
// PREMIUM BOOKING PAGE - BANANA MAHAL
// Function Hall & Guest House
// WITH FLATPICKR CALENDAR - DISABLED BOOKED DATES
// ============================================

// 🔧 CONFIGURATION
const API_URL = "https://script.google.com/macros/s/AKfycbxZJ-MTVLg9piRn1bjdfkFVvxH3L_70wzFsQx44XetUs-uv-lrcN7Qk13gahA3tkfEJ/exec";
const OWNER_WHATSAPP = "919384376599";

// Store blocked bookings
let blockedBookings = [];

// Flatpickr instances
let startDatePicker = null;
let endDatePicker = null;

// Event type options based on resource
const eventTypeOptions = {
  "Function Hall": [
    "Marriage",
    "Reception",
    "Engagement",
    "Showering",
    "Birthday Party",
    "Meeting",
    "Conference",
    "Corporate Event",
    "Anniversary",
    "Other"
  ],
  "Guest House": [
    "Stay",
    "Family Stay",
    "Guest Accommodation"
  ]
};

// DOM Elements
const resourceSelect = document.getElementById('resource');
const eventTypeSelect = document.getElementById('eventType');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const endDateBox = document.getElementById('endDateBox');
const slotSelect = document.getElementById('slot');
const slotBox = document.getElementById('slotBox');
const availabilityDiv = document.getElementById('availability');
const submitBtn = document.getElementById('submitBtn');
const bookingForm = document.getElementById('bookingForm');

// ============================================
// LOAD BLOCKED BOOKINGS
// ============================================
async function loadBookings() {
  try {
    console.log('📥 Loading blocked bookings...');
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Validate and filter bookings
    blockedBookings = data.filter(booking => {
      // Check if booking has required fields
      if (!booking.resource || !booking.start) {
        console.warn('Invalid booking (missing fields):', booking);
        return false;
      }
      
      // Check if dates are valid
      const startDate = new Date(booking.start);
      if (isNaN(startDate.getTime())) {
        console.warn('Invalid booking (bad start date):', booking);
        return false;
      }
      
      if (booking.end) {
        const endDate = new Date(booking.end);
        if (isNaN(endDate.getTime())) {
          console.warn('Invalid booking (bad end date):', booking);
          return false;
        }
      }
      
      return true;
    });
    
    console.log('✅ Blocked bookings loaded:', blockedBookings.length);
    console.log('Bookings:', blockedBookings);
    
    // Initialize calendar after bookings are loaded
    initCalendar();
  } catch (error) {
    console.warn('⚠️ Could not load bookings:', error.message);
    blockedBookings = [];
    // Initialize calendar even if bookings fail to load
    initCalendar();
  }
}

// ============================================
// HELPER: CHECK DATE OVERLAP
// ============================================
function isOverlapping(start1, end1, start2, end2) {
  return new Date(start1) <= new Date(end2) && new Date(start2) <= new Date(end1);
}

// ============================================
// INITIALIZE FLATPICKR CALENDAR
// ============================================
function initCalendar() {
  console.log('📅 Initializing calendar with blocked dates...');
  
  const resource = resourceSelect.value;
  
  // Destroy existing instances
  if (startDatePicker) {
    startDatePicker.destroy();
  }
  if (endDatePicker) {
    endDatePicker.destroy();
  }
  
  // Check if Flatpickr is loaded
  if (typeof flatpickr === 'undefined') {
    console.error('❌ Flatpickr library not loaded!');
    return;
  }
  
  try {
    // Start Date Picker
    startDatePicker = flatpickr("#startDate", {
      dateFormat: "Y-m-d",
      minDate: "today",
      allowInput: false,
      clickOpens: true,
      disable: [
        function(date) {
          if (!resource) return false;
          
          try {
            const dateStr = date.toISOString().split('T')[0];
            
            return blockedBookings.some(booking => {
              if (booking.resource !== resource) return false;
              
              // Validate booking dates
              if (!booking.start) return false;
              
              try {
                const bookingStart = new Date(booking.start);
                const bookingEnd = booking.end ? new Date(booking.end) : bookingStart;
                
                // Check if dates are valid
                if (isNaN(bookingStart.getTime()) || isNaN(bookingEnd.getTime())) {
                  console.warn('Invalid booking date:', booking);
                  return false;
                }
                
                // Function Hall: Block exact date
                if (resource === "Function Hall") {
                  const bookingDateStr = bookingStart.toISOString().split('T')[0];
                  return dateStr === bookingDateStr;
                }
                
                // Guest House: Block date range
                if (resource === "Guest House") {
                  return isOverlapping(date, date, bookingStart, bookingEnd);
                }
              } catch (err) {
                console.warn('Error processing booking:', booking, err);
                return false;
              }
              
              return false;
            });
          } catch (err) {
            console.warn('Error in disable function:', err);
            return false;
          }
        }
      ],
      onChange: function(selectedDates, dateStr) {
        console.log('📅 Start date selected:', dateStr);
        checkAvailability();
      }
    });
    
    // End Date Picker (for Guest House)
    endDatePicker = flatpickr("#endDate", {
      dateFormat: "Y-m-d",
      minDate: "today",
      allowInput: false,
      clickOpens: true,
      disable: [
        function(date) {
          if (resource !== "Guest House") return false;
          
          try {
            const dateStr = date.toISOString().split('T')[0];
            
            return blockedBookings.some(booking => {
              if (booking.resource !== "Guest House") return false;
              if (!booking.start) return false;
              
              try {
                const bookingStart = new Date(booking.start);
                const bookingEnd = booking.end ? new Date(booking.end) : bookingStart;
                
                if (isNaN(bookingStart.getTime()) || isNaN(bookingEnd.getTime())) {
                  return false;
                }
                
                return isOverlapping(date, date, bookingStart, bookingEnd);
              } catch (err) {
                return false;
              }
            });
          } catch (err) {
            return false;
          }
        }
      ],
      onChange: function(selectedDates, dateStr) {
        console.log('📅 End date selected:', dateStr);
        checkAvailability();
      }
    });
    
    console.log('✅ Calendar initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing calendar:', error);
  }
}

// ============================================
// UPDATE EVENT TYPE OPTIONS
// ============================================
function updateEventTypeOptions() {
  const resource = resourceSelect.value;
  
  // Clear existing options
  eventTypeSelect.innerHTML = '<option value="">Select Purpose</option>';
  
  if (resource) {
    const options = eventTypeOptions[resource] || [];
    options.forEach(eventType => {
      const option = document.createElement('option');
      option.value = eventType;
      option.textContent = eventType;
      eventTypeSelect.appendChild(option);
    });
    
    // Show/hide end date and slot based on resource
    if (resource === "Guest House") {
      endDateBox.style.display = 'block';
      endDateInput.required = true;
      slotBox.style.display = 'none';
      slotSelect.required = false;
      slotSelect.value = 'FULL_DAY';
    } else {
      endDateBox.style.display = 'none';
      endDateInput.required = false;
      slotBox.style.display = 'block';
      slotSelect.required = true;
    }
    
    // Reinitialize calendar with new resource
    initCalendar();
  }
  
  checkAvailability();
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function isOverlapping(start1, end1, start2, end2) {
  return new Date(start1) <= new Date(end2) && new Date(start2) <= new Date(end1);
}

// ============================================
// CHECK AVAILABILITY
// ============================================
function checkAvailability() {
  const resource = resourceSelect.value;
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;
  const slot = slotSelect.value;
  
  // Clear availability message if no date selected
  if (!resource || !startDate) {
    availabilityDiv.innerHTML = '';
    availabilityDiv.className = 'status';
    submitBtn.disabled = false;
    return;
  }
  
  console.log('🔍 Checking availability for:', resource, startDate);
  
  // Check if date is in the past
  const selectedDate = new Date(startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) {
    availabilityDiv.innerHTML = '❌ Please select a future date';
    availabilityDiv.className = 'status error';
    submitBtn.disabled = true;
    return;
  }
  
  // ============================================
  // GUEST HOUSE: Date Range Overlap Check
  // ============================================
  if (resource === "Guest House") {
    if (!endDate) {
      availabilityDiv.innerHTML = '';
      availabilityDiv.className = 'status';
      submitBtn.disabled = false;
      return;
    }
    
    const checkInDate = new Date(startDate);
    const checkOutDate = new Date(endDate);
    
    if (checkOutDate <= checkInDate) {
      availabilityDiv.innerHTML = '❌ Check-out must be after check-in';
      availabilityDiv.className = 'status error';
      submitBtn.disabled = true;
      return;
    }
    
    // Check for overlapping guest house bookings
    const overlap = blockedBookings.some(booking => {
      if (booking.resource !== "Guest House") return false;
      return isOverlapping(startDate, endDate, booking.start, booking.end);
    });
    
    if (overlap) {
      availabilityDiv.innerHTML = '❌ Guest house not available for these dates';
      availabilityDiv.className = 'status error';
      submitBtn.disabled = true;
    } else {
      availabilityDiv.innerHTML = '✅ Guest house available!';
      availabilityDiv.className = 'status success';
      submitBtn.disabled = false;
    }
    return;
  }
  
  // ============================================
  // FUNCTION HALL: Same Date Check
  // ============================================
  if (!slot) {
    availabilityDiv.innerHTML = '';
    availabilityDiv.className = 'status';
    submitBtn.disabled = false;
    return;
  }
  
  // Check if date is blocked
  const isBlocked = blockedBookings.some(booking => {
    if (booking.resource !== "Function Hall") return false;
    return booking.start === startDate;
  });
  
  if (isBlocked) {
    availabilityDiv.innerHTML = '❌ This date is already booked';
    availabilityDiv.className = 'status error';
    submitBtn.disabled = true;
    return;
  }
  
  // Date is available
  availabilityDiv.innerHTML = '✅ Date is available!';
  availabilityDiv.className = 'status success';
  submitBtn.disabled = false;
}

// ============================================
// SUBMIT BOOKING
// ============================================
async function submitBooking(event) {
  event.preventDefault();
  
  const resource = resourceSelect.value;
  const eventType = eventTypeSelect.value;
  const startDate = startDateInput.value;
  const endDate = endDateInput.value || startDate;
  const slot = slotSelect.value || 'FULL_DAY';
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const guests = document.getElementById('guests').value;
  const message = document.getElementById('message').value;
  
  // Validation
  if (!resource || !eventType || !startDate || !name || !phone || !guests) {
    availabilityDiv.innerHTML = '❌ Please fill all required fields';
    availabilityDiv.className = 'status error';
    return;
  }
  
  // Phone validation
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
    availabilityDiv.innerHTML = '❌ Please enter a valid 10-digit phone number';
    availabilityDiv.className = 'status error';
    return;
  }
  
  // Guest house validation
  if (resource === "Guest House" && !endDate) {
    availabilityDiv.innerHTML = '❌ Please select check-out date';
    availabilityDiv.className = 'status error';
    return;
  }
  
  // Show loading
  availabilityDiv.innerHTML = '⏳ Submitting booking request...';
  availabilityDiv.className = 'status info';
  submitBtn.disabled = true;
  
  // Prepare booking data
  const bookingData = {
    resource: resource,
    eventType: eventType,
    startDate: startDate,
    endDate: endDate,
    slot: slot,
    name: name,
    phone: phone,
    guests: guests,
    message: message
  };
  
  try {
    console.log('📤 Submitting booking:', bookingData);
    
    // Submit to Google Sheets
    const response = await fetch(API_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    });
    
    console.log('📥 Response received');
    
    // Show success message
    availabilityDiv.innerHTML = '✅ Booking request submitted successfully!';
    availabilityDiv.className = 'status success';
    
    // Send WhatsApp notification
    sendWhatsAppNotification(bookingData);
    
    // Reload bookings
    setTimeout(() => loadBookings(), 1000);
    
    // Reset form after delay
    setTimeout(() => {
      bookingForm.reset();
      availabilityDiv.innerHTML = '';
      availabilityDiv.className = 'status';
      updateEventTypeOptions();
    }, 3000);
    
  } catch (error) {
    console.error('❌ Booking error:', error);
    availabilityDiv.innerHTML = '❌ Error submitting booking. Please try again.';
    availabilityDiv.className = 'status error';
  } finally {
    submitBtn.disabled = false;
  }
}

// ============================================
// SEND WHATSAPP NOTIFICATION
// ============================================
function sendWhatsAppNotification(booking) {
  let whatsappText = `📢 *NEW BOOKING REQUEST*\n\n`;
  whatsappText += `🏛️ *RESOURCE:* ${booking.resource}\n`;
  whatsappText += `🎯 *EVENT TYPE:* ${booking.eventType}\n`;
  whatsappText += `📅 *START DATE:* ${booking.startDate}\n`;
  
  if (booking.endDate && booking.endDate !== booking.startDate) {
    whatsappText += `📅 *END DATE:* ${booking.endDate}\n`;
  }
  
  if (booking.slot && booking.resource === "Function Hall") {
    whatsappText += `⏰ *TIME SLOT:* ${booking.slot.replace('_', ' ')}\n`;
  }
  
  whatsappText += `👤 *NAME:* ${booking.name}\n`;
  whatsappText += `📱 *PHONE:* ${booking.phone}\n`;
  whatsappText += `👥 *GUESTS:* ${booking.guests}\n`;
  
  if (booking.message) {
    whatsappText += `💬 *MESSAGE:* ${booking.message}\n`;
  }
  
  whatsappText += `\n⚠️ *STATUS:* PENDING\n`;
  whatsappText += `📋 *ACTION:* Review in Google Sheet\n`;
  whatsappText += `\n_Sent from Banana Mahal Website_`;
  
  setTimeout(() => {
    window.open(
      `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(whatsappText)}`,
      '_blank'
    );
  }, 1000);
}

// ============================================
// EVENT LISTENERS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Premium booking page loaded');
  
  // Load bookings and initialize calendar
  loadBookings();
  
  // Attach event listeners
  resourceSelect.addEventListener('change', updateEventTypeOptions);
  slotSelect.addEventListener('change', checkAvailability);
  bookingForm.addEventListener('submit', submitBooking);
  
  console.log('✅ Event listeners attached');
});
