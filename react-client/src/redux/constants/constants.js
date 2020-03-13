
// constants for autoposting
export const FETCH_AUTOPOSTING_LIST = 'FETCH_AUTOPOSTING_LIST'
export const CREATE_AUTOPOSTING_SUCCESS = 'CREATE_AUTOPOSTING_SUCCESS'
export const CREATE_AUTOPOSTING_FAILURE = 'CREATE_AUTOPOSTING_FAILURE'
export const EDIT_AUTOPOSTING_SUCCESS = 'EDIT_AUTOPOSTING_SUCCESS'
export const EDIT_AUTOPOSTING_FAILURE = 'EDIT_AUTOPOSTING_FAILURE'
export const CLEAR_AUTOPOSTING_ALERT_MESSAGES = 'CLEAR_AUTOPOSTING_ALERT_MESSAGES'
export const FETCH_AUTOPOSTING_MESSAGES_LIST = 'FETCH_AUTOPOSTING_MESSAGES_LIST'
export const SHOW_AUTOPOSTING_POSTS = 'SHOW_AUTOPOSTING_POSTS'

// constants for backdoor
export const LOAD_LOCALES_LIST_BACKDOOR = 'LOAD_LOCALES_LIST_BACKDOOR'
export const LOAD_USERS_LIST = 'LOAD_USERS_LIST'
export const LOAD_USERS_LIST_FILTERS = 'LOAD_USERS_LIST_FILTERS'
export const LOAD_DATA_OBJECTS_LIST = 'LOAD_DATA_OBJECTS_LIST'
export const LOAD_TOP_PAGES_LIST = 'LOAD_TOP_PAGES_LIST'
export const LOAD_BACKDOOR_PAGES_LIST = 'LOAD_BACKDOOR_PAGES_LIST'
export const UPDATE_BROADCASTS_GRAPH = 'UPDATE_BROADCASTS_GRAPH'
export const UPDATE_POLLS_GRAPH = 'UPDATE_POLLS_GRAPH'
export const UPDATE_SURVEYS_GRAPH = 'UPDATE_SURVEYS_GRAPH'
export const UPDATE_SESSIONS_GRAPH = 'UPDATE_SESSIONS_GRAPH'
export const UPDATE_BROADCASTS_BY_DAYS = 'UPDATE_BROADCASTS_BY_DAYS'
export const UPDATE_POLLS_BY_DAYS = 'UPDATE_POLLS_BY_DAYS'
export const UPDATE_SURVEYS_BY_DAYS = 'UPDATE_SURVEYS_BY_DAYS'
export const LOAD_POLLS_LIST = 'LOAD_POLLS_LIST'
export const LOAD_POLL_DETAILS = 'LOAD_POLL_DETAILS'
export const LOAD_BROADCASTS_LIST = 'LOAD_BROADCASTS_LIST' //  backdoor broadcasts
export const LOAD_SURVEY_DETAILS = 'LOAD_SURVEY_DETAILS' //  backdoor broadcasts
export const LOAD_PAGE_SUBSCRIBERS_LIST = 'LOAD_PAGE_SUBSCRIBERS_LIST'
export const SAVE_USER_INFORMATION = 'SAVE_USER_INFORMATION'
export const SAVE_PAGE_INFORMATION = 'SAVE_PAGE_INFORMATION'
export const SAVE_SURVEY_INFORMATION = 'SAVE_SURVEY_INFORMATION'
export const SAVE_CURRENT_POLL = 'SAVE_CURRENT_POLL'
export const DOWNLOAD_FILE = 'DOWNLOAD_FILE'
export const DELETE_ACCOUNT_RESPONSE = 'DELETE_ACCOUNT_RESPONSE'
export const LOAD_UNIQUE_PAGES_DETAILS = 'LOAD_UNIQUE_PAGES_DETAILS'
export const LOAD_PAGE_TAGS = 'LOAD_PAGE_TAGS'
export const LOAD_SUBSCRIBERS_WITH_TAGS = 'LOAD_SUBSCRIBERS_WITH_TAGS'
export const LOAD_COMPANY_INFO = 'LOAD_COMPANY_INFO'
export const LOAD_PAGE_OWNERS = 'LOAD_PAGE_OWNERS'
export const UPDATE_PAGE_USERS = 'UPDATE_PAGE_USERS'
export const UPDATE_PAGE_PERMISSIONS = 'UPDATE_PAGE_PERMISSIONS'
export const UPDATE_PAGE_PERMISSIONS_ERROR = 'UPDATE_PAGE_PERMISSIONS_ERROR'
export const UPDATE_PAGE_ADMINS = 'UPDATE_PAGE_ADMINS'

