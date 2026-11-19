
//Customer Order Tracking + Rating & Review 

const trackingForm = document.getElementById("tracking-form");
const trackingResult = document.getElementById("tracking-result");
const trackingError = document.getElementById("tracking-error");

const ORDER_STAGES = ["Pending", "Accepted", "Picked Up", "Delivered"];

// Get saved customer reviews
function getReviews() {
  return JSON.parse(localStorage.getItem("orderReviews")) || [];
}

// Save customer reviews
function saveReviews(reviews) {
  localStorage.setItem("orderReviews", JSON.stringify(reviews));
}

// Find a review for a specific order
function findReview(orderId) {
  return getReviews().find(function (review) {
    return review.orderId === orderId;
  });
}

// Show the order progress
function showTrackingSteps(status) {
  const currentStep = ORDER_STAGES.indexOf(status);
  let html = '<div class="tracking-steps">';

  for (let i = 0; i < ORDER_STAGES.length; i++) {
    let className = "tracking-step";

    if (i <= currentStep) {
      className += " done";
    }

    html += '<div class="' + className + '">' +
              '<span>' + ORDER_STAGES[i] + '</span>' +
            '</div>';
  }

  return html + '</div>';
}

// Show a previously submitted review
function showSavedReview(review) {
  return '<div class="review-section">' +
           '<h3>Your Review</h3>' +
           '<div class="review-display">' +
             '<div class="review-stars">' + "★".repeat(review.rating) +
               "☆".repeat(5 - review.rating) + '</div>' +
             '<p>' + safe(review.comment) + '</p>' +
             '<small>' + safe(review.date) + '</small>' +
           '</div>' +
         '</div>';
}

// Show the review form for a delivered order
function showReviewForm(order) {
  const oldReview = findReview(order.id);

  if (oldReview) {
    return showSavedReview(oldReview);
  }

  if (order.status !== "Delivered") {
    return '<div class="review-section">' +
             '<h3>Rate Your Experience</h3>' +
             '<p class="subtitle">You can submit a review after your order is delivered.</p>' +
           '</div>';
  }

  return '<div class="review-section">' +
           '<h3>Rate Your Experience</h3>' +
           '<p class="subtitle">How was your experience with FoodParcel Express?</p>' +
           '<form class="review-form" id="review-form">' +
             '<label><b>Your Rating</b></label>' +
             '<div class="rating-options">' +
               '<label><input type="radio" name="rating" value="1" required>★</label>' +
               '<label><input type="radio" name="rating" value="2">★★</label>' +
               '<label><input type="radio" name="rating" value="3">★★★</label>' +
               '<label><input type="radio" name="rating" value="4">★★★★</label>' +
               '<label><input type="radio" name="rating" value="5">★★★★★</label>' +
             '</div>' +
             '<label for="review-comment"><b>Write Your Review</b></label>' +
             '<textarea id="review-comment" placeholder="Share your experience..." required maxlength="500"></textarea>' +
             '<button type="submit" class="btn">Submit Review</button>' +
           '</form>' +
         '</div>';
}

// Display the matched order
function showOrder(order) {
  let itemLines = "";

  for (const item of order.items) {
    itemLines += '<div class="tracking-item">' +
                   '<span>' + safe(item.name) + ' x ' + item.qty + '</span>' +
                   '<span>৳' + (item.price * item.qty) + '</span>' +
                 '</div>';
  }

  const riderText = order.riderName
    ? safe(order.riderName)
    : "Not assigned yet";

  trackingResult.innerHTML =
    '<div class="tracking-result-box">' +
      '<h2>Order Details</h2>' +

      '<div class="tracking-info">' +
        '<div>' +
          '<p><b>Order ID</b></p>' +
          '<p>' + safe(order.id) + '</p>' +
        '</div>' +
        '<div>' +
          '<p><b>Order Date</b></p>' +
          '<p>' + safe(order.date) + '</p>' +
        '</div>' +
        '<div>' +
          '<p><b>Current Status</b></p>' +
          '<span class="tracking-status">' + safe(order.status) + '</span>' +
        '</div>' +
      '</div>' +

      '<h3>Delivery Progress</h3>' +
      showTrackingSteps(order.status) +

      '<div class="tracking-items">' +
        '<h3>Ordered Items</h3>' +
        itemLines +
      '</div>' +

      '<p><b>Delivery Address:</b> ' + safe(order.address) + '</p>' +
      '<p class="tracking-rider"><b>Delivery Rider:</b> ' + riderText + '</p>' +
      '<p class="tracking-rider"><b>Total Amount:</b> ৳' + order.total + '</p>' +

      showReviewForm(order) +
    '</div>';

  // Listen for review submission after displaying the form
  const reviewForm = document.getElementById("review-form");

  if (reviewForm) {
    reviewForm.addEventListener("submit", function (event) {
      event.preventDefault();
      submitReview(order);
    });
  }
}

// Search order using Order ID and phone number
function trackOrder(event) {
  event.preventDefault();

  const orderId = document.getElementById("order-id").value.trim().toUpperCase();
  const phone = document.getElementById("tracking-phone").value.trim();

  trackingError.innerText = "";
  trackingResult.innerHTML = "";

  const orders = getOrders();

  const order = orders.find(function (o) {
    return String(o.id).toUpperCase() === orderId &&
           String(o.phone).trim() === phone;
  });

  if (!order) {
    trackingError.innerText = "No order found. Please check your Order ID and phone number.";
    return;
  }

  if (!ORDER_STAGES.includes(order.status)) {
    trackingError.innerText = "This order has an unknown status.";
    return;
  }

  showOrder(order);
}

// Save a customer review
function submitReview(order) {
  const selectedRating = document.querySelector('input[name="rating"]:checked');
  const comment = document.getElementById("review-comment").value.trim();

  if (!selectedRating) {
    alert("Please select a rating.");
    return;
  }

  if (comment === "") {
    alert("Please write your review.");
    return;
  }

  if (order.status !== "Delivered") {
    alert("You can review an order only after it is delivered.");
    return;
  }

  const reviews = getReviews();

  const alreadyReviewed = reviews.some(function (review) {
    return review.orderId === order.id;
  });

  if (alreadyReviewed) {
    alert("You have already reviewed this order.");
    showOrder(order);
    return;
  }

  const review = {
    orderId: order.id,
    name: order.name,
    phone: order.phone,
    rating: Number(selectedRating.value),
    comment: comment,
    date: new Date().toLocaleString()
  };

  reviews.push(review);
  saveReviews(reviews);

  alert("Thank you! Your review has been submitted.");
  showOrder(order);
}

// ----- Run when the page opens -----

trackingForm.addEventListener("submit", trackOrder);
