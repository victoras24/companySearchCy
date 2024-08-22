import corsAnywhere from 'cors-anywhere';

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 8080;

corsAnywhere.createServer({
    originWhitelist: ["http://localhost:5173/", "https://company-search-cy.vercel.app/"],
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
}).listen(port, host, function () {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});