// constants for basicinfo
export const LOAD_BROWSER_NAME = 'LOAD_BROWSER_NAME'
export const LOAD_USER_DETAILS = 'LOAD_USER_DETAILS'
export const LOAD_KEYS = 'LOAD_KEYS'
export const FETCH_PLAN = 'FETCH_PLAN'
export const LOAD_UPDATED_USER_DETAILS = 'LOAD_UPDATED_USER_DETAILS'
export const STORE_FB_APP_ID = 'STORE_FB_APP_ID'
export const LOAD_BROWSER_VERSION = 'LOAD_BROWSER_VERSION'
export const STORE_ADMIN_SUB_ID = 'STORE_ADMIN_SUB_ID'
export const SET_SOCKET_STATUS = 'SET_SOCKET_STATUS'
export const DASHBOARD_TOUR_COMPLETED = 'DASHBOARD_TOUR_COMPLETED'
export const WORKFLOWS_TOUR_COMPLETED = 'WORKFLOWS_TOUR_COMPLETED'
export const SURVEY_TOUR_COMPLETED = 'SURVEY_TOUR_COMPLETED'
export const CONVO_TOUR_COMPLETED = 'CONVO_TOUR_COMPLETED'
export const POLL_TOUR_COMPLETED = 'POLL_TOUR_COMPLETED'
export const PERMISSION_ERROR = 'PERMISSION_ERROR'
export const GET_AUTOMATED_OPTIONS = 'GET_AUTOMATED_OPTIONS'

// constants for broadcasts
export const FETCH_BROADCASTS_LIST = 'FETCH_BROADCASTS_LIST'
export const SHOW_FILE_UPLOAD_INDICATOR = 'SHOW_FILE_UPLOAD_INDICATOR'
export const ADD_BROADCAST = 'ADD_BROADCAST'
export const EDIT_BROADCAST = 'EDIT_BROADCAST'
export const GET_BROADCAST = 'GET_BROADCAST'
export const SEND_BROADCAST_SUCCESS = 'SEND_BROADCAST_SUCCESS'
export const SEND_BROADCAST_FAILURE = 'SEND_BROADCAST_FAILURE'
export const CLEAR_ALERT = 'CLEAR_ALERT'

// constants for customer list
export const LOAD_CUSTOMER_LISTS = 'LOAD_CUSTOMER_LISTS'
export const LOAD_CUSTOMER_LISTS_NEW = 'LOAD_CUSTOMER_LISTS_NEW'
export const LOAD_LIST_DETAILS = 'LOAD_LIST_DETAILS'
export const ADD_NEW_LIST = 'ADD_NEW_LIST'
export const CURRENT_CUSTOMER_LIST = 'CURRENT_CUSTOMER_LIST'
export const CLEAR_CURRENT_CUSTOMER_LIST = 'CLEAR_CURRENT_CUSTOMER_LIST'
export const LOAD_REPLIED_POLL_SUBSCRIBERS = 'LOAD_REPLIED_POLL_SUBSCRIBERS'
export const LOAD_REPLIED_SURVEY_SUBSCRIBERS = 'LOAD_REPLIED_SURVEY_SUBCSCRIBERS'

// constants for dashboard
export const UPDATE_DASHBOARD = 'UPDATE_DASHBOARD'
export const UPDATE_SUBSCRIBER_SUMMARY = 'UPDATE_SUBSCRIBER_SUMMARY'
export const UPDATE_AUTOPOSTING_SUMMARY = 'UPDATE_AUTOPOSTING_SUMMARY'
export const UPDATE_NEWS_SUMMARY = 'UPDATE_NEWS_SUMMARY'
export const UPDATE_INTEGRATIONS_SUMMARY = 'UPDATE_INTEGRATIONS_SUMMARY'
export const UPDATE_SENT_VS_SEEN = 'UPDATE_SENT_VS_SEEN'
export const UPDATE_GRAPH_DATA = 'UPDATE_GRAPH_DATA'
export const UPDATE_TOP_PAGES = 'UPDATE_TOP_PAGES'
export const VIEW_PAGE_SUBSCRIBERS_LIST_DASHBOARD = 'VIEW_PAGE_SUBSCRIBERS_LIST_DASHBOARD'
export const LOAD_LOCALES_LIST_DASHBOARD = 'LOAD_LOCALES_LIST_DASHBOARD'

