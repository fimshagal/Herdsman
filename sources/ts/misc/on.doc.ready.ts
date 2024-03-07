export const onDocReady = async (): Promise<Event> =>
    await new Promise(resolve => document.addEventListener("DOMContentLoaded", resolve));
