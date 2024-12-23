const BASE_URL = 'http://localhost:8080/';

export const APP_ROUTES = {
    schedules: '/schedules',
    events: '/events',
    athletes: '/athletes',
    coaches: '/coaches',
    countries: '/countries',
    teams: '/teams',
    medallists: '/medallists'
}

export const API_ROUTE = {
    schedules: BASE_URL + 'schedules',
    events: BASE_URL + 'events',
    disciplines: BASE_URL + 'disciplines',
    countries: BASE_URL + 'countries',
    athletes: BASE_URL + 'athletes',
    coaches: BASE_URL + 'coaches',
    teams: BASE_URL + '/teams',
    medallists: BASE_URL + '/medallists',
    update_schedule_group: BASE_URL + 'update_schedule_group',
}