// constants for growth tools
export const SAVE_PHONE_NUMBERS = 'SAVE_PHONE_NUMBERS'
export const CLEAR_ALERT_FILERESPONSE = 'CLEAR_ALERT_FILERESPONSE'
export const LOAD_NON_SUBSCRIBERS_DATA = 'LOAD_NON_SUBSCRIBERS_DATA'

// constants for invitations
export const LOAD_INVITATIONS = 'LOAD_INVITATIONS'
export const INVITATION_SUCCESS = 'INVITATION_SUCCESS'
export const INVITATION_FAILURE = 'INVITATION_FAILURE'
export const ADD_INVITATION = 'ADD_INVITATION'
export const CLEAR_INVITATION_ALERT_MESSAGES = 'CLEAR_INVITATION_ALERT_MESSAGES'

// constants live chat
export const UPDATE_CHAT_SESSIONS = 'UPDATE_CHAT_SESSIONS'
export const RESET_UNREAD_SESSION = 'RESET_UNREAD_SESSION'
export const SHOW_CHAT_SESSIONS = 'SHOW_CHAT_SESSIONS'
export const SHOW_OPEN_CHAT_SESSIONS = 'SHOW_OPEN_CHAT_SESSIONS'
export const SHOW_OPEN_CHAT_SESSIONS_OVERWRITE = 'SHOW_OPEN_CHAT_SESSIONS_OVERWRITE'
export const SHOW_CLOSE_CHAT_SESSIONS = 'SHOW_CLOSE_CHAT_SESSIONS'
export const SHOW_CLOSE_CHAT_SESSIONS_OVERWRITE = 'SHOW_CLOSE_CHAT_SESSIONS_OVERWRITE'
export const SHOW_USER_CHAT = 'SHOW_USER_CHAT'
export const SHOW_USER_CHAT_OVERWRITE = 'SHOW_USER_CHAT_OVERWRITE'
export const SOCKET_UPDATE = 'SOCKET_UPDATE'
export const SOCKET_UPDATE_SEEN = 'SOCKET_UPDATE_SEEN'
export const RESET_SOCKET = 'RESET_SOCKET'
export const LOADING_URL_META = 'LOADING_URL_META'
export const GET_URL_META = 'GET_URL_META'
export const UPDATE_CHAT = 'UPDATE_CHAT'
export const CHANGE_STATUS = 'CHANGE_STATUS'
export const SET_ACTIVE_SESSION = 'SET_ACTIVE_SESSION'
export const RESET_ACTIVE_SESSION = 'RESET_ACTIVE_SESSION'
export const SHOW_SEARCH_CHAT = 'SHOW_SEARCH_CHAT'
export const UPDATE_USER_CHAT = 'UPDATE_USER_CHAT'
export const CLEAR_SEARCH_RESULT = 'CLEAR_SEARCH_RESULT'
export const SHOW_CUSTOMERS = 'SHOW_CUSTOMERS'
export const UPDATE_OPEN_SESSIONS_WITH_CUSTOMERID = 'UPDATE_OPEN_SESSIONS_WITH_CUSTOMERID'
export const UPDATE_CLOSE_SESSIONS_WITH_CUSTOMERID = 'UPDATE_CLOSE_SESSIONS_WITH_CUSTOMERID'
export const UPDATE_SESSIONS = 'UPDATE_SESSIONS'
export const EMPTY_SOCKET_DATA = 'EMPTY_SOCKET_DATA'
export const CLEAR_USER_CHAT = 'CLEAR_USER_CHAT'
export const UPDATE_LIVECHAT_INFO = 'UPDATE_LIVECHAT_INFO'

// constants for login
export const FORGOT_FAILURE = 'FORGOT_FAILURE'
export const FORGOT_SUCCESS = 'FORGOT_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'

// constants for members
export const LOAD_MEMBERS = 'LOAD_MEMBERS'
export const MEMBERS_SUCCESS = 'MEMBERS_SUCCESS'
export const MEMBERS_FAILURE = 'MEMBERS_FAILURE'
export const CLEAR_MEMBERS_ALERT_MESSAGES = 'CLEAR_MEMBERS_ALERT_MESSAGES'

// constants for menu
export const ADD_MENU_ITEM = 'ADD_MENU_ITEM'
export const SAVE_CURRENT_MENUITEM = 'SAVE_CURRENT_MENUITEM'
export const SAVE_MENU_SUCCESS = 'SAVE_MENU_SUCCESS'
export const SAVE_MENU_FAILURE = 'SAVE_MENU_FAILURE'
export const UPDATE_INDEX_BY_PAGE = 'UPDATE_INDEX_BY_PAGE'

