export const onDocReady = async (): Promise<Event> =>
    new Promise(resolve => document.addEventListener("DOMContentLoaded", resolve));
