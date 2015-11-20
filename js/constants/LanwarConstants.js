module.exports = {
	/**
	 * Action Constanrs
	 */
	LOAD_TICKET_TYPES: "LOAD_TICKET_TYPES",
	LOAD_TICKET_TYPES_SUCCESS: "LOAD_TICKET_TYPES_SUCCESS",
	LOAD_TICKET_TYPES_FAILURE: "LOAD_TICKET_TYPES_FAILURE",

	CHANGE_TICKET_QUANTITY: "CHANGE_TICKET_QUANTITY",
	SAVE_TICKET_FORM_DATA: "SAVE_TICKET_FORM_DATA",
	ASSIGN_SEAT_TO_TICKET: "ASSIGN_SEAT_TO_TICKET",
	LOAD_MAKE_RESERVATION: "LOAD_MAKE_RESERVATION",
	LOAD_MAKE_RESERVATION_SUCCESS: "LOAD_MAKE_RESERVATION_SUCCESS",
	LOAD_MAKE_RESERVATION_FAILURE: "LOAD_MAKE_RESERVATION_FAILURE",
	ALL_SEATS_UNRESERVED: "ALL_SEATS_UNRESERVED",
	CHECKOUT_SUCCESS: "CHECKOUT_SUCCESS",
	CHECKOUT_ERROR: "CHECKOUT_ERROR",
	INIT_CHECKOUT: "INIT_CHECKOUT",
	CHECKOUT_LOADING: "CHECKOUT_LOADING",
	SET_ADMIN_GUEST_CHECKOUT: "SET_ADMIN_GUEST_CHECKOUT",
	SET_STUDENT_CHECKOUT: "SET_STUDENT_CHECKOUT",
	RESET_CHECKOUT: "RESET_CHECKOUT",
	UPDATE_TICKET_OPTIONS: "UPDATE_TICKET_OPTIONS",
	UPDATE_TICKET_OPTIONS_NOTES: "UPDATE_TICKET_OPTIONS_NOTES",
	CHECK_COUPON_LOADING: "CHECK_COUPON_LOADING",
	CHECK_COUPON_SUCCESS: "CHECK_COUPON_SUCCESS",
	CHECK_COUPON_ERROR: "CHECK_COUPON_ERROR",
	RESET_COUPON: "RESET_COUPON",
	MANUALLY_LOAD_ORDER: "MANUALLY_LOAD_ORDER",

	LOAD_ROOMS: "LOAD_ROOMS",
	LOAD_ROOMS_SUCCESS: "LOAD_ROOMS_SUCCESS",
	LOAD_ROOMS_FAILURE: "LOAD_ROOMS_FAILURE",
	LOAD_SEATS: "LOAD_SEATS",
	LOAD_SEATS_SUCCESS: "LOAD_SEATS_SUCCESS",
	LOAD_SEATS_FAILURE: "LOAD_SEATS_FAILURE",
	LOAD_ALL_SEATS: "LOAD_ALL_SEATS",
	LOAD_ALL_SEATS_SUCCESS: "LOAD_ALL_SEATS_SUCCESS",
	LOAD_ALL_SEATS_FAILURE: "LOAD_ALL_SEATS_FAILURE",

	LOAD_SEAT_STATUSES: "LOAD_SEAT_STATUSES",
	LOAD_SEAT_STATUSES_SUCCESS: "LOAD_SEAT_STATUSES_SUCCESS",
	LOAD_SEAT_STATUSES_FAILURE: "LOAD_SEAT_STATUSES_FAILURE",
	SEAT_STATUS_CHANGED: "SEAT_STATUS_CHANGED",

	LOGIN_LOADING: "LOGIN_LOADING",
	LOGIN_SUCCESS: "LOGIN_SUCCESS",
	LOGIN_ERROR: "LOGIN_ERROR",
	LOGOUT_SUCCESS: "LOGOUT_SUCCESS",
	SESSION_CHECK_LOADING: "SESSION_CHECK_LOADING",
	SESSION_CHECK_SUCCESS: "SESSION_CHECK_SUCCESS",
	SESSION_CHECK_ERROR: "SESSION_CHECK_ERROR",
	USER_PROFILE_LOADING: "USER_PROFILE_LOADING",
	USER_PROFILE_SUCCESS: "USER_PROFILE_SUCCESS",
	USER_PROFILE_ERROR: "USER_PROFILE_ERROR",
	UPDATE_PROFILE_LOADING: "UPDATE_PROFILE_LOADING",
	UPDATE_PROFILE_SUCCESS: "UPDATE_PROFILE_SUCCESS",
	UPDATE_PROFILE_ERROR: "UPDATE_PROFILE_ERROR",
	UPDATE_EMAIL_LOADING: "UPDATE_EMAIL_LOADING",
	UPDATE_EMAIL_SUCCESS: "UPDATE_EMAIL_SUCCESS",
	UPDATE_EMAIL_ERROR: "UPDATE_EMAIL_ERROR",
	UPDATE_PASSWORD_LOADING: "UPDATE_PASSWORD_LOADING",
	UPDATE_PASSWORD_SUCCESS: "UPDATE_PASSWORD_SUCCESS",
	UPDATE_PASSWORD_ERROR: "UPDATE_PASSWORD_ERROR",
	REGISTER_LOADING: "REGISTER_LOADING",
	REGISTER_SUCCESS: "REGISTER_SUCCESS",
	REGISTER_ERROR: "REGISTER_ERROR",
	SESSION_TIMEOUT: "SESSION_TIMEOUT",
	DISMISSED_SESSION_TIMEOUT: "DISMISSED_SESSION_TIMEOUT",

	ADMIN_ORDERS_LOADING: "ADMIN_ORDERS_LOADING",
	ADMIN_ORDERS_SUCCESS: "ADMIN_ORDERS_SUCCESS",
	ADMIN_ORDERS_ERROR: "ADMIN_ORDERS_ERROR",
	ADMIN_ORDERS_SUMMARY_LOADING: "ADMIN_ORDERS_SUMMARY_LOADING",
	ADMIN_ORDERS_SUMMARY_SUCCESS: "ADMIN_ORDERS_SUMMARY_SUCCESS",
	ADMIN_ORDERS_SUMMARY_ERROR: "ADMIN_ORDERS_SUMMARY_ERROR",
	ADMIN_ORDER_DETAIL_LOADING: "ADMIN_ORDER_DETAIL_LOADING",
	ADMIN_ORDER_DETAIL_SUCCESS: "ADMIN_ORDER_DETAIL_SUCCESS",
	ADMIN_ORDER_DETAIL_ERROR: "ADMIN_ORDER_DETAIL_ERROR",
	ADMIN_CHECK_IN_ID_LOADING: "ADMIN_CHECK_IN_ID_LOADING",
	ADMIN_CHECK_IN_ID_SUCCESS: "ADMIN_CHECK_IN_ID_SUCCESS",
	ADMIN_CHECK_IN_ID_ERROR: "ADMIN_CHECK_IN_ID_ERROR",
	OPEN_LOOKUP_ORDER_NUMBER_MODAL: "OPEN_LOOKUP_ORDER_NUMBER_MODAL",
	LOOKUP_ORDER_NUMBER_LOADING: "LOOKUP_ORDER_NUMBER_LOADING",
	LOOKUP_ORDER_NUMBER_SUCCESS: "LOOKUP_ORDER_NUMBER_SUCCESS",
	LOOKUP_ORDER_NUMBER_ERROR: "LOOKUP_ORDER_NUMBER_ERROR",
	DISMISS_LOOKUP_ORDER_NUMBER_MODAL: "DISMISS_LOOKUP_ORDER_NUMBER_MODAL",
	DISMISS_RE_SEND_EMAIL_MODAL: "DISMISS_RE_SEND_EMAIL_MODAL",
	OPEN_RE_SEND_EMAIL_MODAL: "OPEN_RE_SEND_EMAIL_MODAL",
	RE_SEND_EMAIL_LOADING: "RE_SEND_EMAIL_LOADING",
	RE_SEND_EMAIL_SUCCESS: "RE_SEND_EMAIL_SUCCESS",
	RE_SEND_EMAIL_ERROR: "RE_SEND_EMAIL_ERROR",
	RESET_RE_SEND_EMAIL_MESSAGE: "RESET_RE_SEND_EMAIL_MESSAGE",

	CHECK_IN_HASH_LOADING: "CHECK_IN_HASH_LOADING",
	CHECK_IN_HASH_SUCCESS: "CHECK_IN_HASH_SUCCESS",
	CHECK_IN_HASH_ERROR: "CHECK_IN_HASH_ERROR",
	CHECK_IN_DISMISS: "CHECK_IN_DISMISS",

	ADMIN_TICKETS_LOADING: "ADMIN_TICKETS_LOADING",
	ADMIN_TICKETS_SUCCESS: "ADMIN_TICKETS_SUCCESS",
	ADMIN_TICKETS_ERROR: "ADMIN_TICKETS_ERROR",

	GET_ORDER_LOADING: "GET_ORDER_LOADING",
	GET_ORDER_SUCCESS: "GET_ORDER_SUCCESS",
	GET_ORDER_ERROR: "GET_ORDER_ERROR",
	BOOK_SEATS_LOADING: "BOOK_SEATS_LOADING",
	BOOK_SEATS_SUCCESS: "BOOK_SEATS_SUCCESS",
	BOOK_SEATS_ERROR: "BOOK_SEATS_ERROR",
	SET_LABEL_LOADING: "SET_LABEL_LOADING",
	SET_LABEL_SUCCESS: "SET_LABEL_SUCCESS",
	SET_LABEL_ERROR: "SET_LABEL_ERROR",

	/**
	 * Misc Constants
	 */
	EVENT_ID: 1,
	RESERVATION_API: "/reservations",
	STUDENT_DISCOUNT: 5.0
};