// constants for pages
export const LOAD_PAGES_LIST = 'LOAD_PAGES_LIST'
export const LOAD_PAGES_LIST_NEW = 'LOAD_PAGES_LIST_NEW'
export const FETCH_PAGES_LIST = 'FETCH_PAGES_LIST'
export const PAGE_CONNECT_WARNING = 'PAGE_CONNECT_WARNING'
export const PAGE_NOT_PUBLISHED = 'PAGE_NOT_PUBLISHED'
export const UPDATE_CURRENT_PAGE = 'UPDATE_CURRENT_PAGE'
export const UPDATE_REACH_ESTIMATION = 'UPDATE_REACH_ESTIMATION'

// constants for polls
export const FETCH_POLLS_LIST = 'FETCH_POLLS_LIST'
export const FETCH_POLLS_LIST_NEW = 'FETCH_POLLS_LIST_NEW'
export const ADD_POLL = 'ADD_POLL'
export const ADD_POLL_RESPONSES = 'ADD_POLL_RESPONSES'
export const ADD_POLL_RESPONSES_FULL = 'ADD_POLL_RESPONSES_FULL'
export const SEND_POLL = 'SEND_POLL'
export const SEND_POLL_SUCCESS = 'SEND_POLL_SUCCESS'
export const SEND_POLL_FAILURE = 'SEND_POLL_FAILURE'
export const GET_ALL_POLL_RESPONSES = 'GET_ALL_POLL_RESPONSES'
export const POLLS_WARNING = 'POLLS_WARNING'

// constants for settings
export const GET_INTEGRATIONS = 'GET_INTEGRATIONS'
export const GET_GREETING_MESSAGE = 'GET_GREETING_MESSAGE'
export const ENABLE_SUCCESS_NGP = 'ENABLE_SUCCESS_NGP'
export const DISABLE_SUCCESS_NGP = 'DISABLE_SUCCESS_NGP'
export const RESET_SUCCESS_NGP = 'RESET_SUCCESS_NGP'
export const GET_API_SUCCESS_NGP = 'GET_API_SUCCESS_NGP'
export const GET_API_FAILURE_NGP = 'GET_API_FAILURE_NGP'
export const GET_PERMISSIONS_SUCCESS = 'GET_PERMISSIONS_SUCCESS'
export const GET_UPDATED_PERMISSIONS_SUCCESS = 'GET_UPDATED_PERMISSIONS_SUCCESS'
export const SHOW_WEBHOOK = 'SHOW_WEBHOOK'
export const SHOW_WEBHOOK_RESPONSE = 'SHOW_WEBHOOK_RESPONSE'
export const RESPONSE_METHOD = 'RESPONSE_METHOD'
export const DELETE_OPTION = 'DELETE_OPTION'
export const SHOW_WHITELIST_DOMAINS = 'SHOW_WHITELIST_DOMAINS'

// constants for sign up
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS'
export const SIGNUP_FAILURE = 'SIGNUP_FAILURE'
export const RESEND_FAILURE = 'RESEND_FAILURE'
export const RESEND_SUCCESS = 'RESEND_SUCCESS'
export const SKIP_SUCCESS = 'SKIP_SUCCESS'

// constants for subscribers
export const LOAD_SUBSCRIBERS_LIST = 'LOAD_SUBSCRIBERS_LIST'
export const LOAD_LOCALES_LIST = 'LOAD_LOCALES_LIST'
export const LOAD_ALL_SUBSCRIBERS_LIST = 'LOAD_ALL_SUBSCRIBERS_LIST'
export const LOAD_ALL_SUBSCRIBERS_LIST_NEW = 'LOAD_ALL_SUBSCRIBERS_LIST_NEW'
export const LOAD_SUBSCRIBERS_COUNT = 'LOAD_SUBSCRIBERS_COUNT'
export const UPDATE_CUSTOM_FIELD_FOR_SUBSCRIBER = 'UPDATE_CUSTOM_FIELD_FOR_SUBSCRIBER'

// constants for surveys
export const ADD_SURVEY = 'ADD_SURVEY'
export const LOAD_SURVEYS_QUESTIONS = 'LOAD_SURVEYS_QUESTIONS'
export const SUBMIT_SURVEY = 'SUBMIT_SURVEY'
export const SEND_SURVEY_SUCCESS = 'SEND_SURVEY_SUCCESS'
export const SEND_SURVEY_FAILURE = 'SEND_SURVEY_FAILURE'
export const LOAD_SURVEYS_LIST = 'LOAD_SURVEYS_LIST'
export const LOAD_SURVEYS_LIST_NEW = 'LOAD_SURVEYS_LIST_NEW'
export const ADD_RESPONSES = 'ADD_RESPONSES'
export const SURVEYS_WARNING = 'SURVEYS_WARNING'

