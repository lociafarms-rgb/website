// Goat Inquiry configuration for Locia Farms
//
// 1) Create a Formspree form (recommended) and paste the endpoint below.
//    Example: https://formspree.io/f/abcdwxyz
//
// 2) Create a Google Calendar Appointment Schedule (or booking link)
//    from the Locia Farms Google Calendar, and paste the public URL below.
//
// NOTE: These values are public (served to browsers). Do not put secrets here.

window.LOCIA_GOAT_INQUIRY = {
  // Form handler endpoint (Formspree/Getform/etc). Keep empty to disable submission.
  FORM_ACTION: "https://formspree.io/f/xykdnjor",

  // Public scheduling link (Google Calendar appointment schedule)
  PICKUP_SCHED_URL: "https://calendar.app.google/FEHXXWXLwPQiqHzp7",

  // Where the inquiry should route (informational only; real routing is controlled by the form provider)
  TO_EMAIL: "lociafarms@gmail.com",
};
