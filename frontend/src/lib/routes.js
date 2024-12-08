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
    teams: BASE_URL + '/teams',
    medallists: BASE_URL + '/medallists'
}