// constants for templates
export const ADD_TEMPLATE_BROADCAST = 'ADD_TEMPLATE_BROADCAST'
export const ADD_TEMPLATE_SURVEY = 'ADD_TEMPLATE_SURVEY'
export const ADD_TEMPLATE_POLL = 'ADD_TEMPLATE_POLL'
export const LOAD_CATEGORY_LIST = 'LOAD_CATEGORY_LIST'
export const LOAD_TEMPLATE_SURVEYS_LIST = 'LOAD_TEMPLATE_SURVEYS_LIST'
export const LOAD_TEMPLATE_SURVEYS_LIST_NEW = 'LOAD_TEMPLATE_SURVEYS_LIST_NEW'
export const LOAD_TEMPLATE_POLLS_LIST = 'LOAD_TEMPLATE_POLLS_LIST'
export const LOAD_TEMPLATE_POLLS_LIST_NEW = 'LOAD_TEMPLATE_POLLS_LIST_NEW'
export const LOAD_TEMPLATE_SURVEY_DETAILS = 'LOAD_TEMPLATE_SURVEY_DETAILS'
export const LOAD_TEMPLATE_POLL_DETAILS = 'LOAD_TEMPLATE_POLL_DETAILS'
export const LOAD_TEMPLATE_BROADCAST_DETAILS = 'LOAD_TEMPLATE_BROADCAST_DETAILS'
export const LOAD_TEMPLATE_BROADCASTS_LIST = 'LOAD_TEMPLATE_BROADCASTS_LIST'
export const LOAD_TEMPLATE_BROADCASTS_LIST_NEW = 'LOAD_TEMPLATE_BROADCASTS_LIST_NEW'
export const SAVE_BROADCAST_INFORMATION = 'SAVE_BROADCAST_INFORMATION'
export const TEMPLATES_WARNING = 'TEMPLATES_WARNING'

// constants for teams
export const SHOW_TEAMS_LIST = 'SHOW_TEAMS_LIST'
export const SHOW_TEAM_PAGES = 'SHOW_TEAM_PAGES'
export const SHOW_TEAM_AGENTS = 'SHOW_TEAM_AGENTS'

// other constants
export const SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS'
export const SEND_MESSAGE_FAILURE = 'SEND_MESSAGE_FAILURE'
export const ADD_FILE_URL = 'ADD_FILE_URL'
export const ADD_FILE_INFO = 'ADD_FILE_INFO'
export const SET_LOADING = 'SET_LOADING'
export const GET_STARTED_COMPLETED = 'GET_STARTED_COMPLETED'

// constants for tags
export const LOAD_TAGS_LIST = 'LOAD_TAGS_LIST'
export const LOAD_SUBSCRIBER_TAGS = 'LOAD_SUBSCRIBER_TAGS'
export const ADD_TAG = 'ADD_TAG'
export const REMOVE_TAG = 'REMOVE_TAG'
export const UPDATE_TAG = 'UPDATE_TAG'
export const ASSIGN_TAG = 'ASSIGN_TAG'
export const UNASSIGN_TAG = 'UNASSIGN_TAG'
export const CLEAR_SUBSCRIBER_TAGS = 'CLEAR_SUBSCRIBER_TAGS'

// constants for notifications
export const SHOW_NOTIFICATIONS = 'SHOW_NOTIFICATIONS'

// constants for bots
export const SHOW_BOTS = 'SHOW_BOTS'
export const SHOW_ANALYTICS = 'SHOW_ANALYTICS'
export const SHOW_BOTS_NEW = 'SHOW_BOTS_NEW'
export const SHOW_CREATED_BOT = 'SHOW_CREATED_BOT'
export const SHOW_BOT_DETAILS = 'SHOW_BOT_DETAILS'
export const APPLY_BOT_TEMPLATE = 'APPLY_BOT_TEMPLATE'
export const SHOW_WAITING_REPLY_LIST = 'SHOW_WAITING_REPLY_LIST'
export const SHOW_UNANSWERED_QUERIES = 'SHOW_UNANSWERED_QUERIES'

// constants for bots intents
export const SHOW_BOT_INTENTS = 'SHOW_BOT_INTENTS'
export const SHOW_CREATED_INTENT = 'SHOW_CREATED_INTENT'

// constants for Sequence
export const SHOW_ALL_SEQUENCE = 'SHOW_ALL_SEQUENCE'
export const SHOW_ALL_SEQUENCE_NEW = 'SHOW_ALL_SEQUENCE_NEW'
export const SHOW_ALL_MESSAGES = 'SHOW_ALL_MESSAGES'
export const SHOW_CREATED_SEQUENCE = 'SHOW_CREATED_SEQUENCE'
export const SHOW_SUBSCRIBER_SEQUENCE = 'SHOW_SUBSCRIBER_SEQUENCE'

// constants for Comment Capture
export const SHOW_FACEBOOK_POSTS = 'SHOW_FACEBOOK_POSTS'
export const SHOW_POST_COMMENTS = 'SHOW_POST_COMMENTS'
export const SHOW_AllPostsAnalytics = 'SHOW_AllPostsAnalytics'
export const SHOW_SinglePostsAnalytics = 'SHOW_SinglePostsAnalytics'
export const CURRENT_POST = 'CURRENT_POST'
export const SAVE_COMMENT_REPLIES = 'SAVE_COMMENT_REPLIES'
export const SHOW_COMMENTS_REPLIES = 'SHOW_COMMENTS_REPLIES'
export const RESET_COMMENTS = 'RESET_COMMENTS'
export const SHOW_POST_CONTENT = 'SHOW_POST_CONTENT'
export const SHOW_GLOBAL_POSTS = 'SHOW_GLOBAL_POSTS'
export const SAVE_COMMENTS = 'SAVE_COMMENTS'
export const SHOW_SEARCH_RESULTS = 'SHOW_SEARCH_RESULTS'
export const RESET_SEARCH_RESULTS = 'RESET_SEARCH_RESULTS'

//  constants for Plans
export const FETCH_ALL_PLANS = 'FETCH_ALL_PLANS'

//  constants for Permissions
export const FETCH_ALL_PERMISSIONS = 'FETCH_ALL_PERMISSIONS'

//  constants for Features
export const FETCH_ALL_FEATURES = 'FETCH_ALL_FEATURES'

//  constants for Usage
export const FETCH_ALL_USAGE = 'FETCH_ALL_USAGE'

// constants for Shopify Abandoned Carts
export const UPDATE_STORE_LIST = 'UPDATE_STORE_LIST'
export const UPDATE_ORDER_LIST = 'UPDATE_ORDER_LIST'
export const UPDATE_ABANDONED_LIST = 'UPDATE_ABANDONED_LIST'
export const UPDATE_ANALYTICS = 'UPDATE_ANALYTICS'
export const UPDATE_SENT_COUNT = 'UPDATE_SENT_COUNT'

// New Operational Dashboard
export const UPDATE_PLATFORM_STATS = 'UPDATE_PLATFORM_STATS'
export const UPDATE_PLATFORM_STATS_RANGED = 'UPDATE_PLATFORM_STATS_RANGED'

export const UPDATE_USER_STATS = 'UPDATE_USER_STATS'
export const UPDATE_USER_STATS_RANGED = 'UPDATE_USER_STATS_RANGED'
export const UPDATE_ONE_USER_STATS = 'UPDATE_ONE_USER_STATS'
export const UPDATE_ONE_USER_STATS_RANGED = 'UPDATE_ONE_USER_STATS_RANGED'

export const UPDATE_PAGE_STATS = 'UPDATE_PAGE_STATS'
export const UPDATE_PAGE_STATS_RANGED = 'UPDATE_PAGE_STATS_RANGED'
export const UPDATE_ONE_PAGE_STATS = 'UPDATE_ONE_PAGE_STATS'
export const UPDATE_ONE_PAGE_STATS_RANGED = 'UPDATE_ONE_PAGE_STATS_RANGED'
export const UPDATE_TOP_PAGES_KIBODASH = 'UPDATE_TOP_PAGES_KIBODASH'

export const UPDATE_AUTPOSTING_PLATFORM = 'UPDATE_AUTPOSTING_PLATFORM'
export const UPDATE_AUTPOSTING_PLATFORM_RANGED = 'UPDATE_AUTPOSTING_PLATFORM_RANGED'
export const UPDATE_AUTPOSTING_USER = 'UPDATE_AUTPOSTING_USER'
export const UPDATE_AUTPOSTING_USER_RANGED = 'UPDATE_AUTPOSTING_USER_RANGED'
export const UPDATE_WEEKLY_PLATFORM_STATS = 'UPDATE_WEEKLY_PLATFORM_STATS'
export const UPDATE_MONTHLY_PLATFORM_STATS = 'UPDATE_MONTHLY_PLATFORM_STATS'

// constants for Messenger Code
export const UPDATE_MESSENGER_CODE = 'UPDATE_MESSENGER_CODE'
export const RESET_STATE_MSG_CODE = 'RESET_STATE_MSG_CODE'
export const SHOW_MESSENGER_CODES = 'SHOW_MESSENGER_CODES'

// constants for Landing Page
export const SHOW_LANDING_PAGES = 'SHOW_LANDING_PAGES'
export const UPDATE_LANDING_PAGE = 'UPDATE_LANDING_PAGE'

// constants for Messenger Ads
export const SHOW_MESSENGER_ADS = 'SHOW_MESSENGER_ADS'
export const SAVE_CURRENT_JSON_AD = 'SAVE_CURRENT_JSON_AD'
export const SET_DEFAULT_JSON_AD = 'SET_DEFAULT_JSON_AD'
export const SHOW_JSON_CODE = 'SHOW_JSON_CODE'
export const CLEAR_MESSENGER_AD = 'CLEAR_MESSENGER_AD'

// constants for Business Gateway
export const SAVE_CURRENT_CUSTOMERS_INFO = 'SAVE_CURRENT_CUSTOMERS_INFO'
export const SET_DEFAULT_CUSTOMERS_INFO = 'SET_DEFAULT_CUSTOMERS_INFO'
export const SAVE_CURRENT_CUSTOMER_INFO = 'SAVE_CURRENT_CUSTOMER_INFO'

// constants for DemoSSA
export const UPDATE_DEMOSSA_CHAT = 'UPDATE_DEMOSSA_CHAT'

// constants for Messenger Ref URL
export const SHOW_MESSENGER_REF_URLS = 'SHOW_MESSENGER_REF_URLS'
export const UPDATE_MESSENGER_REF_URL = 'UPDATE_MESSENGER_REF_URL'
export const RESET_STATE_REF_URL = 'RESET_STATE_REF_URL'

// constants for custom fields
export const LOAD_CUSTOM_FIELDS = 'LOAD_CUSTOM_FIELDS'
export const GET_CUSTOM_FIELD_SUBSCRIBER = 'GET_CUSTOM_FIELD_SUBSCRIBER'
export const CLEAR_CUSTOM_FIELD_VALUES = 'CLEAR_CUSTOM_FIELD_VALUES'
export const UPDATE_CUSTOM_FIELD_VALUE = 'UPDATE_CUSTOM_FIELD_VALUE'
export const ADD_CUSTOM_FIELD = 'ADD_CUSTOM_FIELD'
export const REMOVE_CUSTOM_FIELD = 'REMOVE_CUSTOM_FIELD'
export const UPDATE_CUSTOM_FIELD = 'UPDATE_CUSTOM_FIELD'

// constants for contacts
export const LOAD_CONTACTS_LIST = 'LOAD_CONTACTS_LIST'

// constants for smsBroadcasts
export const LOAD_SMS_BROADCASTS_LIST = 'LOAD_SMS_BROADCASTS_LIST'
export const LOAD_TWILIO_NUMBERS = 'LOAD_TWILIO_NUMBERS'

// constants for smsChat
export const SHOW_SMS_OPEN_CHAT_SESSIONS_OVERWRITE = 'SHOW_SMS_OPEN_CHAT_SESSIONS_OVERWRITE'
export const SHOW_SMS_CLOSE_CHAT_SESSIONS_OVERWRITE = 'SHOW_SMS_CLOSE_CHAT_SESSIONS_OVERWRITE'
export const UPDATE_SMSCHAT_INFO = 'UPDATE_SMSCHAT_INFO'
export const FETCH_CHAT = 'FETCH_CHAT'
export const FETCH_CHAT_OVERWRITE = 'FETCH_CHAT_OVERWRITE'
export const SHOW_SMS_USER_CHAT_OVERWRITE = 'SHOW_SMS_USER_CHAT_OVERWRITE'
export const UPDATE_SESSION = 'UPDATE_SESSION'
export const SOCKET_UPDATE_SMS = 'SOCKET_UPDATE_SMS'
export const SHOW_SEARCH_CHAT_SMS = 'SHOW_SEARCH_CHAT_SMS'
export const CLEAR_SEARCH_RESULT_SMS = 'CLEAR_SEARCH_RESULT_SMS'

// constants for whatsAppBroadcasts
export const LOAD_WHATSAPP_BROADCASTS_LIST = 'LOAD_WHATSAPP_BROADCASTS_LIST'

// constants for whatsAppChat
export const FETCH_WHATSAPP_OPEN_SESSIONS = 'FETCH_WHATSAPP_OPEN_SESSIONS'
export const FETCH_WHATSAPP_CLOSE_SESSIONS = 'FETCH_WHATSAPP_CLOSE_SESSIONS'
export const FETCH_WHATSAPP_CHAT = 'FETCH_WHATSAPP_CHAT'
export const FETCH_WHATSAPP_CHAT_OVERWRITE = 'FETCH_WHATSAPP_CHAT_OVERWRITE'
export const UPDATE_WHATSAPP_SESSION = 'UPDATE_WHATSAPP_SESSION'
export const UPDATE_WHATSAPP_CHAT = 'UPDATE_WHATSAPP_CHAT'
export const SOCKET_UPDATE_WHATSAPP = 'SOCKET_UPDATE_WHATSAPP'
export const UPDATE_SESSIONS_WHATSAPP = 'UPDATE_SESSIONS_WHATSAPP'
export const CLEAR_SEARCH_WHATSAPP = 'CLEAR_SEARCH_WHATSAPP'
export const SHOW_SEARCH_WHATSAPP = 'SHOW_SEARCH_WHATSAPP'
export const RESET_SOCKET_WHATSAPP = 'RESET_SOCKET_WHATSAPP'
export const SOCKET_UPDATE_WHATSAPP_SEEN = 'SOCKET_UPDATE_WHATSAPP_SEEN'
//constants for sponsored Messaging
export const SHOW_SPONSORED_MESSAGES = 'SHOW_SPONSORED_MESSAGES'
export const ADD_TO_SPONSORED_MESSAGES = 'ADD_TO_SPONSORED_MESSAGES'
export const UPDATE_SPONSORED_MESSAGES_LIST_ITEM = 'UPDATE_SPONSORED_MESSAGES_LIST_ITEM'
export const UPDATE_SPONSORED_MESSAGE = 'UPDATE_SPONSORED_MESSAGE'
export const CREATE_SPONSORED_MESSAGE = 'CREATE_SPONSORED_MESSAGE'
export const SHOW_AD_ACCOUNTS = 'SHOW_AD_ACCOUNTS'
export const SHOW_CAMPAIGNS = 'SHOW_CAMPAIGNS'
export const SHOW_AD_SETS = 'SHOW_AD_SETS'
export const GET_INSIGHTS = 'GET_INSIGHTS'

// constants for smsWhatsAppDashboard
export const SHOW_SENT_SEEN = 'SHOW_SENT_SEEN'
export const SHOW_CARDBOXES_DATA = 'SHOW_CARDBOXES_DATA'
export const SHOW_SUBSCRIBER_SUMMARY = 'SHOW_SUBSCRIBER_SUMMARY'

// constants for hubSpot
export const SHOW_hubSpotForm = 'SHOW_hubSpotForm'
export const SHOW_hubspot_form_COLUMNS = 'SHOW_hubspot_form_COLUMNS'
export const EMPTY_hubspotForm_FIELDS = 'EMPTY_hubspotForm_FIELDS'
export const SHOW_showHubspotColumns = 'SHOW_showHubspotColumns'
// constants for google sheets
export const SHOW_WORKSHEETS = 'SHOW_WORKSHEETS'
export const SHOW_SPREADSHEETS = 'SHOW_SPREADSHEETS'
export const SHOW_COLUMNS = 'SHOW_COLUMNS'
export const EMPTY_FIELDS = 'EMPTY_FIELDS'

// constants for rss feeds
export const SHOW_RSS_FEEDS = 'SHOW_RSS_FEEDS'
export const SHOW_RSS_FEED_POSTS = 'SHOW_RSS_FEED_POSTS'
export const SAVE_CURRENT_FEED = 'SAVE_CURRENT_FEED'
export const SAVE_NEWS_PAGES = 'SAVE_NEWS_PAGES'

// constants for Overlay Widgets
export const SHOW_OVERLAY_WIDGETS = 'SHOW_OVERLAY_WIDGETS'
export const SAVE_CURRENT_WIDGET = 'SAVE_CURRENT_WIDGET'

// constants for Socket
export const SOCKET_EVENT = 'SOCKET_EVENT'
export const CLEAR_SOCKET_DATA = 'CLEAR_SOCKET_DATA'
export const SOCKET_EVENT_SMS = 'SOCKET_EVENT_SMS'
export const CLEAR_SOCKET_DATA_SMS = 'CLEAR_SOCKET_DATA_SMS'
